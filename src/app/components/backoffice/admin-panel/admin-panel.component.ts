import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';

import { UpcomingEventsComponent } from '../upcoming-events/upcoming-events.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ModerationComponent } from '../moderation/moderation.component';
import CategoriesComponent from '../categories/categories.component';
import { VariablesCompartidasService } from '../../../services/variables-compartidas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  imports: [
    CommonModule,
    UpcomingEventsComponent,
    DashboardComponent,
    ModerationComponent,
    CategoriesComponent,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  activeTab: string = 'dashboard';

  constructor(
    private variablesCompartidas: VariablesCompartidasService,
    private router: Router
  ) {
    effect(() => {
      this.variablesCompartidas.userAdmin();
    });
  }
  ngOnInit(): void {
    if (!this.variablesCompartidas.userAdmin()) {
      this.activeTab = 'dashboard';
      this.router.navigate(['/main']);
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
