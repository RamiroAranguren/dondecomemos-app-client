import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.page.html',
  styleUrls: ['./book-table.page.scss'],
})
export class BookTablePage implements OnInit {
    slideOptionsDate = {
        slidesPerView: 4,
    }
    days = ['lun', 'mar', 'mie', 'jue', 'vie','sab', 'dom']
  constructor() { }

  ngOnInit() {
  }

}
