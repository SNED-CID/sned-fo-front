
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { PreviewTokenService } from './preview-token.service';

export interface PartnerReadDTO {
  id: number,
  partnerType : string,
  name : string,
  description?: string,
  displayOrder?: number,
  logoUUID: string
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  BASE_URL : string = `${environment.apiUrl}/v1/partners`;

  constructor(
    private http : HttpClient,
    private previewTokenService: PreviewTokenService
  ){}

  getAllLocalizedPartners(lang? : string) : Observable<PartnerReadDTO[]> {
    const hasPreviewToken = this.previewTokenService.hasToken();
    const endpoint = hasPreviewToken ? '/preview' : '';
    const url : string = this.BASE_URL + endpoint + (lang != null ? '?lang=' + lang : '');
    return this.http.get<PartnerReadDTO[]>(url);
  }


  getLogoByPartnerId(id: string): Observable<Blob> {
    const hasPreviewToken = this.previewTokenService.hasToken();
    const endpoint = hasPreviewToken ? `preview/${id}/logo` : `${id}/logo`;
    return this.http.get(`${this.BASE_URL}/${endpoint}`, { responseType: 'blob' });
  }


}
