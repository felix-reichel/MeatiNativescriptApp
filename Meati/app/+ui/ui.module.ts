import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptRouterModule } from 'nativescript-angular';

import { UiRoutes } from './ui.routes';

import { MeatiActionbarComponent } from './ui/meati-actionbar/meati-actionbar.component';
import { MeatiNavbarComponent } from './ui/meati-navbar/meati-navbar.component';

@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule.forChild(<any>UiRoutes)
  ],
  declarations: [
    MeatiActionbarComponent,
    MeatiNavbarComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  exports: [
    MeatiActionbarComponent,
    MeatiNavbarComponent,
  ]
})
export class UiModule { }
