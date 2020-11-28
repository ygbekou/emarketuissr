import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Tmoney, PaymentMethodChangeVO } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-Tmoneys',
  templateUrl: './Tmoneys.component.html',
  styleUrls: ['./Tmoneys.component.scss']
})
export class TmoneysComponent implements OnInit {

  displayedColumns: string[] = ['selected', 'image', 'phoneNumber', 'action'];
  tmoneysDataSource: MatTableDataSource<Tmoney>;
  selectedTmoney: Tmoney;

  panelOpenState = false;

  @Input()
  paymentType: string;
  @Input()
  userId;

  @Output()
  changePaymentMethodEvent = new EventEmitter<any>();

  tmoneys: Tmoney[] = [];
  error: string;
  paymentMethodChange: PaymentMethodChangeVO = new PaymentMethodChangeVO();
  constructor(public appService: AppService, public translate: TranslateService) {
  }

  ngOnInit() {

    this.tmoneysDataSource = new MatTableDataSource();
    
    if (this.userId === undefined) {
      this.userId = Number(this.appService.tokenStorage.getUserId());
    }

    this.getTmoneys();

  }

  public delete(tmoneyId: number) {
    this.appService.delete(tmoneyId, this.paymentType)
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          this.getTmoneys();
        }
      });
  }

  getTmoneys() {
    if (this.userId > 0) {
      const parameters: string[] = [];
      parameters.push('e.user.id = |userId|' + this.userId + '|Integer');
      this.appService.getAllByCriteria(this.paymentType, parameters)
        .subscribe((data: Tmoney[]) => {
          this.tmoneys = data;
          this.tmoneysDataSource = new MatTableDataSource(data);
          this.selectedTmoney = data[0];
        },
          error => console.log(error),
          () => console.log('Get all Tmoney complete for userId=' + this.userId));
    }
  }

  changePaymentMethod(tmoney: Tmoney) {

    this.paymentMethodChange.userId = this.userId;
    this.paymentMethodChange.paymentMethodCodeId = tmoney.id;
    this.paymentMethodChange.paymentMethodCode = this.paymentType.toUpperCase();

    this.appService.saveWithUrl('/service/order/changePaymentMethod/', this.paymentMethodChange)
      .subscribe((data: any) => {
        this.getTmoneys();
        this.changePaymentMethodEvent.emit(data);
      },
        error => console.log(error),
        () => console.log('Changing Payment Method complete'));
  }

  updateTable(tmoney: Tmoney) {

    const index = this.tmoneysDataSource.data.findIndex(x => x.id === tmoney.id);

		if (index === -1) {
			this.tmoneysDataSource.data.push(tmoney);
		} else {
			this.tmoneysDataSource.data[index] = tmoney;
		}

    this.tmoneysDataSource.data = this.tmoneysDataSource.data.slice();
	}
}
