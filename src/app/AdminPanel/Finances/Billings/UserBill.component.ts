import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { Store, StoreEmployee, User, Supplier, BillDtl, Bill } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { BillDetailsComponent } from './BillDetails.component';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';


@Component({
  selector: 'app-user-bill',
  templateUrl: './UserBill.component.html',
  styleUrls: ['./UserBills.component.scss']
})
export class UserBillComponent extends BaseComponent implements OnInit {

  @ViewChild('ProductsComponent', { static: false }) productsComponent: BillDetailsComponent;
  @ViewChild('ServicesComponent', { static: false }) servicesComponent: BillDetailsComponent;

  billDtlColumns: string[] = ['id', 'image', 'productName', 'quantity', 'unitPrice', 'totalAmount'];
  billDtlDatasource: MatTableDataSource<BillDtl>;
  @ViewChild('billDtlPaginator', { static: true }) billDtlPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) billDtlSort: MatSort;
  messages = '';
  bill: Bill = new Bill();
  billDtls: BillDtl[] = [];
  selectedPurchaser: User;
  formData = new FormData();
  picture: any[] = [];
  @Input() isAdminPage = false;
  @Input() store = new Store();
  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
      } else {
        this.bill.id = params.id;
        this.getBill(params.id);
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });

  }

  setDatasource(data) {
    setTimeout(() => {
      const prdBillDtls = data.filter(billDtl => billDtl.product && billDtl.product.id > 0);
      this.billDtlDatasource = new MatTableDataSource<BillDtl>(data);
      this.billDtlDatasource.paginator = this.billDtlPaginator;
      this.billDtlDatasource.sort = this.billDtlSort;
      this.billDtls = data;
    }, 1000);
  }


  getBill(bill: Bill) {
    this.messages = '';
    if (bill && bill.id > 0) {
      this.appService.getOneWithChildsAndFiles(bill.id, 'Bill')
        .subscribe(result => {
          if (result.id > 0) {
            this.bill = result;
            this.getBillDtls();
            const images: any[] = [];
            const image = {
              link: 'assets/images/pohdrs/' + this.bill.id + '/' + this.bill.image,
              preview: 'assets/images/pohdrs/' + this.bill.id + '/' + this.bill.image
            };
            images.push(image);
            this.picture = images;

          } else {
            this.bill = new Bill();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  getBillDtls() {
    this.appService.saveWithUrl('/service/finance/getBillDetails',
      {
        billId: this.bill.id,
        languageId: this.appService.appInfoStorage.language.id
      })
      .subscribe((data: any[]) => {
        this.setDatasource(data);
      },
        error => console.log(error),
        () => console.log('Get bill products complete'));

  }

}
