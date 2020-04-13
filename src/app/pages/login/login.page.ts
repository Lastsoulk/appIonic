import { Component, OnInit } from '@angular/core';
import { LoginUsuario } from 'src/app/models/login-usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: any = {};
  usuario: LoginUsuario;
  nombreUser: string;
  isLogged = false;
  isLoginFail = false;
  roles: string[] = [];
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private alertController: AlertController
    ) { }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      console.log('Nombre: ' + this.tokenService.getUserName());
      console.log('Token: ' + this.tokenService.getToken());
      console.log('Roles: ' + this.tokenService.getAuthorities());
      this.nombreUser = this.tokenService.getUserName();
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin() {
    this.usuario = new LoginUsuario(this.form.nombreUsuario, this.form.password);

    this.authService.login(this.usuario).subscribe(data => {
      this.tokenService.setToken(data.token);
      this.tokenService.setUserName(data.nombreUsuario);
      this.tokenService.setAuthorities(data.authorities);

      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
      window.location.reload();
      // this.navController.navigateRoot('/menu');
    },
      (err: any) => {
        console.log(err);
        this.isLogged = false;
        this.isLoginFail = true;
        this.errorMsg = err.error.message;
        this.presentAlert();
      }
    );
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Fail en el login',
      message: this.errorMsg,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

onLogout() {
  this.tokenService.logOut();
  window.location.reload();
}

}
