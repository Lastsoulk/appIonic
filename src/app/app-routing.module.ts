import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardService as guard } from './guards/guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'registro', loadChildren: './pages/registro/registro.module#RegistroPageModule' },
  {
    path: 'admin',
    loadChildren: './pages/admin/admin.module#AdminPageModule',
    canActivate: [guard],
    data: { expectedRol: ['admin'] }
  },
  {
    path: 'user',
    loadChildren: './pages/user/user.module#UserPageModule',
    canActivate: [guard],
    data: { expectedRol: ['admin', 'user'] }
  },
  {
    path: 'detalle/:id',
    loadChildren: './pages/producto-detalle/producto-detalle.module#ProductoDetallePageModule',
    canActivate: [guard],
    data: { expectedRol: ['admin', 'user'] }
  },
  {
    path: 'nuevo',
    loadChildren: './pages/nuevo-producto/nuevo-producto.module#NuevoProductoPageModule',
    canActivate: [guard],
    data: { expectedRol: ['admin'] }
  },
  { path: 'facebook', loadChildren: './pages/facebook/facebook.module#FacebookPagePageModule' },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
