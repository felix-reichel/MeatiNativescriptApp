import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StaticPreset, BbqCategory, BbqItem } from './../shared/transfer-models';
import { BackendService } from './backend.service';

@Injectable()
export class PresetsService {
  public availablePresets: StaticPreset[] = [];

  constructor(private http: HttpClient, private backendService: BackendService) {
    this.getRemotePresets();
  }

  public getRemotePresets(): void {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'bearer ' + this.backendService.token); 

    this.http.get<StaticPreset[]>(`${BackendService.API_BASE_DOMAIN}/staticpreset/retrieveMultiple`, {headers: headers}).subscribe(p => {
      this.availablePresets = p;
      console.log(`Presets ${JSON.stringify(p)}`);
    },(error) => {
      console.log(`An error occured during the preset-fetch process ${JSON.stringify(error)}`);
    });
  }

  public updateListOnDelete(id: number) {
    this.availablePresets.splice(id, 1);
  }

  public getPresetsByCategory(categoryEnumId: number): StaticPreset[] {
    return this.availablePresets.filter(p => p.itemOnBbq.category.toString() == BbqCategory[categoryEnumId]);
  } 

  public getCategoryName(categoryEnumId: number): string {
    return BbqCategory[categoryEnumId].toLowerCase();
  }

  public savePreset(preset: StaticPreset, index: number): void {
    this.availablePresets[index] = preset;
  }
}
