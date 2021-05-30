import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Ingredient, IngredientDescription, Language } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';

@Component({
  selector: 'app-ingredient',
  templateUrl: './Ingredient.component.html',
  styleUrls: ['./Ingredient.component.scss']
})

export class IngredientComponent extends BaseComponent implements OnInit {

  messages = '';
  ingredient: Ingredient;
  
  @Output() ingredientSaveEvent = new EventEmitter<Ingredient>();

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
        this.getIngredientDescriptions(params.id);
      }
    });

  }

  clearMessages($event) {
    this.messages = '';
  }

  setImage($event) {
    console.log('Setting image' + $event);
    this.ingredient.image = $event;
  }

  setIngredient($event) {
    this.ingredient = $event;
  }

  clear() {
    this.ingredient = new Ingredient();
    this.ingredient.ingredientDescriptions = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const pd = new IngredientDescription();
      pd.language = lang;
      pd.name = '';
      this.ingredient.ingredientDescriptions.push(pd);
    }
  }

  getIngredientDescriptions(ingredientId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (ingredientId != null) {
      parameters.push('e.ingredient.id = |ingredientId|' + ingredientId + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.IngredientDescription', parameters)
      .subscribe((data: IngredientDescription[]) => {

        if (data !== null && data.length > 0) {
          this.ingredient = data[0].ingredient;
          this.ingredient.ingredientDescriptions = data;

        }
      },
        error => console.log(error),
        () => console.log('Get all Ingredient Description complete'));
  }

  setIngredientToggles() {
    this.ingredient.status = (this.ingredient.status == null
      || this.ingredient.status.toString() === 'false'
      || this.ingredient.status.toString() === '0') ? 0 : 1;
  }

  cleanIngredientDescriptions(ingredient: Ingredient) {
    ingredient.ingredientDescriptions.forEach(element => {
       element.ingredient = undefined;
       const language = element.language;
       element.language = new Language();
       element.language.id = language.id;    });
  }

  save() {
    this.messages = '';
    try {
      const ingred = {...this.ingredient};
      this.cleanIngredientDescriptions(ingred);

      this.appService.save(ingred, 'Ingredient')
        .subscribe(result => {
          if (result.id > 0) {
            this.ingredient.id = result.id;
            this.processResult(result, this.ingredient, null);
            this.ingredientSaveEvent.emit(this.ingredient);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }


}
