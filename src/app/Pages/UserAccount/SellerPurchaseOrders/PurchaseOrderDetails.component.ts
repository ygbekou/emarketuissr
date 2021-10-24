import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PoDtl, PoHdr, ProductDescription, IngredientDescription } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/Services/app.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/AdminPanel/baseComponent';


@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './PurchaseOrderDetails.component.html',
  // styleUrls: ['./PurchaseOrders.component.scss']
})

export class PurchaseOrderDetailsComponent extends BaseComponent implements OnInit, AfterViewInit {

  poDtlColumns: string[] = ['id', 'image', 'productName', 'quantity', 'unitPrice', 'totalAmount', 'actions'];
  poDtlDatasource: MatTableDataSource<PoDtl>;
  @ViewChild('poDtlPaginator', { static: true }) poDtlPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) poDtlSort: MatSort;

  messages = '';
  currentOption: string;
  productOptions: ProductDescription[];
  filteredProductOptions: ProductDescription[];
  ingredientOptions: IngredientDescription[];
  filteredIngredientOptions: IngredientDescription[];

  poHdr: PoHdr = new PoHdr();
  poDtls: PoDtl[] = [];

  saving = false;

  constructor(public appService: AppService,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    super(translate);
  }

  ngOnInit() {
    this.clear([]);
  }

  ngAfterViewInit() {

  }

  clear(data) {
    this.messages = '';
    this.currentOption = '';
    this.setDatasource([]);
  }

  setDatasource(data) {
    this.poDtlDatasource = new MatTableDataSource<PoDtl>(data);
    this.poDtlDatasource.paginator = this.poDtlPaginator;
    this.poDtlDatasource.sort = this.poDtlSort;

    this.poDtls = data;
  }

  getStoreProducts(storeId: number) {    
    this.appService.getObjects('/service/catalog/getMyProductsOnSale/'
      + this.appService.appInfoStorage.language.id + '/' + storeId)
      .subscribe((data: ProductDescription[]) => {
        this.filteredProductOptions = data;
        this.productOptions = data;
      },
        error => console.log(error),
        () => console.log('Get all store product complete'));
  }

  getStoreIngredients(storeId: number) {

    this.appService.saveWithUrl('/service/catalog/getStoreIngredients', {
      languageId: +this.appService.appInfoStorage.language.id,
      storeId: storeId
    })
      .subscribe((data: any[]) => {
        this.filteredIngredientOptions = data;
        this.ingredientOptions = data;
      },
    error => console.log(error),
    () => console.log('Get store ingredients complete'));
  }

  filterOptions(val) {
    if (val) {
      const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
      this.filteredProductOptions = this.productOptions
        .filter(productDesc => productDesc.name.toLowerCase().startsWith(filterValue));
    } else {
      this.filteredProductOptions = this.productOptions;
    }
  }

  filterIngredientOptions(val) {
    if (val) {
      const filterValue = typeof val === 'string' ? val.toLowerCase() : val.name.toLowerCase();
      this.filteredIngredientOptions = this.ingredientOptions
        .filter(ingredienttDesc => ingredienttDesc.name.toLowerCase().startsWith(filterValue));
    } else {
      this.filteredIngredientOptions = this.ingredientOptions;
    }
  }


  addPoDtl() {
    this.messages = '';
    this.poDtlDatasource.data.unshift(new PoDtl())
    this.poDtlDatasource = new MatTableDataSource(this.poDtlDatasource.data);
    this.poDtlDatasource.paginator = this.poDtlPaginator;
    this.poDtlDatasource.sort = this.poDtlSort;
  }

  savePoDtl(poDtl: PoDtl, index: number) {
    this.saving = true;
    this.messages = '';
    poDtl.modifiedBy = +this.appService.tokenStorage.getUserId();
    poDtl.poHdr = this.poHdr;

    if (poDtl.product.id > 0) {
      poDtl.ingredient = null;
    } else if (poDtl.ingredient.id > 0) {
      poDtl.product = null;
    }

    this.appService.saveWithUrl('/service/finance/savePoDtl/', poDtl)
      .subscribe((data: PoDtl) => {
        console.log(data);
        this.processResult(data, poDtl, null);
        poDtl = data;
        poDtl.isTouched = false;
        this.poDtlDatasource.data[index] = data;
        this.setDatasource(this.poDtlDatasource.data);
        this.saving = false;
        
        if (poDtl.product.id > 0) {
          this.filteredProductOptions = this.productOptions;
        } else if (poDtl.ingredient.id > 0) {
          this.filteredIngredientOptions = this.ingredientOptions;
        }
      },
        error => console.log(error),
        () => console.log('Get all PoDtl complete'));
  }

  removePoDtl(poDtl: PoDtl, index: number) {

    if (!poDtl.id) {
        this.poDtlDatasource.data.splice(index, 1);
        this.resetDatasource(this.poDtlDatasource.data, index);
        return;
    }

    this.messages = '';

    this.appService.delete(poDtl.id, 'PoDtl')
        .subscribe(data => {
          this.processDataSourceDeleteResult(data, this.messages, poDtl, this.poDtlDatasource);
          this.poDtlDatasource.data = Array.from(this.poDtlDatasource.data);
          this.setDatasource(this.poDtlDatasource.data);
      });
  }

  validateSelectedProduct(poDtl: PoDtl) {

      if (typeof(poDtl.productName) === 'string' && this.productOptions) {
         let index = this.productOptions.findIndex(x => x.name === poDtl.productName);
         if (index === -1) {
            index = this.poDtls.findIndex(x => x.id === poDtl.id);
            if (index === -1) {
               return false;
            } else {
               return true;
            }
         } else {
            poDtl.product = this.productOptions[index].product;
         }
      }

      if (!poDtl.product || !poDtl.product.id) {
         return false;
      }

      return true;
   }

  validateSelectedIngredient(poDtl: PoDtl) {

      if (typeof(poDtl.ingredientName) === 'string' && this.ingredientOptions) {
         let index = this.ingredientOptions.findIndex(x => x.name === poDtl.ingredientName);
         if (index === -1) {
            index = this.poDtls.findIndex(x => x.id === poDtl.id);
            if (index === -1) {
               return false;
            } else {
               return true;
            }
         } else {
            poDtl.ingredient = this.ingredientOptions[index].ingredient;
         }
      }

      if (!poDtl.ingredient || !poDtl.ingredient.id) {
         return false;
      }

      return true;
   }

  setSelectedProduct(poDtl: PoDtl, productDesc: ProductDescription) {
     poDtl.product = productDesc.product;
  }

  calculateTotalAmount (poDtl: PoDtl) {
    if (!poDtl.unitAmount || !poDtl.quantity) {
      poDtl.totalAmount = undefined;
      return;
    }
    poDtl.totalAmount = Number((poDtl.unitAmount * poDtl.quantity).toFixed(2));
  }

  calculateUnitAmount (poDtl: PoDtl) {
    if (!poDtl.totalAmount || !poDtl.quantity) {
      poDtl.unitAmount = undefined;
      return;
    }
    poDtl.unitAmount = Number((poDtl.totalAmount / poDtl.quantity).toFixed(2));
  }

  changeTab($event) {
    console.log('Tab changed');
  }
}
