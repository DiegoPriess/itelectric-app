import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../../config/utils';
import { UtilsService } from '../utils/utils.service';
import { Page } from '../interfaces/Page';
import { IWorkRequest } from '../interfaces/work/WorkRequest';
import { IWork } from '../models/Work';

@Injectable({
    providedIn: 'root',
})
export class WorkService {
    constructor(private http: HttpClient,
        private utilsService: UtilsService
    ) { }

    add(work: IWork): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.post<IWork>(`${BASE_URL}/work`, work, { headers });
    }

    get(workId: number): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.get<IWork>(`${BASE_URL}/work/${workId}`, { headers });
    }

    edit(work: IWork, selectedMaterialIds: number[]): Observable<any> {
        const headers = this.utilsService.getHeader();
        const request: IWorkRequest = {
            name: work.name,
            price: work.price,
            materialIdList: selectedMaterialIds
        }
        return this.http.put<IWork>(`${BASE_URL}/work/${work.id}`, request, { headers });
    }

    delete(id: number): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.delete<IWork>(`${BASE_URL}/work/${id}`, { headers });
    }

    list(page: number, size: number, name: string = ''): Observable<Page<IWork>> {
        const headers = this.utilsService.getHeader();
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
    
        if (name) {
            params = params.set('name', name);
        }
    
        return this.http.get<Page<IWork>>(`${BASE_URL}/work`, { headers, params });
    }    
}

