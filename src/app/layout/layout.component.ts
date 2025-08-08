import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { CardComponent } from '../components/card/card.component';
import { RecommendationComponent } from '../components/recommendation/recommendation.component';
import { BookmarkBookService } from '../core/services/bookmark-book/bookmark-book.service';
import { ReadingGoalService } from '../core/services/readingGoal/reading-goal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CardComponent, RecommendationComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  hasGoal: boolean = false;
  dataReadingGoal: any = {}

  constructor(private readingGoalService: ReadingGoalService, private bookmarkBookService: BookmarkBookService) {}

  ngOnInit(): void {
    this.getReadingGoal();
  }

  getReadingGoal() {
    this.readingGoalService.getReadingGoal().subscribe({
      next: res => {
        if (res.length > 0) {
          this.dataReadingGoal = res[0]; 
          this.hasGoal = true;
        } else {
          this.dataReadingGoal = {};
          this.hasGoal = false;
        }
      },
      error: error => console.error(error)
    })
  }

  get readingGoalTitle(): string {
    const goal = this.dataReadingGoal?.goal;
    return goal ? `Reading Goal<br>0/${goal}` : 'Reading Goal';
  }  

  readingGoal() {
    Swal.fire({
      title: "What is your reading goal?",
      text: "Inform how many pages do you want to read per day",
      input: 'number',
      inputValue: this.dataReadingGoal?.goal || '',
      inputAttributes: {
        min: '1',
        step: '1'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      confirmButtonColor: '#704a4a',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#be8a75',
      inputValidator: (value) => {
        if (!value || parseInt(value) <= 0) {
          return 'Please enter a valid number greater than 0';
        }
        return null;
      }
    }).then(result => {
      if (result.isConfirmed) {
        const goal = Number(result.value);
        if(this.hasGoal) {
          this.readingGoalService.editReadingGoal(this.dataReadingGoal.id, goal).subscribe({
            next: res => {
              this.dataReadingGoal = res;
            },
            error: err => console.error(err)
          })
        } else {
          this.readingGoalService.saveReadingGoals(goal).subscribe({
            next: res => {
              this.dataReadingGoal = res;
              this.hasGoal = true;
            },
            error: err => console.error(err)
          })
        }
      }
    });
  }

  booksBookmarked(): void {
    this.bookmarkBookService.getBookmarkedBooks().subscribe({
      next: (books) => {
        if (!books || books.length === 0) {
          Swal.fire({
            title: 'No Bookmarked Books',
            text: 'You have no books saved yet.',
            icon: 'info',
            confirmButtonColor: '#704a4a'
          });
          return;
        }
  
        const htmlList = `
          <div style="max-height: 300px; overflow-y: auto; text-align: left;">
            ${books
              .map(book => `
                <div style="margin-bottom: 10px;">
                  <strong>${book.title || 'Untitled'}</strong><br>
                  <small>${book.authors?.join(', ') || 'Unknown Author'}</small>
                </div>
              `)
              .join('')}
          </div>
        `;
  
        Swal.fire({
          title: 'Your Bookmarked Books',
          html: htmlList,
          confirmButtonText: 'Close',
          confirmButtonColor: '#704a4a',
          width: 600,
          scrollbarPadding: false
        });
      },
      error: (err) => {
        console.error('Error to get bookmarked books:', err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load bookmarked books.',
          icon: 'error',
          confirmButtonColor: '#be8a75'
        });
      }
    });
  }
  
}
