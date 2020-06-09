import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LegalModalPage } from './legal-modal.page';

describe('LegalModalPage', () => {
  let component: LegalModalPage;
  let fixture: ComponentFixture<LegalModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LegalModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
