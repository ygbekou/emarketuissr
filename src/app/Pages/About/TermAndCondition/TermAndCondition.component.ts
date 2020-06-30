import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../Services/app.service';

@Component({
  selector: 'app-TermAndCondition',
  templateUrl: './TermAndCondition.component.html',
  styleUrls: ['./TermAndCondition.component.scss']
})
export class TermAndConditionComponent implements OnInit {

   termContions : any ;

   constructor(public appService: AppService) { }

   ngOnInit() {
      this.appService.getTermCondition().valueChanges().subscribe(res => {this.termContions = res});
   }

}
