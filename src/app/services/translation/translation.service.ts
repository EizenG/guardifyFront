import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  defaultLang = "fr";
  translateService = inject(TranslateService)

  constructor(
    @Inject(PLATFORM_ID) private platformId : Object 
  ) {
    if(isPlatformBrowser(this.platformId)){
      const savedLang = localStorage.getItem("langue");
      if(savedLang){
        this.defaultLang = savedLang;
      }
      this.translateService.setDefaultLang(this.defaultLang);
      this.translateService.use(this.defaultLang);
    }
  }


  changeLang(lang : string){
    this.translateService.use(lang);
    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem("langue", lang);
    }
  }
}
