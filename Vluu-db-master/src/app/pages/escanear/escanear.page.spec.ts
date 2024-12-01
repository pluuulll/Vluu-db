import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscanearPage } from './escanear.page';

describe('EscanearPage', () => {
  let component: EscanearPage;
  let fixture: ComponentFixture<EscanearPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscanearPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
