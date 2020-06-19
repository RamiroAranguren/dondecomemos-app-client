import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-code',
  templateUrl: './card-code.component.html',
  styleUrls: ['./card-code.component.scss'],
})
export class CardCodeComponent implements OnInit {
  inputFocus:boolean= false; 

  constructor() { }

  ngOnInit() {}

  setFocus(){
    this.inputFocus= true;
    console.log("focus ")
  }

  onBlur(){
    this.inputFocus = false;
    console.log("blur")
  }


}
