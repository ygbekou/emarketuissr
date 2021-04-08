import { Component } from '@angular/core';
import { AppService } from './Services/app.service';
import { registerLocaleData } from '@angular/common';
import localeFrFR from '@angular/common/locales/fr';
import localeFrFRExtra from '@angular/common/locales/extra/fr';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent {
   constructor(private appService: AppService) {
      console.log('In appComponent');
      this.appService.getCacheData();

      registerLocaleData(localeFrFR, localeFrFRExtra);
   }
}
