import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TermsConditionsComponent } from './terms-conditions.component';
import { MatCardModule } from '@angular/material';
export const routes = [
  { path: '', component: TermsConditionsComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [TermsConditionsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule.forChild(routes)
  ]
})

export class TermsConditionsModule { }

