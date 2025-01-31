import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { FormComponent } from './form.component';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(
      of({
        id: 1,
        name: 'Session1',
        date: '2025-01-01',
        teacher_id: 2,
        description: 'Session1 description',
      })
    ),
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({})),
  };

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(
      of([
        { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
        { id: 2, firstName: 'Thiercelin', lastName: 'Hélène' },
      ])
    ),
  };

  const mockRouter = {
    navigate: jest.fn(),
    url: '/sessions/create',
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1'),
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form for creation', () => {
    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm?.value).toEqual({
      name: '',
      date: '',
      teacher_id: '',
      description: '',
    });
  });

  it('should initialize the form for update', () => {
    mockRouter.url = '/sessions/update/1';
    component.ngOnInit();

    expect(component.onUpdate).toBe(true);
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.sessionForm?.value).toEqual({
      name: 'Session1',
      date: '2025-01-01',
      teacher_id: 2,
      description: 'Session1 description',
    });
  });

  it('should submit the form for creation', () => {
    component.onUpdate = false;
    component.sessionForm?.setValue({
      name: 'New Session',
      date: '2025-01-01',
      teacher_id: 1,
      description: 'New session description',
    });

    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalledWith({
      name: 'New Session',
      date: '2025-01-01',
      teacher_id: 1,
      description: 'New session description',
    });
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', {
      duration: 3000,
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should submit the form for update', () => {
    component.onUpdate = true;
    component.sessionForm?.setValue({
      name: 'Updated Session',
      date: '2025-01-02',
      teacher_id: 2,
      description: 'Updated session description',
    });

    component.submit();

    expect(mockSessionApiService.update).toHaveBeenCalledWith('1', {
      name: 'Updated Session',
      date: '2025-01-02',
      teacher_id: 2,
      description: 'Updated session description',
    });
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', {
      duration: 3000,
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });
});