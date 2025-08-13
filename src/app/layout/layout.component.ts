import { Component, computed, OnInit, type Signal } from '@angular/core';
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
  dataReadingGoal: any = {};
  dataBooksBookmarked: any = [];
  readingTimeTitle!: Signal<string>;

  constructor(private readingGoalService: ReadingGoalService, private bookmarkBookService: BookmarkBookService) {
    this.readingTimeTitle = computed(() => {
      const totalSec = this.bookmarkBookService.bookmarks()
        .reduce((sum, b: any) => sum + Number(b.timeSpentSeconds || 0), 0);
      return `${this.formatHMS(totalSec)} this week`;
    });    
  }

  ngOnInit(): void {
    this.getReadingGoal();
    this.bookmarkBookService.getBookmarkedBooks();
  }

  formatHMS(totalSec: number): string {
    if (totalSec < 60) {
      return `${totalSec}s`;
    }
    if (totalSec < 3600) {
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return s > 0 ? `${m}m ${s}s` : `${m}m`;
    }
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
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
    const list = this.bookmarkBookService.bookmarks();
    if (!list  || list.length === 0) {
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
        ${list.map((book: { title: any; authors: any[]; }) => `
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
  }

  timeSpentReading(): void {
    const list = this.bookmarkBookService.bookmarks();
    if (!list || list.length === 0) {
      Swal.fire({
        title: 'No Bookmarked Books',
        text: 'You have no books saved yet.',
        icon: 'info',
        confirmButtonColor: '#704a4a'
      });
      return;
    }
  
    const htmlList = `
      <div style="max-height: 360px; overflow-y: auto; text-align: left;">
        ${list.map((book: any) => `
          <div style="margin-bottom: 10px; display:flex; align-items:center; gap:8px;">
            <div style="flex:1 1 auto;">
              <strong>${book.title || 'Untitled'}</strong><br>
              <small style="
                display:inline-block;
                max-width: 400px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">
                ${(book.authors || ['Unknown Author']).join(', ')}
              </small>
            </div>
            <button class="swal-pomo" data-id="${book.id}"
              style="padding:6px 10px; border:0; border-radius:6px; cursor:pointer; width: 135px;">
              Pomodoro
            </button>
          </div>
        `).join('')}
      </div>
    `;
  
    Swal.fire({
      title: 'Time Spent Reading',
      html: htmlList,
      confirmButtonText: 'Close',
      confirmButtonColor: '#704a4a',
      width: 640,
      scrollbarPadding: false,
      didOpen: () => {
        const c = Swal.getHtmlContainer();
        c?.querySelectorAll<HTMLButtonElement>('.swal-pomo').forEach(btn => {
          btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const id = (ev.currentTarget as HTMLButtonElement).dataset['id']!;
            this.openPomodoroForBook(id);
          });
        });
      }
    });
  }
  
  openPomodoroForBook(id: string) {
    const book = this.bookmarkBookService.bookmarks().find(b => String(b.id) === String(id));
    const title = book?.title ?? 'Reading session';
  
    let seconds = 0;
    let timer: any = null;
  
    const htmlTimer = `
      <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
        <div id="pomodoro-display" style="font-size:28px; font-weight:600;">00:00</div>
        <div style="display:flex; gap:8px;">
          <button id="pomodoro-start" style="padding:6px 10px; border-radius:6px; cursor:pointer;">Start</button>
          <button id="pomodoro-pause" style="padding:6px 10px; border-radius:6px; cursor:pointer;">Pause</button>
          <button id="pomodoro-reset" style="padding:6px 10px; border-radius:6px; cursor:pointer;">Reset</button>
        </div>
        <small>Tip: classic Pomodoro is 25 min focus + 5 min break 😉</small>
      </div>
    `;
  
    const updateDisp = () => {
      const minute = Math.floor(seconds / 60).toString().padStart(2, '0');
      const second = (seconds % 60).toString().padStart(2, '0');
      const element = document.getElementById('pomodoro-display');
      if (element) element.textContent = `${minute}:${second}`;
    };
  
    Swal.fire({
      title: title,
      html: htmlTimer,
      showCancelButton: true,
      cancelButtonText: 'Close',
      confirmButtonText: 'Save time',
      confirmButtonColor: '#704a4a',
      width: 480,
      didOpen: () => {
        const start = document.getElementById('pomodoro-start');
        const pause = document.getElementById('pomodoro-pause');
        const reset = document.getElementById('pomodoro-reset');
  
        start?.addEventListener('click', () => {
          if (timer) return;
          timer = setInterval(() => { seconds += 1; updateDisp(); }, 1000);
        });
        pause?.addEventListener('click', () => {
          if (timer) { clearInterval(timer); timer = null; }
        });
        reset?.addEventListener('click', () => {
          seconds = 0; updateDisp();
        });
  
        updateDisp();
      },
      willClose: () => {
        if (timer) { clearInterval(timer); timer = null; }
      }
    }).then(res => {
      if (res.isConfirmed) {
        this.bookmarkBookService.appendReadingTime(id, seconds).subscribe({
          next: () => {
            const mm = Math.floor(seconds / 60);
            const ss = seconds % 60;
            Swal.fire({
              icon: 'success',
              title: 'Saved!',
              text: `Added ${mm}m ${ss}s to this book.`,
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: err => {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Could not save time.' });
          }
        });
      }
    });
  }

  booksBookmarkedTitle = computed(() => {
    const booksBookmarked = this.bookmarkBookService.bookmarks().length;
    return booksBookmarked ? `You have saved ${booksBookmarked} books` : 'You haven’t saved any';
  });
  
}
