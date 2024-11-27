import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostrardatosPage } from './mostrardatos.page';

describe('MostrardatosPage', () => {
  let component: MostrardatosPage;
  let fixture: ComponentFixture<MostrardatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrardatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
