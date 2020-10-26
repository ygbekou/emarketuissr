import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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