import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Shipper} from 'src/app/app.models';
import { AppService } from './../../../../../src/app/Services/app.service';

@Component({
  selector: 'app-shipper-serch',
  templateUrl: './ShipperSearch.component.html',
  styleUrls: ['./DeliveriesSummaries.component.scss']
})
export class ShipperSearchComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'phone', 'status', 'deliveryCount', 'rating', 'actions'];
  dataSource: MatTableDataSource<Shipper>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() searchCriteria: any;
  @Output() selectEvent = new EventEmitter<Number>();

  shipperName: string;
  shipperLastName: string;
  shipperFirstName: string;

  popupResponse: any;
  qty = 1;
  error = '';

  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<ShipperSearchComponent>,
    public appService: AppService) {

  }

  ngOnInit() {
  }

  public shouldClose() {
    let errorFound = false;
    this.error = '';
    //this.searchCriteria.shouldSave = true;
    if (!errorFound) {
      this.dialogRef.close(this.searchCriteria);
    }
  }

  search() {
    const parameters: string[] = [];
    parameters.push('e.status = |shipperStatus|1|Integer');
    if (this.shipperName) {
      parameters.push('e.name like |shipperName|' + '%' + this.shipperName + '%' + '|String');
    }
    if (this.shipperLastName) {
      parameters.push('e.user.lastName like |shipperLastName|' + '%' + this.shipperLastName + '%' + '|String');
    }
    if (this.shipperFirstName) {
      parameters.push('e.user.firstName like |shipperFirstName|' + '%' + this.shipperFirstName + '%' + '|String');
    }

    this.appService.getAllByCriteria('com.softenza.emarket.model.Shipper', parameters)
      .subscribe((data: Shipper[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Shipper complete'));
  }


  select(shipper: Shipper) {
    this.searchCriteria.shipperId = shipper.id;
    this.searchCriteria.shipperName = shipper.name;
    this.searchCriteria.shipperLastName = shipper.user.lastName;
    this.searchCriteria.shipperFirstName = shipper.user.firstName;
  }

  clearDatasource() {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
