import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../config/utils';
import { IMaterial } from '../models/Material';
import { UtilsService } from './utils.service';
import { Page } from '../models/Page';

@Injectable({
    providedIn: 'root',
})
export class MaterialService {
    constructor(private http: HttpClient,
        private utilsService: UtilsService
    ) { }

    add(material: IMaterial): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.post<IMaterial>(`${BASE_URL}/material`, material, { headers });
    }

    edit(material: IMaterial): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.put<IMaterial>(`${BASE_URL}/material/${material.id}`, material, { headers });
    }

    delete(id: number): Observable<any> {
        const headers = this.utilsService.getHeader();
        return this.http.delete<IMaterial>(`${BASE_URL}/material/${id}`, { headers });
    }

    list(page: number, size: number, name: string = ''): Observable<Page<IMaterial>> {
        const headers = this.utilsService.getHeader();
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
    
        if (name) {
            params = params.set('name', name);
        }
    
        return this.http.get<Page<IMaterial>>(`${BASE_URL}/material`, { headers, params });
    }    
}

