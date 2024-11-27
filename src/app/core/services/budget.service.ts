import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../../config/utils';
import { UtilsService } from '../utils/utils.service';
import { Page } from '../interfaces/Page';
import { IBudget } from '../models/Budget';
import { IBudgetResponse } from '../interfaces/budget/BudgetResponse';
import { IBudgetRequest } from '../interfaces/budget/BudgetRequest';

@Injectable({
    providedIn: 'root',
})
export class BudgetService {
    constructor(private readonly http: HttpClient,
        private readonly utilsService: UtilsService
    ) { }

    add(budget: IBudget): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.post<IBudget>(`${BASE_URL}/budget`, budget, { headers });
    }

    get(id: number): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.get<IBudget>(`${BASE_URL}/budget/${id}`, { headers });
    }

    edit(budget: IBudgetRequest, selectedWorksIds: number[]): Observable<any> {
        const headers = this.utilsService.getHeader();
        budget.workIdList = selectedWorksIds

        return this.http.put<IBudget>(`${BASE_URL}/budget/${budget.id}`, budget, { headers });
    }

    delete(id: number): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.delete<IBudget>(`${BASE_URL}/budget/${id}`, { headers });
    }

    list(page: number, size: number, customerEmail: string = ''): Observable<Page<IBudgetResponse>> {
        const headers = this.utilsService.getHeader();
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (customerEmail) {
            params = params.set('customerEmail', customerEmail);
        }

        return this.http.get<Page<IBudgetResponse>>(`${BASE_URL}/budget`, { headers, params });
    }

    customerList(page: number, size: number): Observable<Page<IBudgetResponse>> {
        const headers = this.utilsService.getHeader();
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<Page<IBudgetResponse>>(`${BASE_URL}/budget/customer-list`, { headers, params });
    }


    approve(id: number): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.put<IBudget>(`${BASE_URL}/budget/${id}/approve`, {}, { headers });
    }

    deny(id: number): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.put<IBudget>(`${BASE_URL}/budget/${id}/deny`, {}, { headers });
    }
}

