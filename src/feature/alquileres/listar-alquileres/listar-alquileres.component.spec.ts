import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAlquileresComponent } from './listar-alquileres.component';

describe('ListarAlquileresComponent', () => {
  let component: ListarAlquileresComponent;
  let fixture: ComponentFixture<ListarAlquileresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAlquileresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarAlquileresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
