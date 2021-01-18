import {Component} from '@angular/core';
import { TranslateService} from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material';
import { Pagination, ProductListVO } from '../app.models';
@Component({
	template: ``,
  providers: []
})
export class BaseComponent {

  public messages: string;
  public messageColor: string;
  public hasError: boolean;
  public lang: any;
  dataSource: any;
  paginator: any;
  sort: any;


  constructor
    (
      protected translate: TranslateService
    ) {

  }

  protected processResult(result, entityObject, pictureUrl) {
    if (result.errors === null || result.errors.length === 0) {
      this.hasError = false;
      entityObject = result;
      this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_SUCCESS']).subscribe(res => {
          this.messages = res['MESSAGE.SAVE_SUCCESS'];
      });
      
      if (entityObject.user && entityObject.user.birthDate != null) {
          entityObject.user.birthDate = new Date(entityObject.user.birthDate);
      }
      if (pictureUrl) {
          pictureUrl = '';
      }
    } else {
      this.hasError = true;
      this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS']).subscribe(res => {
          this.messages = res['MESSAGE.SAVE_UNSUCCESS'] + '<br/>' + result.errors[0];
      });
    }
  }

  removeItem(listItems: any[], id: number) {
    const index = listItems.findIndex(x => x.id === id);
    listItems.splice(index, 1);
  }

  removeElement(listItems: any[], name: string) {
    const index = listItems.findIndex(x => x === name);
    listItems.splice(index, 1);
  }

  protected processDeleteResult(result, messages) {
    if (result.errors === undefined || result.errors === null || result.errors.length > 0) {
        this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_SUCCESS']).subscribe(res => {
            this.messages = res['MESSAGE.DELETE_SUCCESS'];
        });
    } else {
        this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_UNSUCCESS', 'MESSAGE.' + result.errors[0]]).subscribe(res => {
            messages = res['MESSAGE.DELETE_UNSUCCESS'] + ': ' + res['MESSAGE.' + result.errors[0]];
        });
    }
  }


  protected processDataSourceDeleteResult(resp, messages, object, dataSource) {


    if (resp.result === 'SUCCESS') {
      const index: number = dataSource.data.indexOf(object);
      if (index !== -1) {
        this.resetDatasource(dataSource, index);
      }
    } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
      this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
        this.messages = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
      });
    } else {
      this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
        this.messages = res['MESSAGE.ERROR_OCCURRED'];
      });
    }

    return dataSource;
  }

  public isBlank(value: any) {
    return value === undefined || value === null || value === '';
  }

  public resetDatasource(dataSource, index: number) {
    if (index !== undefined) {
      dataSource.data.splice(index, 1);
    }
    dataSource = new MatTableDataSource <any>(dataSource.data);
    dataSource.paginator = this.paginator;
    dataSource.sort = this.sort;

    return dataSource;
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? (o1.id === o2.id) : false;
  }

}
