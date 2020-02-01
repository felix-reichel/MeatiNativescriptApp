import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Page } from "ui/page";
import { User, AuthenticationResponse, SuccessState, ErrorNumber, LoginCredential } from '../../shared/transfer-models';
import { BackendService } from '../../services/backend.service';
import { setPageClasses } from './../../common/page';
import { Router } from './../../common/router';
import * as dialogUtil from './../../common/dialog-util';
const sha512 = require('js-sha512');

@Component({
  selector: 'app-login',
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['../../shared/less/all.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public submitted: boolean;
  
  private currentUser: User = new User();

  constructor(private page: Page, private http: HttpClient, private backendService: BackendService, 
    private router: Router, private fb: FormBuilder) { 
    setPageClasses(page);
  }

  ngOnInit() {
    console.log(`Print out serialized token ${ this.backendService.token }`);
    this.initializeForm();

    this.backendService.userLoggedIn.subscribe((res: AuthenticationResponse) => {
      this.router.redirectClearHistory('devices');
      // alert(JSON.stringify(res));
    })
   }

  public redirectRegister(): void {
    this.router.redirectWithCustomAnimation('auth/register', { name: 'fade', duration: 500, curve: 'easeOut' });
  }

  handleLogin(): void {
    this.submitted = true;

    if (this.form.valid) {
      if (this.backendService.isOnline()) {
        let loginCredential: LoginCredential = new LoginCredential();

        loginCredential.username = this.form.value.username;
        loginCredential.password = sha512(this.form.value.password);

        console.log(`login test ${JSON.stringify(loginCredential)}`);

        this.backendService.loginUser(loginCredential);
      } else {
        dialogUtil.alert('Überprüfe deine Internetverbindung!');
      }
    } else {
      dialogUtil.alert('Überprüfe deine Eingaben!').then(() => {
      // Zum Testen der App wird hier, solange der Deployment Server nicht aktiv ist ein Redirect erlaubt 
      this.router.redirectClearHistory('devices');
      
      });
    }

  }

  private initializeForm(): void {
    this.form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
  }
  
  public startBackgroundAnimation(background): void {
    background.animate({
      scale: { x: 1.0, y: 1.0 },
      duration: 10000
    });
  }

}
