import { Component } from '@angular/core';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
})
export class BuscadorPage {
  searchResults: any[] = [];
  searchQuery: string = '';

  constructor(private supabase: SupabaseService) {}

  async searchUsers() {
    if (this.searchQuery.trim() !== '') {
      this.searchResults = await this.supabase.searchUsers(this.searchQuery);
    }
  }

  async addFriend(amigo_id: string) {
    const usuario_id = localStorage.getItem('usuario_id'); // Obtén el ID del usuario de la sesión
    if (usuario_id) {
      await this.supabase.addFriend(usuario_id, amigo_id);
      alert('Amigo agregado con éxito');
    }
  }
}
