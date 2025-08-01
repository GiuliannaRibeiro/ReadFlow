import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})

export class BookDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
