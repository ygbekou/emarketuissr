import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { User} from 'src/app/app.models';

@Component({
  selector: 'app-user-serch',
  templateUrl: './UserSearch.component.html',
  styleUrls: ['./AdminWallets.component.scss']
})
export class UserSearchComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'phone', 'status', 'actions'];
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() searchCriteria: any;
  @Output() selectEvent = new EventEmitter<Number>();

  userName: string;
  userLastName: string;
  userFirstName: string;

  popupResponse: any;
  qty = 1;
  error = '';

  constructor(public appService: AppService,
    public translate: TranslateService,
    public dialogRef: MatDialogRef<UserSearchComponent>) {

  }

  ngOnInit() {
  }

  public shouldClose() {
    let errorFound = false;
    this.error = '';
    if (!errorFound) {
      this.dialogRef.close(this.searchCriteria);
    }
  }

  search() {
    const parameters: string[] = [];
    parameters.push('e.status = |userStatus|0|Integer');
    if (this.userName) {
      parameters.push('e.userName like |userName|' + '%' + this.userName + '%' + '|String');
    }
    if (this.userLastName) {
      parameters.push('e.lastName like |userLastName|' + '%' + this.userLastName + '%' + '|String');
    }
    if (this.userFirstName) {
      parameters.push('e.firstName like |userFirstName|' + '%' + this.userFirstName + '%' + '|String');
    }

    this.appService.getAllByCriteria('com.softenza.emarket.model.User', parameters)
      .subscribe((data: User[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all User complete'));
  }


  select(user: User) {
    this.searchCriteria.userId = user.id;
    this.searchCriteria.userName = user.userName;
    this.searchCriteria.lastName = user.lastName;
    this.searchCriteria.firstName = user.firstName;
    this.dialogRef.close(this.searchCriteria);
  }

  clearDatasource() {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
