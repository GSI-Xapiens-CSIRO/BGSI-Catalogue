import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import _ from 'lodash';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatTableModule, MatPaginatorModule],
})
export class HomePageComponent implements OnInit {
  // protected usersTableDataSource: any = [];
  protected pageSize = 10;
  protected usersTableDisplayedColumns: string[] = [
    'Project Name',
    'Project Description',
    'Number of Sample',
  ];
  protected selectedIndex = 0;

  protected usersTableDataSource: any[] = [];

  ngOnInit(): void {
    this.getData(0);
  }

  getData(index: number) {
    if (index === 0) {
      this.usersTableDataSource = this.data.hub1;
    } else {
      this.usersTableDataSource = this.data.hub2;
    }
  }

  // fake data ==================
  protected data: any = {
    hub1: [
      {
        'Project Name': 'P1',
        'Project Description': 'HyDrogen',
        'Number of Sample': 1.0079,
      },
    ],
    hub2: [
      {
        'Project Name': 'P2',
        'Project Description': 'Non Hydrogen',
        'Number of Sample': 1,
      },
    ],
  };
  // end fake data
}
