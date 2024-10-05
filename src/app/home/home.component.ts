import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild("mainContainer") mainContainer !: ElementRef;
  @ViewChildren("h5Tag") h5Tags !: QueryList<ElementRef>;

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

  
}
