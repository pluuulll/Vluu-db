// login.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, Animation, AlertController } from '@ionic/angular';
import { SupabaseService } from 'src/app/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginUsuario: string = "";
  loginContrasena: string = "";
  animation!: Animation;

  constructor(
    private animationController: AnimationController,
    private router: Router,
    private alertController: AlertController,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
    this.animacionTexto();
  }

  async validarCredenciales() {
    try {
      // Usamos el servicio 'get' para obtener la contraseña del usuario desde la base de datos
      const contrasena = await this.supabaseService.get(this.loginUsuario);
      
      // Comparamos la contraseña ingresada por el usuario con la obtenida de la base de datos
      if (contrasena === this.loginContrasena) {
        this.router.navigate(['/inicio']);
      } else {
        await this.mostrarAlerta('Error en inicio de sesión', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      await this.mostrarAlerta('Error', 'Ocurrió un error al iniciar sesión');
    }
  }

  animacionTexto() {
    const texto = document.getElementById('tPrincipal');

    if (texto) {
      this.animation = this.animationController.create()
        .addElement(texto)
        .duration(5000)
        .iterations(Infinity)
        .fromTo('transform', 'translateX(0px)', 'translateX(200px)');

      this.animation.play();
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Volver']
    });

    await alert.present();
  }
}
