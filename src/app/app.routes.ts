import { LayoutComponent } from './layout/layout.page';
import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  }
];
