import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-code',
  templateUrl: './card-code.component.html',
  styleUrls: ['./card-code.component.scss'],
})
export class CardCodeComponent implements OnInit {

  @Input() id;
  @Input() user;

  constructor() { }

  ngOnInit() {}

}
