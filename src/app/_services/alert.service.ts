import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private dataSource = new Subject<DataSourceClass>();
  data$ = this.dataSource.asObservable();

  public dataBusChanged(ev, value) {
    this.dataSource.next({ ev: ev, value: value })
  }
}

export class DataSourceClass {
  ev: string;
  value: any
}