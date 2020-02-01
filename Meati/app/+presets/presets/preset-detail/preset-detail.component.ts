import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Page } from "ui/page";
import { setPageClasses } from './../../../common/page';
import { Router } from './../../../common/router';
import { PageRoute } from "nativescript-angular/router";
import { PresetsService } from '../../../services/presets.service';
import { Slider } from "ui/slider";
import { StaticPreset } from "./../../../shared/transfer-models";

@Component({
  moduleId: module.id,
  selector: 'app-preset-detail',
  templateUrl: './preset-detail.component.html',
  styleUrls: ['../../../shared/less/all.css']
})

export class PresetDetailComponent implements OnInit {
  public currPreset: StaticPreset;
  private presetIndex: number;
  private categoryEnumId: number;

  constructor(private page: Page, private pageRoute: PageRoute, private router: Router, private presetsService: PresetsService) { 
    setPageClasses(page);

    // use switchMap to get the latest activatedRoute instance
    this.pageRoute.activatedRoute
      .switchMap(activatedRoute => activatedRoute.params)
      .forEach((params) => { 
        this.categoryEnumId = +params["categoryEnumId"]; 
        this.presetIndex = +params["presetId"];
      });

    this.currPreset = this.presetsService.getPresetsByCategory(this.categoryEnumId)[this.presetIndex];
  }

  ngOnInit() {

  }

  public onLoaded() : void {}

  public savePreset(): void {
    this.presetsService.savePreset(this.currPreset, this.presetIndex);
    this.router.redirect(`presets/presetList/${ this.categoryEnumId }`);
  }
}
