import { Component, OnInit } from '@angular/core';
import { Page } from "ui/page";
import { ListPicker } from "ui/list-picker";
import { setPageClasses } from './../../common/page';
import { Router } from './../../common/router';
import { BbqItemDoneness, StaticPreset, ProcessState } from '../../shared/transfer-models';
import { GrillProcess, Pin } from '../../model/Session';
import { SessionService } from '../../services/session.service';
import { PresetsService } from '../../services/presets.service';
import * as moment from 'moment';
const listPickerModule = require("tns-core-modules/ui/list-picker");

@Component({
  moduleId: module.id,
  selector: 'app-create-grill-process',
  templateUrl: './create-grill-process.component.html',
  styleUrls: ['../../shared/less/all.css']
})
export class CreateGrillProcessComponent implements OnInit {

  public grillProcess: GrillProcess;

  public cookingLevels: string[] = ['Rare', 'Medium Rare', 'Medium', 'Well Done', 'Custom Temperature'];
  public staticPresets: StaticPreset[] = [];
  public staticPresetsAsStringArray: string[] = [];
  public index: number = 2; // medium
  public temperature: number = 0;

  constructor(private page: Page, private router: Router, private sessionService: SessionService, private presetService: PresetsService) {
    setPageClasses(page);
   }
   
  ngOnInit() { 
    this.grillProcess = this.sessionService._lastEditedGrillProcess;
    this.staticPresets = this.presetService.availablePresets;
    this.staticPresetsAsStringArray = this.staticPresets.map(p => p.presetName);

    console.log(`this is the current grillProcess: ${JSON.stringify(this.grillProcess)}`);
  }

  public selectedPresetIndexChanged(args) {
    let picker: ListPicker = args.object as ListPicker;
    let selectedIndex: number = picker.selectedIndex;
    let selectedPreset: StaticPreset = this.staticPresets[selectedIndex];
    console.log('--- selected preset ' + JSON.stringify(selectedPreset));
    this.grillProcess.preset.preset = selectedPreset;

    // TODO: update temperature field
    this.updateTemperatureField();
  }

  public selectedCookingLevelIndexChanged(args) {
    let picker: ListPicker = args.object as ListPicker;
    this.index = picker.selectedIndex;
    this.updateTemperatureField();
  }

  public updateTemperatureField() {
    let donenessLevel: BbqItemDoneness;
    let isPresetAndItemSet: boolean = false;
    let selectedIndex: number = this.index;
    console.log("picker selection: " + selectedIndex);
    console.log("temperatur val " + JSON.stringify(this.temperature));

    if (this.grillProcess.preset.preset && this.grillProcess.preset.preset.itemOnBbq) {
      isPresetAndItemSet = true;
    }

    switch (selectedIndex) {
      case 0: 
        donenessLevel = BbqItemDoneness.RARE;
        if (isPresetAndItemSet) {
          this.temperature = this.grillProcess.preset.preset.itemOnBbq.rareTemperature.end;
        }
        break;
      case 1: 
        donenessLevel = BbqItemDoneness.MEDIUM_RARE; 
        if (isPresetAndItemSet) {
          this.temperature = this.grillProcess.preset.preset.itemOnBbq.mediumRareTemperature.end;
        }
        break;
      case 2: 
        donenessLevel = BbqItemDoneness.MEDIUM;
        if (isPresetAndItemSet) {
          this.temperature = this.grillProcess.preset.preset.itemOnBbq.mediumTemperature.end;
        }
        break;
      case 3:
        donenessLevel = BbqItemDoneness.WELL_DONE; 
        if (isPresetAndItemSet) {
          this.temperature = this.grillProcess.preset.preset.itemOnBbq.mediumDoneTemperature.end;
        }
        break;
      case 4: donenessLevel = BbqItemDoneness.CUSTOM_TEMP; 
        break;
      default:
        donenessLevel = BbqItemDoneness.NONE; 
        break;
    }

    this.grillProcess.preset.doneness = donenessLevel;
    if (this.temperature != 0) {
      this.grillProcess.preset.temperature = this.temperature;
    }

  }
  
  public onBlur(event): void {
    if (this.grillProcess.preset) {
      this.grillProcess.preset.temperature = this.temperature;
      this.grillProcess.preset.doneness = BbqItemDoneness.CUSTOM_TEMP;
      this.index = 4; // Custom temp.
    }
  }
  
  public addGrillProcess(): void {
    this.grillProcess.grillProcessStartDate = moment().unix().toString();
    this.grillProcess.grillProcessState = ProcessState.RUNNING;

    // getEstimatedGrillTime and save to DTO entity
    this.sessionService.receiveEstimatedGrillTime(this.grillProcess);

    this.router.redirect('/meati');
  }

}
