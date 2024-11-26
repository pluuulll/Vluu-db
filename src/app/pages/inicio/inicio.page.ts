import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para manejar solicitudes HTTP

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  // Variables existentes para el registro
  inicioUsuario: string = "";
  inicioContrasena: string = "";
  inicioPatente: string = "";
  inicioMarca: string = "";
  inicioModelo: string = "";
  inicioTipo: string = "";

  // Variables para el buscador de música
  query: string = ""; // Texto de búsqueda
  results: any[] = []; // Resultados de la búsqueda

  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpClient // Inyectamos HttpClient para usar en la búsqueda
  ) {}

  ngOnInit() {}

  // Método para almacenar datos de vehículo
  almacenarVehiculo() {
//    this.dbServices.almacenarVehiculo(this.inicioPatente, this.inicioMarca, this.inicioModelo, this.inicioTipo);
  }

  // Método para limpiar campos del formulario
  limpiarDatos() {
    this.inicioPatente = "";
    this.inicioMarca = "";
    this.inicioModelo = "";
    this.inicioTipo = "";
  }

  // Método para buscar música usando la API de iTunes
  searchMusic() {
    if (this.query.trim() === '') return; // Si no hay búsqueda, no hacer nada

    const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(this.query)}&media=music&limit=10`;

    this.http.get(apiUrl).subscribe((response: any) => {
      this.results = response.results; // Almacena los resultados en el array
    });
  }
}
