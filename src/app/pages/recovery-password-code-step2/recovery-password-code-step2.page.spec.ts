import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryPasswordCodeStep2Page } from './recovery-password-code-step2.page';

describe('RecoveryPasswordCodeStep2Page', () => {
  let component: RecoveryPasswordCodeStep2Page;
  let fixture: ComponentFixture<RecoveryPasswordCodeStep2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryPasswordCodeStep2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryPasswordCodeStep2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
