import { Component, OnInit } from '@angular/core';
import { Page, Color } from "ui/page";
import { Switch } from "ui/switch"; 
import { ListPicker } from "ui/list-picker";
import { Router } from './../../common/router';
import { setPageClasses } from './../../common/page';
import { BackendService } from '../../services/backend.service';
import { UserService } from '../../services/user.service';
import { UserSettings, TemperatureMode } from '../../shared/transfer-models';

@Component({
  selector: 'app-settings',
  moduleId: module.id,
  templateUrl: 'settings.component.html',
  styleUrls: ['../../shared/less/all.css'],
})
export class SettingsComponent implements OnInit {

  public temperatureUnits: string[] = ["Celsius °C", "Fahrenheit °F"]; 

  public currentUserSettings: UserSettings = new UserSettings();

  constructor(private page: Page, private backend: BackendService, private userService: UserService, public router: Router) {
    setPageClasses(page);
  }

  ngOnInit() {
    this.currentUserSettings = this.userService.currentUserSettings;
    console.log(`current user settings ${JSON.stringify(this.currentUserSettings)}`);
  }

  /* 
    TO-DO: Fix code duplication -> Generic Function ...
  */
  public onChecked1(args) {
    let firstSwitch = <Switch>args.object;
    if (firstSwitch.checked) {
        firstSwitch.backgroundColor = "#FB6149";
        this.currentUserSettings.sendNotifications = true;

    } else {
        firstSwitch.backgroundColor = "#000000";
        this.currentUserSettings.sendNotifications = false;
    }
    this.userService.currentUserSettings = this.currentUserSettings;
  }

  public onChecked2(args) {
    let secondSwitch = <Switch>args.object;
    if (secondSwitch.checked) {
        secondSwitch.backgroundColor = "#FB6149";
        this.currentUserSettings.autoConnectWithKnownDevices = true;
    } else {
        secondSwitch.backgroundColor = "#000000";
        this.currentUserSettings.autoConnectWithKnownDevices = false;
    }
    this.userService.currentUserSettings = this.currentUserSettings;
  }

  public onChecked3(args) {
    let secondSwitch = <Switch>args.object;
    if (secondSwitch.checked) {
        secondSwitch.backgroundColor = "#FB6149";
        this.currentUserSettings.alarmOnHardware = true;
    } else {
        secondSwitch.backgroundColor = "#000000";
        this.currentUserSettings.alarmOnHardware = false;
    }
    this.userService.currentUserSettings = this.currentUserSettings;
  }

  public selectedIndexChanged(args) {
    let listPicker = <ListPicker>args.object;
    if (listPicker.selectedIndex == 0) {
      // dropped in DTO Model
                // this.currentUserSettings.temperatureMode = TemperatureMode.CELSIUS;
    }
    else if (listPicker.selectedIndex == 1) {
      // dropped in DTO Model
                // this.currentUserSettings.temperatureMode = TemperatureMode.FAHRENHEIT;
    }
    this.userService.currentUserSettings = this.currentUserSettings;

  }

  public getSelectedIndex(): number {
    /*
    if (TemperatureMode[this.currentUserSettings.temperatureMode] === 'CELSIUS') {
      return 0;
    } else {
      return 1;
    }
    */
    return 0;
  }

  public redirectProfile() {
    this.router.redirect('profile');
  }

  public logOff() {
    this.backend.logOffUser();
    this.userService.resetStorage();
    this.router.redirect('auth');
  }



}
