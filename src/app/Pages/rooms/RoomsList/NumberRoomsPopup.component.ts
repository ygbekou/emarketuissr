import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-NumberRoomsPopup',
  templateUrl: './NumberRoomsPopup.component.html',
  styleUrls: ['./RoomsList.component.scss']
})
export class NumberRoomsPopupComponent implements OnInit {

  @Input()
  productDesc: any;
  popupResponse: any;
  qty = 1;
  error = '';

  constructor(public appService: AppService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<NumberRoomsPopupComponent>) {

    }

  ngOnInit() {

  }
}
