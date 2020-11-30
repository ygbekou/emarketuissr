import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ConfirmationPopup',
  templateUrl: './ConfirmationPopup.component.html',
  styleUrls: ['./ConfirmationPopup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {

   message : string;
   
   constructor(public dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    translate: TranslateService) { }

   ngOnInit() {
   }

}
