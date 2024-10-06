import { Component } from '@angular/core';
import { Camera } from '../customType/camera';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [],
  templateUrl: './camera-list.component.html',
  styleUrl: './camera-list.component.scss'
})
export class CameraListComponent {

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

  

}
