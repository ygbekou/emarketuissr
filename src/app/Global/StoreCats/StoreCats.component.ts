import { Component, OnInit, Input } from '@angular/core';
import { StoreCatVO } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-store-cats',
  templateUrl: './StoreCats.component.html',
  styleUrls: ['./StoreCats.component.scss']
})
export class StoreCatsComponent implements OnInit {

  @Input() storeCats: StoreCatVO[] = [];

  constructor(public appService: AppService, public translate: TranslateService) { }

  ngOnInit() {
  }

}
