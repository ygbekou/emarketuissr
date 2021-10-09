import { Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/Services/auth-guard.service';
import { RoleGuardService } from 'src/app/Services/role-guard.service';
import { AmenitiesComponent } from './Amenities/Amenities.component';

export const HospitalitiesRoutes: Routes = [
   {
      path: '',
      redirectTo: 'AmenitiesComponent',
      pathMatch: 'full'
   },
   {
      path: '',
      children: [
         {
            path: 'amenities',
            component: AmenitiesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         }
      ]
   }
];
