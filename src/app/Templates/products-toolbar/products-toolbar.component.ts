import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { MatTableDataSource } from '@angular/material';
import { ProductDescription } from 'src/app/app.models';

@Component({
  selector: 'app-products-toolbar',
  templateUrl: './Products-toolbar.component.html',
  styleUrls: ['./Products-toolbar.component.scss']
})
export class ProductsToolbarComponent implements OnInit {
  @Input() isHomePage: boolean = false;
  @Input() showSidenavToggle: boolean = false;
  @Input() color: string;
  @Input() dataSource: MatTableDataSource<ProductDescription>;
  @Output() onSidenavToggle: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeCount: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeSorting: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeViewType: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchClick: EventEmitter<any> = new EventEmitter<any>();

  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [12, 24, 36, 48, 96];
  public count: any;
  public sortings = [
    { code: 'nameasc', name: 'Nom ascendant' },
    { code: 'namedesc', name: 'Nom descendant' },
    { code: 'priceasc', name: 'Prix ascendant' },
    { code: 'pricedesc', name: 'Prix descendant' },
    { code: 'rating', name: 'Rating' }];
  public sort: any;
  public searchForm: FormGroup;
  constructor(public appService: AppService,
    public translate: TranslateService) { }

  ngOnInit() {

    this.count = (this.isHomePage) ? this.counts[0] : this.counts[1];
    this.sort = this.sortings[0];
    if (this.appService.appInfoStorage.language.code === 'en') {
      this.sortings = [
        { code: 'nameasc', name: 'Name ascending' },
        { code: 'namedesc', name: 'Name descending' },
        { code: 'priceasc', name: 'Price ascending' },
        { code: 'pricedesc', name: 'Price descending' },
        { code: 'rating', name: 'Rating' }];
    }
  }

  public changeCount(count) {
    this.count = count;
    this.onChangeCount.emit(count);
  }

  public changeSorting(sort) {
    this.sort = sort;
    this.onChangeSorting.emit(sort.code);
  }

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
    this.onChangeViewType.emit({ viewType: viewType, viewCol: viewCol });
  }

  public sidenavToggle() {
    this.onSidenavToggle.emit();
  }

  public search(values: Object): void {
    this.onSearchClick.emit(values);
  }


}
