import { Component, OnInit, ViewChild } from '@angular/core';
import { CreditCard, CategoryDescription, ProductDescription, Product, ProductToCategory, ProductRelated, Category, Store } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-sell-product',
  templateUrl: './SellProduct.component.html',
  styleUrls: ['./SellProduct.component.scss']
})
export class SellProductComponent extends BaseComponent implements OnInit {

  categories: CategoryDescription[][] = [];
  categoryId = 0;
  productId = 0;
  finalSelectedCatDescs: CategoryDescription[] = [];
  finalDeletedCatDescs: number[] = [];
  selectedCatDescs: CategoryDescription[] = [];
  depth = 0;
  messages: string;
  product: Product = new Product();
  @ViewChild('stepper') stepper: MatStepper;
  selectedStore: Store = new Store();
  options = ['One', 'Two'];
  filteredOptions: Observable<string[]>;
  currentOption: string;
  products: ProductDescription[] = [];
  stores: Store[] = [];
  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {

    this.getStores();

    this.product = new Product();

    for (let counter = 0; counter < 10; counter++) {
      console.log('for loop executed : ' + counter);
      this.categories[counter] = [];
    }

    setTimeout(() => {
      this.categories.splice(1);
    }, 1000);

    this.getParentCategoryDescriptions();
    this.getProductCategoryDescriptions();
  }

  getProductCategoryDescriptions() {
    this.depth = 0;
    this.categories = [];
    this.appService.getObjects('/service/catalog/productcategorydescriptions/'
      + this.productId + '/' + this.appService.appInfoStorage.language.id)
      .subscribe((data: CategoryDescription[]) => {
        this.finalSelectedCatDescs = data;
        this.finalSelectedCatDescs.forEach(element => {
          element.id = element.category.id;
        });
      },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
  }

  getStores() {
    const userId = Number(this.appService.tokenStorage.getUserId());
    if (userId > 0) {
      const parameters: string[] = [];
      parameters.push('e.owner.id = |userId|' + userId + '|Integer');
      this.appService.getAllByCriteria('com.softenza.emarket.model.Store', parameters)
        .subscribe((data: Store[]) => {
          this.stores = data;
        },
          error => console.log(error),
          () => console.log('Get all Store complete for userId=' + userId));
    }
  }
  getParentCategoryDescriptions() {
    this.depth = 0;
    this.categories = [];
    this.appService.getObjects('/service/catalog/categorydescriptions/'
      + this.appService.appInfoStorage.language.id + '/' + this.productId)
      .subscribe((data: CategoryDescription[]) => {
        this.categories[this.depth] = data;
        this.depth++;
        this.categories[this.depth] = [];

        setTimeout(() => {
          this.categories.splice(this.depth);
        }, 5);
      },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
  }


  addCategory(indexOfElement: number, index: number) {

    const ptc = new ProductToCategory();
    ptc.category = this.finalSelectedCatDescs[index].category;
    ptc.product = new Product();
    ptc.product.id = this.productId;

    this.appService.saveWithUrl('/service/crud/ProductToCategory/save/', ptc)
      .subscribe((data: ProductToCategory[]) => {
        this.processResult(data, ptc, null);


        const name = this.finalSelectedCatDescs[index].name;
        this.finalSelectedCatDescs[index].name = '';
        for (const catIndex in this.selectedCatDescs) {
          this.finalSelectedCatDescs[index].longName += (+catIndex > 0 ? ' > ' : '') + this.selectedCatDescs[catIndex].name;
        }
      },
        error => console.log(error),
        () => console.log('Delete of selected category complete'));
  }

  categorySelected(selectedCatDesc: CategoryDescription, indexOfElement: number) {

    const indexIncrement = indexOfElement + 1;
    this.categories.splice(indexIncrement);
    this.selectedCatDescs.splice(indexIncrement);
    this.depth = indexIncrement;

    if (this.selectedCatDescs[indexOfElement].category.childCount > 0) {
      this.appService.getObjects('/service/catalog/categorydescriptions/' + this.appService.appInfoStorage.language.id
        + '/' + this.selectedCatDescs[indexOfElement].category.id + '/' + this.productId)
        .subscribe((data: CategoryDescription[]) => {
          this.categories[this.depth] = data;
          this.depth++;
          this.categories[this.depth] = [];

          setTimeout(() => {
            this.categories.splice(this.depth);
          }, 5);
        },
          error => console.log(error),
          () => console.log('Get all CategoryDescription complete'));
    } else {
      this.getProducts(this.selectedCatDescs[indexOfElement]);
    }
  }

  getProducts(cat: CategoryDescription) {
    console.log(cat);
    console.log(this.selectedStore);
    console.log(this.appService.appInfoStorage.language);
    this.appService.getObjects('/service/catalog/getProductsForCategoryForSale/' + this.appService.appInfoStorage.language.id
      + '/' + cat.id + '/' + this.selectedStore.id)
      .subscribe((data: ProductDescription[]) => {
        this.products = data;
        this.stepper.selectedIndex = 2;
        console.log(this.products);
      },
        error => console.log(error),
        () => console.log('Get all getProductsForCategoryForSale complete'));
  }

  save() {
    this.messages = '';
    try {
      const productToCategorys = [];
      this.finalSelectedCatDescs.forEach(element => {
        const productToCategory = new ProductToCategory();
        productToCategory.category = new Category();
        productToCategory.category.id = element.id;
        productToCategory.action = element.action;

        productToCategorys.push(productToCategory);
      });

      const product = new Product();
      product.id = this.productId;
      product.productToCategorys = productToCategorys;
      this.appService.save(product, 'Product')
        .subscribe(result => {
          if (result.id > 0) {
            this.product.id = result.id;
            this.processResult(result, this.product, null);
            this.getParentCategoryDescriptions();
            this.getProductCategoryDescriptions();
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

  public addToCart(value) {
    this.appService.addToCart(value);
  }

  public addToWishList(value) {
    this.appService.addToWishlist(value);
  }

  public transformHits(hits) {
    hits.forEach(hit => {
      hit.stars = [];
      for (let i = 1; i <= 5; i) {
        hit.stars.push(i <= hit.rating);
        i += 1;
      }
    });
    return hits;
  }
}
