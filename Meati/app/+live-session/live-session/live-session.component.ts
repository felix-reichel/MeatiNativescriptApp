import { Component, OnInit } from '@angular/core';
import { Page } from "ui/page";
import { setPageClasses } from './../../common/page';
import { Router } from './../../common/router';
import { BluetoothService } from '../../services/bluetooth.service';
import { SessionService } from '../../services/session.service';
import * as dialogs from "ui/dialogs";
import { inputType, PromptResult } from 'ui/dialogs';
import { GrillSession, ProcessState, BbqItemDoneness } from '../../shared/transfer-models';
import { BLEPeripheral } from '../../model/BLEPeripheral';
import { GrillProcess } from '../../model/Session';
const Observable = require("tns-core-modules/data/observable").Observable;
import { setInterval, clearInterval } from "timer";
import * as moment from 'moment';

@Component({
  selector: 'app-live-session',
  moduleId: module.id,
  templateUrl: 'live-session.component.html',
  styleUrls: ['../../shared/less/all.css']
})
export class LiveSessionComponent implements OnInit {

  public noDevicesConnected: boolean = true;

  public grillSession: GrillSession;

  public currentDevice: BLEPeripheral;

  constructor(private page: Page, private router: Router, private bluetoothService: BluetoothService, private sessionService: SessionService) {
    setPageClasses(page);
  }

  ngOnInit() { 
    this.sessionService.refreshCurrentSession();
    this.grillSession = this.sessionService._currentSession;
    // console.log(`Current session loaded: ${JSON.stringify(this.grillSession)}`);

    this.grillSession.grillProcesses.forEach(e => {
      console.log(`reading gp: ${JSON.stringify(e)}`)
    });


    if (this.bluetoothService._connectedPeripherals.length > 0) {
      this.noDevicesConnected = false
    }

    // set up the initial values for the progress components
    const vm = new Observable();
    vm.set("progressValue", 10);
    vm.set("progressMaxValue", 100);
    setInterval(() => {
        const value = vm.get("progressValue");
        vm.set("progressValue", value + 2);
    }, 300);
    this.page.bindingContext = vm;

    setInterval(() => {
      this.sessionService.updateGrillTime();
    }, 1000);

  }

  // handle value change
  public onProgressLoaded(args) {
    const sliderComponent = args.object;
    sliderComponent.on("valueChange", (pargs) => {
        console.log(`Old Value: ${pargs.oldValue}`);
        console.log(`New Value: ${pargs.value}`);
  });
  }

  public addTimerSubject() {
    console.log('hmm');
  }

  public createGrillProcess(grillProcess: GrillProcess) {
    this.sessionService._lastEditedGrillProcess = grillProcess;
    this.router.redirectWithCustomAnimation('meati/create', { name: 'slideLeft', duration: 300, curve: 'easeOut' });
  }

  public isRunning(grillProcess: GrillProcess): boolean {
    return grillProcess.grillProcessState.valueOf() === ProcessState.RUNNING.valueOf() ? true : false;
  }

  public getCurrentPinTemperatureByGrillProcess(grillProcess: GrillProcess) {
    let result: string = '-- °C';
    
    this.currentDevice = this.bluetoothService._connectedPeripherals
      .filter(device => device.UUID === grillProcess.device.bluetoothUUID)[0];

    switch (grillProcess.pin.pinNo) {
      case 1:
        result = `${this.currentDevice.tempDataPin1.getItem(this.currentDevice.tempDataPin1.length - 1).value} °C`;
        break;
      case 2:
        result = `${this.currentDevice.tempDataPin2.getItem(this.currentDevice.tempDataPin2.length - 1).value} °C`;
        break;
      case 3:
        result = `${this.currentDevice.tempDataPin3.getItem(this.currentDevice.tempDataPin3.length - 1).value} °C`;
        break;
      case 4:
        result = `${this.currentDevice.tempDataPin4.getItem(this.currentDevice.tempDataPin4.length - 1).value} °C`;
        break;
      default:
        result = `${this.currentDevice.tempDataPin1.getItem(this.currentDevice.tempDataPin1.length - 1).value} °C`;
        break;
    }
    return result;
  }

  getGrillCookingLevelByGrillProcess(grillProcess: GrillProcess): string {
    switch (grillProcess.preset.doneness) {
      case BbqItemDoneness.RARE:
        return 'RARE';
      case BbqItemDoneness.MEDIUM_RARE:
        return 'MEDIUM RARE';
      case BbqItemDoneness.MEDIUM:
       return 'MEDIUM';
      case BbqItemDoneness.WELL_DONE:
       return 'WELL DONE';
      case BbqItemDoneness.CUSTOM_TEMP:
       return 'CUSTOM';
    }
  }

  public getGrillTime(grillProcess: GrillProcess): any {
    if(grillProcess.estimatedGrillTime) {// ESTIMATED is set
      let estimate: any = moment(grillProcess.estimatedGrillTime, 'kk:mm:ss');
      let now : any = moment();
      let leftGrillTime: any = moment(grillProcess.grillProcessStartDate).add(estimate).subtract(now).format('kk:mm:ss');
      console.log('time left in unix: ' + leftGrillTime + 'normalized: ' + moment(leftGrillTime).format('kk:mm:ss'));
      console.log(`Estimated GrillTime is set ${grillProcess.estimatedGrillTime} - grillProcessStartDate ${grillProcess.grillProcessStartDate} - now ${new Date()}`);
      grillProcess.currTimeLeft = leftGrillTime;
      return 'Restzeit: ' + leftGrillTime.toString();
    }


  }

}
