import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { UsersService } from '../../services/users/user.service';
import { UserInterface } from '../../interfaces/user';
import { StorageService } from '../../services/storage/storage.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ToastService } from '../../services/toast/toast.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    guestStatus = true;
    menuHide = false;
    backButtonSuscription: any;

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
        private navCtrl: NavController,
        private userService: UsersService,
        private storage: StorageService,
        private loader: LoaderService,
        public formBuild: FormBuilder,
        private toast: ToastService,
        private platform: Platform,
        private router: Router
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
            this.initals = `${this.user.first_name.slice(0, 1)}${this.user.last_name.slice(0, 1)}`;
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
        let isGuest = this.userService.isGuestUser();
        if (isGuest) {
            this.guestStatus = true;
        } else {
            this.guestStatus = false;
            this.menuHide = true;
        }
        this.backToHomeSuscription();
    }


    ionViewWillLeave() {
        this.guestStatus = true;
        this.menuHide = false;
        this.backButtonSuscription.unsubscribe();
    }

    backToHomeSuscription() {
        this.backButtonSuscription = this.platform.backButton.subscribe(() => {
            this.router.navigate(['tabs/home'])
        })
    }

    async logOut() {
        const alert = await this.alertCtrl.create({
            header: 'Cerrar Sesión',
            message: '¿Seguro quiere cerrar sesión?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Cerrar sesión',
                    handler: () => {
                        this.userService.logout();
                        this.userService.loginAsGuest();
                        this.navCtrl.navigateRoot('/tabs/home');
                    }
                }
            ]
        });

        await alert.present();
    }

    legalView() {
        this.backButtonSuscription.unsubscribe();
        this.navCtrl.navigateForward(['/legal'])
    }

    dataView() {
        this.backButtonSuscription.unsubscribe();
        this.navCtrl.navigateForward(['/profile-data']);
    }

    login() {
        this.navCtrl.navigateForward(['/login']);
    }

    register() {
        this.navCtrl.navigateForward(['/register']);
    }

    loginGoogle() {
        console.log('fcbk');
    }

    loginFcbk() {
        console.log('g+');
    }

    addError(key, msg) {
        this.errors[key].push(msg)
    }

    field(fieldName) {
        return this.form.controls[fieldName]
    }

}
