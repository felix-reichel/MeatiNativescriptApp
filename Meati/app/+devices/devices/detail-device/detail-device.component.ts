import { Component, OnInit, Input, OnDestroy, EventEmitter } from '@angular/core';
import { Page } from "ui/page";
import { setPageClasses } from './../../../common/page';
import { BluetoothService } from '../../../services/bluetooth.service';
import { Router } from '../../../common/router';
import { PageRoute } from "nativescript-angular/router";
import "rxjs/add/operator/switchMap";
import { BLEPeripheral, PinData } from '../../../model/BLEPeripheral';
import { Observable, PropertyChangeData } from 'tns-core-modules/data/observable/observable';
import * as dialogs from "ui/dialogs";
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

@Component({
  moduleId: module.id,
  selector: 'app-detail-device',
  templateUrl: './detail-device.component.html',
  styleUrls: ['../../../shared/less/all.css'],
})
export class DetailDeviceComponent implements OnInit, OnDestroy {

  public id: number;

  public detailDevice: BLEPeripheral;
  
  public temperatureUnit: string = '°C'; // todo: implement Enum for switching Units

  public temp1: string = '-- °C';
  public temp2: string = '-- °C';
  public temp3: string = '-- °C';
  public temp4: string = '-- °C';

  thisPage;
  
  constructor(private page: Page, private pageRoute: PageRoute, private router: Router, private bluetoothService: BluetoothService) { 
    setPageClasses(page);
    
    this.thisPage = page;
    
    // use switchMap to get the latest activatedRoute instance
    this.pageRoute.activatedRoute
      .switchMap(activatedRoute => activatedRoute.params)
      .forEach((params) => { this.id = +params["id"]; });
  }
  
  ngOnDestroy() {
    //complete event stream - do NOT unsubscribe!
    this.detailDevice.onNotifyValue.complete(); 
  }


  ngOnInit() { 
    this.detailDevice = this.bluetoothService._connectedPeripherals.getItem(this.id);

    console.log(`current device UUID ${this.detailDevice.UUID}`);

    this.detailDevice.onNotifyValue = new EventEmitter();

    if (this.detailDevice.tempDataPin4 && this.detailDevice.tempDataPin4.length > 0) {
      this.updatePinLabels();
    }

    this.detailDevice.onNotifyValue.subscribe((event) => {
      console.log("@onNotifyValue Event fired");
      this.updatePinLabels();
    })

    
  }

  private updatePinLabels(): void {
    console.log('update Pin Labels')

    this.temp1 = this.detailDevice.tempDataPin1.getItem(this.detailDevice.tempDataPin1.length-1).value.toString();
    let myLabel = this.thisPage.getViewById("temp1Label");
    myLabel.text = `${this.temp1} ${this.temperatureUnit}`;

    /* experimental */
    this.temp2 = this.detailDevice.tempDataPin2.getItem(this.detailDevice.tempDataPin2.length-1).value.toString();
    let myLabel2 = this.thisPage.getViewById("temp2Label");
    myLabel2.text = `${this.temp2} ${this.temperatureUnit}`;

    this.temp3 = this.detailDevice.tempDataPin3.getItem(this.detailDevice.tempDataPin3.length-1).value.toString();
    let myLabel3 = this.thisPage.getViewById("temp3Label");
    myLabel3.text = `${this.temp3} ${this.temperatureUnit}`;

    this.temp4 = this.detailDevice.tempDataPin4.getItem(this.detailDevice.tempDataPin4.length-1).value.toString();
    let myLabel4 = this.thisPage.getViewById("temp4Label");
    myLabel4.text = `${this.temp4} ${this.temperatureUnit}`;
  }

  disconnect() {
    this.router.redirect('/devices');
    this.bluetoothService.disconnectViaPeripheralIndex(this.id);
  }

  redirectToPinView(pinNo: number): void {
    this.router.redirect(`devices/detail/${ this.id }/${ pinNo }`);   
  }

 changeDeviceName() {
    dialogs.prompt({
      title: "Neuen Gerätenamen eingeben",
      okButtonText: "Ändern",
      cancelButtonText: "Namen beibehalten",
      defaultText: "Dev Meatemp",
      inputType: dialogs.inputType.text
    }).then(r => {
        console.log("Dialog result: " + r.result + ", text: " + r.text);
        if (r.result) this.bluetoothService.writeDeviceName(this.detailDevice.UUID, r.text);
    });
 }

}
