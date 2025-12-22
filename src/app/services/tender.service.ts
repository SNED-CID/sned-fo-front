import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PreviewTokenService } from './preview-token.service';

export interface TenderReadDTO {
  id: number;
  number: string;
  datePosting: Date | null;
  content: string;
  publicationStatus: string;
}

export interface Page<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TenderService {
  BASE_URL: string = `${environment.apiUrl}/tenders`;

  constructor(
    private http: HttpClient,
    private previewTokenService: PreviewTokenService
  ) {}

  getAllLocalizedTenders(lang? : string) : Observable<TenderReadDTO[]> {
      const hasPreviewToken = this.previewTokenService.hasToken();
      const endpoint = hasPreviewToken ? '/preview' : '/localized';
      const url : string = this.BASE_URL + endpoint + (lang != null ? '?lang=' + lang : '');
      return this.http.get<TenderReadDTO[]>(url);
  }


}
