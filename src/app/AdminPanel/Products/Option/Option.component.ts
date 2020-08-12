import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Options, OptionDescription, Language } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';
import { OptionDescriptionComponent } from './OptionDescription.component';

@Component({
   selector: 'app-option', 
   templateUrl: './Option.component.html',
   styleUrls: ['./Option.component.scss']
})

export class OptionComponent extends BaseComponent implements OnInit {

   messages = '';

   @ViewChild(OptionDescriptionComponent, {static: false}) optionDescriptionView: OptionDescriptionComponent;

   option: Options;
   optionId: number;

   constructor(
     private activatedRoute: ActivatedRoute,
      public translate: TranslateService,
      public appService: AppService) {
        super(translate);
        this.option = new Options();
      }

   ngOnInit() {

      this.activatedRoute.params.subscribe(params => {
        if (params.id === undefined || params.id === 0) {
          this.clear();
        } else {
          this.clear();
          this.optionId = params.id;
          this.getOptionDescriptions(params.id);
        }
      });

   }

   clear() {
      this.option = new Options();
        
      for (const lang of this.appService.appInfoStorage.languages) {

        const od = new OptionDescription();
        od.language = lang;
        this.option.optionDescriptions.push(od);

      }
   }

   getOptionDescriptions(optionId: number) {
      const parameters: string[] = [];
      if (optionId != null) {
         parameters.push('e.option.id = |optionId|' + optionId + '|Integer');
      }
      this.appService.getAllByCriteria('OptionDescription', parameters)
         .subscribe((data: OptionDescription[]) => {

          if (data !== null && data.length > 0) {
            console.info(data);
            this.option = data[0].option;
            this.option.optionDescriptions = data;
          }
      },
        error => console.log(error),
        () => console.log('Get all Option Desc complete'));
   }

   cleanOptionDescriptions(option: Options) {
     option.optionDescriptions.forEach(element => {
       element.option = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;
     })
   }

  save() {
    this.messages = '';
    try {
      const opt = {...this.option};
      this.cleanOptionDescriptions(opt);
      //opt.optionDescriptions = [];

      this.appService.save(opt, 'Option')
        .subscribe(result => {
          if (result.id > 0) {
            this.option.id = result.id;
            this.processResult(result, this.option, null);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }
}
