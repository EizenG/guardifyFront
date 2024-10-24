import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslationService } from '../services/translation/translation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../langues/langues';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,CommonModule,NgbAlert,TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy,AfterViewInit {
  @ViewChild("mainContainer") mainContainer !: ElementRef;
  @ViewChildren("h5Tag") h5Tags !: QueryList<ElementRef>;
  @ViewChild('selfClosingAlertError', { static: false }) selfClosingAlertError !: NgbAlert;
  @ViewChild('selfClosingAlertSuccess', { static: false }) selfClosingAlertSuccess !: NgbAlert;
  @ViewChild('frFlag') frFlagImg !: ElementRef;
  @ViewChild('ukFlag') ukFlagImg !: ElementRef;

  // Services
  firebaseService = inject(FirebaseService);
  router = inject(Router);

  userUid : string | null = null;
  errorMessage = '';
  successMessage = '';
  private _messageError$ = new Subject<string>();
  private _messageSuccess$ = new Subject<string>();
  errorMessageSubscription: Subscription | null = null;
  successMessageSubscription: Subscription | null = null;

  translate = inject(TranslateService);
  translationService = inject(TranslationService);

  constructor(private cdref : ChangeDetectorRef){
    const langue = localStorage.getItem("langue");
    if(langue && langues.includes(langue)){
      this.translate.setDefaultLang(langue);
    }else{
      this.translate.setDefaultLang(langues[0]);
    }

    onAuthStateChanged(this.firebaseService.firebaseAuth, (user) =>{
      if(user){
        this.userUid = user.email;
      }else{
        this.userUid = null;
      }
      this.cdref.detectChanges();
    });

    this.errorMessageSubscription = this._messageError$
      .pipe(
        takeUntilDestroyed(),
        tap((message) => (this.errorMessage = message)),
        debounceTime(5000),
      )
      .subscribe(() => this.selfClosingAlertError?.close());

    this.successMessageSubscription = this._messageSuccess$
      .pipe(
        takeUntilDestroyed(),
        tap((message) => (this.successMessage = message)),
        debounceTime(5000),
      )
      .subscribe(() => this.selfClosingAlertSuccess?.close());
  }
  ngAfterViewInit(): void {
    const langue = localStorage.getItem("langue");
    if (langue && langue == "en") {
      this.frFlagImg.nativeElement.style.display = "block";
      this.ukFlagImg.nativeElement.style.display = "none";
    }
  }
  ngOnDestroy(): void {
    if(this.errorMessageSubscription){
      this.errorMessageSubscription.unsubscribe();
    }

    if(this.successMessageSubscription){
      this.successMessageSubscription.unsubscribe();
    }
  }

  expandMenu(){
    let nativeHtmlElt = (this.mainContainer.nativeElement as HTMLElement);
    nativeHtmlElt.classList.toggle("expandMenu");
    this.h5Tags.forEach(item =>{
      nativeHtmlElt.classList.contains("expandMenu") ? item.nativeElement.previousElementSibling.style.paddingLeft = "20px" : item.nativeElement.previousElementSibling.style.paddingLeft = "0"; 
    });
    /*-----------------------------------*/
    setTimeout(() =>{
      this.h5Tags.forEach(item => {
        (nativeHtmlElt.classList.contains("expandMenu")) ? (item.nativeElement as HTMLElement).style.opacity = "1" : (item.nativeElement as HTMLElement).style.opacity = "0";
        item.nativeElement.hidden = (nativeHtmlElt.classList.contains("expandMenu")) ? false : true;
      });
       
    },(nativeHtmlElt.classList.contains("expandMenu")?400:50));
  }

  handleLogin(){
    this.router.navigate(['/login-logout']);
  }

  handleLogout(){
    this.firebaseService.signOut().subscribe(
      {
        next: () => {
          this.changeSuccessMessage('Vous êtes désormais déconnecté');
        },
        error: () => {
          this.changeSuccessMessage('Attention une erreur est survenue !!!');
        }
      }
    )
  }

  changeErrorMessage(message: string) {
    this._messageError$.next(message);
  }

  changeSuccessMessage(message: string) {
    this._messageSuccess$.next(message);
  }

  navigateTo(url : string){
    this.router.navigate([url]);
  }

  changeLang(lang : string){
    if(lang == 'en'){
      this.ukFlagImg.nativeElement.style.display = "none";
      this.frFlagImg.nativeElement.style.display = "block";
    }else if(lang == 'fr'){
      this.ukFlagImg.nativeElement.style.display = "block";
      this.frFlagImg.nativeElement.style.display = "none";
    }

    this.translationService.changeLang(lang);
  }
}
