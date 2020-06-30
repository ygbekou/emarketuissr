import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../Services/app.service';


@Component({
  selector: 'app-AboutUs',
  templateUrl: './AboutUs.component.html',
  styleUrls: ['./AboutUs.component.scss']
})
export class AboutUsComponent implements OnInit {

   teamData          : any;
   testimonialData   : any;
   missionVisionData : any;
   aboutInfo         : any;


   constructor(private appService : AppService) { }

   ngOnInit() {
      this.getAboutInfo();
      this.getMissionVision();
      this.getTestimonialData();
      this.getTeamData();
   }

   public getAboutInfo() {
      this.appService.getAboutInfo().valueChanges().subscribe(res => {this.aboutInfo = res});
   }

   public getMissionVision() {
      this.appService.getMissionVision().valueChanges().subscribe(res => {this.missionVisionData = res});
   }

   public getTeamData() {
      this.appService.getTeam().valueChanges().subscribe(res => {this.teamData = res});
   }

   public getTestimonialData() {
      this.appService.getTestimonial().valueChanges().subscribe(res => {this.testimonialData = res});
   }
}

