import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AnalyticsPage, OverviewPage} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService{
  constructor(private http: HttpClient) {
  }
  getOverview():Observable<OverviewPage> {
    return this.http.get<OverviewPage>('/api/analytics/overview')
  }

  getAnalytics():Observable<AnalyticsPage> {
    return this.http.get<AnalyticsPage>('/api/analytics/analytics')
  }
}
