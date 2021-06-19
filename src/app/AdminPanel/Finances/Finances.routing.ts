import { Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/Services/auth-guard.service';
import { RoleGuardService } from 'src/app/Services/role-guard.service';
import { TransactionTypesComponent } from './TransactionTypes/TransactionTypes.component';
import { TransactionTypeComponent } from './TransactionType/TransactionType.component';
import { SuppliersComponent } from './Suppliers/Suppliers.component';
import { SupplierComponent } from './Suppliers/Supplier.component';

export const FinancesRoutes: Routes = [
   {
      path: '',
      redirectTo: 'TransactionTypesComponent',
      pathMatch: 'full'
   },
   {
      path: '',
      children: [
         {
            path: 'transactionTypes',
            component: TransactionTypesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'transactionType/:id',
            component: TransactionTypeComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'suppliers',
            component: SuppliersComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'supplier/:id',
            component: SupplierComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         }
      ]
   }
];
