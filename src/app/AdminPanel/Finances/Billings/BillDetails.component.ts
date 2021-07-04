import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProductDescription, Bill, BillDtl, Service, ServiceDescription } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-bill-details',
  templateUrl: './BillDetails.component.html',
  // styleUrls: ['./Bills.component.scss']
})

export class BillDetailsComponent extends BaseComponent implements OnInit, AfterViewInit {

  billDtlColumns: string[] = ['id', 'image', 'productName', 'quantity', 'unitPrice', 'totalAmount', 'actions'];
  billDtlDatasource: MatTableDataSource<BillDtl>;
  @ViewChild('billDtlPaginator', { static: true }) billDtlPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) billDtlSort: MatSort;

  messages = '';
  currentOption: string;
  productOptions: ProductDescription[];
  filteredProductOptions: ProductDescription[];
  serviceOptions: ServiceDescription[];
  filteredServiceOptions: ServiceDescription[];

  bill: Bill = new Bill();
  billDtls: BillDtl[] = [];
  saving = false;
  services: Service[] = [];

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.clear([]);
    this.getStoreProducts(17);
    this.getServices();
  }

  ngAfterViewInit() {

  }

  clear(data) {
    this.messages = '';
    this.currentOption = '';
    this.setDatasource([]);
  }

  setDatasource(data) {
    this.billDtlDatasource = new MatTableDataSource<BillDtl>(data);
    this.billDtlDatasource.paginator = this.billDtlPaginator;
    this.billDtlDatasource.sort = this.billDtlSort;
    this.billDtls = data;
  }

  getStoreProducts(storeId: number) {
    this.appService.getObjects('/service/catalog/getMyProductsOnSale/'
      + this.appService.appInfoStorage.language.id + '/' + 17)
      .subscribe((data: ProductDescription[]) => {
        this.filteredProductOptions = data;
        this.productOptions = data;
      },
        error => console.log(error),
        () => console.log('Get all store product complete'));
  }

  public getServices() {

    const parameters: string[] = [];
    parameters.push('e.language.code = |langCode|' + this.appService.appInfoStorage.language.code + '|String');
    this.appService.getAllByCriteria('ServiceDescription', parameters)
      .subscribe((data: ServiceDescription[]) => {
        this.filteredServiceOptions = data;
        this.serviceOptions = data;
      },
        error => console.log(error),
        () => console.log('Get all ServiceDescription complete'));
  }

  filterOptions(val) {
    if (val) {
      const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
      this.filteredProductOptions = this.productOptions
        .filter(productDesc => productDesc.name.toLowerCase().startsWith(filterValue));
    } else {
      this.filteredProductOptions = this.productOptions;
    }
  }

  filterServiceOptions(val) {
    if (val) {
      const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
      this.filteredServiceOptions = this.serviceOptions
        .filter(ingredienttDesc => ingredienttDesc.name.toLowerCase().startsWith(filterValue));
    } else {
      this.filteredServiceOptions = this.serviceOptions;
    }
  }

  addBillDtl() {
    this.messages = '';
    this.billDtlDatasource.data.unshift(new BillDtl())
    this.billDtlDatasource = new MatTableDataSource(this.billDtlDatasource.data);
    this.billDtlDatasource.paginator = this.billDtlPaginator;
    this.billDtlDatasource.sort = this.billDtlSort;
  }

  saveBillDtl(billDtl: BillDtl, index: number) {
    this.saving = true;
    this.messages = '';
    billDtl.modifiedBy = +this.appService.tokenStorage.getUserId();
    billDtl.bill = this.bill;

    if (billDtl.product.id > 0) {
      billDtl.service = null;
    } else if (billDtl.service.id > 0) {
      billDtl.product = null;
    }


    this.appService.saveWithUrl('/service/finance/saveBillDtl/', billDtl)
      .subscribe((data: BillDtl) => {
        console.log(data);
        this.processResult(data, billDtl, null);
        billDtl = data;
        billDtl.isTouched = false;
        this.billDtlDatasource.data[index] = data;
        this.setDatasource(this.billDtlDatasource.data);
        this.saving = false;
      },
        error => console.log(error),
        () => console.log('Get all billDtl complete'));
  }

  removeBillDtl(billDtl: BillDtl, index: number) {

    if (!billDtl.id) {
      this.billDtlDatasource.data.splice(index, 1);
      this.resetDatasource(this.billDtlDatasource.data, index);
      return;
    }

    this.messages = '';

    this.appService.delete(billDtl.id, 'BillDtl')
      .subscribe(data => {
        this.processDataSourceDeleteResult(data, this.messages, billDtl, this.billDtlDatasource);
        this.billDtlDatasource.data = Array.from(this.billDtlDatasource.data);
        this.setDatasource(this.billDtlDatasource.data);
      });
  }

  validateSelectedProduct(billDtl: BillDtl) {

    if (typeof (billDtl.productName) === 'string' && this.productOptions) {
      let index = this.productOptions.findIndex(x => x.name === billDtl.productName);
      if (index === -1) {
        index = this.billDtls.findIndex(x => x.id === billDtl.id);
        if (index === -1) {
          return false;
        } else {
          return true;
        }
      } else {
        billDtl.product = this.productOptions[index].product;
      }
    }

    if (!billDtl.product || !billDtl.product.id) {
      return false;
    }

    return true;
  }

  validateSelectedService(billDtl: BillDtl) {

    if (typeof(billDtl.serviceName) === 'string' && this.serviceOptions) {
        let index = this.serviceOptions.findIndex(x => x.name === billDtl.serviceName);
        if (index === -1) {
          index = this.billDtls.findIndex(x => x.id === billDtl.id);
          if (index === -1) {
              return false;
          } else {
              return true;
          }
        } else {
          billDtl.service = this.serviceOptions[index].service;
        }
    }

    if (!billDtl.service || !billDtl.service.id) {
        return false;
    }

    return true;
  }

  setSelectedProduct(billDtl: BillDtl, productDesc: ProductDescription) {
    billDtl.product = productDesc.product;
  }

  calculateTotalAmount(billDtl: BillDtl) {
    if (!billDtl.unitAmount || !billDtl.quantity) {
      billDtl.totalAmount = undefined;
      return;
    }
    billDtl.totalAmount = billDtl.unitAmount * billDtl.quantity;
  }

  changeTab($event) {
    console.log('Tab changed');
  }
}
