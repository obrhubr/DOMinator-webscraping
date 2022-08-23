import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DOMinator-frontend';

  constructor(private router: Router) {}

  notLanding() {
    let href = this.router.url;
    return href != "/";
  }
}
