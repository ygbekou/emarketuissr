import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, FundType, FundTypeDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-fund-type',
  templateUrl: './FundType.component.html',
  styleUrls: ['./FundType.component.scss']
})

export class FundTypeComponent extends BaseComponent implements OnInit {

  messages = '';
  fundType: FundType;

  @Output() saveEvent = new EventEmitter<FundType>();

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
    this.fundType = new FundType();
  }

  setIngredient($event) {
    this.fundType = $event;
  }

  clear() {
    this.fundType = new FundType();
    this.fundType.fundTypeDescriptions = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const ftd = new FundTypeDescription();
      ftd.language = lang;
      ftd.name = '';
      this.fundType.fundTypeDescriptions.push(ftd);
    }
  }

  getDescriptions(fundTypeId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (fundTypeId != null) {
      parameters.push('e.fundType.id = |fundTypeId|' + fundTypeId + '|Integer');
    }
    this.appService.getAllByCriteria('FundTypeDescription', parameters)
      .subscribe((data: FundTypeDescription[]) => {

        if (data !== null && data.length > 0) {
          this.fundType = data[0].fundType;
          this.fundType.fundTypeDescriptions = data;

        }
      },
        error => console.log(error),
        () => console.log('Get all FundType Description complete'));
  }

  setToggles() {
    this.fundType.status = (this.fundType.status == null
      || this.fundType.status.toString() === 'false'
      || this.fundType.status.toString() === '0') ? 0 : 1;

    this.fundType.approverOnly = (this.fundType.approverOnly == null
      || this.fundType.approverOnly.toString() === 'false'
      || this.fundType.approverOnly.toString() === '0') ? 0 : 1;
  }

  cleanDescriptions(fundType: FundType) {
    fundType.fundTypeDescriptions.forEach(element => {
       element.fundType = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;    });
  }

  save() {
    this.messages = '';
    try {
      this.setToggles();
      const thisFundType = {...this.fundType};
      this.cleanDescriptions(thisFundType);

      this.appService.save(thisFundType, 'FundType')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.fundType, null);
            this.fundType = {...result};
            this.saveEvent.emit(this.fundType);
            this.clear();
          }
        });

    } catch (e) {
      console.log(e);
    }
  }


}
