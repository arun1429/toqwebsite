import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(registerData: any) {
    const url = `${environment.apiUrl}users/signup`;
    return this.http.post(url, registerData);
  }
}
