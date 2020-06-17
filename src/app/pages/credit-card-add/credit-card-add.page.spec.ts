import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreditCardAddPage } from './credit-card-add.page';

describe('CreditCardAddPage', () => {
  let component: CreditCardAddPage;
  let fixture: ComponentFixture<CreditCardAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCardAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCardAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
