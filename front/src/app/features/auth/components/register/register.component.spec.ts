import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';


import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockAuthService = {
    register: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.form;
    expect(form.value).toEqual({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    });
  });

  it('should mark the form as invalid if required fields are empty', () => {
    const form = component.form;
    form.patchValue({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    });
    expect(form.valid).toBeFalsy();
  });

  it('should mark the form as valid if all fields are filled correctly', () => {
    const form = component.form;
    form.patchValue({
      email: 'wassim.zerouta@gmail.com',
      firstName: 'Wassim',
      lastName: 'Zerouta',
      password: 'wasswass123',
    });
    expect(form.valid).toBeTruthy();
  });

  it('should call authService.register and navigate to /login on successful submit', () => {
    mockAuthService.register.mockReturnValue(of(void 0));

    component.form.patchValue({
      email: 'wassim.zerouta@gmail.com',
      firstName: 'Wassim',
      lastName: 'Zerouta',
      password: 'wasswass123',
    });

    component.submit();

    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'wassim.zerouta@gmail.com',
      firstName: 'Wassim',
      lastName: 'Zerouta',
      password: 'wasswass123',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true if register fails', () => {
    mockAuthService.register.mockReturnValue(throwError(() => new Error('Registration failed')));

    component.form.patchValue({
      email: 'wassim.zerouta@gmail.com',
      firstName: 'Wassim',
      lastName: 'Zerouta',
      password: 'wasswass123',
    });

    component.submit();

    expect(component.onError).toBeTruthy();
  });
});