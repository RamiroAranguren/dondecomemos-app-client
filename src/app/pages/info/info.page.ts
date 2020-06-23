import { Component, OnInit } from '@angular/core';
import { restaurant } from 'src/app/interfaces/restaurant';
import { Router } from '@angular/router';
import { ServiceRestaurantService } from '../../services/services-restaurant/service-restaurant.service';
import { PaymentsMethodsService } from 'src/app/services/payments-methods/payments-methods.service';
import { HoursService } from 'src/app/services/hours/hours.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  restaurant:restaurant;

  services:any;
  payment_methods = [];
  hours_open = [];

  constructor(
    private route: Router,
    private servicesService: ServiceRestaurantService,
    private paymentsService: PaymentsMethodsService,
    private hoursOpenService: HoursService
  ) { }

  ngOnInit() {
    this.restaurant = this.route.getCurrentNavigation().extras.state.data;
    this.getInfoComplement();
  }

  getInfoComplement() {
    this.servicesService.get(this.restaurant.id).then((res:any) => {
      console.log("RES-SERVICES", res);
      let result = res.map(service => service.name);
      this.services = result.join(", ");
    });

    this.paymentsService.get(this.restaurant.id).then((res:any) => {
      console.log("RES-PAYMENTS", res);
      this.payment_methods = res;
    });

    this.hoursOpenService.get(this.restaurant.id).then((res:any) => {
      console.log("RES-HOURS", res);
      let days = {
        Lun: [],
        Mar: [],
        Mie: [],
        Jue: [],
        Vie: [],
        Sab: [],
        Dom: [],
        Feriados: [],
      };
      res.filter(day => {
        if (day.day === 'lunes'){
          days.Lun.push({open: day.opening_hour, close: day.closing_hour})
        }
      })
      this.hours_open = res;
    });
  }

}
