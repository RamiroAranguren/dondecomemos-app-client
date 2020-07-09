import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reserve-info',
  templateUrl: './reserve-info.component.html',
  styleUrls: ['./reserve-info.component.scss'],
})
export class ReserveInfoComponent implements OnInit {

  @Input() availability;

  constructor() { }

  ngOnInit() {}

}
