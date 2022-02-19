import { Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/Services/auth-guard.service';
import { RoleGuardService } from 'src/app/Services/role-guard.service';
import { AmenitiesComponent } from './Amenities/Amenities.component';
import { ReservationsComponent } from './Reservations/Reservations.component';
import { ReservationViewComponent } from './Reservations/ReservationView.component';
import { IconsComponent } from './Icons/Icons.component';

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
         },
         {
            path: 'reservations',
            component: ReservationsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'amenities',
            component: AmenitiesComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'icons',
            component: IconsComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         },
         {
            path: 'reservation-detail/:id',
            component: ReservationViewComponent,
            canActivate: [AuthGuardService, RoleGuardService],
            data: {
               expectedRole: ['Administrator']
            }
         }
      ]
   }
];
