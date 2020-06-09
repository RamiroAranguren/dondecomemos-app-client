import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryPasswordEmailStep1Page } from './recovery-password-email-step1.page';

describe('RecoveryPasswordEmailStep1Page', () => {
  let component: RecoveryPasswordEmailStep1Page;
  let fixture: ComponentFixture<RecoveryPasswordEmailStep1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryPasswordEmailStep1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryPasswordEmailStep1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
