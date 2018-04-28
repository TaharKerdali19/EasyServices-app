import { Injectable } from '@angular/core';
import { Nav } from 'ionic-angular';

import { GhostPage } from '../pages/ghost-page/ghost-page';

@Injectable()
export class RoutingService {
  detailNav: Nav = null;
  isActivatedSplitPane: boolean = true;
  isTablet: boolean = false;
  masterNav: Nav = null;

  pushDetail(detailPage: any, detailDatas?: any): void {
    (this.isTablet) ? this.detailNav.setRoot(detailPage, detailDatas) : this.masterNav.push(detailPage, detailDatas);
  }

  popDetail(): void {
    (this.isTablet) ? this.detailNav.setRoot(GhostPage) : this.masterNav.pop(); 
  }

  onPlatformChanged(istablet: boolean): void {
    this.isTablet = istablet ? true : false;
  }

  ActivateSplitPane(): boolean {
    this.isActivatedSplitPane = true;
    return this.isActivatedSplitPane;
  }

  DeActiveSplitePane(): boolean {
    this.isActivatedSplitPane = false;
    return this.isActivatedSplitPane;
  }

  StatusSplitPane(): boolean {
    return this.isActivatedSplitPane;
  }
}