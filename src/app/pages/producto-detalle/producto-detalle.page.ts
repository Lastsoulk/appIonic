import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.page.html',
  styleUrls: ['./producto-detalle.page.scss'],
})
export class ProductoDetallePage implements OnInit {

  producto: Producto = null;
  constructor(private productoService: ProductoService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    this.productoService.detalle(id).subscribe(data => {
      this.producto = data;
    },
      err => {
        console.log(err);
        this.router.navigate(['']);
      }
    );
  }

}
