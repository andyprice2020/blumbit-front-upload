import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit{

  // Variables
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
  imageInfos?: Observable<any>;

  constructor(private uploadService: FileUploadService) {}

  ngOnInit(): void {
    this.imageInfos = this.uploadService.getFiles();
  }

  // Metodos para la subida de un archivo
  // Metodo que permite seleccionar el archivo de imagen
  selectFile(event: any): void {

    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    // Si existe el archivo...
    if(this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if(file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  // Metodo para subir el archivo
  upload(): void {
    this.progress = 0;

    if(this.selectedFiles) {

      const file: File | null = this.selectedFiles.item(0);

      if(file) {
        this.currentFile = file;
        // Invocamos el servicio para subir la imagen
        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              // Generamos la barra de progreso de subida del archivo
              this.progress = Math.round((100*event.loaded)/ event.total);
            }
            else if(event instanceof HttpResponse) {
                this.message = event.body.message;
                this.imageInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any)=> {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            }
            else { this.message = 'Could not upload the image!'; }
            this.currentFile = undefined;
          }
      });
    }
    this.selectedFiles = undefined;
  }
}
}
