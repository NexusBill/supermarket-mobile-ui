import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HomePage } from "./home/home.page";
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, HttpClientModule,IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
