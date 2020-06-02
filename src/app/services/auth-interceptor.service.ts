import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from './user.service';
import {exhaustMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(
    private userService: UserService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.userService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          setHeaders: {
            'Content-Type' : 'application/json; charset=utf-8',
            'Accept'       : 'application/json',
            'Authorization': `Token ${user.token}`
          }
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
