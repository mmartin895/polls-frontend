import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
      private router: Router,
      private userService: UserService
  ) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    var user = this.userService.user.getValue();
    if (user) {
        // check all permissions
        var hasPermissions = route.data.permissions.every(permission => {
          return this.userService.hasPermission(permission)}
        );

        // authorised so return true
        return hasPermissions;
    } 

    // not logged in so redirect to login page with the return url
    return this.router.createUrlTree(['/auth/login']);
  }
}
