import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptRouterModule } from 'nativescript-angular';
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { PresetsRoutes } from './presets.routes';
import { PresetsComponent } from './presets/presets.component';
import { PresetListComponent } from './presets/preset-list/preset-list.component';
import { PresetDetailComponent } from './presets/preset-detail/preset-detail.component';

import { UiModule } from './../+ui/ui.module';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptUIListViewModule,
    NativeScriptRouterModule.forChild(<any>PresetsRoutes),
    UiModule
  ],
  declarations: [
  PresetsComponent,
  PresetListComponent,
  PresetDetailComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class PresetsModule { }
