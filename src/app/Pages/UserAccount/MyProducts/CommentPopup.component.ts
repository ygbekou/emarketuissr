import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-Comment',
  templateUrl: './CommentPopup.component.html',
  styleUrls: ['./MyProducts.component.scss']
})
export class CommentPopupComponent implements OnInit {

  @Input()
  productStore: any;
  popupResponse: any;
  qty = 1;
  error = '';

  constructor(public appService: AppService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<CommentPopupComponent>) {

    }

  ngOnInit() {
  }

  public shouldClose() {
    let errorFound = false;
    this.error = '';
    this.productStore.shouldSave = true;
    if (!errorFound) {
      this.dialogRef.close(this.productStore);
    }
  }
}
