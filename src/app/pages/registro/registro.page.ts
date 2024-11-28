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
  showErrorMessage: boolean = false; // Controla la visibilidad del mensaje de error
  errorMessage: string = ''; // Mensaje de error específico

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async register() {
    // Verificar si los campos están vacíos
    if (this.user.usuario.trim() === '' || this.user.contrasena.trim() === '') {
      this.showErrorMessage = true; // Mostrar el mensaje de error si algún campo está vacío
      this.errorMessage = 'Todos los campos deben ser completados.';
      return;
    }

    try {
      // Intentar registrar al usuario en la base de datos
      await this.supabaseService.registerUser({ 
        usuario: this.user.usuario, 
        contrasena: this.user.contrasena 
      });
      console.log('Usuario registrado exitosamente');
      // Redirigir al login después de un registro exitoso
      this.router.navigate(['/login']); // Ruta de redirección correcta
    } catch (error) {
      console.error('Error en el registro:', error);
      this.showErrorMessage = true;
      this.errorMessage = 'Hubo un problema al registrar el usuario. Inténtalo de nuevo.';
    }
  }
}
