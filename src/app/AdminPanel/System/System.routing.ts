import { Routes } from '@angular/router';
import { LanguagesComponent } from './Languages/Languages.component';
import { CurrenciesComponent } from './Currencies/Currencies.component';
import { StockStatusesComponent } from './StockStatuses/StockStatuses.component';
import { OrderStatusesComponent } from './OrderStatuses/OrderStatuses.component';
import { ReturnStatusesComponent } from './ReturnStatuses/ReturnStatuses.component';
import { ReturnActionsComponent } from './ReturnActions/ReturnActions.component';
import { ReturnReasonsComponent } from './ReturnReasons/ReturnReasons.component';
import { CountriesComponent } from './Countries/Countries.component';
import { ZonesComponent } from './Zones/Zones.component';
import { GeoZonesComponent } from './GeoZones/GeoZones.component';
import { TaxRatesComponent } from './TaxRates/TaxRates.component';
import { TaxClassesComponent } from './TaxClasses/TaxClasses.component';
import { WeightClassComponent } from './WeightClass/WeightClass.component';
import { WeightClassesComponent } from './WeightClasses/WeightClasses.component';
import { LengthClassesComponent } from './LengthClasses/LengthClasses.component';
import { LengthClassComponent } from './LengthClass/LengthClass.component';
import { ConfigsComponent } from './configs/configs.component';
import { AuthGuardService } from 'src/app/Services/auth-guard.service';
import { RoleGuardService } from 'src/app/Services/role-guard.service';

export const SystemRoutes: Routes = [
   {
      path: '',
      redirectTo: 'LanguagesComponent',
      pathMatch: 'full'
   },
   {
      path: '',
      children: [
         {
            path: 'languages',
            component: LanguagesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'currencies',
            component: CurrenciesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'stockStatuses',
            component: StockStatusesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'orderStatuses',
            component: OrderStatusesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'returnStatuses',
            component: ReturnStatusesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'returnActions',
            component: ReturnActionsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'returnReasons',
            component: ReturnReasonsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'countries',
            component: CountriesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'zones',
            component: ZonesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'geoZones',
            component: GeoZonesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'taxRates',
            component: TaxRatesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'taxClasses',
            component: TaxClassesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'weightClasses',
            component: WeightClassesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'weightClasses/:id',
            component: WeightClassComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'lengthClasses',
            component: LengthClassesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'lengthClasses/:id',
            component: LengthClassComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'configs',
            component: ConfigsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         }
      ]
   }
];
