import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  template: ``,
  providers: []
})
export class BaseComponent {

  public messages: string;
  public messageColor: string;
  public hasError: boolean;

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
    if (result.result === 'SUCCESS') {
      this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_SUCCESS']).subscribe(res => {
        this.messages = res['MESSAGE.DELETE_SUCCESS'];
      });
    } else {
      this.translate.get(['COMMON.DELETE', 'MESSAGE.DELETE_UNSUCCESS', 'MESSAGE.' + result.errors[0]]).subscribe(res => {
        messages = res['MESSAGE.DELETE_UNSUCCESS'] + ': ' + res['MESSAGE.' + result.errors[0]];
      });
    }
  }

}
