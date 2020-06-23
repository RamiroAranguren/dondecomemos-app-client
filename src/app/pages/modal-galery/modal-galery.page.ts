import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { restaurant } from 'src/app/interfaces/restaurant';

@Component({
  selector: 'app-modal-galery',
  templateUrl: './modal-galery.page.html',
  styleUrls: ['./modal-galery.page.scss'],
})
export class ModalGaleryPage implements OnInit {

  @ViewChild('slides', {static: true}) slides: IonSlides;

  @Input() pictures;
  @Input() index;

  options = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  }

  constructor() { }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    console.log("index", this.index);
    // this.slides.slideTo(this.index, 2000);
    this.slides.slideTo(this.index, 2000);

  }

  nextSlide() {
    console.log('CLick next')
    this.slides.slideNext();
  }

  prevSlide () {
    console.log('CLick prev')
    this.slides.slidePrev();
  }

}
