import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../_services/index';
import { NotificationModel } from '../../models/notification-model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  notificationItem: Array<NotificationModel> = [];

  constructor(private _AS: AlertService) { }

  ngOnInit(): void {
    this.getNewNotification();
  }

  public getNewNotification() {
    this._AS.data$.subscribe(data => {
      if (data.ev === 'notification') {
        this.notificationItem.push(data.value)
        setTimeout(() => {
          this.closeAlert(0);
        }, 3000);
      }
    });
  }

  closeAlert(index) {
    this.notificationItem.splice(index, 1);
  }

}
