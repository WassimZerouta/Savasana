import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
      username: 'Admin',
    },
  };

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(
      of([
        { id: 1, name: 'Session 1', date: '2025-01-02', teacher_id: 1, description: 'Description 1', users: [1, 2] },
        { id: 2, name: 'Session 2', date: '2025-01-03', teacher_id: 2, description: 'Description 2', users: [3, 4] },
      ])
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch sessions on initialization', (done) => {
    component.sessions$.subscribe((sessions) => {
      expect(sessions).toEqual([
        { id: 1, name: 'Session 1', date: '2025-01-02', teacher_id: 1, description: 'Description 1', users: [1, 2] },
        { id: 2, name: 'Session 2', date: '2025-01-03', teacher_id: 2, description: 'Description 2', users: [3, 4] },
      ]);
      done();
    });
    expect(mockSessionApiService.all).toHaveBeenCalled();
  });

  it('should return the user from SessionService', () => {
    expect(component.user).toEqual(mockSessionService.sessionInformation);
  });
});