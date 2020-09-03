import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserInterface } from '../../interfaces/user';
import { StorageService } from 'src/app/services/storage/storage.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UsersService } from 'src/app/services/users/user.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ModalController, NavController, Platform, AlertController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.page.html',
  styleUrls: ['./profile-data.page.scss'],
})
export class ProfileDataPage implements OnInit {
  guestStatus = true;
  menuHide = false;
  profile = false;
  legal = false;
  backButtonSuscription: any;
  changedInputState: boolean = false

  result = false;

  initals = "";

  form: FormGroup;

  errors = {
    email: [],
    phone: [],
    firstName: [],
    lastName: []
  }

  user: any = {
    id: "",
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    token: "",
    guest: false,
    phone: null
  };

  options = {
    option1: false,
    option2: true
  }

  constructor(
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    private userService: UsersService,
    private storage: StorageService,
    private loader: LoaderService,
    public formBuild: FormBuilder,
    private toast: ToastService,
    private platform: Platform,
  ) {
    this.form = this.formBuild.group({
      "first_name": ["", [Validators.required], []],
      "last_name": ["", [Validators.required], []],
      "email": ["", [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ], []],
      "phone": ["", [
        Validators.required
      ], []],
    });
  }

  ngOnInit() {
    this.storage.getObject("user").then((user: UserInterface) => {
      this.user = user;
      this.user.phone = `+54${user.phone}`;
      this.initals = `${this.user.first_name.slice(0, 1)}${this.user.last_name.slice(0, 1)}`;
      this.changedInputState = false;
    }).catch(err => {
        this.user = {
          id: "",
          username: "",
          password: "",
          email: "",
          first_name: "",
          last_name: "",
          token: "",
          guest: true,
          phone: null
        };
      });

  }

  ionViewDidEnter() {
    //this.backButtonSuscription = this.platform.backButton.subscribeWithPriority(100, () => {
      //this.closeProfile();
    //})
  }

  ionViewWillLeave() {
    //this.backButtonSuscription.unsubscribe();
  }

  changedInput() {
    if (this.user.first_name !== this.userService.user.first_name ||
      this.user.last_name !== this.userService.user.last_name ||
      this.user.email !== this.userService.user.email ||
      this.user.phone != this.userService.user.phone) {
      this.changedInputState = true;
    } else {
      this.changedInputState = false;
    }

  }
  // FUNCTIONS PROFILE DATA
  saveProfile() {

    this.errors.email = [];
    if (this.field('email').invalid) {
      this.addError("email", "Error: Email inválido.");
    } else {
      this.menuHide = false;
      this.guestStatus = false;
      this.legal = false;

      this.loader.display("Guardando cambios...");
      let phone = (this.user.phone).includes("+54") ? this.user.phone.slice(3) : this.user.phone;
      this.userService.saveChanges(this.user.first_name, this.user.last_name, this.user.email, phone, this.user.password)
        .then(() => {
          this.loader.hide();
          this.toast.show("Datos modificados con éxito", 2500);
        })
        .catch(errors => {
          console.log(errors);
          this.toast.show("Ocurrió un error al intentar modificar", 2500);
          this.loader.hide()
        });
    }
  }

  closeProfile() {
    let changes = this.changeForm();
    if (!changes) {
      this.navCtrl.navigateBack(['tabs/profile']);
    }
  }

  changePassword() {
    let navigationExtras: NavigationExtras = { state: { data: this.user } };
    this.navCtrl.navigateForward(['/change-old-password'], navigationExtras);
  }

  changeForm() {
    if (this.user.first_name !== this.userService.user.first_name ||
      this.user.last_name !== this.userService.user.last_name ||
      this.user.email !== this.userService.user.email ||
      this.user.phone.slice(3) !== this.userService.user.phone) {
      this.showAlert();
      this.result = true;
    } else {
      this.result = false;
    }
    return this.result;
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: '¿Descartar cambios?',
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            return;
          }
        },
        {
          text: 'Descartar',
          handler: data => {
            this.navCtrl.navigateBack(['tabs/profile']);
            return;
          }
        }
      ]
    });

    await alert.present();
  }

  checkEmail() {
    this.errors.email = [];
    if (this.field('email').invalid) {
      this.addError("email", "Error: Email inválido.");
    } else {
      this.errors.email = [];
    }
  }

  addError(key, msg) {
    this.errors[key].push(msg)
  }

  field(fieldName) {
    return this.form.controls[fieldName]
  }

}
