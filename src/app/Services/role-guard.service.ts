import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = sessionStorage.getItem('AuthToken');
    // decode the token to get its payload
    const tokenPayload: any = decode(token);

    console.log('Role Guard ...');
    if (
      !this.auth.isAuthenticated() || !expectedRole.includes(tokenPayload.role)
    ) {
      console.log('current location: ' + window.location);
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
