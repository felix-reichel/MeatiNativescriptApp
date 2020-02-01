import { Component, OnInit } from '@angular/core';
import { Page } from "ui/page";
import { setPageClasses } from './../../common/page';
import { Router } from '../../common/router';
import { LoadingScreenHelper } from '../../common/dialog-util';
import { LoadingIndicator } from "nativescript-loading-indicator";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { BluetoothService } from '../../services/bluetooth.service';
import { BLEPeripheral } from '../../model/BLEPeripheral';
import * as dialogUtil from './../../common/dialog-util';
import { registerElement } from "nativescript-angular/element-registry";
registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);

@Component({
  selector: 'app-devices',
  moduleId: module.id,
  templateUrl: 'devices.component.html',
  styleUrls: ['../../shared/less/all.css']
})
export class DevicesComponent implements OnInit {
  public connectedDevices: ObservableArray<BLEPeripheral>;
  public availableDevices: ObservableArray<BLEPeripheral>;

  private loader: LoadingIndicator = new LoadingIndicator();

  private shouldBeConnected: boolean = false;

  constructor(private page: Page, private router: Router, private bluetoothService: BluetoothService) { 
    this.availableDevices = bluetoothService._availablePeripherals;
    this.connectedDevices = bluetoothService._connectedPeripherals;
    setPageClasses(page);
  }

  ngOnInit() {

    this.bluetoothService._scanningStarted.subscribe((data) => {
      this.availableDevices = data; // when scanning restarts a new Reference is passed by an Event-Emitter;
    })

    this.bluetoothService.getAvailablePeripherals();

    this.connectedDevices.on("change", (args) => {
      // console.log(`index ${ args.index } - action ${ args.action } - addedCount ${ args.addedCount } - removed ${ args.removed }`);
      this.loader.hide();

      this.shouldBeConnected = true;
    });


  }

  public refresh(): void {
    this.bluetoothService.getAvailablePeripherals(); // manipulates ObservableArray <->
    // console.log('current array ' + JSON.stringify(this.availableDevices));
  }

  public onItemTap(args) {
    this.shouldBeConnected = false;
    this.loader.show(LoadingScreenHelper.minimizedOptions); 
    let index: number = args.index;
    console.log("------------------------ ItemTapped: " + index);
    this.bluetoothService.connectViaPeripheralIndex(index);
    
    setTimeout(() => {
      if (!this.shouldBeConnected) {
        this.loader.hide(); // Hide loader manually
        dialogUtil.alert("Etwas scheint beim Verbinden schiefgelaufen zu sein!");
      }
    }, 4000)
  }

  public redirectToDetail(args): void {
    let index: number = args.index;
    console.log('details tapped for deviceIndex: ' + index);
    this.router.redirectWithCustomAnimation(`devices/detail/${ index }`, { name: 'slideLeft', duration: 300, curve: 'easeOut' });
  }

  refreshList(args) {
    let pullRefresh = args.object;
    setTimeout( () => {
        this.refresh();
       pullRefresh.refreshing = false;
    }, 1000);
  }


}