import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, ViewChild } from '@angular/core';
import { Store, StoreEmployee, User, Tranlog, TranlogSearchCriteria } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';


@Component({
  selector: 'app-tranlog',
  templateUrl: './Tranlog.component.html',
  styleUrls: ['./Tranlog.component.scss']
})
export class TranlogComponent extends BaseComponent implements OnInit {
  tranlogsColumns: string[] = ['id', 'author', 'oldQty', 'newQty',
    'oldPrice', 'newPrice', 'oldRebate', 'newRebate', 'tranlogDate', 'operation'];
  tranlogsDatasource: MatTableDataSource<Tranlog>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) tranlogsSort: MatSort;
  messages = '';
  tranlog: Tranlog = new Tranlog();

  storeEmployees: StoreEmployee[] = [];
  selectedPurchaser: User;

  formData = new FormData();
  picture: any[] = [];

  @Input() isAdminPage = false;
  @Input() canAcknowledge = false;
  @Input() store = new Store();
  @Output() tranlogSaveEvent = new EventEmitter<any>();

  saving = false;
  justSubmitted = false;

  tranlogTypes: any = [];
  storeEmployee: StoreEmployee;


  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        // do nothing
      } else {
        this.tranlog.id = params.id;
        this.getTranlog(params.id);
      }
    });
  }

  getTranlog(tranlog: Tranlog) {
    this.tranlog = tranlog;
    this.search();
  }

  getTranlogOld(tranlog: Tranlog) {
    this.messages = '';
    if (tranlog && tranlog.id > 0) {
      this.appService.getOneWithChildsAndFiles(tranlog.id, 'TranLog')
        .subscribe(result => {
          if (result.id > 0) {
            this.tranlog = result;
          } else {
            this.tranlog = new Tranlog();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    } else {
      // do nothing
    }
  }

  search() {
    if (this.tranlog.refNbr) {
      const searchCriteria = new TranlogSearchCriteria();
      searchCriteria.refNbr = this.tranlog.refNbr;
      this.appService.saveWithUrl('/service/order/tranlogs', searchCriteria)
        .subscribe((data: any[]) => {
          console.log(data);
          this.tranlogsDatasource = new MatTableDataSource(data);
          this.tranlogsDatasource.paginator = this.paginator;
          this.tranlogsDatasource.sort = this.tranlogsSort;
        },
          error => console.log(error),
          () => console.log('Get tranlogs complete'));
    }
  }
}
