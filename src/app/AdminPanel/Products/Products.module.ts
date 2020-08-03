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
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { EditProductComponent } from './EditProduct/EditProduct.component';
import { ProductComponent } from './Product/Product.component'; 
import { GlobalModule } from '../../Global/Global.module';
import { ProductsComponent } from './Products/Products.component';
import { ProductsRoutes } from './Products.routing';
import { CategoryComponent } from './Category/Category.component';
import { CategoriesComponent } from './Categories/Categories.component';
import { ProductDescriptionComponent } from './ProductDescription/ProductDescription.component';
import { ProductLinkComponent } from './ProductLink/ProductLink.component';
import { InformationComponent } from './Information/Information.component'; 
import { InformationsComponent } from './Informations/Informations.component';
import { MarketingComponent } from './Marketing/Marketing.component';
import { MarketingsComponent } from './Marketings/Marketings.component';
import { ProductImagesComponent } from './ProductImages/ProductImages.component';
import { AttributeGroupComponent } from './AttributeGroup/AttributeGroup.component';
import { AttributeGroupDescriptionComponent } from './AttributeGroup/AttributeGroupDescription.component';
import { AttributeComponent } from './Attribute/Attribute.component';
import { AttributeDescriptionComponent } from './Attribute/AttributeDescription.component';
import { AttributeGroupsComponent } from './AttributeGroups/AttributeGroups.component';
import { AttributesComponent } from './Attributes/Attributes.component';
import { ProductAttributesComponent } from './ProductAttribute/ProductAttributes.component';
import { OptionsComponent } from './Options/Options.component';
import { OptionComponent } from './Option/Option.component';
import { OptionDescriptionComponent } from './Option/OptionDescription.component';
import { OptionValuesComponent } from './OptionValues/OptionValues.component';
import { OptionValueComponent } from './OptionValue/OptionValue.component';

@NgModule({
  declarations: [ProductsComponent, EditProductComponent, ProductComponent, ProductDescriptionComponent,
    ProductLinkComponent, CategoryComponent, CategoriesComponent, InformationComponent, InformationsComponent,
    MarketingComponent, MarketingsComponent, ProductImagesComponent, AttributeGroupComponent, AttributeGroupDescriptionComponent, 
    AttributeComponent, AttributeDescriptionComponent, AttributeGroupsComponent, AttributesComponent, ProductAttributesComponent, 
    OptionsComponent, OptionComponent, OptionDescriptionComponent, OptionValuesComponent, OptionValueComponent],
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
    RouterModule.forChild(ProductsRoutes),
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
export class ProductsModule { }
