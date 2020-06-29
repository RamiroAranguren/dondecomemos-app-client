import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddItemOrderPage } from './add-item-order.page';

describe('AddItemOrderPage', () => {
  let component: AddItemOrderPage;
  let fixture: ComponentFixture<AddItemOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
