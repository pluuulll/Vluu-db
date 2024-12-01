import { ComponentFixture, TestBed } from '@angular/core/testing';
import { E404Page } from './e404.page';

describe('E404Page', () => {
  let component: E404Page;
  let fixture: ComponentFixture<E404Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(E404Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
