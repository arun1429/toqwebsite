import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserService } from "../_services/user.service";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private _US: UserService, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => {
          let errMsg = "";
          // Client Side Error
          if (error.error instanceof ErrorEvent) {
            errMsg = `Error: ${error.error.message}`;
          } else if (error.status === 401) {
            // Server Side Error
            errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            if (error.status === 401 || error.status === 440) {
              this._US.updateUser(false, null);
              localStorage.removeItem('currentUser');
              this.router.navigateByUrl("/userprofile/login");
            }
          }
          return throwError(error);
        }
      )
    );
  }

}
