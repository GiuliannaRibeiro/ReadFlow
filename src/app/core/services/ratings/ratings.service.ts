import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Book } from '../../../models/bookmarked-book.model';
import { HttpClient } from '@angular/common/http';

const LS_KEY = 'ratings';
type RatingsMap = Record<string, RatingEntry>;
type RatingEntry = {
  value: number;
  title: string;
  authors: string[];
};

@Injectable({ providedIn: 'root' })
export class RatingsService {
  private readonly store$ = new BehaviorSubject<RatingsMap>(this.load());
  readonly ratingsMap = signal<RatingsMap>(this.store$.value);

  private base_url: string = 'http://localhost:3000';
  readonly ratings = signal<Book[]>([]);  

  constructor(private http: HttpClient) {}

  ratings$ = this.store$.asObservable();

  toggleStarred(book: Book, isStarred: boolean) {
    if (isStarred) {
      return this.http.delete(`${this.base_url}/starredBook/${book.id}`).pipe(
        tap(() => this.ratings.update(arr => arr.filter(b => b.id !== book.id)))
      );
    } else {
      return this.http.post<Book>(`${this.base_url}/starredBook`, book).pipe(
        tap(saved => this.ratings.update(arr => [...arr, saved]))
      );
    }
  }

  get(id: string): number {
    return this.store$.value[id]?.value || 0;
  }

  set(book: { id: string; title?: string; authors?: string[] }, value: number): void {
    const next = { ...this.store$.value };
    if (value === 0) {
      delete next[book.id];
    } else {
      next[book.id] = {
        value,
        title: book.title || 'Untitled',
        authors: book.authors?.length ? book.authors : ['Unknown Author'],
      } as any;
    }
    this.persist(next);
  }

  entries(): Array<[string, RatingEntry]> {
    return Object.entries(this.ratingsMap());
  }

  private persist(map: RatingsMap) {
    this.store$.next(map);
    this.ratingsMap.set(map);
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  }

  private load(): RatingsMap {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const isOld = Object.values(parsed).every(v => typeof v === 'number');
        if (isOld) return {};
      }
      return parsed as RatingsMap;
    } catch {
      return {};
    }
  }
}
