import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreOrderPage } from './pre-order.page';

describe('PreOrderPage', () => {
  let component: PreOrderPage;
  let fixture: ComponentFixture<PreOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
