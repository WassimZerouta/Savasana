import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from 'src/app/services/session.service';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';


import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockSessionService = {
    logIn: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.form;
    expect(form.value).toEqual({ email: '', password: '' });
  });

  it('should mark the form as invalid if required fields are empty', () => {
    const form = component.form;
    form.patchValue({ email: '', password: '' });
    expect(form.valid).toBeFalsy();
  });

  it('should mark the form as valid if all fields are correctly filled', () => {
    const form = component.form;
    form.patchValue({ email: 'test@example.com', password: 'password123' });
    expect(form.valid).toBeTruthy();
  });

  it('should call authService.login and navigate to /sessions on successful login', () => {
    const mockResponse = { token: 'mockToken', id: 1, admin: true } as any;
    mockAuthService.login.mockReturnValue(of(mockResponse));

    component.form.patchValue({ email: 'test@example.com', password: 'password123' });
    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(mockSessionService.logIn).toHaveBeenCalledWith(mockResponse);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true if login fails', () => {
    mockAuthService.login.mockReturnValue(throwError(() => new Error('Login failed')));

    component.form.patchValue({ email: 'test@example.com', password: 'aaaa' });
    component.submit();

    expect(component.onError).toBeTruthy();
  });
});