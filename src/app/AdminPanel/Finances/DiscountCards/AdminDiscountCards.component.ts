import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../baseComponent';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { Store, User, DiscountCardDTO, DiscountCardSearchCriteria } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { AdminDiscountCardComponent } from './AdminDiscountCard.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-admin-discountcards',
  templateUrl: './AdminDiscountCards.component.html',
  styleUrls: ['./AdminDiscountCards.component.scss']
})
export class AdminDiscountCardsComponent extends BaseComponent implements OnInit {
  dcColumns: string[] = ['userName', 'currency', 'store', 'availablePoints', 'pointsValue', 'actions'];
  dcDatasource: MatTableDataSource<DiscountCardDTO>;
  @ViewChild('MatPaginatorDiscountCards', { static: true }) dcPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) dcSort: MatSort;

  @ViewChild(AdminDiscountCardComponent, { static: false }) discountCardComponent: AdminDiscountCardComponent;
  expandedElement: SearchResponse | null;
  messages = '';
  button = 'filter';

  @Input()
  userId: number;
  @Input() isAdminPage = false;

  searchCriteria: DiscountCardSearchCriteria = new DiscountCardSearchCriteria();
  stores: Store[] = [];
  users: User[] = [];
  colors = ['primary', 'secondary'];

  allStore = new Store();
  selected = new FormControl(0);

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.clear();
    this.isAdminPage = !this.userId
  }

  ngAfterViewInit() {
    this.searchCriteria.storeId = 0;
    this.searchCriteria.endDate = new Date();
    const beginDate = new Date();
    beginDate.setFullYear(this.searchCriteria.endDate.getFullYear() - 1);
    this.searchCriteria.beginDate = beginDate;
    if (this.isAdminPage) {
      //this.searchCriteria.status = 1;
    }
    this.search();
  }

  private clear() {
    this.searchCriteria = new DiscountCardSearchCriteria();
  }

  changeOrderType(event) {
  }

  search() {
    if (this.button.endsWith('clear')) {
      this.clear();
    } else {
      this.appService.saveWithUrl('/service/finance/discountCards', this.searchCriteria)
        .subscribe((data: any[]) => {
          this.dcDatasource = new MatTableDataSource(data);
          this.dcDatasource.paginator = this.dcPaginator;
          this.dcDatasource.sort = this.dcSort;
        },
          error => console.log(error),
          () => console.log('Get all discount card complete'));

    }
  }

  public applyFilter(filterValue: string) {
    this.dcDatasource.filter = filterValue.trim().toLowerCase();
    if (this.dcDatasource.paginator) {
      this.dcDatasource.paginator.firstPage();
    }

  }

  getDiscountCardDetails(discountCard: DiscountCardDTO) {
    this.discountCardComponent.discountCard = discountCard;
    this.discountCardComponent.getDiscountCardTransList(discountCard.id);
    this.selected.setValue(1);
  }


  public getShipperSearchPopupResponse(response: any, value: any) {
    if (response) {
      console.log('Value returned from comment popup... ');
      console.log(value);
      this.searchCriteria = value;
    }
  }

  openSearchPopup() {
    this.appService.userSearch(this.searchCriteria).
      subscribe(res => {

        console.log(res);
      },
        err => console.log(err),
        () => console.log('User search done... ')
      );

  }

}
