import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptRouterModule } from 'nativescript-angular';
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular";

import { DevicesRoutes } from './devices.routes';
import { DevicesComponent } from './devices/devices.component';

import { UiModule } from './../+ui/ui.module';
import { DetailDeviceComponent } from './devices/detail-device/detail-device.component';
import { DetailDevicePinChartComponent } from './devices/detail-device/detail-device-pin-chart/detail-device-pin-chart.component';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forChild(<any>DevicesRoutes),
    NativeScriptUIListViewModule,
    NativeScriptUIChartModule,
    UiModule
  ],
  declarations: [
    DevicesComponent,
    DetailDeviceComponent,
    DetailDevicePinChartComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class DevicesModule { }
