import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Order, OrderStatus, OrderHistory, OrderOption } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-order-option',
  templateUrl: './OrderOption.component.html',
  styleUrls: ['./Orders.component.scss']
})
export class OrderOptionComponent  extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['product', 'name', 'type', 'value', 'price', 'pricePrefix'];
  dataSource: MatTableDataSource<OrderOption>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  errors = '';

  orderOption: OrderOption = new OrderOption();

  @Input() orderType: string;
  @Input() order: Order;
  @Input() storeOwnerId: number;
  canEdit = false;

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.getOrderOptions();
  }

  getOrderOptions() {
    const parameters: string[] = [];
    if (this.order.id !== null && this.order.id !== undefined) {
      parameters.push('e.orderId = |ourId|' + this.order.id + '|Integer');
    }
    this.appService.getAllByCriteria('OrderOption', parameters)
      .subscribe((data: OrderOption[]) => {
        this.dataSource = new MatTableDataSource<OrderOption>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all OrderOption complete'));
  }
}
