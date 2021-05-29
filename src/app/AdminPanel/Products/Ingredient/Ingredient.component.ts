import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Ingredient, IngredientDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../baseComponent';
import { IngredientDescriptionComponent } from '../IngredientDescription/IngredientDescription.component';

@Component({
  selector: 'app-ingredient',
  templateUrl: './Ingredient.component.html',
  styleUrls: ['./Ingredient.component.scss']
})

export class IngredientComponent extends BaseComponent implements OnInit {

  messages = '';
  @ViewChild(IngredientDescriptionComponent, { static: false}) ingredientDescriptionView: IngredientDescriptionComponent;
  ingredient: Ingredient;

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
    console.log('Tab changed');
    if (this.ingredientDescriptionView) {
      this.ingredientDescriptionView.messages = '';
    }
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
      this.ingredient.ingredientDescriptions.push(pd);
    }
    if (this.ingredientDescriptionView) {
      this.ingredientDescriptionView.setIngredient(this.ingredient);
    }
  }

  getIngredientDescriptions(ingredientId: number) {
    const parameters: string[] = [];
    if (ingredientId != null) {
      parameters.push('e.ingredient.id = |ingredientId|' + ingredientId + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.IngredientDescription', parameters)
      .subscribe((data: IngredientDescription[]) => {

        if (data !== null && data.length > 0) {
          this.ingredient = data[0].ingredient;
          console.log('In product');
          console.log(this.ingredient);
          this.ingredient.ingredientDescriptions = data;
          this.ingredientDescriptionView.ingredient = this.ingredient;
          this.ingredientDescriptionView.refreshLangObjects();

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

  save() {
    this.messages = '';
    try {
      this.setIngredientToggles();
      const ingr = { ...this.ingredient };
      ingr.ingredientDescriptions = [];
      this.appService.save(ingr, 'Ingredient')
        .subscribe(result => {
          if (result.id > 0) {
            this.ingredient.id = result.id;
            this.processResult(result, this.ingredient, null);
            this.ingredientDescriptionView.setIngredient(this.ingredient);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
}
