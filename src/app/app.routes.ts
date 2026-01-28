import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: "dashboard",
    loadComponent: () => import("../Component/dashboard/dashboard.component")
      .then(m => m.DashboardComponent)
  },
  {
    path: "",
    redirectTo: "sign",
    pathMatch: "full"
  },
  {
    path: "login",
    loadComponent: () => import("../Component/login/login.component")
      .then(m => m.LoginComponent)
  },
  {
    path: "sign",
    loadComponent: () => import("../Component/sign/sign.component")
      .then(m => m.SignComponent)
  },
  {
    path: "dashboard-detail/:id",
    loadComponent: () => import("../Component/dashboard-detail/dashboard-detail.component")
      .then(m => m.DashboardDetailComponent)
  },
    {
    path: "dashboard-detail",
    loadComponent: () => import("../Component/dashboard-detail/dashboard-detail.component")
      .then(m => m.DashboardDetailComponent)
  },
];
