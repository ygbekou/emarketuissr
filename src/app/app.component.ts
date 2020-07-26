import { Component } from '@angular/core';
import { AppService } from './Services/app.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent {
   constructor(private appService: AppService) {
      console.log('In appComponent');
      this.appService.getCacheData();
   }
}
