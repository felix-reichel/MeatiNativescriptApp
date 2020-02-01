import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptRouterModule } from 'nativescript-angular';

import { ProfileRoutes } from './profile.routes';
import { ProfileComponent } from './profile/profile.component';

import { UiModule } from './../+ui/ui.module';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forChild(<any>ProfileRoutes),
    UiModule
  ],
  declarations: [
  ProfileComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ProfileModule { }
