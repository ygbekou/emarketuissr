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
import { CustomersRoutes } from './Customers.routing';
import { UsersComponent } from './Customers/Users.component';
import { UserComponent } from './Customers/User.component';
import { UserAccountModule } from 'src/app/Pages/UserAccount/UserAccount.module';
import { StoresComponent } from './Customers/Stores.component';
import { StoreComponent } from './Customers/Store.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserComponent,
    StoresComponent,
    StoreComponent
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
    RouterModule.forChild(CustomersRoutes),
    TranslateModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    GlobalModule,
    UserAccountModule,
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

  ]
})
export class CustomersModule { }
