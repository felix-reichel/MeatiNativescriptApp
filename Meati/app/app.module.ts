/* Angular Imports */
import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

/* Nativescript Angular Imports */
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptHttpModule } from 'nativescript-angular/http';
import { NSModuleFactoryLoader } from 'nativescript-angular/router';

/* Global Services -> Move some to local Modules soon! */
import { AppDemoService } from './app-demo.service';
import { DevicesService } from './services/devices.service';
import { BluetoothService } from './services/bluetooth.service';
import { PresetsService } from './services/presets.service';
import { BackendService } from './services/backend.service';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { UiModule } from './+ui/ui.module';
import { Router } from './common/router';
import { AuthGuardService } from './auth-guard.service';
import { SessionService } from './services/session.service';
import { UserService } from './services/user.service';

@NgModule({
 declarations: [
   AppComponent
 ],
 imports: [
   NativeScriptModule,
   NativeScriptHttpModule,
   AppRoutingModule,
   HttpClientModule,
 ],
 providers: [
   /* Needed for Lazy Loading Modules */
   {
    provide: NgModuleFactoryLoader,
    useClass: NSModuleFactoryLoader
   },
   /* inject only global used services */
   AppDemoService,
   DevicesService,
   BluetoothService,
   SessionService,
   PresetsService,
   BackendService,
   UserService,
   AuthGuardService,
   Router
 ],
 bootstrap: [AppComponent],
 schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }