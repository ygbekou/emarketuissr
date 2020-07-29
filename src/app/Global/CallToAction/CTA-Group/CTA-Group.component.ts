import { Component, OnInit } from '@angular/core';
import { MarketingDescription, Language } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'embryo-CtaGroup',
  templateUrl: './CTA-Group.component.html',
  styleUrls: ['./CTA-Group.component.scss']
})
export class CTAGroupComponent implements OnInit {

   callToActionArray : any = [
      {
         img_path:"assets/images/mobile.jpg",
         route :"/products/gadgets/12"
      },
      {
         img_path:"assets/images/sports.jpg",
         route :"/products/men/3"
      },
      {
         img_path:"assets/images/headphone.jpg",
         route :"/products/gadgets/11"
      },
      {
         img_path:"assets/images/t-shirts.jpg",
         route :"/products/men/5"
      },
      {
         img_path:"assets/images/watch.jpg",
         route :"/products/gadgets/14"
      },
      {
         img_path:"assets/images/shoes.jpg",
         route :"/products/men/6"
      }
   ]

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
