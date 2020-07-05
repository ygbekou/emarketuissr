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
   constructor(public translate: TranslateService, public appService: AppService) { }

   ngOnInit() {
   }

   selectionChange(data) {
      if (data && data.value) {
         this.selectedLanguage.emit(data.value);
         console.log('Using =' + data.value);
         this.translate.use(data.value);
         Cookie.set('lang', data.value);
         this.appService.appInfoStorage.languages.forEach(aLang => {
            if (aLang.code === data.value) {
               this.appService.appInfoStorage.language = aLang;
            }
         });
         // window.location.reload();
      }
   }
}
