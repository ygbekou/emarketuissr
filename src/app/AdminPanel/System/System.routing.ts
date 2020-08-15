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
            component: LanguagesComponent
         },
         {
            path: 'currencies',
            component: CurrenciesComponent
         },
         {
            path: 'stockStatuses',
            component: StockStatusesComponent
         },
         {
            path: 'orderStatuses',
            component: OrderStatusesComponent
         },
         {
            path: 'returnStatuses',
            component: ReturnStatusesComponent
         },
         {
            path: 'returnActions',
            component: ReturnActionsComponent
         },
         {
            path: 'returnReasons',
            component: ReturnReasonsComponent
         },
         {
            path: 'countries',
            component: CountriesComponent
         },
         {
            path: 'zones',
            component: ZonesComponent
         },
         {
            path: 'geoZones',
            component: GeoZonesComponent
         },
         {
            path: 'taxRates',
            component: TaxRatesComponent
         },
         {
            path: 'taxClasses',
            component: TaxClassesComponent
         },
         {
            path: 'weightClasses',
            component: WeightClassesComponent
         },
         {
            path: 'weightClasses/:id',
            component: WeightClassComponent
         },
         {
            path: 'lengthClasses',
            component: LengthClassesComponent
         },
         {
            path: 'lengthClasses/:id',
            component: LengthClassComponent
         },
         {
            path: 'configs',
            component: ConfigsComponent
         }
      ]
   }
];
