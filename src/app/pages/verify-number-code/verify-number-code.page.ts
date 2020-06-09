import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-verify-number-code',
  templateUrl: './verify-number-code.page.html',
  styleUrls: ['./verify-number-code.page.scss'],
})
export class VerifyNumberCodePage implements OnInit {

  form: FormGroup;

  user:any;

  errors = {
    code: []
  }

  numberRegister = {
    code: null
  }

  constructor(
    private route: Router,
    public formBuild: FormBuilder,
    private navCtrl: NavController
  ) {
    this.form = this.formBuild.group({
        "code": ["", [
          Validators.required, Validators.minLength(4)
        ], []],
    });
  }

  ngOnInit() {
    this.user = this.route.getCurrentNavigation().extras.state.data;
  }

  doVerify() {
    console.log("doVerifyCode");
    console.log("validando code...");
    setTimeout(() => {
      let navigationExtras: NavigationExtras = {state: {data: this.user}};
      this.navCtrl.navigateRoot(['/login'], navigationExtras);
      // this.navCtrl.navigateRoot('/login');
    }, 3000);
  }

}
