import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AttributeGroup, AttributeGroupDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';

@Component({
	selector: 'app-attributegroup-description',
	templateUrl: './AttributeGroupDescription.component.html',
	styleUrls: ['./AttributeGroupDescription.component.scss']
})

export class AttributeGroupDescriptionComponent extends BaseComponent implements OnInit {

   messages = '';

   @Input() attributeGroup: AttributeGroup;

   attributeGroupDescription: AttributeGroupDescription;
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
         this.attributeGroup.attributeGroupDescriptions.forEach(aAttributeGroupDesc => {
         if (aAttributeGroupDesc.language.code === language.code) {
            found = true;
            if (first) {
               this.attributeGroupDescription = aAttributeGroupDesc;
               first = false;
            }
         }
         });
    });
  }


   onLangChanged(event) {
      this.messages = '';
      console.info(this.attributeGroup.attributeGroupDescriptions);
      this.attributeGroup.attributeGroupDescriptions.forEach(aAttributeGroupDesc => {
      if (aAttributeGroupDesc.language.name === event.tab.textLabel) {
        this.attributeGroupDescription = aAttributeGroupDesc;
        return;
      }
    });
   }

   save() {
    this.messages = '';
    try {
      const attGrp = new AttributeGroup();
      attGrp.id = this.attributeGroup.id;
      alert(this.attributeGroup.id)
      this.attributeGroupDescription.attributeGroup = attGrp;
      this.appService.save(this.attributeGroupDescription, 'AttributeGroupDescription')
         .subscribe(result => {
            if (result.id > 0) {
               this.attributeGroupDescription = result;
               this.attributeGroup.id = result.attributeGroup.id;
            }
            this.processResult(result, this.attributeGroupDescription, null);
        });

      } catch (e) {
         console.log(e);
      }
   }
}
