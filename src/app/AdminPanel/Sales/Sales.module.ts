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
  MatButtonToggleModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatStepperModule,
  MatChipsModule,
  MatBadgeModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalModule } from '../../Global/Global.module';
import { SalesRoutes } from './Sales.routing';
import { OrdersComponent } from './Orders/Orders.component';
import { OrderViewComponent } from './Orders/OrderView.component';
import { OrderHistoryComponent } from './Orders/OrderHistory.component';
import { ReturnsComponent } from './Returns/Returns.component';
import { ReturnComponent } from './Returns/Return.component';
import { ReturnHistoryComponent } from './Returns/ReturnHistory.component';
import { AdminReviewsComponent } from './Reviews/AdminReviews.component';
import { ReviewsTableComponent } from './Reviews/ReviewsTable.component';
import { OrderOptionComponent } from './Orders/OrderOption.component';
import { SalesSummariesComponent } from './Summaries/SalesSummaries.component';
import { PayoutsComponent } from './Payouts/Payouts.component';
import { PayoutComponent } from './Payouts/Payout.component';
import { SalesSummariesIncludeComponent } from './Summaries/SalesSummariesInclude.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderViewComponent,
    OrderHistoryComponent,
    OrderOptionComponent,
    ReturnsComponent,
    ReturnComponent,
    ReturnHistoryComponent,
    AdminReviewsComponent,
    ReviewsTableComponent,
    SalesSummariesComponent,
    SalesSummariesIncludeComponent,
    PayoutsComponent,
    PayoutComponent
  ],
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
    MatDatepickerModule,
    MatTableModule,
    MatRadioModule,
    MatDividerModule,
    MatListModule,
    RouterModule.forChild(SalesRoutes),
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
    MatToolbarModule,
    MatTooltipModule,
    MatInputModule,
    MatAutocompleteModule,
    InputFileModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatChipsModule,
    MatBadgeModule,
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

  ],
	exports: [OrdersComponent, OrderViewComponent, SalesSummariesComponent, SalesSummariesIncludeComponent, PayoutComponent, PayoutsComponent]
})
export class SalesModule { }
