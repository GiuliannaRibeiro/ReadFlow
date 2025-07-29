import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GoogleBooksService } from '../../core/services/google-books.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss'
})
export class RecommendationComponent implements OnInit {
  books: any = '';
  imageBook: string = "";

  constructor(private googleBooksService: GoogleBooksService) {}

  ngOnInit(): void {
    this.getRandomBooks();
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
            image
          };
        });
      },
      error: err => console.error('Error to get ramdom books', err)
    });
  }
  

}
