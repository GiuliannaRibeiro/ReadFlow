import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  
  constructor(private http: HttpClient) { }

  searchBooks(
    query: string = this.getRandomHighlightQuery(),
    startIndex: number = Math.floor(Math.random() * 40),
    maxResults: number = 20
  ): Observable<any> {
    const url = `${this.apiUrl}?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=relevance`;
    return this.http.get(url);
  }
  
  private getRandomHighlightQuery(): string {
    const queries = [
      'subject:fiction',
      'subject:technology',
      'subject:romance',
      'intitle:design',
      'intitle:productivity',
    ];
    return queries[Math.floor(Math.random() * queries.length)];
  }
  
}
