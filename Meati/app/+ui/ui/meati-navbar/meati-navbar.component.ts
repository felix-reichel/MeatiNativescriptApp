import { Component, OnInit } from '@angular/core';
import { isIOS } from 'tns-core-modules/ui/frame/frame';
import * as app from 'application';
import { Router } from './../../../common/router';

@Component({
  selector: 'app-meati-navbar',
  moduleId: module.id,
  templateUrl: 'meati-navbar.component.html',
  styleUrls: ['../../../shared/less/all.css']
})
export class MeatiNavbarComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    console.log(`iPhone X Navbar -> move to main app!`);
    if (isIOS && app.ios.window.safeAreaInsets) {
      const bottomSafeArea: number = app.ios.window.safeAreaInsets.bottom;
      if (bottomSafeArea > 0) {
        app.addCss(`
          .bottom-navbar { margin-bottom: ${bottomSafeArea} !important }
        `);
      }
    }
   }

  public redirect(url: string): void {
    console.log('REDIRECT tapped! to ' + url + ' ===================================');
    this.router.redirectClearHistory(url);
  }

}
