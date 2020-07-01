import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookTablePage } from './book-table.page';

describe('BookTablePage', () => {
  let component: BookTablePage;
  let fixture: ComponentFixture<BookTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookTablePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
