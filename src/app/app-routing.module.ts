import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Rutas principales
  { 
    path: '', 
    redirectTo: 'login', // Redirección predeterminada
    pathMatch: 'full' 
  },
  { 
    path: 'inicio', 
    loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule) 
  },
  { 
    path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) 
  },
  { 
    path: 'registro', 
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule) 
  },
  { 
    path: 'recuperar', 
    loadChildren: () => import('./pages/recuperar/recuperar.module').then(m => m.RecuperarPageModule) 
  },

  // Rutas de navegación
  { 
    path: 'perfil', 
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule) 
  },
  { 
    path: 'chatbot', 
    loadChildren: () => import('./pages/chatbot/chatbot.module').then(m => m.ChatbotPageModule) 
  },
  { 
    path: 'escanear', 
    loadChildren: () => import('./pages/escanear/escanear.module').then(m => m.EscanearPageModule) 
  },
  { 
    path: 'recomendaciones', 
    loadChildren: () => import('./pages/recomendaciones/recomendaciones.module').then(m => m.RecomendacionesPageModule) 
  },
  {
    path: 'mostrardatos',
    loadChildren: () => import('./pages/mostrardatos/mostrardatos.module').then( m => m.MostrardatosPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
