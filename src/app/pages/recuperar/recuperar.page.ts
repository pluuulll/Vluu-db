import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SupabaseService } from '../../supabase.service';
import { ToastController } from '@ionic/angular'; // Importar ToastController

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  usuario: string = '';
  nuevaContrasena: string = '';
  usuarioValido: boolean = false; // Control para saber si el usuario es válido

  constructor(
    private navCtrl: NavController,
    private supabaseService: SupabaseService,
    private toastController: ToastController // Inyectar ToastController
  ) {}

  // Función para mostrar mensajes toast
  async mostrarToast(mensaje: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000, // Duración en milisegundos
      position: 'bottom', // Posición del mensaje
      color, // Color del toast (success, danger, warning, etc.)
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  // Validar si el usuario existe
  async validarUsuario() {
    if (this.usuario.trim() === '') {
      this.mostrarToast('Por favor, ingresa un usuario.', 'warning');
      return;
    }

    try {
      // Verificar si el usuario existe en la base de datos
      const existe = await this.supabaseService.doesUserExist(this.usuario);

      if (existe) {
        this.usuarioValido = true;
        this.mostrarToast('¡Usuario validado correctamente!', 'success');
      } else {
        this.usuarioValido = false;
        this.mostrarToast('El usuario ingresado no existe. Verifica nuevamente.', 'danger');
      }
    } catch (error) {
      console.error('Error al verificar el usuario:', error);
      this.mostrarToast('Ocurrió un error al validar el usuario. Inténtalo más tarde.', 'danger');
    }
  }

  // Modificar la contraseña del usuario
  async modificarContrasena() {
    if (this.nuevaContrasena.trim() === '') {
      this.mostrarToast('Por favor, ingresa una nueva contraseña.', 'warning');
      return;
    }

    try {
      // Actualizar la contraseña en la base de datos
      await this.supabaseService.updatePassword(this.usuario, this.nuevaContrasena);
      this.mostrarToast('Contraseña cambiada correctamente.', 'success');

      // Redirigir al login después de un cambio exitoso
      this.navCtrl.navigateBack('/login');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      this.mostrarToast('Ocurrió un error al cambiar la contraseña. Inténtalo más tarde.', 'danger');
    }
  }
}
