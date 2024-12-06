import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { catchError, of } from 'rxjs';
import _ from 'lodash';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service'

interface Project {
  name: string;
  description: string;
  total_samples: number;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [
    MatCardModule, 
    MatTabsModule, 
    MatTableModule, 
    MatPaginatorModule,
    MatSnackBarModule,
  ],
})
export class HomePageComponent implements OnInit {
  protected pageSize = 10;
  protected projectsTableColumnMap: { [key: string]: string } = {
    'Project Name': 'name',
    'Project Description': 'description',
    'Number of Samples': 'total_samples',
  };
  protected projectsTableDisplayedColumns: string[] = [
    'Project Name',
    'Project Description',
    'Number of Samples',
  ];
  protected selectedIndex = 0;
  protected hubs = environment.api_endpoint_hubs;
  protected projectsTableDataSource: any[] = [];

  constructor(
    private as: ApiService,
    private sb: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.list(this.selectedIndex);
  }

  list(index: number) {
    this.selectedIndex = index; 
    const hub = this.hubs[index];
    this.as
      .getProjects(hub)
      .pipe(catchError(() => of(null)))
      .subscribe((projects: any) => {
        if (!projects) {
          this.sb.open('Unable to retrieve projects for this hub.', 'Close', {
            duration: 60000,
          });
        } else {
          this.projectsTableDataSource = projects.map((p: Project) => ({
            ...p,
            expanded: false,
          }));
          console.log(this.projectsTableDataSource);
        }
      });
  }
}
