import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Shipper } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';

@Component({
  selector: 'app-shipper',
  templateUrl: './Shippers.component.html',
  styleUrls: ['./Shippers.component.scss']
})
export class ShippersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'phone', 'status', 'deliveryCount', 'rating', 'sortOrder'];
  dataSource: MatTableDataSource<Shipper>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  shipper: Shipper = new Shipper();
  messages = '';
  errors = '';
  selectedTab = 0;

  @Input()
  shipperName: string;
  @Input()
  shipperLastName: string;
  @Input()
  shipperFirstName: string;



  constructor(public appService: AppService,
    private translate: TranslateService) {

    }

  ngOnInit() {
    this.getAll();
  }
  
  getAll() {
    const parameters: string[] = [];
    if (this.shipperName) {
      parameters.push('e.name = |shipperName|' + this.shipperName + '|String');
    }
    if (this.shipperLastName) {
      parameters.push('e.user.lastName = |shipperLastName|' + this.shipperLastName + '|String');
    }
    if (this.shipperFirstName) {
      parameters.push('e.user.firstName = |shipperFirstName|' + this.shipperFirstName + '|String');
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

  public remove(shipper: Shipper) {
    this.messages = '';
    this.errors = '';
    this.appService.delete(shipper.id, 'com.softenza.emarket.model.Shipper')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(shipper);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Shipper>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
          });
        } else {
          this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
            this.errors = res['MESSAGE.ERROR_OCCURRED'];
          });
        }
      });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clear() {
    this.shipper = new Shipper();
    this.dataSource = new MatTableDataSource();
  }

  addSectionItem() {
    this.selectedTab = 1;
    this.shipper = new Shipper();
  }
  edit(si: Shipper) {
    this.shipper = si;
    this.selectedTab = 1;
  }
  save() {
    this.messages = '';
    this.errors = '';
    try {
      this.messages = '';
      console.log(this.shipper);
      const index: number = this.dataSource.data.indexOf(this.shipper);
      this.shipper.status = (this.shipper.status == null || this.shipper.status.toString() === 'false') ? 0 : 1;
      this.appService.save(this.shipper, 'Shipper')
        .subscribe(result => {
          if (result.id > 0) {
            this.shipper = new Shipper();
            this.selectedTab = 0;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<Shipper>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.selectedTab = 1;
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

}
