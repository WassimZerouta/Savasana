import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockSessionService = {
    sessionInformation: {
      token: 'test-token',
      type: 'Bearer',
      id: 1,
      username: 'testUser',
      firstName: 'Wassim',
      lastName: 'Zerouta',
      admin: true,
    },
    logOut: jest.fn(),
  };

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of({ id: 1, firstName: 'Wassim', lastName: 'Zerouta' })),
    delete: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user on init', () => {
    const mockUser = { id: 1, firstName: 'Wassim', lastName: 'Zerouta' };
    mockUserService.getById.mockReturnValue(of(mockUser)); 
  
    component.ngOnInit(); 
  
    expect(mockUserService.getById).toHaveBeenCalledWith('1'); 
    expect(component.user).toEqual(mockUser);
  });

  it('should delete user and navigate to home', () => {
    mockUserService.delete.mockReturnValue(of(null));

    component.delete(); 

    expect(mockUserService.delete).toHaveBeenCalledWith('1'); 
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    ); 
    expect(mockSessionService.logOut).toHaveBeenCalled(); 
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']); 
  });

  it('should call history.back on back()', () => {
    const spy = jest.spyOn(window.history, 'back'); 
    component.back();
    expect(spy).toHaveBeenCalled();
  });
});