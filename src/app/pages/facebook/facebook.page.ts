import { Component, OnInit } from '@angular/core';
import { Facebook,FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { NuevoUsuario } from 'src/app/models/nuevo-usuario';
@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.page.html',
  styleUrls: ['./facebook.page.scss'],
})
export class FacebookPage implements OnInit {

  user:any = {};

  userdata:string;

  private usuario: any = {};
  isRegister = false;
  isRegisterFail = false;
  errorMsg = '';
  mensajeOK = '';

  constructor(public navCtrl: NavController,private fb : Facebook,private http: HttpClient,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
  }

  loginFb(){
    this.fb.login(['public_profile','user_friends','email'])
      .then((res: FacebookLoginResponse)=>{
        if(res.status==='connected'){
          this.user.img = 'https://graph.facebook.com/'+res.authResponse.userID+'/picture?type=square';
          this.getData(res.authResponse.accessToken);
          this.onRegister();
        }else{
          alert('Login falló ');
        }
        console.log('Loggged into Facebook: ',res)
      })
      .catch(e=>console.log('Error logging into Facebook',e));
  }
  getData(access_token: string){
    let url = 'https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token='+access_token;
    this.http.get(url).subscribe(data=>{
      this.userdata = JSON.stringify(data);
      console.log(data);
    });
  }

  onRegister() {
    var stringify = JSON.parse(this.userdata);
    var nombre = stringify['name'];
    var first = stringify['first_name'];
    var last = stringify['last_name'];
    var email = stringify['email'];
    

    this.usuario = new NuevoUsuario(first, nombre, email, nombre+last);
    this.authService.registro(this.usuario).subscribe(data => {
      this.isRegister = true;
      this.isRegisterFail = false;
      this.presentToast();
    },
      (error: any) => {
        this.errorMsg = error.error.mensaje;
        this.isRegister = false;
        this.isRegisterFail = true;
        this.presentAlert();
      }
    );
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Fail en el registro',
      message: this.errorMsg,
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
