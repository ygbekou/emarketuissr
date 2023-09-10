import {Component} from '@angular/core';
import { TranslateService} from '@ngx-translate/core';
import {
  MatTableDataSource,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material';

@Component({
	template: ``,
  providers: []
})
export class BaseComponent {

  public messages: string;
  public errors: string;
  public messageColor: string;
  public hasError: boolean;
  public lang: any;
  dataSource: any;
  paginator: any;
  sort: any;
  actionButtonLabel = 'Retry';
  setAutoHide = true;
  autoHide = 2000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor
    (
      protected translate: TranslateService
    ) {
  }

  protected processResult(result, entityObject, pictureUrl) {
    console.log('Processing Result...');
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
      this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS', 'MESSAGE.SYSTEM_ERROR',
        'MESSAGE.ALREADY_EXISTS', 'MESSAGE.PAYMENT_PROCESSING_FAILED']).subscribe(res => {
          this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
          const error = result.errors[0];

          switch (error) {
            case 'SYSTEM_ERROR':
              this.errors += res['MESSAGE.SYSTEM_ERROR'];
              break;
            case 'ALREADY_EXISTS':
              this.errors += res['MESSAGE.ALREADY_EXISTS'];
              break;
            case 'PAYMENT_PROCESSING_FAILED':
              this.errors += res['MESSAGE.PAYMENT_PROCESSING_FAILED'];
              break;
            default :
              this.errors += res['MESSAGE.SYSTEM_ERROR'];
              break;
          }
      });
    }
  }

  protected processResultWith(result, entityObject, pictureUrl) {
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
      this.translate.get(['COMMON.SAVE', 'MESSAGE.SAVE_UNSUCCESS', 'MESSAGE.SYSTEM_ERROR']).subscribe(res => {
          this.messages = res['MESSAGE.SAVE_UNSUCCESS'] + '\n' + (result.errors[0] === 'SYSTEM_ERROR'
          ?  res['MESSAGE.SYSTEM_ERROR'] : result.errors[0]);
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


  updateDatasourceData(dataSource, paginator, sort, obj) {

    const index = dataSource.data.findIndex(x => x.id === obj.id);

    if (index === -1) {
      dataSource.data.unshift(obj);
    } else {
      dataSource.data[index] = obj;
    }

    dataSource.data = dataSource.data.slice();
    dataSource = new MatTableDataSource(dataSource.data);
    dataSource.paginator = paginator;
    dataSource.sort = sort;
  }

  reinitializingDatasourceData(dataSource, paginator, sort, data) {
    dataSource.data = data;
    dataSource = new MatTableDataSource(dataSource.data);
    dataSource.paginator = paginator;
    dataSource.sort = sort;
  }

  applyDatasourceFilter(dataSource, filterValue: string) {
    dataSource.filter = filterValue.trim().toLowerCase();
    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }
}
