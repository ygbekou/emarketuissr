import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Bill, BillPayment } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-bill-payment',
  templateUrl: './BillPayment.component.html',
  styleUrls: ['./Bills.component.scss']
})

export class BillPaymentComponent extends BaseComponent implements OnInit, AfterViewInit {

  billPayColumns: string[] = ['id', 'dueDate', 'paymentDate', 'amount'];
  billPayDatasource: MatTableDataSource<BillPayment>;
  @ViewChild('billPayPaginator', { static: true }) billPayPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) billPaySort: MatSort;

  messages = '';
  formData = new FormData();
  picture: any[] = [];

  bill: Bill = new Bill();
  billPayment = new BillPayment();
  billPayments: BillPayment[] = [];
  saving = false;
  justSubmitted = false;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.clear([]);
  }

  ngAfterViewInit() {

  }

  clear(data) {
    this.messages = '';
    this.setDatasource([]);
    this.billPayment = new BillPayment();
    this.picture = [];
  }

  setDatasource(data) {
    this.billPayDatasource = new MatTableDataSource<BillPayment>(data);
    this.billPayDatasource.paginator = this.billPayPaginator;
    this.billPayDatasource.sort = this.billPaySort;
    this.billPayments = data;
  }

  updateDataTable(billPayment: BillPayment) {
    this.updateDatasourceData(this.billPayDatasource, this.billPayPaginator, this.billPaySort, billPayment);
  }


  addPayment() {
    this.messages = '';
    this.billPayment = new BillPayment();
    this.billPayment.bill = this.bill;
  }

  save() {
    if (this.justSubmitted) {
      this.justSubmitted = false;
      return;
    }
    this.saving = true;
    this.messages = '';
    this.billPayment.modifiedBy = +this.appService.tokenStorage.getUserId();

    if (!this.billPayment.bill.id) {
      this.billPayment.bill.id = this.bill.id;
    }

    if (this.billPayment.paymentDate) {
      this.billPayment.status = 5;
    }

    this.formData = new FormData();
    if (this.picture && this.picture.length > 0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.' + this.picture[0].file.name);
    }

    this.appService.saveWithFile(this.billPayment, 'BillPayment', this.formData, 'saveWithFile')
      .subscribe((data: BillPayment) => {
        this.processResult(data, this.bill, null);
        this.billPayment = data;
        this.updateDataTable(this.billPayment);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Save Bill Payment complete'));
  }


  getBillPayment(billPayment: BillPayment) {
    this.messages = '';
    if (billPayment && billPayment.id > 0) {
      this.appService.getOneWithChildsAndFiles(billPayment.id, 'BillPayment')
        .subscribe(result => {
          console.log(result);
          if (result.id > 0) {
            this.billPayment = result;
            const images: any[] = [];
            const image = {
              link: 'assets/images/billpayments/' + this.billPayment.id + '/' + this.billPayment.image,
              preview: 'assets/images/billpayments/' + this.billPayment.id + '/' + this.billPayment.image
            };
            images.push(image);
            this.picture = images;

          } else {
            this.billPayment = new BillPayment();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }


  public getBillPayments() {
    const parameters: string[] = [];
    parameters.push('e.bill.id = |billId|' + this.bill.id + '|Integer');
    this.appService.getAllByCriteria('BillPayment', parameters, ' ORDER BY e.createDate DESC ')
      .subscribe((data: BillPayment[]) => {
        this.setDatasource(data);
      },
        error => console.log(error),
        () => console.log('Get Bill payments for bill complete'));
  }

  public newBillSelected(bill: Bill) {
    if (bill) {
      this.bill = bill;
      this.clear([]);
      this.getBillPayments();
    }
  }

  changeTab($event) {
    console.log('Tab changed');
  }
}
