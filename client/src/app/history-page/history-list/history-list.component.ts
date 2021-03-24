import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";

import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modal') modalRef: ElementRef
  @Input() orders: Order[]
  modal: MaterialInstance
  selectedOrder: Order

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  computePrice(order: Order): number {
    return order.list.reduce((acc, item) => {
      return acc += item.cost * item.quantity
    }, 0)
  }

  openOrderModal(order: Order) {
    this.selectedOrder = order
    this.modal.open()
  }
  close(){
    this.modal.close()
  }
}
