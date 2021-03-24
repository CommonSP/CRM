import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OverviewPage} from "../shared/interfaces";
import {Observable} from "rxjs";
import {AnalyticsService} from "../shared/services/analytics.service";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tapTarget') tapTargetRef: ElementRef
  data$: Observable<OverviewPage>
  tapTarget: MaterialInstance
  yesterday = new Date()
  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
    this.data$ = this.analyticsService.getOverview()
    this.yesterday.setDate(this.yesterday.getDate()-1)
  }

  ngAfterViewInit() {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }

  ngOnDestroy() {
    this.tapTarget.destroy()
  }
  openTapTarget(){
    this.tapTarget.open()
  }
}
