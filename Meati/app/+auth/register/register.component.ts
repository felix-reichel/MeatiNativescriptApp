import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, AuthenticationResponse, SuccessState, ErrorNumber } from '../../shared/transfer-models';
import { BackendService } from '../../services/backend.service';
import { RegisterModel } from '../../model/RegisterModel';
import { genderProvider } from '../../model/GenderProvider';
import * as dialogs from 'ui/dialogs';
import { Page } from "ui/page";
import view = require("ui/core/view");
import { setPageClasses } from './../../common/page';
import { Router } from './../../common/router';
import * as dialogUtil from './../../common/dialog-util';
import { knownFolders } from "file-system";
const sha512 = require('js-sha512');
import * as viewModule from "tns-core-modules/ui/core/view";
import { RadDataForm, CommitMode } from 'nativescript-ui-dataform';
import dataFormModule = require("nativescript-ui-dataform");
import { SegmentedBarItem, SelectedIndexChangedEventData } from "tns-core-modules/ui/segmented-bar";

@Component({
  moduleId: module.id,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../shared/less/all.css']
})
export class RegisterComponent implements OnInit {
  public _user: RegisterModel;
  public _dataform: RadDataForm;
  public _commitMode = CommitMode.Immediate;
  public _genderProvider = genderProvider;

  constructor(private page: Page, private http: HttpClient, private backendService: BackendService, private router: Router) {
    setPageClasses(page);
  }

  ngOnInit() {
    this._user = new RegisterModel();
    this._dataform = <RadDataForm>viewModule.getViewById(this.page, "myDataForm");

    this.backendService.userRegistered.subscribe((res: AuthenticationResponse) => {
      const state: string = res.state.toString();

      if (state === SuccessState[SuccessState.SUCCESS]) {
        this.backendService.token = res.token;

        dialogUtil.alertAuthenticationResponse(res);

        dialogs.alert({
          title: 'Du wurdest registriert!',
          message: 'Wir haben dir einen Bestätigungslink per E-Mail zugesendet, bitte bestätige diesen um dich einzuloggen!',
          okButtonText: 'Okay, mache ich gerne'
        }).then(function () {
          this.router.redirect('/auth/login');
        });

      } else if (state === SuccessState[SuccessState.FAILURE]) {
        let errorMessage: string;

        switch (res.error.toString()) {
          case ErrorNumber[ErrorNumber.EMAIL_OR_USERNAME_ALREADY_IN_USE]:
            errorMessage = 'Deine E-Mail-Adresse oder Benutzername scheint bereits in Verwendung zu sein!';
            break;
          case ErrorNumber[ErrorNumber.INVALID_DATA]:
            errorMessage = 'Deine eingegebenen Daten stimmen nicht!';
            break;
          case ErrorNumber[ErrorNumber.TOKEN_FAILURE]:
            errorMessage = 'Wir konnten deinen Benutzer-Token nicht anlegen! Versuche es später nochmal.';
            break;
          case ErrorNumber[ErrorNumber.NO_ERROR]:
            errorMessage = 'Versuche es später nochmal.';
            break;
        }

        dialogs.alert({
          title: 'Oje! Etwas ist schiefgelaufen',
          message: errorMessage,
          okButtonText: 'Schließen'
        }).then(function () {
          console.log('Dialog closed!');
        });
      }
    })
  }

  public onLoaded(): void { }

  public redirectToLogin(): void {
    this.router.routerExtensions.back();
   }

  public registerTest(): void {
    const registerUser: User = new User();

    registerUser.firstname = 'Felix';
    registerUser.lastname = 'Reichel';
    registerUser.dateOfBirth = '2000-01-17';
    registerUser.username = 'freichel';
    registerUser.email = 'f.reichel@gmx.at';
    registerUser.gender = 'M';
    registerUser.password = 'pw';

    if (this.backendService.isOnline()) {
      this.backendService.registerUser(registerUser);
    }
  }

  public handleRegister(): void {
    if (!this._dataform.hasValidationErrors()) {
      if (this.backendService.isOnline()) {
        const registerUser: User = new User();

        registerUser.firstname = this._user.firstname;
        registerUser.lastname = this._user.lastname;
        registerUser.dateOfBirth = this._user.dateOfBirth;
        registerUser.username = this._user.username;
        registerUser.email = this._user.email;
        registerUser.gender = this._user.gender;
        registerUser.password = sha512(this._user.password);

        this.backendService.registerUser(registerUser);
      } else if (!this.backendService.isOnline()) {
        dialogs.alert({
          title: 'Überprüfe deine Internetverbindung!',
          message: '',
          okButtonText: 'Ok'
        });
      }

    } else if (this._dataform.hasValidationErrors()) {
      dialogs.alert({
        title: 'Deine Eingaben sind nicht korrekt!',
        message: '',
        okButtonText: 'Ok'
      });
    }
  }

  public onPropertyCommitted(): void { }

  public onPropertyValidate(args): void {
    let validationResult: boolean = true;

    if (args.propertyName == "password2") {
      let dataForm = args.object;
      let password1 = dataForm.getPropertyByName("password");
      let password2 = args.entityProperty;
      if (password1.valueCandidate != password2.valueCandidate) {
        password2.errorMessage = "Passwörter stimmen nicht überein.";
        validationResult = false;
      }
    }

    args.returnValue = validationResult;
  }

  public onPropertyValidated(args): void {
    let propertyName = args.propertyName;
    let validatedValue = args.entityProperty.valueCandidate;
    let validationResult = args.entityProperty.isValid;

    if (propertyName == "password") {
      let dataForm = args.object;
      let password2 = dataForm.getPropertyByName("password2");
      let password1 = args.entityProperty;
      if (password2.valueCandidate != "") {
        if (password1.valueCandidate != password2.valueCandidate) {
          dataForm.notifyValidated("password2", false);
        } else {
          dataForm.notifyValidated("password2", true);
        }
      }
    }
  }

}