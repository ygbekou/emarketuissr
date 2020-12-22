import { Component, OnInit, ViewChild } from '@angular/core';
import { ReturnProduct, User } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/app.constants';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './User.component.html',
  styleUrls: ['./Users.component.scss']
})
export class UserComponent extends BaseComponent implements OnInit {
  messages = '';
  displayedColumns: string[] = ['product', 'model', 'quantity', 'returnReason', 'opened', 'comment', 'actions'];
  dataSource: MatTableDataSource<ReturnProduct>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  user: User;
  constants: Constants = new Constants();
  picture: any;
  selectedTabIndex = 0;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute) {
    super(translate);
    this.appService.refreshReferenceData('ReturnAction', undefined);
    this.appService.refreshReferenceData('ReturnStatus', undefined);
    this.appService.refreshReferenceData('ReturnReason', undefined);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getUser(params.id);
      }
    });
  }

  clear() {
    this.user = new User();
  }

  getUser(userId: number) {
    if (userId > 0) {
      this.appService.getOneWithChildsAndFiles(userId, 'User')
        .subscribe(result => {
          if (result.id > 0) {
            this.user = result;
            // this.dataSource = new MatTableDataSource(this.orderReturn.returnProducts);
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
            // this.getOrder();
          } else {
            this.user = new User();
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
    }
  }
  save() {
    this.messages = '';
    this.user.status = (this.user.status == null
      || this.user.status.toString() === 'false'
      || this.user.status.toString() === '0') ? 0 : 1;
    try {
      this.appService.save(this.user, 'User')
        .subscribe(result => {
          if (result.id > 0) {
            this.user.id = result.id;
            this.processResult(result, this.user, null);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }


  setToggleValues(returnProduct: ReturnProduct) {
    returnProduct.opened = (returnProduct.opened === null
      || returnProduct.opened === undefined
      || returnProduct.opened.toString() === 'false'
      || returnProduct.opened.toString() === '0') ? 0 : 1;
  }

  isEmpty(value: string): boolean {
    const val = value !== null && value !== undefined ? value.trim() : '';

    return val.length === 0;
  }

  tabClick(tab) {
    this.selectedTabIndex = tab.index;
  }
}
