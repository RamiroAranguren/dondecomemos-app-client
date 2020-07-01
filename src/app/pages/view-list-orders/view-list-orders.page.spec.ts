import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewListOrdersPage } from './view-list-orders.page';

describe('ViewListOrdersPage', () => {
  let component: ViewListOrdersPage;
  let fixture: ComponentFixture<ViewListOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewListOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewListOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
