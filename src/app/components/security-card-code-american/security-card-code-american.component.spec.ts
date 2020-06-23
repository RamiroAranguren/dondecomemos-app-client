import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SecurityCardCodeAmericanComponent } from './security-card-code-american.component';

describe('SecurityCardCodeAmericanComponent', () => {
  let component: SecurityCardCodeAmericanComponent;
  let fixture: ComponentFixture<SecurityCardCodeAmericanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityCardCodeAmericanComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityCardCodeAmericanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
