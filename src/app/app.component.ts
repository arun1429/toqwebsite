import { Component, OnInit } from '@angular/core';
import { UserService } from './_services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Toq';

  constructor(private _US: UserService) { }

  ngOnInit() {
    const allReadyLoggedIn = localStorage.getItem("currentUser");
    if (allReadyLoggedIn) {
      const user = this.getLocalStorage();
      this.afterLogin(user);
    }
  }

  getLocalStorage() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser;
  }

  afterLogin(user) {
    this._US.updateUser(true, user);
  }

}
