import {
  ChangeDetectorRef,
  Component,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
} from 'rxjs';
import _ from 'lodash';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerService } from 'src/app/services/spinner.service';

interface Project {
  name: string;
  description: string;
  total_samples: number;
}

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Items per page:`;
  lastPageLabel = $localize`Last page`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    return $localize`Page ${page + 1}`;
  }
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
  standalone: true,
  imports: [
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class HomePageComponent implements OnInit {
  protected pageSize = 5;
  searchControl = new FormControl('');
  private searchSubject = new BehaviorSubject<string>('');

  @ViewChild('paginator')
  paginator!: MatPaginator;
  private pageTokens = new Map<number, string>();

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
    private cd: ChangeDetectorRef,
    private ss: SpinnerService,
  ) {}

  ngOnInit(): void {
    this.list(this.selectedIndex, 0, '');
    this.cd.detectChanges();

    this.paginator.page.subscribe((event: PageEvent) => {
      if (this.pageSize != this.paginator.pageSize) {
        this.resetPagination();
        this.refresh();
      } else {
        this.list(
          this.selectedIndex,
          event.pageIndex,
          this.searchSubject.value,
        );
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.resetPagination();
        this.setSearchInput(value as string);
        this.list(
          this.selectedIndex,
          this.paginator.pageIndex,
          value as string,
        );
      });
  }

  onSelectTab(index: number): void {
    this.resetPagination();
    this.list(index, 0, '');
  }

  setSearchInput(query: string) {
    this.searchSubject.next(query);
  }

  refresh() {
    try {
      this.resetPagination();
      this.list(
        this.selectedIndex,
        this.paginator.pageIndex,
        this.searchSubject.value,
      );
    } catch (error) {
      console.log(error);
    }
  }

  list(index: number, page: number, search: string): void {
    this.selectedIndex = index;
    const hub = this.hubs[index];
    this.ss.start();

    if (!this.pageTokens.get(page) && page > 0) {
      this.paginator.pageIndex--;
      this.sb.open('No more items to show', 'Okay', { duration: 60000 });
      return;
    }

    this.as
      .getProjects(hub, this.pageSize, this.pageTokens.get(page), search)
      .pipe(catchError(() => of(null)))
      .subscribe((projects: any) => {
        if (!projects.data) {
          this.sb.open('Unable to retrieve projects for this hub.', 'Close', {
            duration: 60000,
          });
        } else {
          //handle if there no data on next page (set page index and last page to prev value)
          if (
            projects &&
            projects.data.length <= 0 &&
            this.paginator.pageIndex > 0
          ) {
            this.paginator.pageIndex--;
            this.sb.open('No more items to show', 'Okay', { duration: 60000 });
            this.ss.end();
            return;
          }

          this.projectsTableDataSource = projects.data.map((p: Project) => ({
            ...p,
            expanded: false,
          }));

          // set next page token
          this.pageTokens.set(page + 1, projects.last_evaluated_key);
          this.ss.end();
        }
      });
  }

  resetPagination() {
    this.pageTokens = new Map<number, string>();
    this.paginator.pageIndex = 0;
    this.pageSize = this.paginator.pageSize;
  }
}
