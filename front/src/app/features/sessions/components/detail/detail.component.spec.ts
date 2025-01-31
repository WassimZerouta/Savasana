import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';


import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Router } from '@angular/router';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of({ id: 1, teacher_id: 2, users: [1, 2] })),
    delete: jest.fn().mockReturnValue(of(null)),
    participate: jest.fn().mockReturnValue(of(null)),
    unParticipate: jest.fn().mockReturnValue(of(null)),
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of({ id: 2, firstName: 'Margot', lastName: 'Delahaye' })),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session on initialization', () => {
    component.ngOnInit();

    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual({ id: 1, teacher_id: 2, users: [1, 2] });
    expect(component.isParticipate).toBeTruthy();
    expect(mockTeacherService.detail).toHaveBeenCalledWith('2');
    expect(component.teacher).toEqual({ id: 2, firstName: 'Margot', lastName: 'Delahaye' });
  });

  it('should delete session and navigate to sessions', () => {
    component.delete();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should participate in a session', () => {
    component.participate();

    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });

  it('should unparticipate from a session', () => {
    component.unParticipate();

    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });

  it('should navigate back on back() call', () => {
    const spy = jest.spyOn(window.history, 'back');

    component.back();

    expect(spy).toHaveBeenCalled();
  });
});