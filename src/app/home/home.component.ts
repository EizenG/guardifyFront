import { ChangeDetectorRef, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { onAuthStateChanged } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,CommonModule,NgbAlert],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {
  @ViewChild("mainContainer") mainContainer !: ElementRef;
  @ViewChildren("h5Tag") h5Tags !: QueryList<ElementRef>;
  @ViewChild('selfClosingAlertError', { static: false }) selfClosingAlertError !: NgbAlert;
  @ViewChild('selfClosingAlertSuccess', { static: false }) selfClosingAlertSuccess !: NgbAlert;

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


  constructor(private cdref : ChangeDetectorRef){
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
}
