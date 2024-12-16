import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from '../services/translation/translation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { emailjsConfigContactUs } from '../../../emailConfig';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, debounceTime, tap } from 'rxjs';
import { MessageService } from '../services/message.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { loaderService } from '../services/loader.service';
import { NgxLoadingModule,ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, NgbAlertModule,NgxLoadingModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild("mainContainer") mainContainer !: ElementRef;
  @ViewChildren("h5Tag") h5Tags !: QueryList<ElementRef>;
  @ViewChild('selfClosingAlertError', { static: false }) selfClosingAlertError !: NgbAlert;
  @ViewChild('selfClosingAlertSuccess', { static: false }) selfClosingAlertSuccess !: NgbAlert;
  errorMessage = '';
  successMessage = '';
  errorMessageSubscription: Subscription | null = null;
  successMessageSubscription: Subscription | null = null;
  @ViewChild('frFlag') frFlagImg !: ElementRef;
  @ViewChild('ukFlag') ukFlagImg !: ElementRef;
  isLoading: boolean = false;
  loadersConfig = {
    backdropBorderRadius: '3px',
    primaryColour: 'rgb(151, 153, 251)',
    animationType: ngxLoadingAnimationTypes.circle
  };

  // Services
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  fb = inject(FormBuilder);
  msgService = inject(MessageService);
  loaderService = inject(loaderService);

  contactUsForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    tel: ['', Validators.required],
    message: ['', Validators.required]
  });

  userUid: string | null = null;

  translate = inject(TranslateService);
  translationService = inject(TranslationService);

  constructor(private cdref: ChangeDetectorRef) {
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
    onAuthStateChanged(this.firebaseService.firebaseAuth, (user) => {
      if (user) {
        this.userUid = user.uid;
      } else {
        this.userUid = null;
      }
      this.cdref.detectChanges();
    });

    this.errorMessageSubscription = this.msgService._messageError$
      .pipe(
        takeUntilDestroyed(),
        tap((message) => (this.errorMessage = message)),
        debounceTime(5000),
      )
      .subscribe(() => this.selfClosingAlertError?.close());

    this.successMessageSubscription = this.msgService._messageSuccess$
      .pipe(
        takeUntilDestroyed(),
        tap((message) => (this.successMessage = message)),
        debounceTime(5000),
      )
      .subscribe(() => this.selfClosingAlertSuccess?.close());

  }

  ngOnInit(): void {
    this.loaderService._loader$.subscribe({
      next: (value) => {
        this.isLoading = value;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.errorMessageSubscription) {
      this.errorMessageSubscription.unsubscribe();
    }
    if (this.successMessageSubscription) {
      this.successMessageSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    const langue = localStorage.getItem("langue");
    if (langue && langue == "en") {
      this.frFlagImg.nativeElement.style.display = "block";
      this.ukFlagImg.nativeElement.style.display = "none";
    }
  }

  changeLang(lang: string) {
    if (lang == 'en') {
      this.ukFlagImg.nativeElement.style.display = "none";
      this.frFlagImg.nativeElement.style.display = "block";
    } else if (lang == 'fr') {
      this.ukFlagImg.nativeElement.style.display = "block";
      this.frFlagImg.nativeElement.style.display = "none";
    }

    this.translationService.changeLang(lang);
  }

  sendEmail(e: Event) {
    e.preventDefault();

    emailjs.sendForm(emailjsConfigContactUs.serviceId, emailjsConfigContactUs.homeEmailTemplate, e.target as HTMLFormElement, {
      publicKey: emailjsConfigContactUs.publicKey,
    })
      .then(
        () => {
          if (localStorage.getItem("langue") == "fr") {
            this.msgService.changeSuccessMessage("Le mail a été envoyé avec succès.");
          } else {
            this.msgService.changeSuccessMessage("The email has been sent successfully.");
          }
        },
        (error) => {
          if (localStorage.getItem("langue") == "fr") {
            this.msgService.changeErrorMessage("L'envoi du mail a échoué.");
          } else {
            this.msgService.changeErrorMessage("The email failed to send.");
          }
        },
      );
  }

}
