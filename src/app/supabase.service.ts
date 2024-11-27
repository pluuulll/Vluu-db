import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  private handleError(error: PostgrestError | null, operation: string): void {
    if (error) {
      console.error(`Error en la operación ${operation}:`, error.message);
      throw new Error(`Error en la operación ${operation}: ${error.message}`);
    }
  }

  // *********************** USUARIOS ****************************

  async getPassword(usuario: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('contrasena')
      .eq('usuario', usuario)
      .single();

    this.handleError(error, 'obtener contraseña');
    return data?.contrasena || null;
  }

  async doesUserExist(usuario: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('usuario')
      .eq('usuario', usuario);

    this.handleError(error, 'verificar existencia de usuario');
    return (data?.length ?? 0) > 0;
  }

  async registerUser(usuario: string, contrasena: string): Promise<void> {
    const { error } = await this.supabase
      .from('usuarios')
      .insert([{ usuario, contrasena }]);

    this.handleError(error, 'registrar usuario');
  }

  async updatePassword(usuario: string, nuevaContrasena: string): Promise<void> {
    const { error } = await this.supabase
      .from('usuarios')
      .update({ contrasena: nuevaContrasena })
      .eq('usuario', usuario);

    this.handleError(error, 'actualizar contraseña');
  }

  async verifyPassword(usuario: string, contrasena: string): Promise<boolean> {
    try {
      const storedPassword = await this.getPassword(usuario);
      return storedPassword === contrasena;
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      return false;
    }
  }

  // *********************** CANCIONES ****************************

  async addSong(song: {
    nombre: string;
    artista: string;
    duracion?: string; // Formato hh:mm:ss
    album?: string;
    ano?: number;
  }): Promise<any> {
    const { data, error } = await this.supabase.from('canciones').insert([{
      nombre: song.nombre,
      artista: song.artista,
      duracion: song.duracion
        ? `PT${song.duracion.replace(/:/g, 'H').replace(/:/g, 'M')}S`
        : null, // ISO 8601
      album: song.album,
      ano: song.ano,
    }]);

    this.handleError(error, 'agregar canción');
    return data;
  }

  async getSongs(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('canciones')
      .select('*')
      .order('creado_en', { ascending: false });

    this.handleError(error, 'obtener canciones');
    return data ?? [];
  }

  // *********************** PERFIL ****************************

  async getUserProfile(usuario: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('usuario', usuario)
      .single();

    this.handleError(error, 'obtener perfil');
    return data;
  }

  async updateUserProfile(usuario: string, data: any): Promise<void> {
    const { error } = await this.supabase
      .from('perfiles')
      .update(data)
      .eq('usuario', usuario);

    this.handleError(error, 'actualizar perfil');
  }

  async addUserItem(usuario: string, item: string): Promise<void> {
    const { error } = await this.supabase
      .from('items_perfil')
      .insert([{ usuario, item }]);

    this.handleError(error, 'agregar ítem al perfil');
  }

  async getUserItems(usuario: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('items_perfil')
      .select('*')
      .eq('usuario', usuario);

    this.handleError(error, 'obtener ítems del usuario');
    return data ?? [];
  }
}
