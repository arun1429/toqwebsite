import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const currentUser: any = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.token) {
      req = req.clone({
        headers: new HttpHeaders({
          authkey: currentUser.token,
          Accept: "application/json"
        })
      });
    }
    const fDataUrl1 = "/banners";
    const fDataUrl2 = "";
    const isFormData = fDataUrl1 || fDataUrl2;
    if (isFormData) {
      return next.handle(req);
    }
    if (!req.headers.has("Content-Type")) {
      req = req.clone({
        headers: req.headers.set("Content-Type", "application/json")
      });
    }
    return next.handle(req);
  }

}
