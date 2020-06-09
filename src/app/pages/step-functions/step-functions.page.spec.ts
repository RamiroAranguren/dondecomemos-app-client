import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StepFunctionsPage } from './step-functions.page';

describe('StepFunctionsPage', () => {
  let component: StepFunctionsPage;
  let fixture: ComponentFixture<StepFunctionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepFunctionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StepFunctionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
