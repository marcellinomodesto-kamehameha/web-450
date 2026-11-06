/**
 * Author: Marcellino Modesto
 * Date: 5 November 2026
 * File: agent-performance-by-team.component.ts
 * Description: Agent performance by team component
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartComponent } from '../../../shared/chart/chart.component';

@Component({
  selector: 'app-agent-performance-by-team',
  standalone: true,
  imports: [ChartComponent],
  template: `
    <div class="agent-performance-container">
      <h2>Agent Performance by Team</h2>

      <div class="chart-container">
        <app-chart
          [type]="chartType"
          [label]="chartLabel"
          [data]="callDurations"
          [labels]="teamLabels"
        >
        </app-chart>
      </div>
    </div>
  `,
  styles: `
    .agent-performance-container {
      padding: 20px;
    }

    .chart-container {
      height: 400px;
      width: 100%;
      margin-top: 20px;
    }
  `,
})
export class AgentPerformanceByTeamComponent implements OnInit {
  teamLabels: string[] = [];
  callDurations: number[] = [];
  chartType = 'bar' as const;
  chartLabel = 'Total Call Duration';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPerformanceByTeam();
  }

  getPerformanceByTeam(): void {
    this.http.get<any[]>('http://localhost:3000/api/reports/agent-performance/performance-by-team')
      .subscribe({
        next: (data) => {
          console.log('Team performance data:', data);

          this.teamLabels = data.map((team) => team.team);
          this.callDurations = data.map((team) => team.totalCallDuration);

          console.log('Team labels:', this.teamLabels);
          console.log('Call durations:', this.callDurations);
        },
        error: (err) => {
          console.error('Error fetching agent performance by team:', err);
          console.log('Status:', err.status);
          console.log('Error URL:', err.url);
          console.log('Error message:', err.message);
          console.log('Error details:', err.error);
        },
      });
  }
}
