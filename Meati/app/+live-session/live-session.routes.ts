import { Routes } from '@angular/router';

import { LiveSessionComponent } from './live-session/live-session.component';
import { CreateGrillProcessComponent } from './create-grill-process/create-grill-process.component';

export const LiveSessionRoutes: Routes = [
    {
        path: '',
        component: LiveSessionComponent
    },
    {
        path: 'create',
        component: CreateGrillProcessComponent
    }
];
