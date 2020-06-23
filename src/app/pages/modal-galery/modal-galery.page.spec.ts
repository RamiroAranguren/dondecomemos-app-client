import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalGaleryPage } from './modal-galery.page';

describe('ModalGaleryPage', () => {
  let component: ModalGaleryPage;
  let fixture: ComponentFixture<ModalGaleryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGaleryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalGaleryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
