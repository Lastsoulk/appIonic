import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { Router, NavigationEnd } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  productos: Producto[] = [];
  msjOk = '';

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
    ) {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.cargarProductos();
      }
    });
  }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.lista().subscribe(data => {
      this.productos = data;
    },
      (err: any) => {
        console.log(err);
      }
    );
  }

  async presentAlertConfirm(id: number) {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'si aceptas, no hay vuelta atrás',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (nops) => {
            console.log(nops);
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.productoService.borrar(id).subscribe( data => {
              this.msjOk = data.mensaje;
              this.cargarProductos();
              this.presentToast();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.msjOk,
      duration: 2000
    });
    toast.present();
  }

}
