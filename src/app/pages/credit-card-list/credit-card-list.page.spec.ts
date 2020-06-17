import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreditCardListPage } from './credit-card-list.page';

describe('CreditCardListPage', () => {
  let component: CreditCardListPage;
  let fixture: ComponentFixture<CreditCardListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCardListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCardListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
