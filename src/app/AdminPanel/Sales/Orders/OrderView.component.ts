import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Order, OrderProduct } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';

@Component({
  selector: 'app-orders',
  templateUrl: './OrderView.component.html',
  styleUrls: ['./Orders.component.scss']
})
export class OrderViewComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['product', 'model', 'quantity', 'price', 'total'];
  dataSource: MatTableDataSource<OrderProduct>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';

  @Input()
  order: Order;
  constants: Constants = new Constants();

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
      super(translate);
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getOrder(params.id);
      }
    });
  }

  clear() {
    this.order = new Order();
  }

  getOrder(orderId: number) {
    if (orderId > 0) {
      this.appService.getOneWithChildsAndFiles(orderId, 'Order')
        .subscribe(result => {
          if (result.id > 0) {
            this.order = result;
            this.dataSource = new MatTableDataSource(this.order.orderProducts);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.info(this.order);
          } else {
            this.order = new Order();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
