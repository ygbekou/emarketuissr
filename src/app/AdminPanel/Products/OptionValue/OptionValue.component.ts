import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Options, OptionDescription, OptionValue, OptionValueDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';

@Component({
   selector: 'app-option-value',
   templateUrl: './OptionValue.component.html',
   styleUrls: ['./OptionValue.component.scss']
})

export class OptionValueComponent extends BaseComponent implements OnInit {

   messages = '';
   @Input() optionValue: OptionValue;
   optionValueDescription: OptionValueDescription;
   @Input() option: Options;
   @Input() optionId: number;

   formData: FormData;

   selectedTab = 0;
   selectedMainTabIndex = 0;

   constructor(
     private activatedRoute: ActivatedRoute,
      public translate: TranslateService,
      public appService: AppService) {
        super(translate);
        this.optionValue = new OptionValue();
        this.optionValueDescription = new OptionValueDescription();
      }

   ngOnInit() {

      this.activatedRoute.params.subscribe(params => {
        if (params.id === undefined || params.id === 0) {
          this.clear();
        } else {
          this.clear();
          this.getOptionValueDescriptions(params.id);
        }
      });

   }

   clear() {
      this.optionValueDescription = new OptionValueDescription();
      this.optionValue = new OptionValue();
      for (const lang of this.appService.appInfoStorage.languages) {

        const od = new OptionValueDescription();
        od.language = lang;
        od.option = new Options();
        od.option.id = this.optionId;
        this.optionValue.optionValueDescriptions.push(od);

      }
   }

   

   getOptionValueDescriptions(optionValueId: number) {
      const parameters: string[] = [];
      if (optionValueId != null) {
         parameters.push('e.optionValue.id = |optionValueId|' + optionValueId + '|Integer');
      }
      this.appService.getAllByCriteria('OptionValueDescription', parameters)
         .subscribe((data: OptionValueDescription[]) => {

          if (data !== null && data.length > 0) {
            this.optionValue = data[0].optionValue;
            this.optionValue.optionValueDescriptions = data;
            this.setOptionValueDescription();
            if (this.optionValue.image !== undefined && this.optionValue.image !== null) {
                this.optionValue.imageFiles = [];
                this.optionValue.imageFiles.push(
                  {
                      link: 'assets/images/optionvalues/' + this.optionValue.id + '/' + this.optionValue.image,
                      preview: 'assets/images/optionvalues/' + this.optionValue.id + '/' + this.optionValue.image
                  }
                );
            }
          }
      },
        error => console.log(error),
        () => console.log('Get all Option value Desc complete'));
   }


  save() {
    this.messages = '';
    const opt = {...this.optionValue};
    opt.optionValueDescriptions = [];
    opt.option = new Options();
    opt.option.id = this.optionId;


    this.formData = new FormData();

    for (let i = 0; i < this.optionValue.imageFiles.length; i++) {
        if (this.optionValue.imageFiles[i].file) {
          this.formData.append('file[]', this.optionValue.imageFiles[i].file, 'main_picture.' + this.optionValue.imageFiles[i].file.name);
        }
    }

    if (this.optionValue.imageFiles.length > 0) {
      console.log(opt);

      this.appService.saveWithFile(opt, 'OptionValue', this.formData, 'saveWithFile')
        .subscribe(result => {
        if (result.id > 0) {
          this.optionValue.id = result.id;
          this.processResult(result, this.optionValue, null);
        }
      });
    } else {
        this.appService.save(opt, 'OptionValue')
          .subscribe(result => {
            if (result.id > 0) {
              this.optionValue.id = result.id;
              this.processResult(result, this.optionValue, null);
            }
          });
    }
  }


  saveOptionValueDescription() {
    this.messages = '';
    try {
      const optValue = new OptionValue();
      optValue.id = this.optionValue.id;
      this.optionValueDescription.optionValue = optValue;
      this.appService.save(this.optionValueDescription, 'OptionValueDescription')
         .subscribe(result => {
            if (result.id > 0) {
               this.optionValueDescription = result;
               this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.SAVE_SUCCESS'];
               });
            } else {
               this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                  this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
               });
            }
        });

      } catch (e) {
         console.log(e);
      }
   }

  onLangChanged(event) {
      this.messages = '';
      this.optionValue.optionValueDescriptions.forEach(aOptionValueDesc => {
      if (aOptionValueDesc.language.name === event.tab.textLabel) {
        this.optionValueDescription = aOptionValueDesc;
        return;
      }
    });
   }


   setOptionValueDescription() {
      this.optionValue.optionValueDescriptions.forEach(aOptionValueDesc => {
      if (aOptionValueDesc.language.id === this.appService.appInfoStorage.languages[0].id) {
        this.optionValueDescription = aOptionValueDesc;
        return;
      }
    });
   }
}
