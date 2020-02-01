import { Component, OnInit } from '@angular/core';
import { Page } from "ui/page";
import { setPageClasses } from './../../common/page';
import { Router } from './../../common/router';
import { PresetsService } from '../../services/presets.service';

@Component({
  selector: 'app-presets',
  moduleId: module.id,
  templateUrl: 'presets.component.html',
  styleUrls: ['../../shared/less/all.css']
})
export class PresetsComponent implements OnInit {

  constructor(private page: Page, private router: Router, private presetService: PresetsService) {
    setPageClasses(page);
    this.presetService.getRemotePresets();
  }

  ngOnInit() { }

  public redirectToList(catId: number): void {
    console.log('list tapped for categoryid: ' + catId);
    this.router.redirect(`presets/presetList/${ catId }`);
  }

}
