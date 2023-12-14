import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../_services';
import { NotificationModel } from '../../models/notification-model';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {

  constructor(public _AS: AlertService) { }

  ngOnInit(): void { }

  alertMessage(data: NotificationModel = { type: 'default', title: 'Look here!', value: 'This alert needs your attention.' }) {
    this._AS.dataBusChanged('notification', data);
  }

}
