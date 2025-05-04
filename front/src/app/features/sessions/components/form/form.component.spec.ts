import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { FormComponent } from './form.component';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';

describe('FormComponent (integration)', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let httpMock: HttpTestingController;
  let sessionService: SessionService;

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
        HttpClientTestingModule,
        RouterTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      declarations: [FormComponent],
      providers: [
        SessionService,
        SessionApiService,
        TeacherService,
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);

    sessionService.logIn({
      id: 1,
      username: 'testUser',
      firstName: 'Wassim',
      lastName: 'Zerouta',
      token: 'abc',
      type: 'Bearer',
      admin: true,
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    const teacherReq = httpMock.expectOne('api/teacher');
    teacherReq.flush([]);
    expect(component).toBeTruthy();
  });

  it('should initialize the form for creation', () => {
    const teacherReq = httpMock.expectOne('api/teacher');
    teacherReq.flush([]);
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

    const teacherReq = httpMock.expectOne('api/teacher');
    teacherReq.flush([
      { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
      { id: 2, firstName: 'Thiercelin', lastName: 'Hélène' },
    ]);

    const detailReq = httpMock.expectOne('api/session/1');
    detailReq.flush({
      id: 1,
      name: 'Session1',
      date: '2025-01-01',
      teacher_id: 2,
      description: 'Session1 description',
    });

    expect(component.onUpdate).toBe(true);
    expect(component.sessionForm?.value).toEqual({
      name: 'Session1',
      date: '2025-01-01',
      teacher_id: 2,
      description: 'Session1 description',
    });
  });

  it('should submit the form for creation', (done) => {
    component.onUpdate = false;
    component.initForm();
  
    component.teachers$.subscribe();
  
    const teacherReq = httpMock.expectOne('api/teacher');
    teacherReq.flush([
      { id: 1, firstName: 'Margot', lastName: 'Delahaye' }
    ]);
  
    fixture.whenStable().then(() => {
      fixture.detectChanges();
  
      component.sessionForm?.setValue({
        name: 'New Session',
        date: '2025-01-01',
        teacher_id: 1,
        description: 'New session description',
      });
  
      component.submit();
  
      const createReq = httpMock.expectOne('api/session');
      expect(createReq.request.method).toBe('POST');
      expect(createReq.request.body).toEqual({
        name: 'New Session',
        date: '2025-01-01',
        teacher_id: 1,
        description: 'New session description',
      });
      createReq.flush({});
  
      expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', {
        duration: 3000,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  
      done();
    });
  });

  it('should submit the form for update', (done) => {
    mockRouter.url = '/sessions/update/1';
    component.ngOnInit();
  
    component.teachers$.subscribe();
  
    const teacherReq = httpMock.expectOne('api/teacher');
    teacherReq.flush([
      { id: 2, firstName: 'Thiercelin', lastName: 'Hélène' }
    ]);
  
    const detailReqs = httpMock.match('api/session/1');
    expect(detailReqs.length).toBeGreaterThan(0);
  
    detailReqs[0].flush({
      id: 1,
      name: 'Session1',
      date: '2025-01-01',
      teacher_id: 2,
      description: 'Session1 description',
    });
  
    fixture.whenStable().then(() => {
      fixture.detectChanges();
  
      component.sessionForm?.setValue({
        name: 'Updated Session',
        date: '2025-01-02',
        teacher_id: 2,
        description: 'Updated session description',
      });
  
      component.submit();
  
      const updateReq = httpMock.expectOne('api/session/1');
      expect(updateReq.request.method).toBe('PUT');
      expect(updateReq.request.body).toEqual({
        name: 'Updated Session',
        date: '2025-01-02',
        teacher_id: 2,
        description: 'Updated session description',
      });
      updateReq.flush({});
  
      expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', {
        duration: 3000,
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  
      done();
    });
  });
});