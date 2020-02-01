
import { Injectable } from '@angular/core';
import { RouterExtensions, ExtendedNavigationExtras } from 'nativescript-angular/router/router-extensions';
import { NavigationTransition } from 'tns-core-modules/ui/frame/frame';

@Injectable()
export class Router {

    constructor(public routerExtensions: RouterExtensions) { }

    public redirect(targetUrl: string): void {
        this.routerExtensions.navigate([`${targetUrl}`], { animated: false });
    }

    public redirectClearHistory(targetUrl: string): void {
        this.routerExtensions.navigate([`${targetUrl}`], { animated: false, clearHistory: true });
    }

    public redirectWithCustomAnimation(targetUrl: string, navigationTransition: NavigationTransition): void {
        this.routerExtensions.navigate([`${targetUrl}`], { animated: true, clearHistory: false, transition: navigationTransition });
    }

    public redirectWithCustomAnimationClearHistory(targetUrl: string, navigationTransition: NavigationTransition): void {
        this.routerExtensions.navigate([`${targetUrl}`], { animated: true, clearHistory: true, transition: navigationTransition });
    }

    public canGoBack(): boolean {
        return this.routerExtensions.canGoBack();
    }

}
