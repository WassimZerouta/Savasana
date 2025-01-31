import { TestBed } from '@angular/core/testing';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  const mockSessionInformation: SessionInformation = {
    token: 'mockToken',
    type: 'Bearer',
    id: 1,
    username: 'mockUser',
    firstName: 'Mock',
    lastName: 'User',
    admin: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isLogged as false', () => {
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should log in and set isLogged to true', () => {
    service.logIn(mockSessionInformation);
    expect(service.isLogged).toBeTruthy();
    expect(service.sessionInformation).toEqual(mockSessionInformation);
  });

  it('should log out and set isLogged to false', () => {
    service.logIn(mockSessionInformation);
    service.logOut();
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit the correct values via $isLogged observable', (done) => {
    const emittedValues: boolean[] = [];
    const subscription = service.$isLogged().subscribe((value) => emittedValues.push(value));

    service.logIn(mockSessionInformation);
    service.logOut();

    setTimeout(() => {
      expect(emittedValues).toEqual([false, true, false]);
      subscription.unsubscribe();
      done();
    });
  });

  it('should call private next() method when logging in', () => {
    const spy = jest.spyOn(service as any, 'next');
    service.logIn(mockSessionInformation);
    expect(spy).toHaveBeenCalled();
  });

  it('should call private next() method when logging out', () => {
    service.logIn(mockSessionInformation);
    const spy = jest.spyOn(service as any, 'next');
    service.logOut();
    expect(spy).toHaveBeenCalled();
  });
});