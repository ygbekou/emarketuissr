import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { OnlineOrderVO, OrdersVO, StoreOrderVO, OrderSearchCriteria } from 'src/app/app.models';
@Component({
   selector: 'app-reports',
   templateUrl: './Reports.component.html',
   styleUrls: ['./Reports.component.scss']
})

export class ReportsComponent implements OnInit {

   onlineDS: MatTableDataSource<OnlineOrderVO>;
   @ViewChild('MatPaginatorO', { static: true }) onlinePG: MatPaginator;
   @ViewChild(MatSort, { static: true }) onlineST: MatSort;

   storeDS: MatTableDataSource<StoreOrderVO>;
   @ViewChild('MatPaginatorS', { static: true }) storePG: MatPaginator;
   @ViewChild(MatSort, { static: true }) storeST: MatSort;

   chartData: any;
   dashboard: any;
   @Input() storeId: any;
   @Input() userId: any;
   tag = 'month';
   tagValue = '0';
   index = 1;
   chartType = 'bar';
   ordersVO: OrdersVO;
   colors = ['secondary', 'primary', 'secondary', 'secondary', 'secondary'];

  onlineOrdersColumns: string[] = ['orderId', 'createDate', 'status', 'storeName', 'city', 'country', 'total'];
   storeOrdersColumns: string[] = ['orderId', 'date', 'status', 'store', 'type', 'price', 'rebate', 'total'];

   constructor(private appService: AppService,
      private translate: TranslateService) {
   }

   ngOnInit() {
      if (!this.storeId) {
         this.storeId = 0;
      }
      if (!this.userId) {
         this.userId = 0;
      }
      this.getDashboard();
   }

   public getDashboard() {

      const searchCriteria = new OrderSearchCriteria();
      searchCriteria.userId = this.userId;
      searchCriteria.storeId = this.storeId;
      searchCriteria.langId = this.appService.appInfoStorage.language.id;
      this.appService.saveWithUrl('/service/catalog/getDashboard', searchCriteria)
         .subscribe((data: any[]) => {
            this.dashboard = data[0];
            this.chartDataChange(this.tag, this.index);
            console.log(this.dashboard);
         },
            error => console.log(error),
            () => console.log('Get all getDashboard complete'));

   }

   public getSalesDtl() {

      const searchCriteria = new OrderSearchCriteria();
      searchCriteria.userId = this.userId;
      searchCriteria.storeId = this.storeId;
      searchCriteria.miscText1 = this.tag;
      searchCriteria.miscText2 = this.tagValue;
      searchCriteria.langId = this.appService.appInfoStorage.language.id;

      this.appService.saveWithUrl('/service/catalog/getSalesDtl', searchCriteria)
         .subscribe((data: any[]) => {
            this.ordersVO = data[0];
            this.onlineDS = new MatTableDataSource(data[0].online);
            this.onlineDS.paginator = this.onlinePG;
            this.onlineDS.sort = this.onlineST;

            this.storeDS = new MatTableDataSource(data[0].store);
            this.storeDS.paginator = this.storePG;
            this.storeDS.sort = this.storeST;
         },
            error => console.log(error),
            () => console.log('Get all getSalesDtl complete'));

   }

   chartClick($event) {
      this.tagValue = $event;
      this.getSalesDtl();
   }
   // chartDataChange method is used to change the chart data according to button event.
   chartDataChange(tag, i) {
      this.tag = tag;
      this.index = i;
      for (let j = 0; j < 5; j++) {
         this.colors[j] = 'secondary';
      }
      this.colors[i] = 'primary';
      if (this.dashboard && this.dashboard.dataSet.length > 0) {
         for (const content of this.dashboard.dataSet) {
            if (content.tag === tag) {
               this.chartData = content;
               this.tagValue = '0';
               this.getSalesDtl();
            }
         }
      }
   }

   filterOnlineOrder(status) {
      this.onlineDS.filter = status.trim().toLowerCase();
      if (this.onlineDS.paginator) {
         this.onlineDS.paginator.firstPage();
      }
   }

   filterStoreOrder(status) {
      console.log(status);
      this.storeDS.filter = status.trim().toLowerCase();
      if (this.storeDS.paginator) {
         this.storeDS.paginator.firstPage();
      }
   }
}
