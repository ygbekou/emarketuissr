import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Options, OptionDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
	selector: 'app-option-description',
	templateUrl: './OptionDescription.component.html',
	styleUrls: ['./OptionDescription.component.scss']
})

export class OptionDescriptionComponent extends BaseComponent implements OnInit {

   messages = '';
   @Input() option: Options;
   optionDescription: OptionDescription;
   selectedTab = 0;
   selectedMainTabIndex = 0;

   constructor(protected translate: TranslateService,
      public appService: AppService) {
         super(translate);
      }

	ngOnInit() {
      this.refreshLangObjects();
   }

   refreshLangObjects() {
      let first = true;
      this.appService.appInfoStorage.languages.forEach(language => {
         let found = false;
         this.option.optionDescriptions.forEach(aOptionDesc => {
         if (aOptionDesc.language.code === language.code) {
            found = true;
            if (first) {
               this.optionDescription = aOptionDesc;
               first = false;
            }
         }
         });
    });
  }


   onLangChanged(event) {
      this.messages = '';
      this.option.optionDescriptions.forEach(aOptionDesc => {
      if (aOptionDesc.language.name === event.tab.textLabel) {
        this.optionDescription = aOptionDesc;
        return;
      }
    });
   }

   save() {
    this.messages = '';
    try {
      const opt = new Options();
      opt.id = this.option.id;
      this.optionDescription.option = opt;
      this.appService.save(this.optionDescription, 'OptionDescription')
         .subscribe(result => {
            if (result.id > 0) {
               this.optionDescription = result;
               this.option.id = result.option.id;
            }
            this.processResult(result, this.optionDescription, null);
        });

      } catch (e) {
         console.log(e);
      }
   }
}
