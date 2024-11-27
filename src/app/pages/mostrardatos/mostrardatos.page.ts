import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-mostrardatos',
  templateUrl: './mostrardatos.page.html',
  styleUrls: ['./mostrardatos.page.scss'],
})
export class MostrardatosPage implements OnInit {
  // Objeto para almacenar la información de la canción ingresada
  song = {
    nombre: '',
    artista: '',
    duracion: '',
    album: '',
    ano: undefined, // Cambiado de null a undefined
  };

  // Propiedad para almacenar los datos obtenidos de la base de datos
  datos: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  // Método de inicialización para cargar los datos al inicio
  async ngOnInit() {
    try {
      // Cambia 'usuario_ejemplo' por el usuario actual o el que estés usando
      const usuario = 'usuario_ejemplo'; 
      this.datos = await this.supabaseService.getUserItems(usuario);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }

  async addSong() {
    try {
      // Llamamos al método de SupabaseService para agregar la canción
      const response = await this.supabaseService.addSong(this.song);
      console.log('Canción agregada:', response);

      // Opcional: Limpiar el formulario después de enviar
      this.song = { nombre: '', artista: '', duracion: '', album: '', ano: undefined };
      
      // Actualizar la lista de canciones después de agregar una nueva
      this.datos = await this.supabaseService.getUserItems('usuario_ejemplo');
    } catch (error) {
      console.error('Error al agregar la canción:', error);
    }
  }
}
