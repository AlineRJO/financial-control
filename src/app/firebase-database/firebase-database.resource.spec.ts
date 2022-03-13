import { TestBed } from '@angular/core/testing';

import { FirebaseDatabaseResource } from './firebase-database.resource';

describe('FirebaseDatabaseResource', () => {
  let service: FirebaseDatabaseResource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseDatabaseResource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
