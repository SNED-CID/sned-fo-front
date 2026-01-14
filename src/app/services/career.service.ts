import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CareerReadDTO {
  id: number;
  content: string;
  datePosting: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CareerService {
  BASE_URL: string = `${environment.apiUrl}/v1/careers`;

  constructor(private http: HttpClient) {}

  getCareer(lang: string): Observable<CareerReadDTO> {
    return this.http.get<CareerReadDTO>(`${this.BASE_URL}/localized/1?lang=${lang}`);
  }
}
