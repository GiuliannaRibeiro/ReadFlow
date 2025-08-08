import { TestBed } from '@angular/core/testing';

import { BookmarkBookService } from './bookmark-book.service';

describe('BookmarkBookService', () => {
  let service: BookmarkBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarkBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
