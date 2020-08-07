import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-modal-galery',
  templateUrl: './modal-galery.page.html',
  styleUrls: ['./modal-galery.page.scss'],
})
export class ModalGaleryPage implements OnInit {

  @ViewChild('slides') slide: IonSlides;

  @Input() pictures;
  @Input() index;

  options = {
    initialSlide: this.index,
    speed: 400,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  };

  constructor() { }

  ngOnInit() { }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.options = {
      initialSlide: this.index,
      speed: 400,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    };

    this.slide.slideTo(this.index, 10);

  }

  nextSlide() {
    this.slide.slideNext();
  }

  prevSlide () {
    this.slide.slidePrev();
  }

}
