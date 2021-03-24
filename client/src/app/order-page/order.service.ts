import {Injectable} from "@angular/core";
import {OrderPosition, Position} from "../shared/interfaces";
import {OrderPositionsComponent} from "./order-positions/order-positions.component";

@Injectable()
export class OrderService {
  public list: OrderPosition[] = []
  public price = 0

  add(position: Position) {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    })

    const idx = this.list.findIndex(p => p._id === orderPosition._id)
    if (this.list[idx]) {
      this.list[idx].quantity += orderPosition.quantity
    } else {
      this.list.push(orderPosition)
    }
    this.totalPrice()
  }

  remove(orderPosition: Position) {
    const idx = this.list.findIndex(p => p._id === orderPosition._id)
    this.list.splice(idx,1)
    this.totalPrice()
  }

  clear() {
    this.list = []
    this.price = 0
  }

  private totalPrice() {
    this.price = this.list.reduce((acc, item) => {
      return acc += item.quantity * item.cost
    }, 0)

  }
}
