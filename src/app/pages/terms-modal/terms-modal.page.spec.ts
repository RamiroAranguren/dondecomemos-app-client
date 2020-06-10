import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TermsModalPage } from './terms-modal.page';

describe('TermsModalPage', () => {
  let component: TermsModalPage;
  let fixture: ComponentFixture<TermsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
