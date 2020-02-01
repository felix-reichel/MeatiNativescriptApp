import { Injectable, Output, EventEmitter } from '@angular/core';
import { Device } from './../shared/transfer-models'; // object which a Peripheral maps to
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { PinData, BLEPeripheral } from '../model/BLEPeripheral';
import { Observable } from 'tns-core-modules/data/observable';
import * as moment from 'moment';
const bluetooth = require('nativescript-bluetooth');
const dialogs = require('tns-core-modules/ui/dialogs');

@Injectable()
export class BluetoothService {
  public _availablePeripherals: ObservableArray<BLEPeripheral> = new ObservableArray<BLEPeripheral>(); // holds diff of available - connected                                              ;
  public _connectedPeripherals: ObservableArray<BLEPeripheral> = new ObservableArray<BLEPeripheral>(); //

  @Output() public _scanningStarted: EventEmitter<ObservableArray<BLEPeripheral>> = new EventEmitter();

  public static CONFIGURATION_SERVICE_UUID: string = 'a0af711b-9201-4f58-b24b-d9829fc30f62';
  public static TEMPERATE_SERVICE_UUID: string = '246201bb-c080-483a-bb30-3724f53c9776';
  public static BATTERY_SERVICE_UUID: string = 'abe2fcda-3f87-4099-b48c-6e9db46e6743';

  public static CONFIGURATION_CHARACTERISTIC_BLENAME_UUID: string = 'b5355a04-6889-48ec-bd64-2a3c30d423c5';
  public static TEMPERATURE_CHARACTERISTIC_FIRST_UUID: string = '66cd850f-130a-4368-83e8-8daaad418f2a';
  public static TEMPERATURE_CHARACTERISTIC_SECOND_UUID: string = '4d8d48e1-bbcf-4337-bf2b-e235a900ffea';
  public static TEMPERATURE_CHARACTERISTIC_THIRD_UUID: string = '77b7f4bb-903d-4f13-9b2e-71ff8391edc3';
  public static TEMPERATURE_CHARACTERISTIC_FOURTH_UUID: string = 'ed149492-8368-4484-b71d-12caa6379194';
  public static TEMPERATURE_CHARACTERISTIC_GENERAL_UUID: string = 'e1401643-ae6d-4815-bcd6-7cf55b42b429';

  constructor() { }

  public isBluetoothEnabled(): boolean {
    return bluetooth.isBluetoothEnabled().then((enabled) => {
      return enabled;
    });
  }

  public pushToAvailablePeripherals(peripheral: BLEPeripheral) { 
     if (this._availablePeripherals.filter(p => p.UUID === peripheral.UUID).length === 0) {
        this._availablePeripherals.push(peripheral);
      }
  }

  public pushToConnectedPeripherals(peripheral: BLEPeripheral) {
    if (this._connectedPeripherals.filter(p => p.UUID === peripheral.UUID).length === 0) {
      this._connectedPeripherals.push(peripheral);
    }
  }

  public getAvailablePeripherals(): void {
    this._availablePeripherals = new ObservableArray<BLEPeripheral>();
    this._scanningStarted.emit(this._availablePeripherals);

    bluetooth.startScanning({
      serviceUUIDs: [], // not knowing services at this point
      seconds: 1,
      onDiscovered: (peripheral) => {
        if (peripheral.name == undefined || peripheral.name == null || peripheral.name == '') {
          peripheral.name = 'Unknown Device';
        }
        console.log(`Peripheral was found: ${peripheral.name} - UUID: ${peripheral.UUID} - RSSI: ${peripheral.RSSI} - Services: ${peripheral.services}`);
        console.log(`Peripheral JSON: ${ JSON.stringify(peripheral) }`);
        if (peripheral.name.includes('Meatemp')) { // find a better way!
          this.pushToAvailablePeripherals(<BLEPeripheral>peripheral);
        }
      }
    }).then(() => { console.log('scanning complete'); }, 
      (err) => { console.log(`error while scanning: ${err}`);
    });
  }

  public connectViaPeripheralIndex(index: number): void {
    bluetooth.connect({
      UUID: this._availablePeripherals.getItem(index).UUID,
      onConnected: (peripheral) => {
        this.pushToConnectedPeripherals(this.peripheralToBLEPeripheral(peripheral));
        console.log(`Connected Peripheral: ${JSON.stringify(peripheral)}`);
        this._availablePeripherals.splice(index, 1);
        this.getAllPinsTemperatureEventStream(peripheral.UUID);
        // this.getPinTemperaturEventStream(peripheral.UUID,1);
        // this.getPinTemperaturEventStream(peripheral.UUID,2);
      }, onDisconnected: (peripheral) => {
        let indexWhilstConnected: number = this._connectedPeripherals.indexOf(peripheral);
        this._connectedPeripherals.splice(indexWhilstConnected, 1);
        this.getAvailablePeripherals();

        const alertOptions = {
          title: 'Verbindung zum Meatemp wurde unerwartet getrennt',
          message: 'Überprüfe gegebenenfalls deine Bluetooth-Einstellungen',
          okButtonText: 'Schließen',
          cancelable: true // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
        };
      
        dialogs.alert(alertOptions).then(() => {
            console.log('Dialog closed! @disconnect-occured');
        });
      }
    });
  }

  public disconnectViaPeripheralIndex(index: number): void {
    bluetooth.disconnect({
      UUID: this._connectedPeripherals.getItem(index).UUID
    }).then(() => { 
      console.log('disconnected successfully' ); 
      const alertOptions = {
        title: `Verbindung wurde zu ${this._connectedPeripherals.getItem(index).name} wurde erfolgreich getrennt!`,
        okButtonText: 'Ok',
        cancelable: true // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
      };
      dialogs.alert(alertOptions).then(() => { 
        console.log('Dialog closed! @disconnect-successfully'); 
      });
    },
    (err) => {
      console.log('disconnection error: ' + err ); 
      const alertOptions = {
        title: `Verbindung ${this._connectedPeripherals.getItem(index).name} konnte nicht richtig getrennt werden!`,
        message: 'Starte eventuell die App oder das Meatemp neu...',
        okButtonText: 'Schließen',
        cancelable: true // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
      };
      dialogs.alert(alertOptions).then(() => {
          console.log('Dialog closed! @disconnect-error');
      });
    }); 
  }

  public testRead(peripheralUUID, serviceUUID, characteristicUUID): void {
    bluetooth.read({
      peripheralUUID: peripheralUUID,
      serviceUUID: serviceUUID,
      characteristicUUID: characteristicUUID
    }).then((result) => {
      let data: Uint8Array = new Uint8Array(result.value);
      console.log(`TEST READ Value ${ JSON.stringify(result)}`);  
    }, (err) => {
      console.log('READ error: ' + err);
    });
  }
  
  public getPinTemperaturEventStream(peripheralUUID: string, pinNo: number): void {
    bluetooth.startNotifying({
      peripheralUUID: peripheralUUID,
      serviceUUID: BluetoothService.TEMPERATE_SERVICE_UUID,
      characteristicUUID: this.getCharacteristicUUIDByPinNo(1),
      onNotify: (result) => {
        try {
            var data = new Uint8Array(result.value);
        } catch(e) {
          console.log(`notify value not readable: ${e.message}`);
        }
        let realTemperature: number = this.bleDataToNumericValue(data);
        let index: number = this._connectedPeripherals.indexOf(this._connectedPeripherals.filter(p => p.UUID === peripheralUUID)[0]);
        let currentDevice: BLEPeripheral = this._connectedPeripherals.getItem(index);

        /*
          to-do: If-Clauses like getAllPinsTemperatureEventStream()
        */
        switch(pinNo) {
          case 1:
            let c1: boolean = true;
            let l1: number = currentDevice.tempDataPin1.length;
            if  (l1 > 0 && currentDevice.tempDataPin1.getItem(l1 - 1).value == realTemperature) { // when list > 0 and prevVal == actVal
              c1 = false;
            }
            if (c1) { 
              currentDevice.tempDataPin1.push(new PinData(moment().unix(), moment().format('LTS'), realTemperature));
              console.log(`Pin 1 notify value ${realTemperature}`) };
            break;
          case 2:
            let l2: number = currentDevice.tempDataPin2.length;
            if (!(l2 > 0 && currentDevice.tempDataPin2.getItem(l2 - 1).value != realTemperature)) {
              currentDevice.tempDataPin2.push(new PinData(moment().unix(), moment().format('LTS'), realTemperature));
              console.log(`Pin 2 notify value ${realTemperature}`);
            }
          case 3:
            let l3: number = currentDevice.tempDataPin3.length;
            if (!(l3 > 0 && currentDevice.tempDataPin3.getItem(l3 - 1).value != realTemperature)) {
              currentDevice.tempDataPin3.push(new PinData(moment().unix(), moment().format('LTS'), realTemperature));
            }
          case 4:
            let l4: number = currentDevice.tempDataPin4.length;
            if (!(l4 > 0 && currentDevice.tempDataPin4.getItem(l4 - 1).value != realTemperature)) {
              currentDevice.tempDataPin4.push(new PinData(moment().unix(), moment().format('LTS'), realTemperature));
            }
            break;
          default:
            console.log('Error at BLEService.getPinTemperaturEventStream');
            break;
        } 
        currentDevice.onNotifyValue.emit({});
        this._connectedPeripherals.setItem(index,currentDevice);
      }  
    }).then(() => {
      console.log('subscribed for notifications');
  });
}

public getAllPinsTemperatureEventStream(peripheralUUID: string): void {
  bluetooth.startNotifying({
    peripheralUUID: peripheralUUID,
    serviceUUID: BluetoothService.TEMPERATE_SERVICE_UUID,
    characteristicUUID: BluetoothService.TEMPERATURE_CHARACTERISTIC_GENERAL_UUID,
    onNotify: (result) => {
      try {
          var data = new Uint8Array(result.value);
          // console.log(JSON.stringify(data));
      } catch(e) {
        console.log(`notify value not readable: ${e.message}`);
      }
      let tempArr: number[] = this.multipleBleDataToNumericArray(data); // '0':'59' -> [99, 122, -99, 12];
      let index: number = this._connectedPeripherals.indexOf(this._connectedPeripherals.filter(p => p.UUID === peripheralUUID)[0]);
      let currentDevice: BLEPeripheral = this._connectedPeripherals.getItem(index);

      /* Use LOOP */ 
          let c1: boolean = true;
          let l1: number = currentDevice.tempDataPin1.length;
          if  (l1 > 0 && currentDevice.tempDataPin1.getItem(l1 - 1).value == tempArr[0]) { // when list > 0 and prevVal == actVal
            c1 = false;
          }
          if (c1) { 
            currentDevice.tempDataPin1.push(new PinData(moment().unix(), moment().format('LTS'), tempArr[0]));
            // console.log(`Pin > 1 notify value ${tempArr[0]}`) 
          };

          let l2: number = currentDevice.tempDataPin2.length;
          if (!(l2 > 0 && currentDevice.tempDataPin2.getItem(l2 - 1).value == tempArr[1])) {
            currentDevice.tempDataPin2.push(new PinData(moment().unix(), moment().format('LTS'), tempArr[1]));
            // console.log(`Pin > 2 notify value ${tempArr[1]}`);
          }

          let l3: number = currentDevice.tempDataPin3.length;
          if (!(l3 > 0 && currentDevice.tempDataPin3.getItem(l3 - 1).value == tempArr[2])) {
            currentDevice.tempDataPin3.push(new PinData(moment().unix(), moment().format('LTS'), tempArr[2]));
            // console.log(`Pin > 3 notify value ${tempArr[2]}`);
          }

          let l4: number = currentDevice.tempDataPin4.length;
          if (!(l4 > 0 && currentDevice.tempDataPin4.getItem(l4 - 1).value == tempArr[3])) {
            currentDevice.tempDataPin4.push(new PinData(moment().unix(), moment().format('LTS'), tempArr[3]));
            // console.log(`Pin > 4 notify value ${tempArr[3]}`);
          }

      currentDevice.onNotifyValue.emit({});
      this._connectedPeripherals.setItem(index,currentDevice);
    } 
  }).then(() => {
    console.log('subscribed for notifications');
});
}

  private getCharacteristicUUIDByPinNo(pinNo: number): string {
    switch (pinNo) {
      case 1:
        return BluetoothService.TEMPERATURE_CHARACTERISTIC_FIRST_UUID;
      case 2:
        return BluetoothService.TEMPERATURE_CHARACTERISTIC_SECOND_UUID;
      case 3: 
        return BluetoothService.TEMPERATURE_CHARACTERISTIC_THIRD_UUID;
      case 4:
        return BluetoothService.TEMPERATURE_CHARACTERISTIC_FOURTH_UUID;
      default:
        return BluetoothService.TEMPERATURE_CHARACTERISTIC_FIRST_UUID;
    }
  }

  public writeDeviceName(peripheralUUID: string, deviceName: string) {
    let newDeviceName = this.string_to_hexa(deviceName);
    console.log(`changing peripheral name to ... ${newDeviceName}`);
    bluetooth.write({
      peripheralUUID: peripheralUUID,
      serviceUUID: BluetoothService.CONFIGURATION_SERVICE_UUID,
      characteristicUUID: BluetoothService.CONFIGURATION_CHARACTERISTIC_BLENAME_UUID,
      value: newDeviceName       // e.g.'0x44, 0x65, 0x76, 0x20, 0x54 ,0x65 ,0x73 ,0x74 ,0x20 ,0x4d ,0x65 ,0x61 ,0x74 ,0x65 ,0x6d ,0x70'
    }).then((result) => {
      console.log('value written');
    }, (err) => {
      console.log(`write error: ${err}`);
    });
  }

  /*
  * Get temperatur data by uuid and pinNo 
  */
  public temperatureReference(peripheralUUID: string, pinNo: number): any { // returning ?optionals
    let index: number = this._connectedPeripherals.indexOf(this._connectedPeripherals.filter(p => p.UUID === peripheralUUID)[0]);
    let currentDevice: BLEPeripheral = this._connectedPeripherals.getItem(index);

    /* multiple returns -> bad practice! */
    switch (pinNo) {
      case 1:
        return currentDevice.tempDataPin1;
      case 2:
        return currentDevice.tempDataPin2;
      case 3:
        return currentDevice.tempDataPin3;
      case 4:
        return currentDevice.tempDataPin4;
      default:
        return currentDevice.tempDataPin1;
    }
  } 


  /*
   *   Helpers for BLE string decoding/encoding
  */
  private ascii_to_hexa(str): string {
    let arr1 = [];
	  for (var n = 0, l = str.length; n < l; n ++) {
      let hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return arr1.join('');
  }

  private string_to_hexa(str): string {
    let result: string = '';
    for (let i = 0; i < str.length; i++) { 
      if (i == 0) {
        result += ('0x') + this.ascii_to_hexa(str.charAt(i).toString());
      } else if (i > 0) {
        result += (', 0x') + this.ascii_to_hexa(str.charAt(i).toString());
      }
    }
    return result;
  }

  private string_to_asciiCode(str: string): number {   // 'A' -> 65
    let result: string = '';
    for (let i = 0; i < str.length; i++) { 
        result += this.ascii_to_hexa(str.charAt(i).toString());
    }
    return Number(result);
  }

  private multipleBleDataToNumericArray(bleData): number[] {
    let res: number[] = [-99, -99, -99, -99];
    let helper: number = 0;
    let delemiter: string = ';';
    let delemiterAsciiCode: number = this.string_to_asciiCode(delemiter);
    let currBleData: number[] = [];

    for (let i = 0; i < bleData.length; i++) {

      if (bleData[i] == 59) {
        res[helper] = this.bleDataToNumericValue(currBleData);
        currBleData = [];
        helper++;
      } else if (bleData[i] != 59) {
        currBleData.push(bleData[i]);
      }
      if (helper == 3) {
        res[helper] = this.bleDataToNumericValue(currBleData);
      }
    }
    return res;

  }
  private bleDataToNumericValue(bleData): number {
    let check1: boolean = bleData[0] && bleData[0] !== undefined;
    let check2: boolean = bleData[1] && bleData[1] !== undefined;
    let res = -1;
    if (check1 && check2) {
      res = Number(String.fromCharCode(bleData[0]) + String.fromCharCode(bleData[1]));
    } 
    else if (check1 && !check2) {
      res = Number(String.fromCharCode(bleData[0]));
    }
    return res;
  }

  private peripheralToBLEPeripheral(peripheral: any): BLEPeripheral {
    let result: BLEPeripheral = new BLEPeripheral(
      peripheral.type, 
      peripheral.UUID, 
      peripheral.name, 
      peripheral.RSSI, 
      peripheral.state, 
      peripheral.advertisement,
      peripheral.manufacturerId,
      peripheral.manufacturerData, 
      peripheral.services);
    
    // console.log('create BLEPeripheral Entity: ' + console.log(JSON.stringify(result)));

    return result;
  }

}