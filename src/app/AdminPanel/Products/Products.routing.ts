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
import { AttributeGroupComponent } from './AttributeGroup/AttributeGroup.component';
import { AttributeGroupsComponent } from './AttributeGroups/AttributeGroups.component';
import { AttributeComponent } from './Attribute/Attribute.component';
import { OptionsComponent } from './Options/Options.component';
import { OptionComponent } from './Option/Option.component';
import { AuthGuardService } from 'src/app/Services/auth-guard.service';
import { RoleGuardService } from 'src/app/Services/role-guard.service';

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
            path: 'attributes',
            component: AttributeGroupsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'attribute-group/:id',
            component: AttributeGroupComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
{
            path: 'attribute/:id',
            component: AttributeComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'product-edit',
            component: EditProductComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'product-edit/:type/:id',
            component: EditProductComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'product-add',
            component: ProductComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'products',
            component: ProductsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'products/:id',
            component: ProductComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'categories',
            component: CategoriesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'categories/:id',
            component: CategoryComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'marketings',
            component: MarketingsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'marketings/:id',
            component: MarketingComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'information',
            component: InformationsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'information/:id',
            component: InformationComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '1'
            }
         },
         {
            path: 'options',
            component: OptionsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         },
         {
            path: 'option/:id',
            component: OptionComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: '3'
            }
         }
      ]
   }
];
