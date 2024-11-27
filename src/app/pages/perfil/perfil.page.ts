import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userProfile: any = {}; // Información del perfil del usuario
  private usuario: string = 'usuarioEjemplo'; // Reemplaza con la lógica adecuada para obtener el usuario actual

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      // Llamada al método de SupabaseService para obtener la información del usuario
      const usuario = await this.supabaseService.get(this.usuario);
      if (usuario) {
        this.userProfile = usuario;
        console.log('Perfil cargado con éxito:', this.userProfile);
      } else {
        console.warn('No se encontró el perfil del usuario');
      }
    } catch (error) {
      console.error('Error al cargar el perfil del usuario:', error);
    }
  }
}
