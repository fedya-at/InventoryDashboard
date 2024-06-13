import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(
          this.router.routerState,
          this.router.routerState.root
        );
      });
  }

  createBreadcrumbs(state, parent): Array<{ label: string; url: string }> {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.breadcrumb) {
      data.push({
        label: parent.snapshot.data.breadcrumb,
        url: parent.snapshot.url.map((segment) => segment.path).join('/'),
      });
    }

    if (state && parent) {
      data.push(...this.createBreadcrumbs(state, state.firstChild(parent)));
    }
    return data;
  }
}
