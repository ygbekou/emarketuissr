import { Component, OnInit, Input } from '@angular/core';
import { Store, StoreSearchCriteria, RunReportVO, Parameter } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/app.constants';

@Component({
  selector: 'app-user-reports',
  templateUrl: './Reports.component.html',
  styleUrls: ['./Reports.component.scss']
})
export class ReportsComponent implements OnInit {

  stores: Store[] = [];
  error: string;
  showParams = false;
  fromAdmin = false;
  beginDate: Date;
  endDate: Date;
  subRpt = 1;

  @Input()
  userId;

  constructor(public appService: AppService, public translate: TranslateService) {

  }

  ngOnInit() {
    this.showParams = false;
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
      },
        error => console.log(error),
        () => console.log('Get all Stores complete'));
  }

  runInvnReport(type: number) {
    this.showParams = false;
    if (type === 3 || type === 4) {
      this.showParams = true;
      this.subRpt = type;
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

    this.appService.saveWithUrl('/service/report/run/', rep)
      .subscribe((data: any) => {
        console.log(data);
        this.openInNewTab(Constants.webServer + '/assets/reports/' + data[0]);
      },
        error => console.log(error),
        () => console.log('runInvnReport complete '));

  }
  openInNewTab(url) {
    const win = window.open(url, '_blank');
    win.focus();
  }

  runRpt() {

    const rep = new RunReportVO();
    rep.reportName = 'sales';
    const parm1 = new Parameter('pUserId', this.appService.tokenStorage.getUserId());
    const parm2 = new Parameter('pLang', this.appService.appInfoStorage.language.code);
    const parm3 = new Parameter('dateDebut', this.beginDate.toLocaleString());
    const parm4 = new Parameter('dateFin', this.endDate.toLocaleString());
    const parm5 = new Parameter('subRptId', '' + this.subRpt);
    rep.parameters = [];
    rep.parameters.push(parm1, parm2, parm3, parm4, parm5);
    console.log(rep);

    this.appService.saveWithUrl('/service/report/run/', rep)
      .subscribe((data: any) => {
        console.log(data);
        this.showParams = false;
        this.openInNewTab(Constants.webServer + '/assets/reports/' + data[0]);
      },
        error => console.log(error),
        () => console.log('runInvnReport complete '));
  }

}
