import { AfterViewInit, Component } from '@angular/core';
import { Camera } from '../customType/camera';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [NgMultiSelectDropDownModule,CommonModule,FormsModule],
  templateUrl: './camera-list.component.html',
  styleUrl: './camera-list.component.scss'
})
export class CameraListComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.dropdownBtnList = document.querySelectorAll(".dropdown-btn");
  }

  dropdownListPermissions = [
    { item_id: 1, item_text: "Modifier les paramètres"},
    { item_id: 2, item_text: "Afficher le flux vidéo" },
    { item_id: 3, item_text: "Voir les vidéos d'infractions" },
  ];
  dropdownListStatus = [
    { item_id: 1, item_text: "Actif" },
    { item_id: 2, item_text: "Inactif" },
  ];
  dropdownBtnList !: NodeList;
  selectedItemsPermissions = [];
  selectedItemsStatus = "";
  dropdownSettingsPermissions : IDropdownSettings = {
    singleSelection : false,
    enableCheckAll : true,
    selectAllText : "Tout sélectionner",
    unSelectAllText: "Tout désélectionner",
    idField : "item_id",
    textField: "item_text",
  };

  dropdownSettings2: IDropdownSettings = {
    singleSelection: true,
    idField: "item_id",
    textField: "item_text",
  };

  fakeData: Camera[] = [
    {
      "ID": "47392",
      "Localisation": "Auchan Dakar Sud",
      "Permissions": [2, 4],
      "Status": true
    },
    {
      "ID": "58374",
      "Localisation": "Carrefour Mbour Nord",
      "Permissions": [1, 3],
      "Status": false
    },
    {
      "ID": "78921",
      "Localisation": "Auchan Thiès Ouest",
      "Permissions": [1, 2],
      "Status": true
    },
    {
      "ID": "91234",
      "Localisation": "Super U Rufisque Centre",
      "Permissions": [3, 5],
      "Status": true
    },
    {
      "ID": "13467",
      "Localisation": "Auchan Saint-Louis",
      "Permissions": [1, 3],
      "Status": false
    },
    {
      "ID": "25678",
      "Localisation": "Super U Dakar Plateau",
      "Permissions": [1, 2],
      "Status": true
    },
    {
      "ID": "34892",
      "Localisation": "Auchan Mbour Sud",
      "Permissions": [2, 5],
      "Status": false
    },
    {
      "ID": "47389",
      "Localisation": "Carrefour Thiès Est",
      "Permissions": [1, 4],
      "Status": true
    },
    {
      "ID": "58213",
      "Localisation": "Auchan Dakar Nord",
      "Permissions": [3, 5],
      "Status": true
    },
    {
      "ID": "93458",
      "Localisation": "Carrefour Kaolack",
      "Permissions": [2, 3],
      "Status": false
    },
    {
      "ID": "23984",
      "Localisation": "Super U Ziguinchor",
      "Permissions": [1, 4],
      "Status": true
    },
    {
      "ID": "19872",
      "Localisation": "Auchan Matam",
      "Permissions": [2, 3],
      "Status": false
    },
    {
      "ID": "58743",
      "Localisation": "Super U Fatick",
      "Permissions": [1, 5],
      "Status": true
    },
    {
      "ID": "64573",
      "Localisation": "Carrefour Louga",
      "Permissions": [3, 4],
      "Status": false
    },
    {
      "ID": "38975",
      "Localisation": "Auchan Diourbel",
      "Permissions": [2, 4],
      "Status": true
    }
  ]
  
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
      console.log(children)
      Array.from(children).forEach((item : any)=>{
        this.printFontAwesomeIcon(item);
      });   
    },10);  
  }

}
