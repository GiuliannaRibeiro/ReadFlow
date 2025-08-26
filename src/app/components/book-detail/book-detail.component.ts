import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookmarkBookService } from '../../core/services/bookmark-book/bookmark-book.service';
import { RatingsService } from '../../core/services/ratings/ratings.service';
import { Book } from '../../models/bookmarked-book.model';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})

export class BookDetailComponent implements OnInit{
  bookList: any = [];
  bookmarkedIds: string[] = [];
  starredIds: string[] = [];
  stars = [1, 2, 3, 4, 5];
  ratings: { [id: string]: number } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private bookmarkBookService: BookmarkBookService,
    private ratingsService: RatingsService
  ) {}

  ngOnInit(): void {
    const savedBookmarks = localStorage.getItem('bookmarkedIds');
    if (savedBookmarks) this.bookmarkedIds = JSON.parse(savedBookmarks);

    const savedStarred = localStorage.getItem('starredIds');
    if (savedStarred) this.starredIds = JSON.parse(savedStarred);
  }

  toggleBookmark(id: string): void {
    const isBookmarked = this.bookmarkedIds.includes(id);

    if (isBookmarked) {
      this.bookmarkBookService.toggleBookmark({ id } as any, true).subscribe({
        next: () => {
          this.bookmarkedIds = this.bookmarkedIds.filter((bookId: string) => bookId !== id);
          localStorage.setItem('bookmarkedIds', JSON.stringify(this.bookmarkedIds));
        },
        error: err => {
          console.error('Error to remove bookmark:', err);
        }
      });
    } else {
      const bookToSave = {
        id: this.data.id,
        title: this.data.title || 'Untitled',
        authors: this.data.authors || ['Unknown Author'],
        image: this.data.image || '',
      } as Book;

      this.bookmarkBookService.toggleBookmark(bookToSave, false).subscribe({
        next: () => {
          this.bookmarkedIds.push(id);
          localStorage.setItem('bookmarkedIds', JSON.stringify(this.bookmarkedIds));
        },
        error: err => {
          console.error('Error to add bookmark:', err);
        }
      });
    }
  }

  toggleStarred(id: string): void {
    const isStarred = this.starredIds.includes(id);
  
    if (isStarred) {
      this.ratingsService.toggleStarred({ id } as any, true).subscribe({
        next: () => {
          this.starredIds = this.starredIds.filter(bookId => bookId !== id);
          localStorage.setItem('starredIds', JSON.stringify(this.starredIds));
        },
        error: err => console.error('Error to remove star:', err)
      });
    } else {
      const bookToSave = {
        id: this.data.id,
        title: this.data.title,
        authors: this.data.authors,
        image: this.data.image
      } as Book;
  
      this.ratingsService.toggleStarred(bookToSave, false).subscribe({
        next: () => {
          this.starredIds.push(id);
          localStorage.setItem('starredIds', JSON.stringify(this.starredIds));
        },
        error: err => console.error('Error to add star:', err)
      });
    }
  }

  getRating(id: string): number {
    return this.ratingsService.get(id);
  }

  setRating(book: { id: string; title?: string; authors?: string[]; image?: string }, value: number): void {
    const id = book.id;
    const wasStarred = this.starredIds.includes(id);

    this.ratingsService.set(book, value);

    if (value > 0 && !wasStarred) {
      const bookToSave: Book = {
        id,
        title: book.title || 'Untitled',
        authors: book.authors?.length ? book.authors : ['Unknown Author'],
        image: book.image || ''
      } as Book;

      this.ratingsService.toggleStarred(bookToSave, false).subscribe({
        next: () => {
          this.starredIds = [...this.starredIds, id];
          localStorage.setItem('starredIds', JSON.stringify(this.starredIds));
        },
        error: err => console.error('Error to add star:', err)
      });
    }

    if (value === 0 && wasStarred) {
      this.ratingsService.toggleStarred({ id } as Book, true).subscribe({
        next: () => {
          this.starredIds = this.starredIds.filter(x => x !== id);
          localStorage.setItem('starredIds', JSON.stringify(this.starredIds));
        },
        error: err => console.error('Error to remove star:', err)
      });
    }
  }

  clearRating(book: { id: string }): void {
    this.setRating(book, 0);
  }
}
