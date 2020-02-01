import { Routes } from '@angular/router';

import { DevicesComponent } from './devices/devices.component';
import { DetailDeviceComponent } from './devices/detail-device/detail-device.component';
import { DetailDevicePinChartComponent } from './devices/detail-device/detail-device-pin-chart/detail-device-pin-chart.component';

export const DevicesRoutes: Routes = [
    {
        path: '',
        component: DevicesComponent
    },
    {
        path: 'detail/:id',
        component: DetailDeviceComponent
    },
    {
        path: 'detail/:id/:pinNo',
        component: DetailDevicePinChartComponent
    }
];
