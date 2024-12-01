import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ItunesService {
    private apiUrl = 'https://itunes.apple.com/search';

    constructor(private http: HttpClient) { }

    // Método para obtener canciones basadas en el término de búsqueda (como 'rock')
    obtenerRecomendaciones(genero: string): Observable<any> {
        const url = `https://itunes.apple.com/search?term=${genero}&limit=100`; // URL de la API de iTunes para obtener canciones
        return this.http.get(url);
    }

    buscarCanciones(term: string): Observable<any> {
        const url = `${this.apiUrl}?term=${encodeURIComponent(term)}&entity=song&limit=100`;
        return this.http.get<any>(url);
    }
    
}
