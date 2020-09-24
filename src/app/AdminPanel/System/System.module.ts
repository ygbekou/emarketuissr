import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputFileModule } from 'ngx-input-file';
import {
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatTableModule,
  MatListModule,
  MatDividerModule,
  MatPaginatorModule,
  MatSortModule,
  MatCheckboxModule,
  MatTabsModule,
  MatGridListModule,
  MatRadioModule,
  MatDatepickerModule,
  MatButtonToggleModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalModule } from '../../Global/Global.module';
import { SystemRoutes } from './System.routing';
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
import { StoresComponent } from './Stores/Stores.component';

@NgModule({
  declarations: [LanguagesComponent, CurrenciesComponent, OrderStatusesComponent,
    StockStatusesComponent, ReturnStatusesComponent, ReturnActionsComponent,
    ReturnReasonsComponent, CountriesComponent, ZonesComponent, GeoZonesComponent,
    TaxRatesComponent, TaxClassesComponent, WeightClassComponent, WeightClassesComponent,
    LengthClassesComponent, LengthClassComponent, ConfigsComponent, StoresComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatMenuModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTableModule,
    MatRadioModule,
    MatDividerModule,
    MatListModule,
    RouterModule.forChild(SystemRoutes),
    TranslateModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    GlobalModule,
    FormsModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
    InputFileModule,
    QuillModule.forRoot({
      theme: 'snow',
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],               // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],      // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }],          // outdent/indent
          [{ direction: 'rtl' }],                       // text direction
          [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ['clean'],                                         // remove formatting button
          ['link', 'image', 'newsVideo']                         // link and image, newsVideo
        ]
      }
    })

  ]
})
export class SystemModule { }
