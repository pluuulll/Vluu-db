import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscadorapiPage } from './buscadorapi.page';

describe('BuscadorapiPage', () => {
  let component: BuscadorapiPage;
  let fixture: ComponentFixture<BuscadorapiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorapiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
