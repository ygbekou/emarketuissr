import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../Services/app.service';

@Component({
  selector: 'app-PrivacyPolicy',
  templateUrl: './PrivacyPolicy.component.html',
  styleUrls: ['./PrivacyPolicy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

   privacyPolicyData : any;

   constructor(public appService : AppService) { }

   ngOnInit() {
      this.appService.getPrivacyPolicy().valueChanges().subscribe(res => {this.privacyPolicyData = res});
   }

}
