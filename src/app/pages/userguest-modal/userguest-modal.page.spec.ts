import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserguestModalPage } from './userguest-modal.page';

describe('UserguestModalPage', () => {
  let component: UserguestModalPage;
  let fixture: ComponentFixture<UserguestModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserguestModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserguestModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
