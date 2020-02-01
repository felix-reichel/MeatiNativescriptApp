import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { PinData, BLEPeripheral } from '../../../../model/BLEPeripheral';
import { setPageClasses } from '../../../../common/page';
import { PageRoute } from 'nativescript-angular';
import { Page } from 'tns-core-modules/ui/page/page';
import { Router } from '../../../../common/router';
import { BluetoothService } from '../../../../services/bluetooth.service';

@Component({
  moduleId: module.id,
  selector: 'app-detail-device-pin-chart',
  templateUrl: './detail-device-pin-chart.component.html',
  styleUrls: ['../../../../shared/less/all.css']
})
export class DetailDevicePinChartComponent implements OnInit, OnDestroy {
  
  private _categoricalSource: ObservableArray<PinData> = new ObservableArray<PinData>();

  // path params
  public id: number
  public pinNo: number;

  public detailDevice: BLEPeripheral;

  constructor(private page: Page, private pageRoute: PageRoute, private router: Router, private bluetoothService: BluetoothService) { 
    setPageClasses(page);
    
    // use switchMap to get the latest activatedRoute instance
    this.pageRoute.activatedRoute
      .switchMap(activatedRoute => activatedRoute.params)
      .forEach((params) => { 
        this.pinNo = +params['pinNo']
        this.id = +params['id']; 
      });
  }

  get categoricalSource(): ObservableArray<PinData> {
    return this._categoricalSource;
  }
  
  ngOnDestroy() { }


  ngOnInit() { 
    this.detailDevice = this.bluetoothService._connectedPeripherals.getItem(this.id);

    switch(this.pinNo) {
      case 1:
        this._categoricalSource = this.detailDevice.tempDataPin1;
        break;
      case 2:
        this._categoricalSource = this.detailDevice.tempDataPin2;
        break;
      case 3: 
        this._categoricalSource = this.detailDevice.tempDataPin3;
        break;
      case 4:
        this._categoricalSource = this.detailDevice.tempDataPin4;
        break;
      default:
        this._categoricalSource = this.detailDevice.tempDataPin1;
        break;
    
    }


  }

}
