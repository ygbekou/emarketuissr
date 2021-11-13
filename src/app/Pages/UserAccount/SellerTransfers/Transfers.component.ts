import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-transfers',
  templateUrl: './Transfers.component.html',
  styleUrls: ['./Transfers.component.scss']
})
export class TransfersComponent extends BaseComponent implements OnInit {

  @Input() userId: number;
  @Input() isAdminPage = false;
  selected = new FormControl(0);

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });
  }

  changeOrderType(event) {
  }
}
