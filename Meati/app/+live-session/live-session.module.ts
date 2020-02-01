import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptRouterModule } from 'nativescript-angular';

import { LiveSessionRoutes } from './live-session.routes';
import { LiveSessionComponent } from './live-session/live-session.component';
import { CreateGrillProcessComponent } from './create-grill-process/create-grill-process.component';

import { UiModule } from './../+ui/ui.module';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forChild(<any>LiveSessionRoutes),
    UiModule
  ],
  declarations: [
  LiveSessionComponent,
  CreateGrillProcessComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class LiveSessionModule { }
