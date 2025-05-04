import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MeComponent } from './me.component';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { expect } from '@jest/globals';

describe('MeComponent (integration)', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let httpMock: HttpTestingController;
  let sessionService: SessionService;

  const mockSnackBar = {
    open: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        SessionService,
        UserService,
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);

    sessionService.logIn({
      token: 'test-token',
      type: 'Bearer',
      id: 1,
      username: 'testUser',
      firstName: 'Wassim',
      lastName: 'Zerouta',
      admin: true,
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    const req = httpMock.expectOne('api/user/1');
    req.flush({ id: 1, firstName: 'Wassim', lastName: 'Zerouta' });
  
    expect(component).toBeTruthy();
  });

  it('should fetch user on init', () => {
    const mockUser = { id: 1, firstName: 'Wassim', lastName: 'Zerouta' };
  
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  
    expect(component.user).toEqual(mockUser);
  });

  it('should delete user and navigate to home', () => {
    httpMock.expectOne('api/user/1').flush({ id: 1, firstName: 'Wassim', lastName: 'Zerouta' });
  
    component.delete();
  
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(sessionService.sessionInformation).toBeUndefined();
    expect(sessionService.isLogged).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
  

  it('should call history.back on back()', () => {
    httpMock.expectOne('api/user/1').flush({ id: 1, firstName: 'Wassim', lastName: 'Zerouta' });
  
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });
});