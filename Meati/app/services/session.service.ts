import { Injectable } from '@angular/core';
import { Timer } from '../model/Timer';
import { GrillSession, ProcessState, Device } from '../shared/transfer-models';
import * as moment from 'moment';
import { BluetoothService } from './bluetooth.service';
import { PresetsService } from './presets.service';
import { BLEPeripheral } from '../model/BLEPeripheral';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { GrillProcess, Pin } from '../model/Session';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SessionService {
  // public timer: Timer = new Timer(); 
  public _currentSession: GrillSession = new GrillSession();
  public _connectedPeripherals: ObservableArray<BLEPeripheral>;

  public _lastEditedGrillProcess: GrillProcess;

  constructor(private http: HttpClient, private bluetoothService: BluetoothService, private presetService: PresetsService) { 
    this._currentSession.sessionStartDate = moment().unix().toString();
    this._currentSession.grillProcesses = [];
    this._currentSession.sessionState = ProcessState.STARTING; // at this point no GrillProcess is created yet

    // pass reference of connected devices
    this._connectedPeripherals = this.bluetoothService._connectedPeripherals;
    this.refreshCurrentSession();
  }

  get grillProcesses(): GrillProcess[] { 
    return this._currentSession.grillProcesses as GrillProcess[]; 
  }

  set grillProcesses(grillProcesses: GrillProcess[]) { 
    this._currentSession.grillProcesses = grillProcesses;
  }

  public pushGrillProcess(grillProcess: GrillProcess) {
    let pushable: boolean = this.grillProcesses
      .filter(gp => gp.device.bluetoothUUID === grillProcess.device.bluetoothUUID && gp.pin.pinNo == grillProcess.pin.pinNo).length > 0 ? false : true;
  
    if (pushable) { 
      this.grillProcesses.push(grillProcess); 
      // session is set to runnice once the first process gets added: 
      if (this._currentSession.sessionState == ProcessState.STARTING) {
        this._currentSession.sessionState = ProcessState.RUNNING;
      }
    }
  }

  public refreshCurrentSession(): void {
    for(let i = 0; i < this._connectedPeripherals.length; i++ ){
      const blePeripheral = this._connectedPeripherals.getItem(i);

      const device = new Device();
      device.bluetoothUUID = blePeripheral.UUID;
      device.deviceName = blePeripheral.name;

      const deviceAdded = this._currentSession.grillProcesses
        .filter(gp => gp.device.bluetoothUUID === device.bluetoothUUID).length > 0 ? true : false;
      
      if (!deviceAdded) {
        if (blePeripheral.tempDataPin1) {
          const gp = new GrillProcess(device, new Pin(1));
          this.pushGrillProcess(gp);
        }
        if (blePeripheral.tempDataPin2) {
          const gp = new GrillProcess(device, new Pin(2));
          this.pushGrillProcess(gp);
        }
        if (blePeripheral.tempDataPin3) {
          const gp = new GrillProcess(device, new Pin(3));
          this.pushGrillProcess(gp);
        }
        if (blePeripheral.tempDataPin4) {
          const gp = new GrillProcess(device, new Pin(4));
          this.pushGrillProcess(gp);
        }
      }
    }
  }

  public updateGrillTime(): void {
    console.log('updateGrillTime fired');
    /*
    this.grillProcesses
      .filter(p => p.grillProcessState == ProcessState.RUNNING)
      .forEach(p => {
        if(p.estimatedGrillTime) {// ESTIMATED is set
          let leftGrillTime: any = moment.unix(Number(p.grillProcessStartDate))
                                          .add(moment(p.estimatedGrillTime, 'kk:mm:ss').unix())
                                          .subtract(moment().unix());
          console.log('time left in unix: ' + leftGrillTime + 'normalized: ' + moment(leftGrillTime, 'kk:mm:ss'));
          console.log(`Estimated GrillTime is set ${p.estimatedGrillTime} - grillProcessStartDate ${p.grillProcessStartDate} - now ${new Date()}`);
          p.currTimeLeft = leftGrillTime;
        }

      })
      */
  }

    /*
    this.http.get<string>(`${BackendService.API_BASE_DOMAIN}/staticpreset/retrieveMultiple`, {headers: headers})
      .subscribe(p => {

    grillProcess // set estimated gt

      console.log(`Received an estimate for GrillTemperatur ${JSON.stringify(p)}`);
    },(error) => {
      console.log(`An error occured during the preset-fetch process ${JSON.stringify(error)}`);
    });
    */
    
  public receiveEstimatedGrillTime(grillProcess: GrillProcess): void {
    grillProcess.estimatedGrillTime = "01:30:12"; // hh:mm:ss or kk:mm:ss
  }
    
}
