import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { StoreSearchCriteria, Store, Transaction, TransactionSearchCriteria, StoreEmployee, TransactionType } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-TransferHistories',
  templateUrl: './TransferHistories.component.html',
  styleUrls: ['./TransferHistories.component.scss']
})
export class TransferHistoriesComponent extends BaseComponent implements OnInit, AfterViewInit {

  transactionsColumns: string[] = ['transactionType', 'paidBy', 'receiver', 'transactionDate', 'amount', 'status' ];
  transactionsDatasource: MatTableDataSource<Transaction>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) transactionsSort: MatSort;

  button = 'filter';

  @Input() userId: number;
  @Input() isAdminPage = false;

  searchCriteria: TransactionSearchCriteria = new TransactionSearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  selected = new FormControl(0);

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });
  }

  ngAfterViewInit() {
   
  }

}
