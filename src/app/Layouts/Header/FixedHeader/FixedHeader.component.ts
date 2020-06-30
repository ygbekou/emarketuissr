import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../Services/app.service';

@Component({
  selector: 'embryo-FixedHeader',
  templateUrl: './FixedHeader.component.html',
  styleUrls: ['./FixedHeader.component.scss']
})
export class FixedHeaderComponent implements OnInit {

  constructor(private appService : AppService) { }

  ngOnInit() {
  }

  public toggleSidebar()
   {
      this.appService.sidenavOpen = !this.appService.sidenavOpen;
   }

}
