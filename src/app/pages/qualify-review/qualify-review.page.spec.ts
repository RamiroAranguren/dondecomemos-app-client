import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QualifyReviewPage } from './qualify-review.page';

describe('QualifyReviewPage', () => {
  let component: QualifyReviewPage;
  let fixture: ComponentFixture<QualifyReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualifyReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QualifyReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
