import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http"

import { Page } from "ui/page";

import { PerformanceMonitor, PerformanceMonitorSample } from 'nativescript-performance-monitor';

import { AppDemoService } from './app-demo.service';
import { setPageClasses } from './common/page';

import { Observable as RxObservable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { BackendService } from "./services/backend.service";
import { Router } from "./common/router";

const performanceMonitor: PerformanceMonitor = new PerformanceMonitor();

@Component({
  selector: "meati-root",
  moduleId: module.id,
  template: "<page-router-outlet></page-router-outlet>",
  styleUrls: ['./shared/less/all.css']
})
export class AppComponent implements OnInit {
  public testString: String = "Meati v1.0";
  private appRoutes: String[] = ["home", "devices", "meati", "presets", "profile"];
  private routerPosition: number = 0; // first position in routes Array;

  ngOnInit() { 
    // Start Performance Monitor tns plugin which showes FPS

    console.log(`AppComponent: Print out serialized token ${ this.backendService.token }`);
    this.router.redirectClearHistory('/devices'); // this will work if Token passes AuthGuard

    performanceMonitor.start();
    // this.getPosts();
  }

  constructor(private appDemoService: AppDemoService, private page: Page, private backendService: BackendService, private router: Router) {
    setPageClasses(page);
  }

  private getPosts(): void {
    this.appDemoService.getData().subscribe((result) => {
            console.log('=== TESTING HTTP MODULE ===')
            console.log(JSON.stringify(result))
        }, (error) => { 
          console.log(error)
        });
    }
}