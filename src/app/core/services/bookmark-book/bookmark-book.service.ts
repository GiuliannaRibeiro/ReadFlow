import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BookmarkedBook } from '../../../models/bookmarked-book.model';

@Injectable({
  providedIn: 'root'
})
export class BookmarkBookService {
  base_url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBookmarkedBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base_url}/bookmarkBook`);
  }  

  toggleBookmark(book: { id: string } | BookmarkedBook, isBookmarked: boolean): Observable<any> {
    if (isBookmarked) {
      return this.http.delete(`${this.base_url}/bookmarkBook/${book.id}`);
    } else {
      return this.http.post(`${this.base_url}/bookmarkBook`, book);
    }
  }  
}
