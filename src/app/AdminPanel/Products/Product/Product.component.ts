import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Product, ProductDescription, Currency } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDescriptionComponent } from '../ProductDescription/ProductDescription.component';
import { BaseComponent } from '../../baseComponent';
import { ProductImagesComponent } from '../ProductImages/ProductImages.component';
import { ProductLinkComponent } from '../ProductLink/ProductLink.component';

@Component({
  selector: 'app-product',
  templateUrl: './Product.component.html',
  styleUrls: ['./Product.component.scss']
})

export class ProductComponent extends BaseComponent implements OnInit {

  messages = '';

  @ViewChild(ProductDescriptionComponent, { static: false }) productDescriptionView: ProductDescriptionComponent;
  @ViewChild(ProductImagesComponent, { static: false }) prodImageComponent: ProductImagesComponent;
  @ViewChild(ProductLinkComponent, { static: false }) prodLinkComponent: ProductLinkComponent;

  product: Product;
  currencies: Currency[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public appService: AppService) {
    super(translate);
  }

  ngOnInit() {

    this.getCurrencies();
    this.activatedRoute.params.subscribe(params => {
      if (params.id === undefined || params.id === 0) {
        this.clear();
      } else {
        this.clear();
        this.getProductDescriptions(params.id);
      }
    });

  }

  getCurrencies() {
    const parameters: string[] = [];
    parameters.push('e.status = |statusParam|1|Integer');
    this.appService.getAllByCriteria('com.softenza.emarket.model.Currency', parameters,
      ' order by e.code ')
      .subscribe((data: Currency[]) => {
        this.currencies = data;
      },
        error => console.log(error),
        () => console.log('Get all Currency complete'));
  }

  clearMessages($event) {
    console.log('Tab changed');
    if (this.productDescriptionView) {
      this.productDescriptionView.messages = '';
    }
    if (this.prodLinkComponent) {
      this.prodLinkComponent.messages = '';
    }
    if (this.prodImageComponent) {
      this.prodImageComponent.messages = '';
    }

    this.messages = '';
  }

  setImage($event) {
    console.log('Setting image' + $event);
    this.product.image = $event;
  }

  setProduct($event) {
    console.log('Product set called');
    console.log($event);
    this.product = $event;
  }

  clear() {
    this.product = new Product();
    this.product.productDescriptions = [];
    for (const lang of this.appService.appInfoStorage.languages) {
      const pd = new ProductDescription();
      pd.language = lang;
      this.product.productDescriptions.push(pd);
    }
    if (this.productDescriptionView) {
      this.productDescriptionView.setProduct(this.product);
    }
  }

  getProductDescriptions(productId: number) {
    const parameters: string[] = [];
    if (productId != null) {
      parameters.push('e.product.id = |productId|' + productId + '|Integer');
    }
    this.appService.getAllByCriteria('com.softenza.emarket.model.ProductDescription', parameters)
      .subscribe((data: ProductDescription[]) => {

        if (data !== null && data.length > 0) {
          this.product = data[0].product;
          console.log('In product');
          console.log(this.product);
          this.product.productDescriptions = data;
          this.productDescriptionView.product = this.product;
          this.productDescriptionView.refreshLangObjects();

        }
      },
        error => console.log(error),
        () => console.log('Get all Category Item complete'));
  }

  setProductToggles() {
    this.product.status = (this.product.status == null
      || this.product.status.toString() === 'false'
      || this.product.status.toString() === '0') ? 0 : 1;
    this.product.shipping = (this.product.shipping == null
      || this.product.shipping.toString() === 'false'
      || this.product.shipping.toString() === '0') ? 0 : 1;
    this.product.subtract = (this.product.subtract == null
      || this.product.subtract.toString() === 'false'
      || this.product.subtract.toString() === '0') ? 0 : 1;
  }

  save() {
    this.messages = '';
    try {
      this.setProductToggles();
      const prod = { ...this.product };
      prod.productDescriptions = [];
      this.appService.save(prod, 'Product')
        .subscribe(result => {
          if (result.id > 0) {
            this.product.id = result.id;
            this.processResult(result, this.product, null);
            this.prodImageComponent.setProduct(this.product);
            this.prodLinkComponent.setProduct(this.product);
            this.productDescriptionView.setProduct(this.product);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
}
