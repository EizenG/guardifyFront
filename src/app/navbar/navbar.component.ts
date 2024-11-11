import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import { Router, RouterLink} from '@angular/router';
import { NgbAlert, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { onAuthStateChanged } from '@angular/fire/auth'; 
import { MessageService } from '../services/message.service';
import { Subscription, debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TranslateModule,RouterLink,CommonModule,NgbAlert],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @ViewChild('selfClosingAlertError', { static: false }) selfClosingAlertError !: NgbAlert;
  @ViewChild('selfClosingAlertSuccess', { static: false }) selfClosingAlertSuccess !: NgbAlert;

  translate = inject(TranslateService);
  router = inject(Router);
  offcanvasService = inject(NgbOffcanvas);
  firebaseService = inject(FirebaseService);
  cdref = inject(ChangeDetectorRef);
  msgService = inject(MessageService);
  errorMessage = '';
  successMessage = '';
  errorMessageSubscription: Subscription | null = null;
  successMessageSubscription: Subscription | null = null;
  userUid : string | null = null;
  currentActiveMenuItem !: HTMLDivElement;

  constructor(){
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

  isActiveUrl(url : string): boolean{
    return this.router.url === url;
  }

  navigateTo(url: string) : void {
    this.router.navigate([url]);
  }

  openMenu(content: TemplateRef<any>, menuCheckbox : HTMLInputElement) : void{
    this.offcanvasService.open(content, { panelClass: 'bg-menu' }).dismissed.subscribe(
      () => {
        menuCheckbox.checked = !menuCheckbox.checked;
      }
    );
  }

  handleLogin() {
    this.router.navigate(['/login-logout']);
  }

  handleLogoutOrGoToSignIn() {
    if (this.userUid) {
      this.firebaseService.signOut().subscribe(
        {
          next: () => {
            this.msgService.changeSuccessMessage('Vous êtes désormais déconnecté');
          },
          error: () => {
            this.msgService.changeSuccessMessage('Attention une erreur est survenue !!!');
          }
        }
      );
    } else {
      this.handleLogin();
    }
  }

}
