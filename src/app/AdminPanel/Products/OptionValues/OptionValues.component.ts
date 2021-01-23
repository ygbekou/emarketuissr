import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Options, OptionValue, OptionValueDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { MatTableDataSource } from '@angular/material';
import { OptionValueComponent } from '../OptionValue/OptionValue.component';

@Component({
   selector: 'app-option-values',
   templateUrl: './OptionValues.component.html',
   styleUrls: ['./OptionValues.component.scss']
})

export class OptionValuesComponent extends BaseComponent implements OnInit {

   @Input() option: Options;
   @Input() optionId: number;

   @ViewChild(OptionValueComponent, { static: false }) optionValueView: OptionValueComponent;

   displayedColumns: string[] = ['id', 'image', 'name'];
   dataSource: MatTableDataSource<OptionValueDescription>;
   messages: string;
   optionValues: OptionValue[];

   constructor(public appService: AppService,
      public translate: TranslateService) {
      super(translate);
   }

   ngOnInit() {
      this.getOptionValues();
   }

   getOptionValues() {
      const parameters: string[] = [];
      parameters.push('e.language.id = |languageId|' + this.appService.appInfoStorage.language.id + '|Integer');
      parameters.push('e.option.id = |optionId|' + this.optionId + '|Integer');

      this.appService.getAllByCriteria('OptionValueDescription', parameters)
         .subscribe((data: OptionValueDescription[]) => {

            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

         },
            error => console.log(error),
            () => console.log('Get OptionValueDescription Items for Option complete'));
   }


   public deleteOptionValue(optionValue: OptionValue, index: number) {

      if (optionValue.id === undefined || optionValue.id === null) {
         this.optionValues.splice(index, 1);
         return;
      }

      this.appService.delete(optionValue.id, 'OptionValue')
         .subscribe(data => {
            this.removeItem(this.optionValues, optionValue.id);
            this.processDeleteResult(data, this.messages);

         });
   }

   public applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }

   onOptionValueSave($event) {
      const optionValue = $event;
      console.log(optionValue);
      optionValue.optionValueDescriptions.forEach(element => {
         if (element.language.id === this.appService.appInfoStorage.language.id) {

            optionValue.optionValueDescriptions[0].optionValue = optionValue;
            const index: number = this.dataSource.data.findIndex((x) => x.optionValue.id === optionValue.id);
            console.log(index);
            console.log(this.dataSource.data);
            if (index !== -1) {
               this.dataSource.data[index] = optionValue.optionValueDescriptions[0];
            } else {
               this.dataSource.data.push(optionValue.optionValueDescriptions[0]);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
         }
      });
   }

}
