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

  spinnHs = true;
  spinnPay = true;
  spinnService = true;
  services:any;
  payment_methods:any;

  hours_open = {
    Lun: [],
    Mar: [],
    Mie: [],
    Jue: [],
    Vie: [],
    Sab: [],
    Dom: [],
    Feriados: [],
  };

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
      this.spinnService = false;
    });

    this.paymentsService.get(this.restaurant.id).then((res:any) => {
      console.log("RES-PAYMENTS", res);
      let result = res.map(method => method.name);
      this.payment_methods = result.join(", ");
      this.spinnPay = false;
    });

    this.hoursOpenService.get(this.restaurant.id).then((res:any) => {
      console.log("RES-HOURS", res);
      this.spinnHs = false;
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
        switch (day.day) {
          case "lunes":
            days.Lun.push({open: day.opening_hour?.substring(0,5), close: day.closing_hour?.substring(0,5)})
            break;
          case "martes":
            days.Mar.push({open: day.opening_hour?.substring(0,5), close: day.closing_hour?.substring(0,5)})
            break;
          case "miércoles":
            days.Mie.push({open: day.opening_hour?.substring(0,5), close: day.closing_hour?.substring(0,5)})
            break;
          case "jueves":
            days.Jue.push({open: day.opening_hour?.substring(0,5), close: day.closing_hour?.substring(0,5)})
            break;
          case "viernes":
            days.Vie.push({open: day.opening_hour?.substring(0,5), close: day.closing_hour?.substring(0,5)})
            break;
          case "sábado":
            days.Sab.push({open: day.opening_hour?.substring(0,5), close: day.closing_hour?.substring(0,5)})
            break;
          case "domingo":
            days.Dom.push({open: day.opening_hour?.substring(0,5), close: day.closing_hour?.substring(0,5)})
            break;
          case "Feriado":
            days.Feriados.push({open: day.opening_hour?.substring(0,5), close: day.closing_hour?.substring(0,5)})
            break;
          default:
            break;
        }
      });

      this.hours_open = days;

      console.log("HS", this.hours_open);
    });

  }

}
