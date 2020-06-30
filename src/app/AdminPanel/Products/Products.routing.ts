import { Routes } from '@angular/router';
import { ProductsComponent } from './Products/Products.component';
import { EditProductComponent } from './EditProduct/EditProduct.component';
import { AddProductComponent } from './AddProduct/AddProduct.component';
import { CategoriesComponent } from './Categories/Categories.component';
import { CategoryComponent } from './Category/Category.component';

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
            component: AddProductComponent
         },
         {
            path: 'products',
            component: ProductsComponent
         },
         {
            path: 'categories',
            component: CategoriesComponent
         },
         {
            path: 'categories/:id',
            component: CategoryComponent
         }
      ]
   }
];
