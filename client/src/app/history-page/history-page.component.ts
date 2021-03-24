import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})

export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  offset = 0
  limit = STEP
  isFilterVisible: boolean = false
  toolTip: MaterialInstance
  oSub: Subscription
  orders: Order[] = []
  loading = false
  reloading = false
  noMoreOrders = false
  filter: Filter = {}

  @ViewChild('toolTip') toolTipRef: ElementRef

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }

  ngAfterViewInit() {
    this.toolTip = MaterialService.initToolTip(this.toolTipRef)
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
    this.toolTip.destroy()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })


    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.noMoreOrders = orders.length < STEP
      this.orders = this.orders.concat(orders)
      this.loading = false
      this.reloading = false
    })
  }

  loadMore() {
    this.loading = true
    this.offset += STEP
    this.fetch()
  }

  applyFilter(filter: Filter) {
    this.filter = filter
    this.orders = []
    this.offset = 0
    this.reloading = true
    this.fetch()
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0
  }

}
