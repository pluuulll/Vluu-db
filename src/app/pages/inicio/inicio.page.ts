import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  // Modelo para el formulario
  song = {
    nombre: '',
    artista: '',
    duracion: '', // hh:mm:ss
    album: '',
    ano: null as number | null, // Permitir null
  };

  // Lista de canciones
  songs: Array<{
    nombre: string;
    artista: string;
    duracion?: string;
    album?: string;
    ano?: number | null; // Permitir null
    creado_en?: string;
  }> = [];

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    // Cargar canciones al inicializar la página
    this.loadSongs();
  }

  // Agregar una nueva canción
  async addSong() {
    try {
      // Llama al servicio para agregar la canción
      await this.supabaseService.addSong({
        ...this.song,
        ano: this.song.ano === null ? undefined : this.song.ano, // Convertir null a undefined antes de enviarlo
      });

      // Agregar la nueva canción a la lista local
      this.songs.unshift({
        ...this.song,
        creado_en: new Date().toISOString(),
      });

      // Limpiar el formulario
      this.song = {
        nombre: '',
        artista: '',
        duracion: '',
        album: '',
        ano: null, // Cambiado de "año" a "ano"
      };

      console.log('Canción agregada correctamente');
    } catch (error) {
      console.error('Error al agregar la canción:', error);
    }
  }

  // Cargar las canciones existentes desde la base de datos
  async loadSongs() {
    try {
      this.songs = await this.supabaseService.getSongs();
      console.log('Canciones cargadas:', this.songs);
    } catch (error) {
      console.error('Error al cargar las canciones:', error);
    }
  }
}
