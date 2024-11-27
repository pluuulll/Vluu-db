import { Component } from '@angular/core';
import { SupabaseService } from '../../supabase.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginUsuario = '';
  loginContrasena = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async validarCredenciales() {
    if (!this.loginUsuario || !this.loginContrasena) {
      await this.mostrarToast('Por favor, completa ambos campos.', 'warning');
      return;
    }

    try {
      // Consultar la base de datos para obtener la contraseña del usuario
      const contrasenaAlmacenada = await this.supabaseService.getPassword(this.loginUsuario);

      if (!contrasenaAlmacenada) {
        await this.mostrarToast('Usuario no encontrado. Regístrate.', 'danger');
        return;
      }

      if (this.loginContrasena === contrasenaAlmacenada) {
        await this.mostrarToast('Inicio de sesión exitoso.', 'success');
        this.router.navigate(['/inicio']); // Navega a la página principal
      } else {
        await this.mostrarToast('Contraseña incorrecta. Intenta nuevamente.', 'danger');
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      await this.mostrarToast('Ocurrió un error al intentar iniciar sesión.', 'danger');
    }
  }

  // Método para mostrar mensajes
  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });
    await toast.present();
  }
}
