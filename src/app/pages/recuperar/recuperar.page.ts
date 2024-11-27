import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  usuario: string = '';
  nuevaContrasena: string = '';

  constructor(private navCtrl: NavController, private supabaseService: SupabaseService) {}

  async validarUsuario() {
    try {
      // Verificar si el usuario existe
      const existe = await this.supabaseService.doesUserExist(this.usuario);

      if (existe) {
        console.log('Usuario válido');
        // Mostrar el campo para cambiar la contraseña si es necesario
      } else {
        console.error('El usuario no existe');
        // Mostrar un mensaje de error si el usuario no existe
      }
    } catch (error) {
      console.error('Error al verificar el usuario:', error);
    }
  }

  async modificarContrasena() {
    if (this.nuevaContrasena.trim() === '') {
      console.error('Por favor, ingresa una nueva contraseña');
      return;
    }

    try {
      // Actualizar la contraseña en la base de datos
      await this.supabaseService.updatePassword(this.usuario, this.nuevaContrasena);
      console.log('Contraseña cambiada correctamente');
      // Redirigir al login después de un cambio exitoso
      this.navCtrl.navigateBack('/login');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
    }
  }
}
