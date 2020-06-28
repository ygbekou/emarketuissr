import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSidenavModule,
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
         MatGridListModule
		 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { EditProductComponent } from './EditProduct/EditProduct.component';
import { AddProductComponent } from './AddProduct/AddProduct.component';
import { GlobalModule} from '../../Global/Global.module';
import { ProductsComponent } from './Products/Products.component';
import { ProductsRoutes} from './Products.routing';

@NgModule({
   declarations: [ProductsComponent, EditProductComponent, AddProductComponent],
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
      MatTableModule,
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
      QuillModule.forRoot({
      theme: 'snow',
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],               // custom button values
          [{ list: 'ordered'}, { list: 'bullet' }],
          [{ script: 'sub'}, { script: 'super' }],      // superscript/subscript
          [{ indent: '-1'}, { indent: '+1' }],          // outdent/indent
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
