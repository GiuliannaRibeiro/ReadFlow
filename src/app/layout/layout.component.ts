import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { CardComponent } from '../components/card/card.component';
import { RecommendationComponent } from '../components/recommendation/recommendation.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CardComponent, RecommendationComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
