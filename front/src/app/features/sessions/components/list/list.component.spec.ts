import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';

describe('ListComponent (integration)', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let httpMock: HttpTestingController;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [
        SessionService,
        SessionApiService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);

    sessionService.logIn({
      admin: true,
      id: 1,
      username: 'testUser',
      token: 'test-token',
      type: 'Bearer',
      firstName: 'Wassim',
      lastName: 'Zerouta'
    });

    fixture.detectChanges();
  });

 it('should create', () => {
  const req = httpMock.expectOne('api/session');
  req.flush([]);

  expect(component).toBeTruthy();
});

it('should fetch sessions on initialization', (done) => {
  const mockSessions = [
    { id: 1, name: 'Session 1', date: '2025-01-02', teacher_id: 1, description: 'Description 1', users: [1, 2] },
    { id: 2, name: 'Session 2', date: '2025-01-03', teacher_id: 2, description: 'Description 2', users: [3, 4] },
  ];

  component.sessions$.subscribe((sessions) => {
    expect(sessions).toEqual(mockSessions);
    done();
  });

  const reqs = httpMock.match('api/session');
  expect(reqs.length).toBe(2);
  reqs.forEach((req) => {
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });
});

  it('should return the user from SessionService', () => {
    const req = httpMock.expectOne('api/session');
    req.flush([]);

    expect(component.user).toEqual({
      admin: true,
      id: 1,
      username: 'testUser',
      token: 'test-token',
      type: 'Bearer',
      firstName: 'Wassim',
      lastName: 'Zerouta'
    });
  });
});