import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { BookmarkedBook } from '../../../models/bookmarked-book.model';

@Injectable({
  providedIn: 'root'
})
export class BookmarkBookService {
  private base_url: string = 'http://localhost:3000';

  readonly bookmarks = signal<BookmarkedBook[]>([]);

  constructor(private http: HttpClient) {}

  getBookmarkedBooks() {
    this.http.get<BookmarkedBook[]>(`${this.base_url}/bookmarkBook`)
    .subscribe(list => this.bookmarks.set(list));  
  }  

  toggleBookmark(book: BookmarkedBook, isBookmarked: boolean) {
    if (isBookmarked) {
      return this.http.delete(`${this.base_url}/bookmarkBook/${book.id}`).pipe(
        tap(() => this.bookmarks.update(arr => arr.filter(b => b.id !== book.id)))
      );
    } else {
      return this.http.post<BookmarkedBook>(`${this.base_url}/bookmarkBook`, book).pipe(
        tap(saved => this.bookmarks.update(arr => [...arr, saved]))
      );
    }
  }  
}
