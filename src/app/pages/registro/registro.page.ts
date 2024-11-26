import { Component } from '@angular/core';
import { SupabaseService } from '../../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  user = {
    usuario: '',
    contrasena: ''
  };

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async register() {
    try {
      // Intentar registrar al usuario en la base de datos
      await this.supabaseService.registerUser(this.user.usuario, this.user.contrasena);
      console.log('Usuario registrado exitosamente');
      // Redirigir al login después de un registro exitoso
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en el registro:', error);
      // Manejar el error y mostrar un mensaje
    }
  }
}
