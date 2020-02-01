import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AuthGuardService } from './auth-guard.service';

import { AppComponent } from "./app.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {   
        path: 'auth',
        loadChildren: './+auth/auth.module#AuthModule'
    },
    {
        path: 'devices',
        loadChildren: './+devices/devices.module#DevicesModule',
        canLoad: [AuthGuardService]
    },
    {
        path: 'meati',
        loadChildren: './+live-session/live-session.module#LiveSessionModule',
        canLoad: [AuthGuardService]
    },
    {
        path: 'presets',
        loadChildren: './+presets/presets.module#PresetsModule',
        canLoad: [AuthGuardService]
    },
    {
        path: 'profile',
        loadChildren: './+profile/profile.module#ProfileModule',
        canLoad: [AuthGuardService]
    },
    {
        path: 'settings',
        loadChildren: './+settings/settings.module#SettingsModule',
        canLoad: [AuthGuardService]
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
    providers: []
})
export class AppRoutingModule { }