import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showPrivacyModal() {
    // let modal = this.modal.create(PrivacyPolicyPage, {show: true});
    // modal.present();
  }

  showTermsModal() {
    // let modal = this.modal.create(TermsOfServicePage, {show: true});
    // modal.present();
  }

}
