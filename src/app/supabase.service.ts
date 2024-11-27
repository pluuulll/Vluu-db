import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // *********************** USUARIOS ****************************

  // Obtener la contraseña de un usuario por su nombre de usuario
  async get(usuario: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('contrasena')
      .eq('usuario', usuario)
      .single();

    if (error) {
      console.error('Error al obtener la contraseña:', error);
      return null;
    }

    return data?.contrasena || null;
  }

  // Verificar si un usuario ya existe
  async doesUserExist(usuario: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('usuario')
      .eq('usuario', usuario);

    if (error) {
      console.error('Error al verificar el usuario:', error);
      return false;
    }

    return data.length > 0;
  }

  // Registrar un nuevo usuario (sin cifrado de contraseña)
  async registerUser(usuario: string, contrasena: string) {
    const { error } = await this.supabase
      .from('usuarios')
      .insert([{ usuario, contrasena }]);

    if (error) {
      console.error('Error al registrar el usuario:', error);
      throw error;
    }
  }

  // Actualizar la contraseña de un usuario (sin cifrado)
  async updatePassword(usuario: string, nuevaContrasena: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .update({ contrasena: nuevaContrasena })
      .eq('usuario', usuario);

    if (error) {
      console.error('Error al actualizar la contraseña:', error);
      return { error };
    }

    return { data };
  }

  // Verificar la contraseña durante el inicio de sesión (sin cifrado)
  async verifyPassword(usuario: string, contrasena: string): Promise<boolean> {
    const storedPassword = await this.get(usuario);

    if (!storedPassword) {
      console.error('Usuario no encontrado o contraseña incorrecta');
      return false;
    }

    return contrasena === storedPassword;
  }


  // *********************** Canciones****************************
  // Método para agregar una canción
  async addSong(song: {
    nombre: string;
    artista: string;
    duracion?: string; // Formato hh:mm:ss
    album?: string;
    ano?: number;
  }) {
    const { data, error } = await this.supabase.from('canciones').insert([
      {
        nombre: song.nombre,
        artista: song.artista,
        duracion: song.duracion
          ? `PT${song.duracion.replace(':', 'H').replace(':', 'M')}S`
          : null, // ISO 8601
        album: song.album,
        ano: song.ano,
      },
    ]);

    if (error) {
      console.error('Error al agregar la canción:', error);
      throw error;
    }
    return data;
  }

  // Método para obtener canciones
  async getSongs() {
    const { data, error } = await this.supabase
      .from('canciones')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error al obtener las canciones:', error);
      throw error;
    }
    return data;
  }


  // *********************** PERFIL ****************************

  // Obtener el perfil de un usuario
  async getUserProfile(usuario: string) {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('usuario', usuario)
      .single();

    if (error) {
      throw new Error(`Error al obtener el perfil: ${error.message}`);
    }
    return data;
  }

  // Actualizar el perfil de un usuario
  async updateUserProfile(usuario: string, data: any) {
    const { error } = await this.supabase
      .from('perfiles')
      .update(data)
      .eq('usuario', usuario);

    if (error) {
      throw new Error(`Error al actualizar el perfil: ${error.message}`);
    }
  }

  // Agregar un ítem al perfil de un usuario
  async addUserItem(usuario: string, item: string) {
    const { error } = await this.supabase
      .from('items_perfil')
      .insert([{ usuario, item }]);

    if (error) {
      throw new Error(`Error al agregar el ítem: ${error.message}`);
    }
  }
}
