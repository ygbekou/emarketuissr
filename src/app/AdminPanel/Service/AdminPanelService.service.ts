import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import * as screenfull from 'screenfull';
import { MatDialogRef, MatDialog, MatBottomSheet, MatSnackBar } from '@angular/material';
import { DeleteListDialogComponent} from '../Widget/PopUp/DeleteListDialog/DeleteListDialog.component';
import { SeeListDialogComponent } from '../Widget/PopUp/SeeListDialog/SeeListDialog.component';
import { AddNewUserComponent } from '../Widget/PopUp/AddNewUser/AddNewUser.component';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from "@angular/fire/database";
import { TokenStorage } from './token.storage';
import { catchError } from 'rxjs/operators';
import { User } from 'firebase';
import { throwError } from 'rxjs';
import { Constants } from 'src/app/app.constants';
import { SearchAttribute, AuthToken, GenericResponse } from 'src/app/app.models';

@Injectable({
  providedIn: 'root'
})

export class AdminPanelServiceService {

	sidenavOpen 	 : boolean = true;
	sidenavMode 	 : string = "side";
	chatSideBarOpen : boolean = true;
	editProductData : any;
	products  : AngularFireObject<any>;
	headers: any;


	constructor(public http: HttpClient,
		private dialog: MatDialog,
		private db: AngularFireDatabase,
		private tokenStorage: TokenStorage) {
    this.headers = new HttpHeaders();
    if (this.tokenStorage.hasToken()) {
      this.headers = this.headers.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
    }
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');
  }

	/*
		---------- Pop Up Function ----------
	*/

	//deleteDiaglog function is used to open the Delete Dialog Component. 
	deleteDialog(data:string){
		let dialogRef : MatDialogRef<DeleteListDialogComponent>;
		dialogRef = this.dialog.open(DeleteListDialogComponent);
		dialogRef.componentInstance.data = data;
		
		return dialogRef.afterClosed();
	}

	//getProducts method is used to get the products.
   public getProducts() {
      this.products = this.db.object("products");
      return this.products;
   }

	//getTableTabContent method is used to get the transcation table data.
	getTableTabContent() {
		let tableContent : any;
		tableContent = this.db.object("transcationTable");
		return tableContent;
	}

	//getBuySellChartData method is used to get the buy and sell chart data.
	getBuySellChartContent() {
		let buySellChart : any;
		buySellChart = this.db.list("buySellChartData");
		return buySellChart;
	}

	//getInvoiceContent method is used to get the Invoice table data.
	getInvoiceContent() {
		let invoiceList : any;
		invoiceList = this.db.list("invoiceData");
		return invoiceList;
	}

	//getCollaborationContent method is used to get the Collaboration table data.
	getCollaborationContent () {
		let collaboration : any;
		collaboration = this.db.list("collaborationData");
		return collaboration;
	}

	//seeList function is used to open the see Dialog Component.
	seeList(){
		let dialogRef : MatDialogRef<SeeListDialogComponent>;
		dialogRef = this.dialog.open(SeeListDialogComponent);
	}	

	//addNewUserDialog function is used to open Add new user Dialog Component. 
	addNewUserDialog(){
		let dialogRef : MatDialogRef<AddNewUserComponent>;
		dialogRef = this.dialog.open(AddNewUserComponent);
		
		return dialogRef.afterClosed();
	}







	public getAll = (entityClass: string): Observable<any[]> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/all';
    return this.http.get<any>(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getAllByCriteria = (entityClass: string, parameters: string[], orderBy = ''): Observable<any[]> => {
    const searchAttribute = new SearchAttribute();
    searchAttribute.parameters = parameters;
    searchAttribute.orderBy = orderBy;
    const toAdd = JSON.stringify(searchAttribute);
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/allByCriteriaAndOrderBy';
    return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getAllByCriteriaWithFiles = (entityClass: string, parameters: string[], orderBy = ''): Observable<any[]> => {
    const searchAttribute = new SearchAttribute();
    searchAttribute.parameters = parameters;
    searchAttribute.orderBy = orderBy;
    const toAdd = JSON.stringify(searchAttribute);
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/allByCriteriaAndOrderByAndFiles';
    return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public save = (entity: any, entityClass: string): Observable<any> => {
    entity.modifiedBy = this.tokenStorage.getUserId;
    const toAdd = JSON.stringify(entity);
    const actionUrl = Constants.apiServer + '/service/crud/' + entityClass + '/save';
    return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }


  public saveWithUrl = (url: string, genericObject: any): Observable<any> => {

    const toAdd = JSON.stringify(genericObject);
    const actionUrl = Constants.apiServer + url;
    return this.http.post<any>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }


  public saveWithFile = (entity: any, entityClass: string, formData: FormData, method: string): Observable<any> => {
    let head = new HttpHeaders();
    if (this.tokenStorage.hasToken()) {
      head = head.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
    }
    entity.modifiedBy = this.tokenStorage.getUserId;
    const toAdd = JSON.stringify(entity);
    formData.append('dto', new Blob([toAdd],
      {
        type: 'application/json'
      }));

    const actionUrl = Constants.apiServer + '/service/crud/' + entityClass + '/' + method;
    return this.http.post<any>(actionUrl, formData, { headers: head })
      .pipe(catchError(this.handleError));
  }


  public authenticate = (user: User): Observable<AuthToken> => {
    const toAdd = JSON.stringify(user);
    const actionUrl = Constants.apiServer + '/service/token/authenticate';
    return this.http.post<AuthToken>(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public resetPassword = (user: User): Observable<any> => {
    const toAdd = JSON.stringify(user);
    const actionUrl = Constants.apiServer + '/service/user/forgot/sendPassword';
    return this.http.post(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public updateToken() {
    if (this.tokenStorage.hasToken()) {
      this.headers = this.headers.set('Authorization', 'Bearer ' + this.tokenStorage.getToken());
    }
  }

  public saveUserAndLogin = (user: User): Observable<any> => {
    const toAdd = JSON.stringify(user);
    const actionUrl = Constants.apiServer + '/service/user/forgot/saveUserAndLogin';
    return this.http.post(actionUrl, toAdd, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getOne = (id: number, entityClass: string): Observable<any> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/' + id;
    return this.http.get(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getOneWithFiles = (id: number, entityClass: string): Observable<any> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/withfiles/' + id;
    return this.http.get(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public delete = (id: number, entityClass: string): Observable<GenericResponse> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/delete/' + id;
    return this.http.get<GenericResponse>(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public getOneWithChildsAndFiles = (id: number, entityClass: string): Observable<any> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/withChildsAndFiles/' + id;
    return this.http.get(actionUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  public deleteFile = (entityClass: string, vo: any): Observable<any> => {
    const actionUrl = Constants.apiServer + '/service/' + entityClass + '/deletefile';
    return this.http.post<any>(actionUrl, vo, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
