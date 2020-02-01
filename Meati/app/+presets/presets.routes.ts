import { Routes } from '@angular/router';

import { PresetsComponent } from './presets/presets.component';
import { PresetListComponent } from './presets/preset-list/preset-list.component';
import { PresetDetailComponent } from './presets/preset-detail/preset-detail.component';

export const PresetsRoutes: Routes = [
    {
        path: '',
        component: PresetsComponent
    },
    {
        path: 'presetList/:categoryId',
        component: PresetListComponent
    },
    {
        path: 'presetDetails/:categoryEnumId/:presetId',
        component: PresetDetailComponent
    }
];
