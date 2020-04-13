import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.page.html',
  styleUrls: ['./nuevo-producto.page.scss'],
})
export class NuevoProductoPage implements OnInit {
  form: any = {};
  producto: Producto;
  creado = false;
  failProducto = false;
  mensajeFail = '';
  mensajeOK = '';

  constructor(
    private productoService: ProductoService,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
  }

  onCreate(): void {
    this.productoService.crear(this.form).subscribe(data => {
      this.creado = true;
      this.failProducto = false;
      this.mensajeOK = data.mensaje;
      this.presentToast();
    },
      (err: any) => {
        this.mensajeFail = err.error.mensaje;
        this.creado = false;
        this.failProducto = true;
        this.presentAlert();
      }
    );
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Fail creando el producto',
      message: this.mensajeFail,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.mensajeOK,
      duration: 2000
    });
    toast.present();
  }

}
