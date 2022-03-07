import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { OrderStatus, StoreSearchCriteria, Store, SalesSummary, SalesSummarySearchCriteria, Currency, Payout } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-sales-summaries-include',
  templateUrl: './SalesSummariesInclude.component.html',
  styleUrls: ['./SalesSummaries.component.scss']
})
export class SalesSummariesIncludeComponent extends BaseComponent implements OnInit {
  salesSummariesColumns: string[] = ['select', 'monthyear', 'paymentMethod', 'total', 'processingFees', 'totalDue', 'totalPaid', 'status'];
  salesSummariesDatasource: MatTableDataSource<SalesSummary>;
  @ViewChild('MatPaginatorSalesSummaries', { static: true }) salesSummariesPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) salesSummariesSort: MatSort;

  messages = '';
  button = 'filter';
  action = '';

  @Input() userId: number;

  searchCriteria: SalesSummarySearchCriteria = new SalesSummarySearchCriteria();
  storeSearchCriteria: StoreSearchCriteria = new StoreSearchCriteria();
  paymentMethods: OrderStatus[];
  stores: Store[] = [];
  colors = ['primary', 'secondary'];

  initialSelection = [];
  allowMultiSelect = true;
  selection;

  selectedCurrency: Currency;
  totalDue = 0;
  @Output() totalDueCompleteEvent = new EventEmitter<Payout>();
  @Output() selectSalesSummaryEvent = new EventEmitter<any>();

  selectedSalesSummaryIds: number[] = [];
  @Input() theaction = 'add';

  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.selection = new SelectionModel<SalesSummary>(this.allowMultiSelect, this.initialSelection);
    this.clear();
  }

  private clear() {
    this.searchCriteria.userId = this.userId;
  }

  changeOrderType(event) {
    this.search();

  }

  search() {
    this.totalDue = 0;
    this.selection.clear();
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {

      this.appService.saveWithUrl('/service/order/salesSummaries', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.salesSummariesDatasource = new MatTableDataSource(data);
          this.salesSummariesDatasource.paginator = this.salesSummariesPaginator;
          this.salesSummariesDatasource.sort = this.salesSummariesSort;
        },
          error => console.log(error),
          () => console.log('Get all sales summaries complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.salesSummariesDatasource.filter = filterValue.trim().toLowerCase();
    if (this.salesSummariesDatasource.paginator) {
      this.salesSummariesDatasource.paginator.firstPage();
    }

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.salesSummariesDatasource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.totalDue = 0;
    this.selectedSalesSummaryIds = [];
    if (this.isAllSelected()) {
        this.selection.clear();
    } else {
      this.salesSummariesDatasource.data.forEach(row => {
        this.selection.select(row);
        this.totalDue +=  row.totalDue;
        this.selectedSalesSummaryIds.push(row.id);
      });
    }
    const payout = new Payout();
    payout.total = this.totalDue;
    payout.salesSummaryIds = this.selectedSalesSummaryIds;
    this.totalDueCompleteEvent.emit(payout);
  }

  calculateTotalDue(row) {
    this.selection.toggle(row);
    this.totalDue = 0;
    this.selectedSalesSummaryIds = [];
    this.salesSummariesDatasource.data.forEach((row) => {
      if (this.selection.isSelected(row)) {
        this.totalDue += row.totalDue;
        this.selectedSalesSummaryIds.push(row.id);
      }
  });

    const payout = new Payout();
    payout.total = this.totalDue;
    payout.salesSummaryIds = this.selectedSalesSummaryIds;
    this.totalDueCompleteEvent.emit(payout);
  }


  setDataSource(data, action, total) {
    this.action = action;
    if (this.theaction !== 'add' && this.salesSummariesColumns[0] === 'select') {
      this.salesSummariesColumns.splice(0, 1);
    }
    if (total) {
      this.totalDue = total;
    }
    this.salesSummariesDatasource = new MatTableDataSource(data);
    this.salesSummariesDatasource.paginator = this.salesSummariesPaginator;
    this.salesSummariesDatasource.sort = this.salesSummariesSort;
  }


  selectSalesSummary(ss: any) {
    // console.log(ss)
    this.selectSalesSummaryEvent.emit(ss);
  }
}
