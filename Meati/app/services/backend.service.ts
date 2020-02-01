import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as connectivity from 'tns-core-modules/connectivity';
import * as applicationSettings from 'application-settings';
import { User, LoginCredential, AuthenticationResponse } from '../shared/transfer-models';

@Injectable()
export class BackendService {
  //public static API_BASE_URL: string = 'http://172.16.6.86:8080/api';
  //public static API_BASE_DOMAIN: string = 'http://172.16.6.86:8080/api';
  public static API_BASE_URL: string = 'http://dev-cluster0:8080/api';
  public static API_BASE_DOMAIN: string = 'http://dev-cluster0:8080/api';

  public userRegistered: EventEmitter<AuthenticationResponse> = new EventEmitter();
  public userLoggedIn: EventEmitter<AuthenticationResponse> = new EventEmitter(); 

  constructor(private http: HttpClient) { }

  public isOnline(): boolean {
    let condition: boolean = false;
    const connectionType = connectivity.getConnectionType();
    switch (connectionType) {
      case connectivity.connectionType.none:
        console.log("No connection");
        condition = false;
        break;
      case connectivity.connectionType.wifi:
        console.log("WiFi connection");
        condition = true;
        break;
      case connectivity.connectionType.mobile:
        console.log("Mobile connection");
        condition = true;
        break;
    }
    return condition;
  }

  public isTokenValid(): boolean {
    return true;
  }

  public registerUser(user: User): void {
    console.log(`Data sent to API: ${JSON.stringify(user)}`);
    this.http.post<AuthenticationResponse>(`${BackendService.API_BASE_DOMAIN}/auth/register`, user)
      .subscribe((response) => {
        console.log(`This was the response: ${JSON.stringify(response)}`);
        this.userRegistered.emit(response);
        this.token = response.token;
      }, (error) => {
        console.log(`An error occured during registration process ${JSON.stringify(error)}`);
      }
    );
  }

  public loginUser(loginCredential: LoginCredential): void {
    console.log(`Data sent to API: ${JSON.stringify(loginCredential)}`);
    this.http.post<AuthenticationResponse>(`${BackendService.API_BASE_DOMAIN}/auth/login`, loginCredential)
    .subscribe((response) => {
      console.log(`This was the response: ${JSON.stringify(response)}`);
      this.token = response.token;
      this.userLoggedIn.emit(response);
      }, (error) => {
        console.log(`An error occured during login process ${JSON.stringify(error)}`);
      }
    );
  }

  set token(token: string) {
    applicationSettings.setString("storedToken", token);
  }

  get token(): string {
    return applicationSettings.getString("storedToken");
  }

  public isToken(): boolean {
    // is not null, empty string (''), undefined, NaN, false or 0
    return this.token && this.token !== '' ? true : false;
  }

  public logOffUser() {
    return this.token = '';
  }

}