import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Rutas principales
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'registro', loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'recuperar', loadChildren: () => import('./pages/recuperar/recuperar.module').then(m => m.RecuperarPageModule) },

  // Rutas de navegación
  { path: 'inicio', loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule) },
  { path: 'perfil', loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule) },
  { path: 'chatbot', loadChildren: () => import('./pages/chatbot/chatbot.module').then(m => m.ChatbotPageModule) },
  { path: 'escanear', loadChildren: () => import('./pages/escanear/escanear.module').then(m => m.EscanearPageModule) },
  { path: 'recomendaciones', loadChildren: () => import('./pages/recomendaciones/recomendaciones.module').then(m => m.RecomendacionesPageModule) },
  { path: 'mostrardatos', loadChildren: () => import('./pages/mostrardatos/mostrardatos.module').then(m => m.MostrardatosPageModule) },

  // Rutas de error
  { path: 'e404', loadChildren: () => import('./pages/e404/e404.module').then(m => m.E404PageModule) },

  // Ruta comodín para páginas no encontradas
  { path: '**', redirectTo: 'e404', pathMatch: 'full' },

  // Otras páginas adicionales
  { path: 'chat', loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatPageModule) },
  { path: 'buscador', loadChildren: () => import('./pages/buscador/buscador.module').then(m => m.BuscadorPageModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
