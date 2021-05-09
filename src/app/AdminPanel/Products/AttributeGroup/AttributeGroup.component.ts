import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AttributeGroup, AttributeGroupDescription, Language } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';
import { AttributeGroupDescriptionComponent } from './AttributeGroupDescription.component';

@Component({
   selector: 'app-attributegroup',
   templateUrl: './AttributeGroup.component.html',
   styleUrls: ['./AttributeGroup.component.scss']
})

export class AttributeGroupComponent extends BaseComponent implements OnInit {

   messages = '';

   @ViewChild(AttributeGroupDescriptionComponent, {static: false}) attributeGroupDescriptionView: AttributeGroupDescriptionComponent;

   attributeGroup: AttributeGroup;


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
          this.getAttributeGroupDescriptions(params.id);
        }
      });

   }

   clear() {
     this.attributeGroup = new AttributeGroup();

      for (const lang of this.appService.appInfoStorage.languages) {

        const agd = new AttributeGroupDescription();
        agd.language = lang;
        this.attributeGroup.attributeGroupDescriptions.push(agd);

      }
   }

   getAttributeGroupDescriptions(attributeGroupId: number) {
      const parameters: string[] = [];
      if (attributeGroupId != null) {
         parameters.push('e.attributeGroup.id = |attributeGroupId|' + attributeGroupId + '|Integer');
      }
      this.appService.getAllByCriteria('com.softenza.emarket.model.AttributeGroupDescription', parameters)
         .subscribe((data: AttributeGroupDescription[]) => {
           
          if (data !== null && data.length > 0) {
            this.attributeGroup = data[0].attributeGroup;
            this.attributeGroup.attributeGroupDescriptions = data;
            this.attributeGroupDescriptionView.attributeGroup = this.attributeGroup;
            this.attributeGroupDescriptionView.refreshLangObjects();
            
          }
      },
        error => console.log(error),
        () => console.log('Get all Category Item complete'));
   }


  cleanAttributeGroupDescriptions(attributeGroup: AttributeGroup) {
    attributeGroup.attributeGroupDescriptions.forEach(element => {
      element.attributeGroup = undefined;
      element.parentEntities = [];
      const language = element.language;
      element.language = new Language();
      element.language.id = language.id;
    });
  }

  save() {
    this.messages = '';
    try {
      const ag = {...this.attributeGroup};
      this.cleanAttributeGroupDescriptions(ag);

      this.appService.save(ag, 'AttributeGroup')
        .subscribe(result => {
          if (result.id > 0) {
            this.attributeGroup.id = result.id;
            this.processResult(result, this.attributeGroup, null);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }
}
