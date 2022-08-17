import { Component, OnInit, Input } from '@angular/core';
import { Store, StoreSearchCriteria, RunReportVO, Parameter } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/app.constants';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-user-reports',
  templateUrl: './Reports.component.html',
  styleUrls: ['./Reports.component.scss'],
  providers: [DatePipe],
})
export class ReportsComponent implements OnInit {

  stores: Store[] = [];
  error: string;
  showParams = false;
  showFormatParams = false;
  fromAdmin = false;
  reportFormat = 'pdf';
  beginDate: Date;
  endDate: Date;
  percentPrint = 100;
  running = false;
  allowExRcpt = false;
  subRpt = 1;
  @Input()
  userId;
  rptType = 0;
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  selectedStore: Store;
  constructor(public appService: AppService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    public translate: TranslateService) {
    this.route.params.subscribe((params) => {
      console.log(params);
      this.rptType = params.rptType;
      console.log('Report type = ' + this.rptType);
      /* this.route.queryParams.forEach(queryParams => {
        console.log(queryParams);
        this.rptType = queryParams['rptType'];
        console.log('Report type = ' + this.rptType);
      }); */
    });
  }

  ngOnInit() {
    this.showParams = false;
    this.showFormatParams = false;
    this.running = false;
    if (this.userId === undefined) {
      this.userId = Number(this.appService.tokenStorage.getUserId());
    } else {
      this.fromAdmin = true;
    }
    this.getStores();
  }

  public delete(cardId: number) {
    this.appService.delete(cardId, 'com.softenza.emarket.model.Store')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          this.getStores();
        }
      });
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }
  private getStores() {
    const storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
    storeSearchCriteria.status = 1;
    storeSearchCriteria.userId = this.userId;
    console.log(storeSearchCriteria);
    this.appService.saveWithUrl('/service/catalog/stores', storeSearchCriteria)
      .subscribe((data: Store[]) => {
        this.stores = data;
        console.log(this.stores);
        if (this.stores) {
          if (this.stores && this.stores.length === 1) {
            this.selectedStore = this.stores[0];
          }
          this.stores.forEach((st) => {
            if (st.allowExRcpt === 1) {
              this.allowExRcpt = true;
            }
          });
        }
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  runInvnReport(type: number) {
    this.showParams = false;
    this.showFormatParams = true;
    this.error = '';
    if (type >= 3) {
      this.showParams = true;
    }

    if (type > 0) {
      this.subRpt = type;
      return;
    }

    let qtyMax = 0;
    if (type === 1) { // all inventory
      qtyMax = 999999999;
    }

    const rep = new RunReportVO();
    rep.reportName = 'inventory';
    const parm1 = new Parameter('pUserId', this.appService.tokenStorage.getUserId());
    const parm2 = new Parameter('pLang', this.appService.appInfoStorage.language.code);
    const parm3 = new Parameter('pQtyMax', qtyMax + '');
    const parm4 = new Parameter('storeId', this.selectedStore.id + '');
    rep.parameters = [];
    rep.parameters.push(parm1, parm2, parm3, parm4);
    this.running = true;
    this.appService.saveWithUrl('/service/report/run/', rep)
      .subscribe((data: any) => {
        console.log(data);
        this.running = false;
        if (data && data.length > 0 && !data[0].startsWith('ERROR :')) {
          this.showParams = false;
          this.showFormatParams = false;
          this.openInNewTab(Constants.webServer + '/assets/reports/' + data[0]);
        } else {
          this.translate.get(['MESSAGE.GOV_ERROR_OCCURRED']).subscribe(res => {
            this.error = res['MESSAGE.GOV_ERROR_OCCURRED'] + ' ' + data[0];
          });
        }
      },
        error => {
          console.log(error);
          this.running = false;
        },
        () => {
          console.log('runInvnReport complete ');
          this.running = false;
        });

  }
  openInNewTab(url) {
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
    }
  }

  runRpt() {
    this.running = true;
    this.error = '';
    const rep = new RunReportVO();
    rep.reportFormat = this.reportFormat;
    if (this.subRpt <= 2) {
      rep.reportName = 'inventory';
    } else if (this.subRpt === 6) {
      rep.reportName = 'receipts';
    } else if (this.subRpt > 2 && this.subRpt < 9) {
      rep.reportName = 'sales';
    } else if (this.subRpt === 9) {
      rep.reportName = 'expenses';
    } else if (this.subRpt === 10) {
      rep.reportName = 'pos';
    } else if (this.subRpt === 11) {
      rep.reportName = 'sales';
    } else if (this.subRpt === 12) {
      rep.reportName = 'bilan';
    } else if (this.subRpt === 13) {
      rep.reportName = 'hotel_rooms_history';
    } else if (this.subRpt === 14) {
      rep.reportName = 'hotel_sales';
    } else if (this.subRpt === 15) {
      rep.reportName = 'sales';
    }


    const parm1 = new Parameter('pUserId', this.appService.tokenStorage.getUserId());
    const parm2 = new Parameter('pLang', this.appService.appInfoStorage.language.code);

    if (this.subRpt <= 2) {
      let qtyMax = 0;
      if (this.subRpt === 1) { // all inventory
        qtyMax = 999999999;
      }
      const parm3 = new Parameter('pQtyMax', qtyMax + '');
      rep.parameters = [];
      rep.parameters.push(parm1, parm2, parm3);
    } else {
      const parm3 = new Parameter('dateDebut',
        this.datePipe.transform(this.beginDate, 'MM/dd/yyyy') + ' 00:00:00');
      const parm4 = new Parameter('dateFin',
        this.datePipe.transform(this.endDate, 'MM/dd/yyyy') + ' 23:59:59');
      const parm5 = new Parameter('subRptId', '' + this.subRpt);
      const parm6 = new Parameter('percentPrint', '' + this.percentPrint);
      rep.parameters = [];
      rep.parameters.push(parm1, parm2, parm3, parm4, parm5, parm6);
    }
    rep.parameters.push(new Parameter('storeId', this.selectedStore.id + ''));
    console.log(rep);
    this.appService.saveWithUrl('/service/report/run/', rep)
      .subscribe((data: any) => {
        console.log(data);
        this.running = false;
        if (data && data.length > 0 && !data[0].startsWith('ERROR :')) {
          this.showParams = false;
          this.showFormatParams = false;
          this.openInNewTab(Constants.webServer + '/assets/reports/' + data[0]);
        } else {
          this.translate.get(['MESSAGE.GOV_ERROR_OCCURRED']).subscribe(res => {
            this.error = res['MESSAGE.GOV_ERROR_OCCURRED'] + ' ' + data[0];
          });
        }
      },
        error => {
          console.log(error);
          this.running = false;
        },
        () => {
          console.log('runInvnReport complete ');
          this.running = false;
        });
  }

}
