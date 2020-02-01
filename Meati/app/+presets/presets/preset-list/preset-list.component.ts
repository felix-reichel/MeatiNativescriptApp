import { Component, OnInit, AfterViewInit, ElementRef, ViewChild  } from '@angular/core';
import { PresetsService } from '../../../services/presets.service';
import { Page } from "ui/page";
import { setPageClasses } from './../../../common/page';
import { Router } from '../../../common/router';
import { PageRoute } from "nativescript-angular/router";
import "rxjs/add/operator/switchMap";
import { StaticPreset } from './../../../shared/transfer-models';
import { isAndroid, isIOS } from "platform";
import { View } from "ui/core/view";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { RadListViewComponent } from 'nativescript-ui-listview/angular/listview-directives';
import { ListViewEventData } from 'nativescript-ui-listview';
import { layout } from "utils/utils";

@Component({
  moduleId: module.id,
  selector: 'app-preset-list',
  templateUrl: './preset-list.component.html',
  styleUrls: ['../../../shared/less/all.css']
})
export class PresetListComponent implements OnInit {
  @ViewChild('listview') listview:RadListViewComponent; 

  //public categoryName: string;
  private categoryId: number;
  private _availablePresets: ObservableArray<StaticPreset> = new ObservableArray<StaticPreset>();
  public categoryName: string;
  public selected: number;

  constructor(private page: Page, private pageRoute: PageRoute, private router: Router, private presetsService: PresetsService) { 
    setPageClasses(page);

    // use switchMap to get the latest activatedRoute instance
    this.pageRoute.activatedRoute
      .switchMap(activatedRoute => activatedRoute.params)
      .forEach((params) => { this.categoryId = params["categoryId"]; });
      this.categoryName = this.presetsService.getCategoryName(this.categoryId);
  }

  ngOnInit() {
    this._availablePresets = new ObservableArray(this.presetsService.getPresetsByCategory(this.categoryId));
  }

  ngAfterViewInit() {
    let listvie = <View>this.listview.nativeElement;
    
    setTimeout(() => {
      if(isAndroid){
        listvie.android.setVerticalScrollBarEnabled(false);
      }
      else if (isIOS) {
        listvie.ios.showsVerticalScrollIndicator = false; 
      }
    }, 10);
  }

  onItemTap(args) {
    this.router.redirect(`presets/presetDetails/${ this.categoryId }/${ args.index }`);
  }

  get availablePresets(): ObservableArray<StaticPreset> {
    return this._availablePresets;
  }

  public onSwipeCellStarted(args: ListViewEventData) {
    var swipeLimits = args.data.swipeLimits;
    swipeLimits.threshold = 60 * layout.getDisplayDensity();
    swipeLimits.right = 80 * layout.getDisplayDensity();
    this.selected = args.index;
  }

  public onDelete() {
    this.availablePresets.splice(this.selected, 1);
    this.presetsService.updateListOnDelete(this.selected);
    this.listview.listView.notifySwipeToExecuteFinished();
  }
}
