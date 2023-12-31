
import { Routes } from '@angular/router';
import { MainAdminPanelComponent } from './Main/Main.component';

export const AdminPanelRoutes: Routes = [
   {
      path: 'admin',
      redirectTo: 'admin/admindash',
      pathMatch: 'full',
   },
   {
      path: "admin", 
      component: MainAdminPanelComponent,
      children: [
         {
            path: 'admindash', loadChildren: () =>
               import('./Reports/Reports.module').then(m => m.ReportsModule)
         },
         {
            path: 'invoices', loadChildren: () =>
               import('./Invoices/Invoices.module').then(m => m.InvoicesModule)
         },
         {
            path: '', loadChildren: () =>
               import('./Products/Products.module').then(m => m.ProductsModule)
         },
         {
            path: 'sales', loadChildren: () =>
               import('./Sales/Sales.module').then(m => m.SalesModule)
         },
         {
            path: 'deliveries', loadChildren: () =>
               import('./Deliveries/Deliveries.module').then(m => m.DeliveriesModule)
         },
         {
            path: 'customers', loadChildren: () =>
               import('./Customers/Customers.module').then(m => m.CustomersModule)
         },
         {
            path: 'finances', loadChildren: () =>
               import('./Finances/Finances.module').then(m => m.FinancesModule)
         },
         {
            path: 'hospitalities', loadChildren: () =>
               import('./Hospitalities/Hospitalities.module').then(m => m.HospitalitiesModule)
         },
         {
            path: 'account', loadChildren: () =>
               import('./AdminAccount/AdminAccount.module').then(m => m.AdminAccountModule)
         },
         {
            path: 'system', loadChildren: () =>
               import('./System/System.module').then(m => m.SystemModule)
         }
      ]
   }
]