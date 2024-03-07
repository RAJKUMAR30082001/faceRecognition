import { TestBed } from '@angular/core/testing';

import { CouchDbService } from './couch-db.service';

describe('CouchDbService', () => {
  let service: CouchDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouchDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
