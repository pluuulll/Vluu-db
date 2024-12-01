import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecomendacionesPage } from './recomendaciones.page';

describe('RecomendacionesPage', () => {
  let component: RecomendacionesPage;
  let fixture: ComponentFixture<RecomendacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecomendacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
