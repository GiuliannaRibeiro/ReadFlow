import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GoogleBooksService } from '../../core/services/google-books.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookDetailComponent } from '../book-detail/book-detail.component';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, BookDetailComponent],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss'
})
export class RecommendationComponent implements OnInit {
  books: any[] = [];
  imageBook: string = "";
  showAll: boolean = false;

  constructor(private googleBooksService: GoogleBooksService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getRandomBooks();
  }

  get visibleBooks(): number {
    return this.showAll ? this.books.length : 10;
  }

  toggleBooks(event: Event): void {
    event.preventDefault();
    this.showAll = !this.showAll;
  }

  getRandomBooks(): void {
    this.googleBooksService.searchBooks().subscribe({
      next: res => {
        this.books = (res.items || []).map((item: any) => {
          const volume = item.volumeInfo;
          const image =
            volume?.imageLinks?.thumbnail ||
            volume?.imageLinks?.smallThumbnail ||
            'assets/icons/logo-readflow-mini.png';
  
            return {
              title: volume.title,
              authors: volume.authors || ['Unknown Author'],
              description: volume.description || 'No description available',
              pageCount: volume.pageCount || 0,
              categories: volume.categories || ['Unknown Category'],
              image: image
            };
        });
      },
      error: err => console.error('Error to get ramdom books', err)
    });
  }

  openBookDetail(book: any): void {
    this.dialog.open(BookDetailComponent, {
      data: book
    });
  }
}
