import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookmarkBookService } from '../../core/services/bookmark-book/bookmark-book.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})

export class BookDetailComponent implements OnInit{
  bookList: any = [];
  bookmarkedIds: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private bookmarkBookService: BookmarkBookService
  ) {}

  ngOnInit(): void {  
    const saved = localStorage.getItem('bookmarkedIds');
    if (saved) {
      this.bookmarkedIds = JSON.parse(saved);
    }
  }

  toggleBookmark(id: string): void {
    const isBookmarked = this.bookmarkedIds.includes(id);
  
    if (isBookmarked) {
      this.bookmarkBookService.toggleBookmark({ id }, isBookmarked).subscribe({
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
        thumbnail: this.data.image || '',
      };
  
      this.bookmarkBookService.toggleBookmark(bookToSave, isBookmarked).subscribe({
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
  
}
