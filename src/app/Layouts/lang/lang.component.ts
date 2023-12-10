import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-lang-l',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.scss']
})
export class LangComponent implements OnInit {
  public flags = [
    { name: 'Francais', code: 'fr' },
    { name: 'English', code: 'en' }
  ];
  public flag: any;
  constructor(public translate: TranslateService,
    public appService: AppService) { }

  ngOnInit() {
    let lang = this.appService.navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    // if (this.cookieService.get('lang')) {
    //   lang = this.cookieService.get('lang');
    //   console.log('Using cookie lang=' + this.cookieService.get('lang'));
    // } else if (lang) {
    //   console.log('Using browser lang=' + lang);
    //   // this.translate.use(lang);
    // } else {
    //   lang = 'fr';
    //   console.log('Using default lang=fr');
    // }
    if (lang === 'fr') {
      this.flag = this.flags[0];
    } else {
      this.flag = this.flags[1];
    }
  }

  public changeLang(flag) {
    console.log('Change lang called');
    this.flag = flag;
    this.translate.use(flag.code);
    //this.cookieService.set('lang', flag.code);
    window.location.reload();
  }

}
