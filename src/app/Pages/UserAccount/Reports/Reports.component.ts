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
  fromAdmin = false;
  beginDate: Date;
  endDate: Date;
  percentPrint = 100;
  running = false;
  allowExRcpt = false;
  subRpt = 1;
  @Input()
  userId;
  rptType = 0;
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
    if (type === 3 || type === 4 || type === 5 || type === 6) {
      this.showParams = true;
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
    rep.parameters = [];
    rep.parameters.push(parm1, parm2, parm3);
    this.running = true;
    this.appService.saveWithUrl('/service/report/run/', rep)
      .subscribe((data: any) => {
        console.log(data);
        this.running = false;
        this.openInNewTab(Constants.webServer + '/assets/reports/' + data[0]);
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
    const rep = new RunReportVO();
    if (this.subRpt === 6) {
      rep.reportName = 'receipts';
    } else {
      rep.reportName = 'sales';
    }

    const parm1 = new Parameter('pUserId', this.appService.tokenStorage.getUserId());
    const parm2 = new Parameter('pLang', this.appService.appInfoStorage.language.code);
    const parm3 = new Parameter('dateDebut',
      this.datePipe.transform(this.beginDate, 'MM/dd/yyyy') + ' 00:00:00');
    const parm4 = new Parameter('dateFin',
      this.datePipe.transform(this.endDate, 'MM/dd/yyyy') + ' 23:59:59');
    const parm5 = new Parameter('subRptId', '' + this.subRpt);
    const parm6 = new Parameter('percentPrint', '' + this.percentPrint);
    rep.parameters = [];
    rep.parameters.push(parm1, parm2, parm3, parm4, parm5, parm6);
    console.log(rep);

    this.appService.saveWithUrl('/service/report/run/', rep)
      .subscribe((data: any) => {
        console.log(data);
        this.showParams = false;
        this.running = false;
        this.openInNewTab(Constants.webServer + '/assets/reports/' + data[0]);
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
