import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseurl = environment.baseUrl;
  constructor(private http: HttpClient) { }


  login_authentication(data){
    const httpheaders = new HttpHeaders({
     'Content-Type': 'application/json'
     });
     return this.http.post(`${this.baseurl}/adminlogin`,data,{
       headers: httpheaders,
       observe: 'response'
     });
   }
}
