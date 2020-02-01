import { Component, OnInit, Input } from '@angular/core';
import { Router } from './../../../common/router';

@Component({
  selector: 'app-meati-actionbar',
  moduleId: module.id,
  templateUrl: 'meati-actionbar.component.html',
  styleUrls: ['../../../shared/less/all.css']
})
export class MeatiActionbarComponent implements OnInit {
  @Input('title') titleString: String;

  constructor(public router: Router) { }

  ngOnInit() { }

  redirectBack(): void {
      this.router.routerExtensions.back();
  }

  redirectSettings(): void {
    this.router.redirectWithCustomAnimation('settings', { name: 'slideLeft', duration: 300, curve: 'easeOut' });
  }

}
