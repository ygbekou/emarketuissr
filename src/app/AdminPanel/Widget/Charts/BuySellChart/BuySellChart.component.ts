import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
   selector: 'app-buy-sell-chart',
   templateUrl: './BuySellChart.component.html',
   styleUrls: ['./BuySellChart.component.scss']
})

export class BuySellChartComponent implements OnInit {

   @Input() color: any;
   @Input() label: any;
   @Input() data: any;
   @Input() chartType: any;
   @Output() chartClick: EventEmitter<any> = new EventEmitter();
   showChart: boolean;
   chartLegend = true;
   public barChartOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      tooltip: {
         enabled: true
      },
      legend: {
         display: true
      },
   };
   // line chart options
   public lineChartOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
         yAxes: [{
            gridLines: {
               display: true,
               drawBorder: false
            }
         }],
         xAxes: [{
            gridLines: {
               display: false,
               drawBorder: false
            }
         }]
      },
      tooltip: {
         enabled: true
      },
      legend: {
         display: false
      },
   }

   constructor() { }

   chartClicked($event) {
      console.log($event);
      console.log($event.active[0]._model.label);
      this.chartClick.emit($event.active[0]._model.label);
   }
   ngOnInit() {
      setTimeout(() => {
         this.showChart = true;
      }, 0)
   }
}
