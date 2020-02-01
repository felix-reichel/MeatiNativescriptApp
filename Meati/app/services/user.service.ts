import { Injectable } from '@angular/core';
import { User, UserSettings, GrillSession, ProcessState, GrillProcess, StaticPreset, ConfiguredPreset } from "../shared/transfer-models";
import * as moment from 'moment';
import * as applicationSettings from 'application-settings';

@Injectable()
export class UserService {
  private _currentUser: User = new User();

  constructor() {
    this.exampleInit();
    /*  
      TO-DO:
      =====
      *) Per Token die aktuellen User Daten anfordern

    */

    this.readFromStorage();
  }

  get currentUser(): User {
    return this._currentUser;
  }

  set currentUser(user: User) {
      this._currentUser = user;
      this.storeToStorage();
  }

  get currentUserSettings(): UserSettings {
    return this._currentUser.userSettings;
  }

  set currentUserSettings(settings: UserSettings) {
      this._currentUser.userSettings = settings;
      this.storeToStorage();
  }

  get allSessions(): GrillSession[] {
      return this._currentUser.sessions;
  }

  private storeToStorage(): void {
    applicationSettings.setString("currentUser", JSON.stringify(this._currentUser)); 
  }

  private readFromStorage(): void {
    if (applicationSettings.getString("currentUser")) {
        this._currentUser = JSON.parse(applicationSettings.getString("currentUser")) as User;
        console.log(`loaded user from local storage ${JSON.stringify(this._currentUser)}`);
    }
  }

  syncWithApi() { }

  restoreFromApi() { }

  resetStorage() { }

  exampleInit() {
    this.currentUser.username = 'felixr';
    this.currentUser.firstname = 'Felix';
    this._currentUser.lastname = 'Reichel';
    this._currentUser.dateOfBirth = '17.01.2000';
    this._currentUser.email = 'f.reichel@gmx.at';
    this.currentUser.password = 'secret';

    const session = new GrillSession();
    session.sessionStartDate = moment().unix().toString();
    session.sessionState = ProcessState.RUNNING;
    session.grillProcesses = [];

    const gp = new GrillProcess();
    gp.preset = new ConfiguredPreset();
    gp.preset.preset = new StaticPreset();
    gp.preset.preset.presetName = 'Crispy Chicken 2';

    session.grillProcesses.push(gp);
    this.currentUser.sessions.push(session);

    this.storeToStorage();
  }

}
