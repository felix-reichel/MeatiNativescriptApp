import { Component, OnInit } from '@angular/core';
import { Page } from "ui/page";
import { PresetsService } from '../../services/presets.service';
import { setPageClasses } from './../../common/page';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/transfer-models';

@Component({
  selector: 'app-profile',
  moduleId: module.id,
  templateUrl: 'profile.component.html',
  styleUrls: ['../../shared/less/all.css']
})
export class ProfileComponent implements OnInit {

  public favoritePresets: String[] // = PresetsService.favoritePresets;

  public currentUser: User;

  constructor(private page: Page, private userService: UserService) {
    setPageClasses(page);
  }

  ngOnInit() {
    this.currentUser = this.userService.currentUser;
  }

}
