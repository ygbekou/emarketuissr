import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OrderStatus, StoreSearchCriteria, Store, Payout, PayoutSearchCriteria, PayoutVO, Supplier } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { SupplierComponent } from './Supplier.component';

export interface SearchResponse {
  document: string;
  timestamp: number;
}


@Component({
  selector: 'app-suppliers',
  templateUrl: './Suppliers.component.html',
  styleUrls: ['./Suppliers.component.scss']
})
export class SuppliersComponent extends BaseComponent implements OnInit {
  supplierColumns: string[] = ['id', 'name', 'contact', 'phone', 'email', 'address'];
  supplierDatasource: MatTableDataSource<Supplier>;
  @ViewChild('MatPaginatorSupplier', { static: true }) supplierPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) supplierSort: MatSort;

  @ViewChild(SupplierComponent, { static: false }) supplierComponent: SupplierComponent;
  expandedElement: SearchResponse | null;
  messages = '';
  button = 'filter';

  searchCriteria: PayoutSearchCriteria = new PayoutSearchCriteria();
  @Input() userId: number;
  @Input() isAdminPage = true;
  @Input() canAcknowledge = false;

  selected = new FormControl(0);

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || +params.id === 0) {
        setTimeout(() => {
          this.selected.setValue(0);
        }, 500);
      } else {
        setTimeout(() => {
          this.selectSupplier(params.id);
        }, 500);
      }
    });

    this.activatedRoute.data.subscribe(value => {
      this.isAdminPage = (value && value.expectedRole && value.expectedRole[0] === 'Administrator')
        && (this.location.path().startsWith('/admin/'));
    });

    this.getSuppliers();
  }

  getSuppliers() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('Supplier', parameters)
      .subscribe((data: Supplier[]) => {
        console.log(data);
        this.clear(data);

      },
        error => console.log(error),
        () => console.log('Get All Supplier complete'));
  }


  private clear(data) {
    this.supplierDatasource = new MatTableDataSource(data);
    this.supplierDatasource.paginator = this.supplierPaginator;
    this.supplierDatasource.sort = this.supplierSort;
  }

  selectSupplier(supplierId: number) {
    // this.payoutComponent.isAdminPage = this.isAdminPage;
    this.supplierComponent.getSupplier(supplierId);
    this.selected.setValue(1);
  }


  public applyFilter(filterValue: string) {
    this.supplierDatasource.filter = filterValue.trim().toLowerCase();
  }

  updateDataTable(supplier: Supplier) {
    this.updateDatasourceData(this.supplierDatasource, this.supplierPaginator, this.supplierSort, supplier);
    // this.supplierComponent.getSupplier(supplier.id);
  }

}
