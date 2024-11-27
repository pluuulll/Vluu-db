import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: string = 'mi-usuario'; // Este valor debe ser dinámico según el usuario autenticado
  perfil: any = null;
  error: string | null = null;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.cargarPerfil();
  }

  async cargarPerfil() {
    try {
      this.perfil = await this.supabaseService.getUserProfile(this.usuario);
    } catch (err) {
      console.error('Error al cargar el perfil:', err);
      this.error = 'No se pudo cargar el perfil.';
    }
  }
}
