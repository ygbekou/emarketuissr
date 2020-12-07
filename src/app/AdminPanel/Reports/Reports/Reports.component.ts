import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { ViewportScroller } from '@angular/common';

@Component({
   selector: 'app-reports',
   templateUrl: './Reports.component.html',
   styleUrls: ['./Reports.component.scss']
})

export class ReportsComponent implements OnInit {
   chartData: any;
   dashboard: any;
   @Input() storeId: any;
   @Input() userId: any;
   tag = 'week';
   tagValue = '0';
   index = 1;
   chartType = 'bar';
   ordersVO: any;
   colors = ['secondary', 'primary', 'secondary', 'secondary', 'secondary'];

   displayedTransactionColumns: string[] = ['transid', 'date', 'account', 'type', 'amount', 'debit', 'balance'];

   displayedTransferColumns: string[] = ['transid', 'date', 'account', 'type', 'amount', 'balance', 'status'];

   constructor(private viewportScroller: ViewportScroller,
      private appService: AppService, private translate: TranslateService) {
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

   public scrollDown() {
      this.viewportScroller.scrollToAnchor('bottom');
   }
   public getDashboard() {
      this.appService.getObject('/service/catalog/getDashboard/'
         + this.storeId + '/' + this.userId)
         .subscribe((data) => {
            this.dashboard = data;
            this.chartDataChange(this.tag, this.index);
            console.log(this.dashboard);
         }, (error) => console.log(error),
            () => {
               console.log('Get all getDashboard complete');
            });
   }

   public getSalesDtl() {
      this.appService.getObject('/service/catalog/getSalesDtl/'
         + this.storeId + '/' + this.userId + '/' + this.tag + '/' + this.tagValue)
         .subscribe((data) => {
            this.ordersVO = data;
            // console.log(this.ordersVO);
         }, (error) => console.log(error),
            () => {
               console.log('Get all getDashboard complete');
            });
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
}
