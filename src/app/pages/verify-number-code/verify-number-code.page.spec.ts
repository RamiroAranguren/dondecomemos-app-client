import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifyNumberCodePage } from './verify-number-code.page';

describe('VerifyNumberCodePage', () => {
  let component: VerifyNumberCodePage;
  let fixture: ComponentFixture<VerifyNumberCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyNumberCodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyNumberCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
