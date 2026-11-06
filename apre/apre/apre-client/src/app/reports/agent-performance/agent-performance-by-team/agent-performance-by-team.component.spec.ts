import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AgentPerformanceByTeamComponent } from './agent-performance-by-team.component';

describe('AgentPerformanceByTeamComponent', () => {
  let component: AgentPerformanceByTeamComponent;
  let fixture: ComponentFixture<AgentPerformanceByTeamComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentPerformanceByTeamComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentPerformanceByTeamComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 1: Verify the component is created.
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Verify the API returns team performance data.
  it('should retrieve agent performance by team', () => {
    const mockData = [
      {
        team: 'Sales',
        totalCallDuration: 1250,
        agentCount: 5,
      },
      {
        team: 'Support',
        totalCallDuration: 980,
        agentCount: 4,
      },
    ];

    component.getPerformanceByTeam();

    const req = httpMock.expectOne(
      'http://localhost:3000/api/reports/agent-performance/performance-by-team',
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockData);

    expect(component.teamLabels).toEqual(['Sales', 'Support']);
    expect(component.callDurations).toEqual([1250, 980]);
  });

  // Test 3: Verify API errors are handled.
  it('should handle errors when retrieving team performance', () => {
    spyOn(console, 'error');

    component.getPerformanceByTeam();

    const req = httpMock.expectOne(
      'http://localhost:3000/api/reports/agent-performance/performance-by-team',
    );

    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(console.error).toHaveBeenCalled();
  });
});
