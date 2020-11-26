import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Return, Order, ReturnStatus, ReturnAction, ReturnReason, ReturnProduct, Product, OrderProduct } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-return',
  templateUrl: './Return.component.html',
  styleUrls: ['./Returns.component.scss']
})
export class ReturnComponent  extends BaseComponent implements OnInit {
  messages = '';
  displayedColumns: string[] = ['product', 'model', 'quantity', 'returnReason', 'opened', 'comment', 'actions'];
  dataSource: MatTableDataSource<ReturnProduct>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  @Input()
  returnStatuses: ReturnStatus[];
  @Input()
  returnActions: ReturnAction[];
  @Input()
  returnReasons: ReturnReason[];

  orderReturn: Return;
  constants: Constants = new Constants();
  order: Order = new Order();

  filteredOrderProducts: OrderProduct[];
  currentOption: string;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
      super(translate);
      this.appService.refreshReferenceData('ReturnAction');
      this.appService.refreshReferenceData('ReturnStatus');
      this.appService.refreshReferenceData('ReturnReason');
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getReturn(params.id);
      }
    });
  }

  clear() {
    this.orderReturn = new Return();
  }

  getReturn(returnId: number) {
    if (returnId > 0) {
      this.appService.getOneWithChildsAndFiles(returnId, 'Return')
        .subscribe(result => {
          if (result.id > 0) {
            this.orderReturn = result;
            this.dataSource = new MatTableDataSource(this.orderReturn.returnProducts);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.getOrder();
          } else {
            this.orderReturn = new Return();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  getOrder() {
    this.messages = '';

    if (this.orderReturn.order.id > 0) {
      this.appService.getOneWithChildsAndFiles(this.orderReturn.order.id, 'Order')
        .subscribe(result => {
          if (result !== null && result.id > 0) {
            this.orderReturn.customerId = result.userId;
            this.order = result;
            this.filteredOrderProducts = this.order.orderProducts;
          } else {
            this.orderReturn.customerId = undefined;
            this.translate.get(['COMMON.READ', 'MESSAGE.INVALID_ORDER_ID']).subscribe(res => {
              this.messages = res['MESSAGE.INVALID_ORDER_ID'];
            });
          }
        });
    }
  }

  save() {
    this.messages = '';
    console.info(this.orderReturn);
    try {
      this.appService.save(this.orderReturn, 'Return')
        .subscribe(result => {
          if (result.id > 0) {
            this.orderReturn.id = result.id;
            this.processResult(result, this.orderReturn, null);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

  addProduct() {
    this.orderReturn.returnProducts.push(new ReturnProduct());
    this.dataSource = new MatTableDataSource(this.orderReturn.returnProducts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterProducts(val) {
      if (val) {
         const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
         this.filteredOrderProducts = this.order.orderProducts.filter(op => op.name.toLowerCase().startsWith(filterValue));
      }

      return this.order.orderProducts;
   }


  public deleteReturnProduct(returnProduct: ReturnProduct, index: number) {

      if (returnProduct.id === undefined || returnProduct.id === null) {
         this.orderReturn.returnProducts.splice(index, 1);
         return;
      }

      this.appService.delete(returnProduct.id, 'ReturnProduct')
         .subscribe(data => {
        this.processDataSourceDeleteResult(data, this.messages, returnProduct, this.dataSource);
      });
   }

   setSelectedValue(returnProduct: ReturnProduct, option: OrderProduct) {
     returnProduct.product = option.product;
    returnProduct.model = option.product.model;
   }

  setToggleValues(returnProduct: ReturnProduct) {
    returnProduct.opened = (returnProduct.opened === null
      || returnProduct.opened === undefined
      || returnProduct.opened.toString() === 'false'
      || returnProduct.opened.toString() === '0') ? 0 : 1;
  }

  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }
}
