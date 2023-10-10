import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  // Variable
  private baseURL = 'http://localhost:9090/api/v1';

  constructor(private http: HttpClient) { }

  // Metodo para subir el archivo
  upload(file: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();

    // Obtenemos el archivo para luego desplegarlo en pantalla
    formData.append('file', file);

    // Armamos la peticion del archivo, ya que se debe hacer mediante el uso del verbo POST
    const request = new HttpRequest('POST', `${this.baseURL}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    //Devolvemos el archivo mediante la variable request
    return this.http.request(request);
  }

  // Método para devolver los arhcivos de imagen subidos
  getFiles(): Observable<any> {
    return this.http.get(`${this.baseURL}/files`);
  }
}
