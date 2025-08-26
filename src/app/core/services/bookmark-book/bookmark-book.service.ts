import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Book } from '../../../models/bookmarked-book.model';

@Injectable({
  providedIn: 'root'
})
export class BookmarkBookService {
  private base_url: string = 'http://localhost:3000';

  readonly bookmarks = signal<Book[]>([]);

  constructor(private http: HttpClient) {}

  getBookmarkedBooks() {
    this.http.get<Book[]>(`${this.base_url}/bookmarkBook`)
    .subscribe(list => this.bookmarks.set(list));  
  }  

  toggleBookmark(book: Book, isBookmarked: boolean) {
    if (isBookmarked) {
      return this.http.delete(`${this.base_url}/bookmarkBook/${book.id}`).pipe(
        tap(() => this.bookmarks.update(arr => arr.filter(b => b.id !== book.id)))
      );
    } else {
      return this.http.post<Book>(`${this.base_url}/bookmarkBook`, book).pipe(
        tap(saved => this.bookmarks.update(arr => [...arr, saved]))
      );
    }
  } 

  appendReadingTime(id: string, seconds: number) {
    const book = this.bookmarks().find(b => String(b.id) === String(id));
    const prevSec = Number(book?.timeSpentSeconds || 0);
    const totalSec = prevSec + seconds;

    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    const stamp = new Date().toLocaleDateString();

    const currentDesc = book?.minutesDescription ?? '';
    const patch = {
      description: `${currentDesc}${currentDesc ? '\n' : ''}⏱ Reading: ${mm}m ${ss}s on ${stamp}`,
      timeSpentSeconds: totalSec,
      timeSpentMinutes: Math.floor(totalSec / 60)
    };

    return this.http.patch<Book>(`${this.base_url}/bookmarkBook/${id}`, patch).pipe(
      tap(updated =>
        this.bookmarks.update(arr =>
          arr.map(book => String(book.id) === String(id) ? { ...book, ...updated } : book)
        )
      )
    );
  }


}
