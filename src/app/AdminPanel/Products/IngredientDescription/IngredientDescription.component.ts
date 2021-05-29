import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Ingredient, IngredientDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';

@Component({
   selector: 'app-ingredient-description',
   templateUrl: './IngredientDescription.component.html',
   styleUrls: ['./IngredientDescription.component.scss']
})

export class IngredientDescriptionComponent implements OnInit {

   messages = '';

   @Input() ingredient: Ingredient;

   ingredientDescription: IngredientDescription;
   selectedTab = 0;
   selectedMainTabIndex = 0;

   constructor(protected translate: TranslateService,
      public appService: AppService) {
      console.log('In product desc');
      console.log(this.ingredient);
   }

   ngOnInit() {

      this.refreshLangObjects();

   }

   setIngredient(ingred: Ingredient) {
      this.ingredient = ingred;
      this.refreshLangObjects();
   }

   refreshLangObjects() {
      let first = true;
      this.appService.appInfoStorage.languages.forEach(language => {
         let found = false;
         this.ingredient.ingredientDescriptions.forEach(aIngredientDesc => {
            if (aIngredientDesc.language.code === language.code) {
               found = true;
               if (first) {
                  this.ingredientDescription = aIngredientDesc;
                  first = false;
               }
            }
         });
      });
   }


   onLangChanged(event) {
      this.messages = '';
      let found = false;
      console.log('tab changed lang =' + event.tab.textLabel);
      console.log(this.ingredient.ingredientDescriptions);
      this.ingredient.ingredientDescriptions.forEach(ingredientDesc => {
         if (ingredientDesc.language.name === event.tab.textLabel) {
            console.log('Found : ' + ingredientDesc.language.name + ' : ' + ingredientDesc.name);
            this.ingredientDescription = ingredientDesc;
            found = true;
            return;
         }
      });

      if (!found) {
         this.appService.appInfoStorage.languages.forEach(language => {
            console.log('creating product desc');
            console.log(language.name + 'creating ingredient desc' + event.tab.textLabel);
            if (language.name === event.tab.textLabel) {
               const id = new IngredientDescription();
               id.language = language;
               this.ingredient.ingredientDescriptions.push(id);
               this.ingredientDescription = id;
               console.log('new Ingredient desc created');
               console.log(this.ingredient.ingredientDescriptions);
               return;
            }
         });
      }

   }

   save() {
      this.messages = '';
      try {
         this.ingredientDescription.ingredient = this.appService.cloneIngredient(this.ingredient);
         this.appService.save(this.ingredientDescription, 'IngredientDescription')
            .subscribe(result => {
               if (result.id > 0) {
                  this.ingredientDescription = result;
                  this.ingredient.id = result.ingredient.id;
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
}
