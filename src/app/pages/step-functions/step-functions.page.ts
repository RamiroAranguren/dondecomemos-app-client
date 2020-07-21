import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController, Platform } from '@ionic/angular';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';


@Component({
    selector: 'app-step-functions',
    templateUrl: './step-functions.page.html',
    styleUrls: ['./step-functions.page.scss'],
})
export class StepFunctionsPage implements OnInit {
    backbuttonSubscription: any;
    @ViewChild(IonSlides) slide: IonSlides;
    nexButton = true;
    backButton = false;
    activeDefault = false;
    stepNumber: number = 1;

    imgActive = 'assets/img/step-functions/step1.svg';

    slides = [
        {
            img: 'assets/img/step-functions/svg/step-1.svg',
            alt: 'step-1',
            title: 'Busque un restaurante',
            description: 'Podrá encontrar sus restaurantes<br>favoritos, con cartas actualizadas<br> y menús del día.',
        },
        {
            img: 'assets/img/step-functions/svg/step-2.svg',
            alt: 'step-2',
            title: 'Pre-ordene la comida',
            description: 'Y especifique a que hora llegará<br> al restaurante. También puede<br> simplemente reservar una mesa.',
        },
        {
            img: 'assets/img/step-functions/svg/step-3.svg',
            alt: 'step-3',
            title: 'Pague desde la app',
            description: 'Podrá retirarse cuando lo<br> desee, sin pedir la cuenta.',
        },
        {
            img: 'assets/img/step-functions/svg/step-4.svg',
            alt: 'step-4',
            title: 'Disfrute de la experiencia',
            description: 'El restaurante lo esperará<br> con la comida lista!<br> Sin filas, sin esperas.',
        }
    ];

    slideOptions = {
        allowTouchMove: false,
        simulateTouch: false
    }


    constructor(
        private navCtrl: NavController,
        private appMinimize: AppMinimize,
        private platform: Platform,
    ) { }

    ngOnInit() {
    }

    ionViewDidEnter() {
        this.suscribeToMinimizeApp();
    }

    ionViewWillLeave() {
        this.unsuscribeButton();
    }

    changeSlide() {
        this.handleSlide();
    }

    suscribeToMinimizeApp() {
        this.backbuttonSubscription = this.platform.backButton.subscribe(() => {
            console.log('minimize');
            this.appMinimize.minimize();
        });
    }

    backButtonSlide() {
        this.backbuttonSubscription = this.platform.backButton.subscribe(() => {
            console.log('backslide');
            this.back();
        });
    }

    unsuscribeButton() {
        this.backbuttonSubscription.unsubscribe();
    }

    next() {
        this.unsuscribeButton();
        this.backButtonSlide();
        this.handleSlide();
        this.stepNumber++;
    }

    back() {
        if (this.stepNumber == 1) {
            this.unsuscribeButton();
            this.suscribeToMinimizeApp();
        } else {
            this.handleSlide(true);
            this.stepNumber--;
            if (this.stepNumber == 1) {
                this.unsuscribeButton();
                this.suscribeToMinimizeApp();
            }
        }
    }

    handleSlide(back: boolean = false) {
        
        if (back) {
            this.imgActive = `assets/img/step-functions/step${this.stepNumber - 1}.svg`;
            this.slide.slidePrev();
        } else {
            this.imgActive = `assets/img/step-functions/step${this.stepNumber + 1}.svg`;
            this.slide.slideNext();
        }
      
    }

    goStart() {
        this.navCtrl.navigateRoot('/start', { animated: true })
    }

}
