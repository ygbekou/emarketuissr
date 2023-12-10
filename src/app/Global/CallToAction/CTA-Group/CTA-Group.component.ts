import { Component, OnInit } from '@angular/core';
import { MarketingDescription, Language } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'embryo-CtaGroup',
  templateUrl: './CTA-Group.component.html',
  styleUrls: ['./CTA-Group.component.scss']
})
export class CTAGroupComponent implements OnInit {

   marketings: MarketingDescription[] = [];

   constructor(public appService: AppService) { }

   ngOnInit() {
      if (this.appService.appInfoStorage.language) {
         this.getSliders(this.appService.appInfoStorage.language.id);
      } else {
         this.getLangAndSliders();
      }
   }

   getLangAndSliders() {
      const parameters: string[] = [];
      this.appService.getAllByCriteria('com.softenza.emarket.model.Language', parameters, ' order by e.sortOrder ')
         .subscribe((data: Language[]) => {
            let lang = this.appService.navigator.language;
            if (lang) {
               lang = lang.substring(0, 2);
            }
            // if (this.cookieService.get('lang')) {
            //    lang = this.cookieService.get('lang');
            //    console.log('Using cookie lang=' + this.cookieService.get('lang'));
            // } else if (lang) {
            //    console.log('Using browser lang=' + lang);
            //    // this.translate.use(lang);
            // } else {
            //    lang = 'fr';
            //    console.log('Using default lang=fr');
            // }
            data.forEach(language => {
               if (language.code === lang) {
                  this.getSliders(language.id);
               }
            });

         }, error => console.log(error),
            () => console.log('Get Languages complete'));
   }
   getSliders(langId: number) {
      const parameters: string[] = [];
      parameters.push('e.language.id = |langCode|' + langId + '|Integer');
      parameters.push('e.marketing.status = |stta|1|Integer');
      parameters.push('e.marketing.section = |sInS|2|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.MarketingDescription', parameters,
         ' order by e.marketing.sortOrder ')
         .subscribe((data: MarketingDescription[]) => {
            this.marketings = data;
         },
            error => console.log(error),
            () => console.log('Get all MarketingDescription complete'));
   }

}
