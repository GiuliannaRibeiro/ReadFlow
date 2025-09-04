import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },

      {
        path: 'main',
        loadComponent: () =>
          import('./pages/main-cards/main-cards.component').then(
            m => m.MainCardsComponent
          )
      },

      // {
      //   path: 'ratings',
      //   loadComponent: () =>
      //     import('./features/ratings/ratings.component').then(
      //       m => m.RatingsComponent
      //     )
      // },

      { path: '**', redirectTo: 'main' }
    ]
  }
];
