import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, Menu, MenuDescription, ProductMenu, TransactionType, TransactionTypeDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './TransactionType.component.html',
  styleUrls: ['./TransactionType.component.scss']
})

export class TransactionTypeComponent extends BaseComponent implements OnInit {

  messages = '';
  transactionType: TransactionType;

  @Output() saveEvent = new EventEmitter<TransactionType>();

  constructor(
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public appService: AppService) {
    super(translate);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getDescriptions(params.id);
      }
    });

  }

  clearMessages($event) {
    this.messages = '';
  }

  setIngredient($event) {
    this.transactionType = $event;
  }

  clear() {
    this.transactionType = new TransactionType();
    this.transactionType.transactionTypeDescriptions = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const ttd = new TransactionTypeDescription();
      ttd.language = lang;
      ttd.name = '';
      this.transactionType.transactionTypeDescriptions.push(ttd);
    }
  }

  getDescriptions(transactionTypeId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (transactionTypeId != null) {
      parameters.push('e.transactionType.id = |transactionTypeId|' + transactionTypeId + '|Integer');
    }
    this.appService.getAllByCriteria('TransactionTypeDescription', parameters)
      .subscribe((data: TransactionTypeDescription[]) => {

        if (data !== null && data.length > 0) {
          this.transactionType = data[0].transactionType;
          this.transactionType.transactionTypeDescriptions = data;

        }
      },
        error => console.log(error),
        () => console.log('Get all TransactionType Description complete'));
  }

  setToggles() {
    this.transactionType.status = (this.transactionType.status == null
      || this.transactionType.status.toString() === 'false'
      || this.transactionType.status.toString() === '0') ? 0 : 1;
  }

  cleanDescriptions(transactionType: TransactionType) {
    transactionType.transactionTypeDescriptions.forEach(element => {
       element.transactionType = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;    });
  }

  save() {
    this.messages = '';
    try {
      this.setToggles();
      const thisTransactionType = {...this.transactionType};
      this.cleanDescriptions(thisTransactionType);

      this.appService.save(thisTransactionType, 'TransactionType')
        .subscribe(result => {
          if (result.id > 0) {
            this.transactionType.id = result.id;
            this.processResult(result, this.transactionType, null);
            this.saveEvent.emit(this.transactionType);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }


}
