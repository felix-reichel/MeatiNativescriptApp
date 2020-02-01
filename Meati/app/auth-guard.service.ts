import { Injectable } from '@angular/core';
import { Router, CanLoad } from "@angular/router";
import { BackendService } from './services/backend.service';

@Injectable()
export class AuthGuardService implements CanLoad {

  constructor(private router: Router, private backend: BackendService) { }

  public canLoad(): boolean {
    if (this.backend.isToken() && this.backend.isTokenValid()) {
      return true;
    } else {
      this.router.navigate(["/auth"]);
      return false;
    }
  }

}