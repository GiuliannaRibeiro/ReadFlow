import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadingGoalService {

  base_url = 'http://localhost:3000'

  constructor(private https: HttpClient) { }

  saveReadingGoals(goal: number): Observable<{ id: string, goal: number }> {
    return this.https.post<{ id: string, goal: number }>(`${this.base_url}/readingGoals`, {
      goal: goal
    });
  }  

  editReadingGoal(id: string, goal: number): Observable<{ id: string, goal: number }> {
    return this.https.put<{ id: string, goal: number }>(`${this.base_url}/readingGoals/${id}`, {
      goal: goal
    });
  }  

  getReadingGoal(): Observable<Array<{ id: string, goal: number }>> {
    return this.https.get<Array<{ id: string, goal: number }>>(`${this.base_url}/readingGoals`);
  }

}
