import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../../config/utils';
import { UtilsService } from '../utils/utils.service';
import { Page } from '../interfaces/Page';
import { IWorkRequest } from '../interfaces/work/WorkRequest';
import { IWork } from '../models/Work';
import { IWorkEditRequest } from '../interfaces/work/WorkEditRequest';

@Injectable({
    providedIn: 'root',
})
export class WorkService {
    constructor(private readonly http: HttpClient,
        private readonly utilsService: UtilsService
    ) { }

    add(workRequest: IWorkRequest): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.post<IWork>(`${BASE_URL}/work`, workRequest, { headers });
    }

    get(workId: number): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.get<IWork>(`${BASE_URL}/work/${workId}`, { headers });
    }

    edit(workRequest: IWorkEditRequest) {
        const headers = this.utilsService.getHeader();
        return this.http.put<IWork>(`${BASE_URL}/work/${workRequest.id}`, workRequest, { headers });
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

