import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { OnlineOrderVO, OrdersVO, StoreOrderVO, OrderSearchCriteria, StoreSearchCriteria, Store } from 'src/app/app.models';
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
   tag = 'week';
   tag2 = 'weekday';
   tagValue = '0';
   index = 1;
   store: Store = new Store();
   store0 = new Store();
   chartType = 'bar';
   ordersVO: OrdersVO;
   stores: Store[] = [];
   colors = ['secondary', 'primary', 'secondary', 'secondary', 'secondary',
      'secondary', 'secondary', 'secondary', 'secondary', 'secondary'];

   colors2 = ['tertiary', 'accent', 'tertiary', 'tertiary', 'tertiary', 'tertiary'];

   onlineOrdersColumns: string[] = ['orderId', 'createDate', 'status', 'storeName', 'city', 'country', 'total'];
   storeOrdersColumns: string[] = ['orderId', 'date', 'status', 'store', 'type', 'price', 'rebate', 'total'];

   constructor(private appService: AppService,
      private translate: TranslateService) {
      this.store0.id = 0;
      this.store = this.store0;
   }

   ngOnInit() {
      if (!this.storeId) {
         this.storeId = 0;
      }
      if (!this.userId) {
         this.userId = 0;
      }
      this.getStores();
      this.getDynDashboard();
   }

   compareObjects(o1: any, o2: any): boolean {
      return o1 && o2 ? (o1.id === o2.id) : false;
   }

   changeStore(storeId: number) {
      this.storeId = storeId;
      console.log(this.storeId);
      this.getDynDashboard();
   }
   private getStores() {
      const storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
      storeSearchCriteria.status = 1;
      storeSearchCriteria.userId = this.userId;
      console.log(storeSearchCriteria);
      this.appService.saveWithUrl('/service/catalog/stores', storeSearchCriteria)
         .subscribe((data: Store[]) => {
            this.stores = data;
         },
            error => console.log(error),
            () => console.log('Get all Stores complete'));
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

   public getDynDashboard() {
      const searchCriteria = new OrderSearchCriteria();
      searchCriteria.userId = this.userId;
      searchCriteria.storeId = this.storeId;
      searchCriteria.miscText1 = this.tag;
      searchCriteria.miscText2 = this.tag2;
      searchCriteria.langId = this.appService.appInfoStorage.language.id;
      this.appService.saveWithUrl('/service/catalog/getDynDashboard', searchCriteria)
         .subscribe((data: any[]) => {
            this.dashboard = data[0];
            // this.chartDataChange(this.tag, this.index);
            this.chartData = this.dashboard.dataSet[0];
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
      // this.getSalesDtl();
   }
   // chartDataChange method is used to change the chart data according to button event.
   chartDataChange2(tag2, i) {
      this.tag2 = tag2;
      this.index = i;
      for (let j = 0; j < 6; j++) {
         this.colors2[j] = 'tertiary';
      }
      this.colors2[i] = 'accent';
      this.getDynDashboard();
   }

   chartDataChange(tag, i) {
      this.tag = tag;
      this.index = i;
      for (let j = 0; j < 10; j++) {
         this.colors[j] = 'secondary';
      }
      this.colors[i] = 'primary';
      if (this.tag === 'day') {
         this.tag2 = 'hour';
         for (let j = 0; j < 6; j++) {
            this.colors2[j] = 'tertiary';
         }
         this.colors2[0] = 'accent';
      } else if (this.tag === 'week') {
         this.tag2 = 'weekday';
         for (let j = 0; j < 6; j++) {
            this.colors2[j] = 'tertiary';
         }
         this.colors2[1] = 'accent';
      } else if (this.tag === 'month'
         || this.tag === '1month') {
         this.tag2 = 'day';
         for (let j = 0; j < 6; j++) {
            this.colors2[j] = 'tertiary';
         }
         this.colors2[2] = 'accent';
      } else if (this.tag === '3months'
         || this.tag === '6months'
         || this.tag === '1year'
         || this.tag === 'year') {
         this.tag2 = 'month';
         for (let j = 0; j < 6; j++) {
            this.colors2[j] = 'tertiary';
         }
         this.colors2[4] = 'accent';
      } else if (this.tag === '5years'
         || this.tag === 'century') {
         this.tag2 = 'year';
         for (let j = 0; j < 6; j++) {
            this.colors2[j] = 'tertiary';
         }
         this.colors2[5] = 'accent';
      }
      this.getDynDashboard();
   }

   chartDataChangeOrig(tag, i) {
      this.tag = tag;
      this.index = i;
      for (let j = 0; j < 10; j++) {
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
