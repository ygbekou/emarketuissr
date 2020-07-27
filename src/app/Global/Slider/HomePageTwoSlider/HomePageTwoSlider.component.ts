import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { Marketing, MarketingDescription, Language } from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
   selector: 'embryo-HomePageTwoSlider',
   templateUrl: './HomePageTwoSlider.component.html',
   styleUrls: ['./HomePageTwoSlider.component.scss']
})
export class HomePageTwoSliderComponent implements OnInit, OnChanges {

   @Input() isRTL: any;

   slideConfig: any;
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
      parameters.push('e.marketing.section = |sInS|1|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.MarketingDescription', parameters,
         ' order by e.marketing.sortOrder ')
         .subscribe((data: MarketingDescription[]) => {
            this.marketings = data;
         },
            error => console.log(error),
            () => console.log('Get all MarketingDescription complete'));
   }

   ngOnChanges() {
      this.slideConfig = {
         infinite: true,
         centerMode: true,
         centerPadding: '400px',
         slidesToShow: 1,
         slidesToScroll: 1,
         autoplay: true,
         autoplaySpeed: 2000,
         dots: false,
         rtl: this.isRTL,
         responsive: [
            {
               breakpoint: 1400,
               settings: {
                  arrows: false,
                  centerMode: true,
                  centerPadding: '300px',
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 2000
               }
            },
            {
               breakpoint: 1199,
               settings: {
                  arrows: false,
                  centerMode: true,
                  centerPadding: '150px',
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 2000
               }
            },
            {
               breakpoint: 899,
               settings: {
                  arrows: false,
                  centerMode: true,
                  centerPadding: '75px',
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 2000
               }
            },
            {
               breakpoint: 768,
               settings: {
                  arrows: false,
                  centerMode: false,
                  centerPadding: '0',
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 2000
               }
            },
            {
               breakpoint: 480,
               settings: {
                  arrows: false,
                  centerMode: false,
                  centerPadding: '0',
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: true,
                  autoplaySpeed: 2000
               }
            }
         ]
      };
   }

}
