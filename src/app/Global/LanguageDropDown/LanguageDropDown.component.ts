import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
   selector: 'app-lang',
   templateUrl: './LanguageDropDown.component.html',
   styleUrls: ['./LanguageDropDown.component.scss']
})
export class LanguageDropDownComponent implements OnInit {

   @Input() selectedValue: any;
   @Output() selectedLanguage: EventEmitter<any> = new EventEmitter();

   public flags = [
      { name: 'Francais', code: 'fr' },
      { name: 'English', code: 'en' }
   ];
   public flag: any;
   constructor(public translate: TranslateService, public appService: AppService) { }

   ngOnInit() {
      let lang = navigator.language;
      if (lang) {
         lang = lang.substring(0, 2);
      }
      if (Cookie.get('lang')) {
         lang = Cookie.get('lang');
         console.log('Using cookie lang=' + Cookie.get('lang'));
      } else if (lang) {
         console.log('Using browser lang=' + lang);
         // this.translate.use(lang);
      } else {
         lang = 'fr';
         console.log('Using default lang=fr');
      }
      if (lang === 'fr') {
         this.flag = this.flags[0];
      } else {
         this.flag = this.flags[1];
      }
   }

   public changeLang(data) {
      if (data.code === 'fr') {
         this.flag = this.flags[0];
      } else {
         this.flag = this.flags[1];
      }
      this.flag = data.code;
      this.translate.use(data.code);
      Cookie.set('lang', data.code);
      console.log(data);
      for (const aLang of this.appService.appInfoStorage.languages) {
         if (aLang.code === data.code) {
            console.log(aLang);
            this.appService.appInfoStorage.language = aLang;
            break;
         }
      }
      window.location.reload();

   }


}
