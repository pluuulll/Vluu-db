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
    // Verificar si el usuario existe
    const existe = await this.supabaseService.doesUserExist(this.usuario);

    if (existe) {
      // Si el usuario existe, permitir cambiar la contraseña
      console.log('Usuario válido');
      // Mostrar el campo para cambiar la contraseña
    } else {
      console.error('El usuario no existe');
      // Mostrar un mensaje de error si el usuario no existe
    }
  }

  async modificarContrasena() {
    if (this.nuevaContrasena.trim() === '') {
      console.error('Por favor, ingresa una nueva contraseña');
      return;
    }

    // Actualizar la contraseña en la base de datos
    const { error } = await this.supabaseService.updatePassword(this.usuario, this.nuevaContrasena);

    if (error) {
      console.error('Error al cambiar la contraseña:', error);
    } else {
      console.log('Contraseña cambiada correctamente');
      // Redirigir al login después de un cambio exitoso
      this.navCtrl.navigateBack('/login');
    }
  }
}
