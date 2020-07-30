import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Attribute, AttributeDescription, AttributeGroup } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';
import { AttributeDescriptionComponent } from './AttributeDescription.component';

@Component({
   selector: 'app-attribute',
   templateUrl: './Attribute.component.html',
   styleUrls: ['./Attribute.component.scss']
})

export class AttributeComponent extends BaseComponent implements OnInit {

   messages = '';

   @ViewChild(AttributeDescriptionComponent, {static: false}) attributeDescriptionView: AttributeDescriptionComponent;

   attribute: Attribute;


   constructor(
     private activatedRoute: ActivatedRoute,
      public translate: TranslateService,
      public appService: AppService) {
        super(translate);
        this.attribute = new Attribute();
        this.attribute.attributeGroup = new AttributeGroup();
      }

   ngOnInit() {

      this.activatedRoute.params.subscribe(params => {
        if (params.id === undefined || params.id === 0) {
          this.clear();
        } else {
          this.clear();
          this.getAttributeDescriptions(params.id);
        }
      });

   }

   clear() {
     this.attribute = new Attribute();
        this.attribute.attributeGroup = new AttributeGroup();

      for (const lang of this.appService.appInfoStorage.languages) {

        const ad = new AttributeDescription();
        ad.language = lang;
        this.attribute.attributeDescriptions.push(ad);

      }
   }

   getAttributeDescriptions(attributeId: number) {
      const parameters: string[] = [];
      if (attributeId != null) {
         parameters.push('e.attribute.id = |attributeId|' + attributeId + '|Integer');
      }
      this.appService.getAllByCriteria('com.softenza.emarket.model.AttributeDescription', parameters)
         .subscribe((data: AttributeDescription[]) => {

          if (data !== null && data.length > 0) {
            console.info(data[0]);
            this.attribute = data[0].attribute;
            this.attribute.attributeDescriptions = data;
            //this.attributeDescriptionView.attribute = this.attribute;
            //this.attributeDescriptionView.refreshLangObjects();

          }
      },
        error => console.log(error),
        () => console.log('Get all Category Item complete'));
   }


  save() {
    this.messages = '';
    try {
      const attr = {...this.attribute};
      attr.attributeDescriptions = [];

      this.appService.save(attr, 'Attribute')
        .subscribe(result => {
          if (result.id > 0) {
            this.attribute.id = result.id;
            this.processResult(result, this.attribute, null);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }
}
