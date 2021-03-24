export interface User {
  email: string,
  password: string
}

export interface Category {
  name: string,
  imageSrc?: string,
  user?: string,
  _id?: string

}

export interface Message {
  message: string
}

export interface Position {
  name: string,
  cost: number,
  user?: string,
  category?: string
  _id?: string
  quantity?: number
}

export interface Order {
  date?: Date,
  order?: number,
  user?: string,
  list: Position[],
  _id?: string
}

export interface OrderPosition {
  name: string,
  quantity: number,
  cost: number,
  _id?: string
}

export interface Filter{
  order?: number,
  start?: Date,
  end?: Date
}

export interface OverviewPage{
  gain: OvervievItem,
  orders: OvervievItem

}
interface OvervievItem{
  percent: number,
  compare: number,
  yesterday: number,
  isHigher: boolean
}

export interface AnalyticsPage{
  average: number,
  chart: AnalyticsItem[]
}

interface AnalyticsItem{
  gain: number,
  order: number,
  label: string
}
