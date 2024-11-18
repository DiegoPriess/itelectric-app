import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        CommonModule,
        RouterModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
    mobileQueryMatches: boolean = false;
    fillerNav = [
        {title: "Orçamentos", link: "orcamentos-cliente", show: sessionStorage.getItem("role") === "ROLE_CUSTOMER"},
        {title: "Orçamentos", link: "orcamentos", show: sessionStorage.getItem("role") === "ROLE_OWNER"},
        {title: "Trabalhos", link: "trabalhos", show: sessionStorage.getItem("role") === "ROLE_OWNER"},
        {title: "Materiais", link: "materiais", show: sessionStorage.getItem("role") === "ROLE_OWNER"}
    ];
    private mobileQuerySubscription: Subscription;
    isOpen: boolean = true;

    constructor(private breakpointObserver: BreakpointObserver) {
        this.mobileQuerySubscription = this.breakpointObserver.observe([Breakpoints.Handset])
            .subscribe((result: BreakpointState) => {
                this.mobileQueryMatches = result.matches;
            });
        if (this.mobileQueryMatches) this.isOpen = false; 
    }

    ngOnDestroy(): void {
        this.mobileQuerySubscription.unsubscribe();
    }

    toggle(snav: any) {
        snav.toggle();
    }
}
