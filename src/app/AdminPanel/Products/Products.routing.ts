import { Routes } from '@angular/router';
import { ProductsComponent } from './Products/Products.component';
import { EditProductComponent } from './EditProduct/EditProduct.component';
import { ProductComponent } from './Product/Product.component';
import { CategoriesComponent } from './Categories/Categories.component';
import { CategoryComponent } from './Category/Category.component';
import { InformationsComponent } from './Informations/Informations.component';
import { InformationComponent } from './Information/Information.component';
import { MarketingsComponent } from './Marketings/Marketings.component';
import { MarketingComponent } from './Marketing/Marketing.component';

export const ProductsRoutes: Routes = [
   {
      path: '',
      redirectTo: 'ProductsComponent',
      pathMatch: 'full'
   },
   {
      path: '',
      children: [
         {
            path: 'product-edit',
            component: EditProductComponent
         },
         {
            path: 'product-edit/:type/:id',
            component: EditProductComponent
         },
         {
            path: 'product-add',
            component: ProductComponent
         },
         {
            path: 'products',
            component: ProductsComponent
         },
         {
            path: 'products/:id',
            component: ProductComponent
         },
         {
            path: 'categories',
            component: CategoriesComponent
         },
         {
            path: 'categories/:id',
            component: CategoryComponent
         }, 
         {
            path: 'marketings',
            component: MarketingsComponent
         },
         {
            path: 'marketings/:id',
            component: MarketingComponent
         },
         {
            path: 'information',
            component: InformationsComponent
         },
         {
            path: 'information/:id',
            component: InformationComponent
         }
      ]
   }
];
