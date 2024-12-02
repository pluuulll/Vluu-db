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
  loginUsuario = ''; // Usuario ingresado
  loginContrasena = ''; // Contraseña ingresada

  // Colores para los mensajes de toast
  private readonly TOAST_COLORS = {
    success: 'success',
    warning: 'warning',
    danger: 'danger',
  };

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private toastController: ToastController
  ) {}

  /**
   * Valida las credenciales del usuario contra la base de datos.
   */
  async validarCredenciales(): Promise<void> {
    if (!this.camposCompletos()) {
      await this.mostrarToast('Por favor, completa ambos campos.', this.TOAST_COLORS.warning);
      return;
    }

    try {
      const contrasenaAlmacenada = await this.supabaseService.getPassword(this.loginUsuario);

      if (!contrasenaAlmacenada) {
        await this.mostrarToast('Usuario no encontrado. Regístrate.', this.TOAST_COLORS.danger);
        return;
      }

      if (this.esContrasenaCorrecta(contrasenaAlmacenada)) {
        await this.mostrarToast('Inicio de sesión exitoso.', this.TOAST_COLORS.success);
        await this.router.navigate(['/inicio']); // Redirige a la página principal
      } else {
        await this.mostrarToast('Contraseña incorrecta. Intenta nuevamente.', this.TOAST_COLORS.danger);
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      await this.mostrarToast('Ocurrió un error al intentar iniciar sesión.', this.TOAST_COLORS.danger);
    }
  }

  /**
   * Verifica si ambos campos (usuario y contraseña) están completos.
   */
  private camposCompletos(): boolean {
    return this.loginUsuario.trim() !== '' && this.loginContrasena.trim() !== '';
  }

  /**
   * Compara la contraseña ingresada con la almacenada.
   */
  private esContrasenaCorrecta(contrasenaAlmacenada: string): boolean {
    return this.loginContrasena === contrasenaAlmacenada;
  }

  /**
   * Muestra un mensaje toast en pantalla.
   * @param mensaje - Mensaje a mostrar
   * @param color - Color del toast ('success', 'warning', 'danger', etc.)
   */
  private async mostrarToast(mensaje: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}
