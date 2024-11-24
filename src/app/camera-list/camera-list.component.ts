import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { Camera } from '../customType/camera';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { dropdownListPermissions,dropdownSettingsPermissions } from '../data/permissionsDropdown';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { langues } from '../data/langues';
import { onAuthStateChanged } from '@angular/fire/auth';
import { FirebaseService } from '../services/firebaseService/firebase.service';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [NgMultiSelectDropDownModule,CommonModule,FormsModule,NgbPagination,TranslateModule,
  RouterModule],
  templateUrl: './camera-list.component.html',
  styleUrl: './camera-list.component.scss'
})
export class CameraListComponent implements AfterViewInit {
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
  items : Camera[] = []
  cameraData : Camera[] = [
    {
      "id_camera": "47392",
      "location": "Auchan Dakar Sud",
      "permissions": [2, 4],
      "status": true,
      "isOwner": true
    }
  ];
  fakeData: Camera[] = [
    {
      "id_camera": "47392",
      "location": "Auchan Dakar Sud ffffffffffffffffffffffffffffffffffffffffff",
      "permissions": [2, 4],
      "status": true,
      "isOwner": true
    },
    {
      "id_camera": "58374",
      "location": "Carrefour Mbour Nord",
      "permissions": [1, 3],
      "status": false,
      "isOwner": false
    },
    {
      "id_camera": "78921",
      "location": "Auchan Thiès Ouest",
      "permissions": [1, 2],
      "status": true,
      "isOwner": false
    },
    {
      "id_camera": "91234",
      "location": "Super U Rufisque Centre",
      "permissions": [3, 5],
      "status": true,
      "isOwner": true
    },
    {
      "id_camera": "13467",
      "location": "Auchan Saint-Louis",
      "permissions": [1, 3],
      "status": false,
      "isOwner": true
    },
    {
      "id_camera": "25678",
      "location": "Super U Dakar Plateau",
      "permissions": [1, 2],
      "status": true,
      "isOwner": false
    },
    {
      "id_camera": "34892",
      "location": "Auchan Mbour Sud",
      "permissions": [2, 5],
      "status": false,
      "isOwner": false
    },
    {
      "id_camera": "47389",
      "location": "Carrefour Thiès Est",
      "permissions": [1, 4],
      "status": true,
      "isOwner": true
    },
    {
      "id_camera": "58213",
      "location": "Auchan Dakar Nord",
      "permissions": [3, 5],
      "status": true,
      "isOwner": false
    },
    {
      "id_camera": "93458",
      "location": "Carrefour Kaolack",
      "permissions": [2, 3],
      "status": false,
      "isOwner": false
    },
    {
      "id_camera": "23984",
      "location": "Super U Ziguinchor",
      "permissions": [1, 4],
      "status": true,
      "isOwner": true
    },
    {
      "id_camera": "19872",
      "location": "Auchan Matam",
      "permissions": [2, 3],
      "status": false,
      "isOwner": false
    },
    {
      "id_camera": "58743",
      "location": "Super U Fatick",
      "permissions": [1, 5],
      "status": true,
      "isOwner": false
    },
    {
      "id_camera": "64573",
      "location": "Carrefour Louga",
      "permissions": [3, 4],
      "status": false,
      "isOwner": true
    },
    {
      "id_camera": "38975",
      "location": "Auchan Diourbel",
      "permissions": [2, 4],
      "status": true,
      "isOwner": true
    }
  ]

  translate = inject(TranslateService);
  firebaseService = inject(FirebaseService);
  router = inject(Router);


  constructor(private cdref: ChangeDetectorRef){
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
    this.items = this.fakeData.slice(startIndex, endIndex); // Slicing des éléments
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
    
    this.items = this.fakeData.slice(0, this.pageSize);
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
