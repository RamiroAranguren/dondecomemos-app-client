import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';


@Component({
    selector: 'app-step-functions',
    templateUrl: './step-functions.page.html',
    styleUrls: ['./step-functions.page.scss'],
})
export class StepFunctionsPage implements OnInit {

    @ViewChild(IonSlides) slide: IonSlides;
    nexButton = true;
    backButton = false;
    activeDefault = false;

    imgActive = 'assets/img/step-functions/step1.svg';

    slides = [
        {
            img: 'assets/img/step-functions/step-1.png',
            alt: 'step-1',
            title: 'Busque un restaurante',
            description: 'Podrá encontrar sus restaurantes<br>favoritos, con cartas actualizadas<br> y menús del día.',
        },
        {
            img: 'assets/img/step-functions/step-2.png',
            alt: 'step-2',
            title: 'Pre-ordene la comida',
            description: 'Y especifique a que hora llegará<br> al restaurante. También puede<br> simplemente reservar una mesa.',
        },
        {
            img: 'assets/img/step-functions/step-3.png',
            alt: 'step-3',
            title: 'Pague desde la app',
            description: 'Podrá retirarse cuando lo<br> desee, sin pedir la cuenta.',
        },
        {
            img: 'assets/img/step-functions/step-4.png',
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
        private navCtrl: NavController
    ) { }

    ngOnInit() {
    }

    changeSlide() {
        this.handleSlide();
    }

    next() {
        this.handleSlide();
    }
    back() {
        this.handleSlide(true);
    }

    handleSlide(back: boolean = false) {
        this.slide.getActiveIndex().then(index => {
            back ? this.imgActive = `assets/img/step-functions/step${index}.svg`
                : this.imgActive = `assets/img/step-functions/step${index + 2}.svg`;

            if (index === 0 || index === 2) {
                this.activeDefault = true;
            } else {
                this.activeDefault = false;
            }
            if (index === 2) {
                this.nexButton = false;
            }
            if(back && index == 1){
                this.backButton = false;
            }
            if(!back){
                this.backButton = true;
            }
            if(back){
                this.slide.slidePrev();
                this.nexButton = true
            } else {
                this.slide.slideNext()
            }
        });
    }

    goStart() {
        this.navCtrl.navigateRoot('/start', { animated: true })
    }

}
