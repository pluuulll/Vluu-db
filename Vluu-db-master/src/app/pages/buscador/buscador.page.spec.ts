import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscadorPage } from './buscador.page';

describe('BuscadorPage', () => {
  let component: BuscadorPage;
  let fixture: ComponentFixture<BuscadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
