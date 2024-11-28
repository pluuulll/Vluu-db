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
    ano: undefined, // Año puede ser un número entero o undefined
  };

  // Propiedad para almacenar los datos obtenidos de la base de datos
  datos: any[] = [];

  constructor(private supabaseService: SupabaseService) {}

  // Método de inicialización para cargar los datos al inicio
  async ngOnInit() {
    await this.loadUserItems();
  }

  /**
   * Carga los datos del usuario desde la base de datos
   */
  private async loadUserItems(): Promise<void> {
    try {
      const usuario = 'usuario_ejemplo'; // Cambiar a usuario dinámico si es necesario
      this.datos = await this.supabaseService.getUserItems(usuario);
    } catch (error) {
      this.handleError('Error al cargar los datos del usuario', error);
    }
  }

  /**
   * Verifica si los campos de la canción están completos
   * @returns boolean
   */
  private isSongValid(): boolean {
    const { nombre, artista, duracion, album, ano } = this.song;
    return Boolean(nombre && artista && duracion && album && ano !== undefined);
  }

  /**
   * Agrega una nueva canción a la base de datos
   */
  async addSong(): Promise<void> {
    if (!this.isSongValid()) {
      this.handleError('Todos los campos deben ser completados.');
      return;
    }

    try {
      const response = await this.supabaseService.addSong(this.song);
      console.log('Canción agregada:', response);

      // Limpiar el formulario después de enviar
      this.resetSongForm();

      // Actualizar la lista de canciones después de agregar una nueva
      await this.loadUserItems();
    } catch (error) {
      this.handleError('Error al agregar la canción', error);
    }
  }

  /**
   * Maneja errores de manera centralizada
   * @param message Mensaje de error a mostrar
   * @param error Detalles del error (opcional)
   */
  private handleError(message: string, error?: any): void {
    console.error(message, error);
    alert(`${message}. Por favor, intente de nuevo más tarde.`);
  }

  /**
   * Limpia el formulario de la canción
   */
  private resetSongForm(): void {
    this.song = { nombre: '', artista: '', duracion: '', album: '', ano: undefined };
  }
}
