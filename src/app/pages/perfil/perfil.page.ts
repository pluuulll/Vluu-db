import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../supabase.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Usuario } from '../../supabase.service'; // Asegúrate de importar la interfaz correctamente

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  user: Usuario = {
    usuario: '',
    contrasena: '',
  };
  favoritos: any[] = []; // Array para almacenar los favoritos del usuario
  readonly defaultPhoto: string = 'assets/default-profile.png'; // Ruta de la imagen por defecto

  constructor(
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.loadUserProfile();
    await this.loadFavoritosDesdeLocalStorage(); // Cargar favoritos desde localStorage
  }

  private async loadUserProfile() {
    const loading = await this.presentLoading('Cargando perfil...');
    try {
      const profile = await this.supabaseService.getProfile();
      this.user = profile ? {
        usuario: profile.usuario || '',
        contrasena: profile.contrasena || '',
      } : { ...this.user, photoURL: this.defaultPhoto };

      if (!profile) {
        console.warn('No se encontraron datos de perfil.');
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      await this.presentAlert('Error', 'No se pudo cargar tu perfil.');
    } finally {
      await loading.dismiss();
    }
  }

  // Método para cargar favoritos desde localStorage
  private async loadFavoritosDesdeLocalStorage() {
    try {
      const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      this.favoritos = favoritos || [];
      console.log('Favoritos cargados desde localStorage:', this.favoritos);
    } catch (error) {
      console.error('Error al cargar los favoritos desde localStorage:', error);
      await this.presentAlert('Error', 'No se pudieron cargar los favoritos.');
    }
  }

  // Método para reproducir la vista previa de la canción
  playPreview(previewUrl: string) {
    const audio = new Audio(previewUrl); // Crea un objeto Audio con la URL de la vista previa
    audio.play(); // Reproduce la canción
  }

  async changeProfilePicture() {
    const alert = await this.alertController.create({
      header: 'Cambiar foto de perfil',
      message: 'Selecciona una nueva imagen para tu perfil.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Seleccionar',
          handler: () => {
            console.log('Funcionalidad de selección de imagen no implementada.');
          },
        },
      ],
    });

    await alert.present();
  }

  async saveChanges() {
    if (!this.isUserProfileValid(this.user)) {
      await this.presentAlert('Advertencia', 'Por favor, completa todos los campos antes de guardar.');
      return;
    }

    const loading = await this.presentLoading('Guardando cambios...');
    try {
      await this.supabaseService.updateProfile(this.user);
      await this.presentAlert('Éxito', 'Tu perfil ha sido actualizado.');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      await this.presentAlert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      await loading.dismiss();
    }
  }

  private async presentLoading(message: string) {
    const loading = await this.loadingController.create({ message });
    await loading.present();
    return loading;
  }

  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private isUserProfileValid(user: Usuario): boolean {
    return user.usuario.trim() !== '' && user.contrasena.trim() !== '';
  }

  
}
