import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Attribute, AttributeDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
	selector: 'app-attribute-description',
	templateUrl: './AttributeDescription.component.html',
	styleUrls: ['./AttributeDescription.component.scss']
})

export class AttributeDescriptionComponent extends BaseComponent implements OnInit {

   messages = '';
 
   @Input() attribute: Attribute;

   attributeDescription: AttributeDescription;
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
         this.attribute.attributeDescriptions.forEach(aAttributeDesc => {
         if (aAttributeDesc.language.code === language.code) {
            found = true;
            if (first) {
               this.attributeDescription = aAttributeDesc;
               first = false;
            }
         }
         });
    });
  }


   onLangChanged(event) {
      this.messages = '';
      this.attribute.attributeDescriptions.forEach(aAttributeDesc => {
      if (aAttributeDesc.language.name === event.tab.textLabel) {
        this.attributeDescription = aAttributeDesc;
        return;
      }
    });
   }

   save() {
    this.messages = '';
    try {
      const att = new Attribute();
      att.id = this.attribute.id;
      this.attributeDescription.attribute = att;
      this.appService.save(this.attributeDescription, 'AttributeDescription')
         .subscribe(result => {
            if (result.id > 0) {
               this.attributeDescription = result;
               this.attribute.id = result.attribute.id;
            }
            this.processResult(result, this.attributeDescription, null);
        });

      } catch (e) {
         console.log(e);
      }
   }
}
