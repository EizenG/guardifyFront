import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { dropdownListPermissions,dropdownSettingsPermissions } from '../data/permissionsDropdown';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import { onAuthStateChanged } from '@angular/fire/auth';
import { FirebaseService } from '../services/firebaseService/firebase.service';
import { Observable, map } from 'rxjs';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { loaderService } from '../services/loader.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [NgMultiSelectDropDownModule,CommonModule,FormsModule,NgbPagination,TranslateModule,
  RouterModule],
  templateUrl: './camera-list.component.html',
  styleUrl: './camera-list.component.scss'
})
export class CameraListComponent implements AfterViewInit,OnInit {
  @ViewChildren("getEltHeight") eltsBeforeList !: QueryList<ElementRef>;
  @ViewChild("noData") noDataImgElt !: ElementRef<HTMLImageElement>;
  
  dropdownListStatus = [
    { item_id: 1, item_text: "Actif" },
    { item_id: 2, item_text: "Inactif" },
  ];
  dropdownBtnList !: NodeList;
  selectedItemsPermissions = [];
  selectedItemsStatus = "";
  
  dropdownSettingsPermissions = dropdownSettingsPermissions;
  dropdownListPermissions = dropdownListPermissions;

  dropdownSettings2: IDropdownSettings = {
    singleSelection: true,
    idField: "item_id",
    textField: "item_text",
  };

  page = 1;
  pageSize = 10;
  isPopupInfVisible = false;
  isPopupRestrictionVisible = false;
  userUID : string | null = null;

  //il faut limiter le champ location a 40 caracteres
  items : any = []
  cameraData : any = [];

  translate = inject(TranslateService);
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  loaderService = inject(loaderService);
  msgService = inject(MessageService);


  constructor(private cdref: ChangeDetectorRef,private activatedRoute : ActivatedRoute){
    const langue = localStorage.getItem("langue");
    if (langue && langues.includes(langue)) {
      this.translate.setDefaultLang(langue);
    } else {
      this.translate.setDefaultLang(langues[0]);
    }
    onAuthStateChanged(this.firebaseService.firebaseAuth,(user)=>{
      if(user){
        this.userUID = user.uid;
      }else{
        this.userUID = null;
        this.router.navigate(["./","login-logout"]);
      }
    });
    
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: (data) => { 
        this.cameraData = (data["cameras"].docs as QueryDocumentSnapshot[]).map(item => {
          return { id_camera : item.id, ...item.data()}
        });
        this.loaderService.changeLoaderStatus(false);
        this.items = this.cameraData.slice(0, this.pageSize);
        console.log(this.items)
      }
      , error: () => {
        this.cameraData = [];
        this.loaderService.changeLoaderStatus(false);
        if (localStorage.getItem("langue") == "fr") {
          this.msgService.changeErrorMessage("Problème survenu lors du chargement des données.");
        } else {
          this.msgService.changeErrorMessage("An error occurred while loading the data.");
        }
      }
    })
  }
  
  onItemSelectStatus(item: any) {
    let children: HTMLCollection;
    setTimeout(()=>{
      children = (this.dropdownBtnList[0] as HTMLSpanElement).children;
      if (item.item_text == "Actif") {
        children[0].innerHTML = children[0].innerHTML + '<i style="font-size:24.45px;color:green;" class="fa-solid fa-earth-africa"></i>';
      } else {
        children[0].innerHTML = children[0].innerHTML + '<i style="font-size:24.45px;color:red;" class="fa-solid fa-earth-africa"></i>';
      }
    },10);
  }
  onSelectAllStatus(items: any) {
    return;
  }

  printFontAwesomeIcon(item : any){
    if (item.children[0].children[0].textContent?.includes("Modifier")) {
      if (item.children.length == 1)
        item.innerHTML = item.innerHTML + '<i style="font-size:24.45px;" class="fa-regular fa-pen-to-square"></i>';
    } else if (item.children[0].children[0].textContent?.includes("Afficher")) {
      if (item.children.length == 1)
        item.innerHTML = item.innerHTML + '<i style="font-size:24.45px;" class="fa-solid fa-video"></i>';
    } else if (item.children[0].children[0].textContent?.includes("Voir")) {
      if (item.children.length == 1)
        item.innerHTML = item.innerHTML + '<i style="font-size:24.45px;" class="fa-solid fa-file-video"></i>';
    }
  }

  onItemSelectPermissions(item: any) {
    setTimeout(()=>{
      let children: HTMLCollection = (this.dropdownBtnList[1] as HTMLSpanElement).children;
      Array.from(children).forEach((item) => {
        if(item.classList.contains("selected-item-container")){
          this.printFontAwesomeIcon(item);  
        }
      });
    },10);
    
  }
  onSelectAllPermissions(items: any) {
    setTimeout(()=>{
      let children: any = (this.dropdownBtnList[1] as HTMLSpanElement).children;
      children = Array.from(children).slice(0,-1);
      Array.from(children).forEach((item : any)=>{
        this.printFontAwesomeIcon(item);
      });   
    },10);  
  }

  loadPageData($event: number) {
    const startIndex = (this.page - 1) * this.pageSize; // Calcul de l'index de début
    const endIndex = startIndex + this.pageSize; // Calcul de l'index de fin
    this.items = this.cameraData.slice(startIndex, endIndex); // Slicing des éléments
  }
  ngAfterViewInit(): void {
    let totalHeight = 0;
    this.eltsBeforeList.forEach(item =>{
      let computedStyle = window.getComputedStyle(item.nativeElement);
      totalHeight += item.nativeElement.offsetHeight;
      totalHeight += parseFloat(computedStyle['marginTop']);
      totalHeight += parseFloat(computedStyle['marginBottom']);
    });
    totalHeight += 80;
    if ((window.innerHeight - totalHeight) > 0)
      this.pageSize = Math.trunc((window.innerHeight - totalHeight) / 100) - 1;
    else
      this.pageSize = 5;

    if(window.innerWidth >= 1240){
      this.pageSize *= 3;
    }else if(window.innerWidth > 830){
      this.pageSize *= 2;
    }

    this.noDataImgElt.nativeElement.style.height = `${window.innerHeight - totalHeight - 100}px`;
    
    this.cdref.detectChanges();
    this.dropdownBtnList = document.querySelectorAll(".dropdown-btn");
  }

  deleteCamera():void{
    this.isPopupRestrictionVisible = true;
  }

  navigateToCameraStream() : void{
    this.router.navigate(['/stream']);
  }

}
