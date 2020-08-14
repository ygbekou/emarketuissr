import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Attribute, AttributeDescription, AttributeGroup, Language } from 'src/app/app.models';
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

  @Input() attributeGroup: AttributeGroup;
  @Input() attributeGroupId: number;
  @Output() attributeSaveEvent = new EventEmitter<Attribute>();


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
        this.attribute.attributeGroup.id = this.attributeGroup.id;

      for (const lang of this.appService.appInfoStorage.languages) {

        const ad = new AttributeDescription();
        ad.language = lang;
        this.attribute.attributeDescriptions.push(ad);

      }

      this.attributeGroup.attributeGroupDescriptions.forEach(element => {
        if (element.language.id === this.appService.appInfoStorage.language.id) {
          this.attributeGroup.attributeGroupName = element.name;
        }
      });
   }

   getAttributeDescriptions(attributeId: number) {
      const parameters: string[] = [];
      if (attributeId != null) {
         parameters.push('e.attribute.id = |attributeId|' + attributeId + '|Integer');
      }
      this.appService.getAllByCriteria('com.softenza.emarket.model.AttributeDescription', parameters)
         .subscribe((data: AttributeDescription[]) => {

          if (data !== null && data.length > 0) {
            this.attribute = data[0].attribute;
            this.attribute.attributeDescriptions = data;
          }
      },
        error => console.log(error),
        () => console.log('Get all Category Item complete'));
   }


  cleanAttributeDescriptions(attribute: Attribute) {
    attribute.attributeDescriptions.forEach(element => {
       element.attribute = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;    });
  }

  save() {
    this.messages = '';
    try {
      const attr = {...this.attribute};
      this.cleanAttributeDescriptions(attr);

      this.appService.save(attr, 'Attribute')
        .subscribe(result => {
          if (result.id > 0) {
            this.attribute.id = result.id;
            this.processResult(result, this.attribute, null);
            this.attributeSaveEvent.emit(this.attribute);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }
}
