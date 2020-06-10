import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoaderService } from '../../services/loader/loader.service';
import { UsersService } from '../../services/users/user.service';

@Component({
  selector: 'app-recovery-password-email-step1',
  templateUrl: './recovery-password-email-step1.page.html',
  styleUrls: ['./recovery-password-email-step1.page.scss'],
})
export class RecoveryPasswordEmailStep1Page implements OnInit {

  type = 'password';
  user:any;
  form: FormGroup;

  errors = {
    email: []
  }

  userRegister = {
    email: ""
  }

  constructor(
    private loader: LoaderService,
    private userService: UsersService,
    private route: Router,
    public formBuild: FormBuilder,
    public navCtrl: NavController,
  ) {
    this.form = this.formBuild.group({
        "email": ["", [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ], []]
    });
  }

  ngOnInit() {
    this.user = this.route.getCurrentNavigation().extras.state.data;
    this.userRegister.email = this.user.email;
  }

  doRegister() {

    if (this.form.valid) {
      let navigationExtras: NavigationExtras = {
        state: {data: this.userRegister}
      };
      this.loader.display('Verificando email');
      this.userService.recoverPassword(this.userRegister.email).then(res => {
        this.loader.hide();
        this.navCtrl.navigateForward(['/recovery-password-code-step2'], navigationExtras);
      }).catch(err => {
        this.loader.hide();
        this.errors.email = ["Error: Email inválido."];
      })

    }

  }

  checkEmail() {
    this.errors.email = [];
    if (this.field('email').invalid)
      this.addError("email", "Error: Email inválido.");
  }

  addError(key, msg) {
    this.errors[key].push(msg);
  }

  field(fieldName) {
    return this.form.controls[fieldName]
  }

}