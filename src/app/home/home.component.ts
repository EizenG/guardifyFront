import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from '../services/translation/translation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, NgbAlert, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  @ViewChild("mainContainer") mainContainer !: ElementRef;
  @ViewChildren("h5Tag") h5Tags !: QueryList<ElementRef>;
  @ViewChild('selfClosingAlertError', { static: false }) selfClosingAlertError !: NgbAlert;
  @ViewChild('selfClosingAlertSuccess', { static: false }) selfClosingAlertSuccess !: NgbAlert;
  @ViewChild('frFlag') frFlagImg !: ElementRef;
  @ViewChild('ukFlag') ukFlagImg !: ElementRef;

  // Services
  firebaseService = inject(FirebaseService);
  router = inject(Router);

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
        this.userUid = user.email;
      } else {
        this.userUid = null;
      }
      this.cdref.detectChanges();
    });

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

}
