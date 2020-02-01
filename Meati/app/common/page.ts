import { Page } from "ui/page";
import * as application from 'application';
import { isIOS } from 'platform';
import { topmost } from 'ui/frame';

export function setPageClasses(page: Page) {
    // Hides Default Page ActionBar on Android Devices
    page.actionBarHidden = true;
    page.backgroundSpanUnderStatusBar = true; // add this

    page.backgroundColor = '#202126';
    if (isIOS) {
      let navigationBar = topmost().ios.controller.navigationBar;
      navigationBar.barStyle = UIBarStyle.BlackTranslucent;

      if ( application.ios.window.safeAreaInsets ) {
        let navigationBar = topmost().ios.controller.navigationBar;
        const bottomSafeArea: number = application.ios.window.safeAreaInsets.bottom;

        if (bottomSafeArea > 0) {
          application.addCss(`.iphoneX-bottom { padding-bottom: ${bottomSafeArea/2} !important }`);
          application.addCss(`.iphoneX-side-half { padding-left: ${bottomSafeArea/2} !important;
                                              padding-right: ${bottomSafeArea/2} !important; }`);
          application.addCss(`.iphoneX-side { padding-left: ${bottomSafeArea*4} !important;
                                              padding-right: ${bottomSafeArea*4} !important; }`);
        }
      }
    }
}