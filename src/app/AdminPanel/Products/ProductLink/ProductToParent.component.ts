import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Product, ProductDescription, ProductToParent, CategoryDescription } from 'src/app/app.models';
import { AppService } from 'src/app/Services/app.service';
import { BaseComponent } from '../../baseComponent';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-product-to-parent',
  templateUrl: './ProductToParent.component.html',
  styleUrls: ['./ProductLink.component.scss']
})

export class ProductToParentComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['id', 'category', 'parent', 'quantity', 'actions'];
  productToParentDatasource: MatTableDataSource<ProductToParent>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input()
  productId: number;

  @Input()
  product: Product;

  messages: string;
  errors: string;

  initialParentProductOptions: ProductDescription[];
  initialCategoryOptions: CategoryDescription[];


  constructor(public appService: AppService,
    public translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.getCategories();
    this.getProductParentDescriptions();
    //this.getUnassignedParentProducts(0);
  }

  getCategories() {
    const parameters: string[] = [];
    parameters.push('e.language.id = |langCode|' + this.appService.appInfoStorage.language.id + '|Integer');
    parameters.push('e.category.status = |sStatus|1|Integer');
    this.appService.getAllByCriteria('CategoryDescription', parameters, ' order by e.category.sortOrder ')
        .subscribe((data: CategoryDescription[]) => {
          this.initialCategoryOptions = data;
        },
        error => console.log(error),
        () => console.log('Get all CategoryDescription complete'));
  }

  getProductParentDescriptions() {

    this.appService.getObjects('/service/catalog/assignedproductparentdescriptions/'
      + this.productId + '/' + this.appService.appInfoStorage.language.id)
      .subscribe((data: ProductToParent[]) => {

        this.productToParentDatasource = new MatTableDataSource<ProductToParent>(data);
        this.productToParentDatasource.paginator = this.paginator;
        this.productToParentDatasource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all ProductDescription complete'));
  }

  getUnassignedParentProducts(productToParent: ProductToParent) {

    if (productToParent.category && productToParent.category.id) {
      this.appService.getObjects('/service/catalog/unassignedproductparentdescriptions/' + this.appService.appInfoStorage.language.id
        + '/' + productToParent.category.id + '/' + this.productId)
        .subscribe((data: ProductDescription[]) => {
          this.initialParentProductOptions = data;
          console.log(data)
          productToParent.filteredParentOptions = data;
        },
          error => console.log(error),
          () => console.log('Get all non related product complete'));
    }
  }


  addNewProductToParent() {
    this.errors = '';
    this.messages = '';
    if (!this.productToParentDatasource || this.productToParentDatasource == null || !this.productToParentDatasource.data) {
      const data: ProductToParent[] = [];
      this.productToParentDatasource = new MatTableDataSource(data);
      this.productToParentDatasource.data = [];
    }
    const newProductToParent = new ProductToParent();
    newProductToParent.filteredCategoryOptions = this.initialCategoryOptions;
    newProductToParent.categoryOptions = this.initialCategoryOptions;
    this.updateDatasourceData(this.productToParentDatasource, this.paginator, this.sort, newProductToParent);
  }

  parentProductSelected(productToParent: ProductToParent, selectedProdDesc: ProductDescription) {

    productToParent.parentProductDescription = selectedProdDesc;
    productToParent.parent = selectedProdDesc.product;

  }

  categorySelected(productToParent: ProductToParent, selectedCatDesc: CategoryDescription) {

    productToParent.categoryDescription = selectedCatDesc;
    productToParent.category = selectedCatDesc.category;
    this.getUnassignedParentProducts(productToParent);

  }


  saveProductToParent(productToParent: ProductToParent) {
    this.messages = '';
    this.errors = '';

    if (
      (productToParent.quantity === 0)
    ) {
      this.translate.get(['MESSAGE.INVALID_QUANTITY']).subscribe(res => {
        this.errors = res['MESSAGE.INVALID_QUANTITY'];
      });
      return;
    }

    if (productToParent.parent.id > 0) {
      productToParent.product = new Product();
      productToParent.product.id = this.productId;

      try {
        this.messages = '';
        const index: number = this.productToParentDatasource.data.indexOf(productToParent);
        this.appService.save(productToParent, 'ProductToParent')
          .subscribe(result => {
            if (result.id > 0) {
              if (index !== -1) {
                this.productToParentDatasource.data.splice(index, 1);
              }

              this.productToParentDatasource.data.push(result);
              this.productToParentDatasource = new MatTableDataSource<ProductToParent>(this.productToParentDatasource.data);
              this.productToParentDatasource.paginator = this.paginator;
              this.productToParentDatasource.sort = this.sort;
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.errors = res['MESSAGE.SAVE_UNSUCCESS'] + ' ' + result.errors[0];
              });
            }
          },
            (error) => console.log(error),
            () => console.log('Save ProductToParent complete'));

      } catch (e) {
        console.log(e);
        this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
          this.errors = res['MESSAGE.SAVE_UNSUCCESS'];
        });
      }
    }
  }
  public deleteProductToParent(productToParent: ProductToParent) {
    this.messages = '';
    this.errors = '';
    if (!(productToParent.id > 0)) {
      const index: number = this.productToParentDatasource.data.indexOf(productToParent);
      if (index !== -1) {
        this.productToParentDatasource.data.splice(index, 1);
        this.productToParentDatasource = new MatTableDataSource<ProductToParent>(this.productToParentDatasource.data);
        this.productToParentDatasource.paginator = this.paginator;
        this.productToParentDatasource.sort = this.sort;
      }
    } else {
      this.appService.delete(productToParent.id, 'ProductToParent')
        .subscribe(resp => {
          if (resp.result === 'SUCCESS') {
            const index: number = this.productToParentDatasource.data.indexOf(productToParent);
            if (index !== -1) {
              this.productToParentDatasource.data.splice(index, 1);
              this.productToParentDatasource = new MatTableDataSource<ProductToParent>(this.productToParentDatasource.data);
              this.productToParentDatasource.paginator = this.paginator;
              this.productToParentDatasource.sort = this.sort;
            }
            this.translate.get(['MESSAGE.DELETE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.DELETE_SUCCESS'];
            });
          } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
            this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
            });
          } else {
            this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
              this.errors = res['MESSAGE.ERROR_OCCURRED'];
            });
          }
        });
    }
  }


  filterParentOptions(productParent: ProductToParent) {

    if (!productParent.parentOptions) {
      productParent.parentOptions = this.initialParentProductOptions;
    }

    if (productParent.currentOption) {
      const filterValue = typeof productParent.currentOption === 'string' ?
        productParent.currentOption.toLowerCase() : productParent.currentOption.name;
      productParent.filteredParentOptions = productParent.parentOptions.filter(prodDesc =>
        prodDesc.name.toLowerCase().startsWith(filterValue));
      return productParent.parentOptions.filter(prodDesc => prodDesc.name.toLowerCase().startsWith(filterValue));
    }

    productParent.filteredParentOptions = productParent.parentOptions;
    return productParent.parentOptions;
  }


  filterCategoryOptions(productParent: ProductToParent) {

    if (!productParent.categoryOptions) {
      productParent.categoryOptions = this.initialCategoryOptions;
    }

    if (productParent.categoryDescription.name) {
      const filterValue = productParent.categoryDescription.name;

      productParent.filteredCategoryOptions = productParent.categoryOptions.filter(catDesc =>
        catDesc.name.toLowerCase().startsWith(filterValue));

      return productParent.categoryOptions.filter(catDesc => catDesc.name.toLowerCase().startsWith(filterValue));
    }

    productParent.filteredCategoryOptions = productParent.categoryOptions;
    return productParent.categoryOptions;
  }

}
