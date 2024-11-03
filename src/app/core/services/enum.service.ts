import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BASE_URL } from '../../config/utils';
import { UtilsService } from './utils.service';
import { IEnum } from '../models/Enum';

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  listUnitOfMeasure(): Observable<IEnum[]> {
    const headers = this.utilsService.getHeader()
    return this.http.get<IEnum[]>(`${BASE_URL}/enum/unitOfMeasure`, { headers }).pipe(
      map((response: IEnum[]) => response)
    );
  }
}
