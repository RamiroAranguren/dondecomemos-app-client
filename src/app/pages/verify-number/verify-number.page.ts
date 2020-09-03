import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavController, IonInput } from '@ionic/angular';


@Component({
  selector: 'app-verify-number',
  templateUrl: './verify-number.page.html',
  styleUrls: ['./verify-number.page.scss'],
})
export class VerifyNumberPage implements OnInit {

  form: FormGroup;

  user:any;

  errors = {
    phone: []
  }

  numberRegister = {
    phone: null
  };

  constructor(
    private route: Router,
    private formBuild: FormBuilder,
    private navCtrl: NavController
  ) {
    this.form = this.formBuild.group({
        phone: [null, [Validators.required]],
        // "phone": ["", [
        //   Validators.required, Validators.minLength(9)
        // ], []],
    });
  }

  ngOnInit() {
    this.user = this.route.getCurrentNavigation().extras.state.data;
  }

  doVerify() {
    this.user.phone = this.numberRegister.phone.slice(3);
    console.log("Pasar a cargar codigo", this.user);
    let navigationExtras: NavigationExtras = {state: {data: this.user}};
    this.navCtrl.navigateForward(['/verify-number-code'], navigationExtras);
  }

}
