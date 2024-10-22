import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BASE_URL } from '../../config/utils';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  listUnitOfMeasure(): Observable<string[]> {
    const headers = this.utilsService.getHeader()
    return this.http.get<string[]>(`${BASE_URL}/enum/unitOfMeasure`, { headers }).pipe(
      map((response: string[]) => response)
    );
  }
}
