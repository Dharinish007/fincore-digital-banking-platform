import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const root = this.router.routerState.root;
      const breadcrumbs: Breadcrumb[] = [];
      this.addBreadcrumb(root, [], breadcrumbs);
      this.breadcrumbsSubject.next(breadcrumbs);
    });
  }

  private addBreadcrumb(route: ActivatedRoute | null, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
    if (route) {
      const routeUrl = parentUrl.concat(route.snapshot.url.map(segment => segment.path));
      if (route.snapshot.data['breadcrumb']) {
        const breadcrumb = {
          label: route.snapshot.data['breadcrumb'],
          url: '/' + routeUrl.join('/')
        };
        if (!breadcrumbs.some(b => b.url === breadcrumb.url)) {
          breadcrumbs.push(breadcrumb);
        }
      }
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }
}
