import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderSearchCriteria, OrderStatus, Return, ReturnStatus, ReturnAction, ReturnReason } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-returns',
  templateUrl: './Returns.component.html',
  styleUrls: ['./Returns.component.scss']
})
export class ReturnsComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'orderId', 'customer', 'status', 'dateAdded', 'dateModified', 'actions'];
  dataSource: MatTableDataSource<Return>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  searchCriteria: OrderSearchCriteria;
  returnStatuses: ReturnStatus[];
  returnActions: ReturnAction[];
  returnReasons: ReturnReason[];



  constructor(public appService: AppService,
    public translate: TranslateService) {
      super(translate);
    }

  ngOnInit() {
    this.searchCriteria = new OrderSearchCriteria();
    this.search();
    this.getReturnStatuses();
    this.getReturnReasons();
    this.getReturnActions();
  }

  getReturnStatuses() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.ReturnStatus', parameters)
      .subscribe((data: ReturnStatus[]) => {
        this.returnStatuses = data;
      },
        error => console.log(error),
        () => console.log('Get all ReturnStatus complete'));
  }

  getReturnActions() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.ReturnAction', parameters)
      .subscribe((data: ReturnAction[]) => {
        this.returnActions = data;
      },
        error => console.log(error),
        () => console.log('Get all ReturnActions complete'));
  }

  getReturnReasons() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('com.softenza.emarket.model.ReturnReason', parameters)
      .subscribe((data: ReturnReason[]) => {
        this.returnReasons = data;
      },
        error => console.log(error),
        () => console.log('Get all ReturnReasons complete'));
  }

  search() {

    this.appService.saveWithUrl('/service/order/returns', this.searchCriteria)
      .subscribe((data: Return[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Returns complete'));
  }

  public remove(orderReturn: Return) {
    this.messages = '';
    this.appService.delete(orderReturn.id, 'Return')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(orderReturn);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Return>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
          });
        } else {
          this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.ERROR_OCCURRED'];
          });
        }
      });
  }

  getProducts(orderReturn: Return) {
    return orderReturn.returnProducts !== null ? orderReturn.returnProducts[0].productName : '';
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
