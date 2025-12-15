import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PreviewTokenService } from './preview-token.service';

export interface CommuniqueReadDTO {
  id: number;
  title: string;
  datePosting: Date | null;
  details: string;
  imageUUID: string;
  publicationStatus: PublicationStatus;
}

export enum PublicationStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CommuniqueFilterClass {
  lang?: string;
  title?: string;
  fromDate?: string | null;
  toDate?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CommuniqueService {
  BASE_URL: string = `${environment.apiUrl}/communique`;

  public communiques!: CommuniqueReadDTO[];

  public communiqueImages: { [key: string]: string } = {};

  constructor(
    private http: HttpClient,
    private previewTokenService: PreviewTokenService
  ) {}

  getImageByUUID(
    imageUUID: string,
    publicationStatus: PublicationStatus = PublicationStatus.PUBLISHED
  ): Observable<Blob> {
    return this.http.get(
      `${this.BASE_URL}/${publicationStatus.toLowerCase()}/${imageUUID}/image`,
      { responseType: 'blob' }
    );
  }

  getFilteredCommunique(
    communiqueFilter: CommuniqueFilterClass,
    page: number = 0,
    size: number = 5
  ): Observable<Page<CommuniqueReadDTO>> {
    const hasPreviewToken = this.previewTokenService.hasToken();
    const endpoint = hasPreviewToken ? '/filter/preview' : '/filter';
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    const url : string = this.BASE_URL + endpoint

    return this.http.post<Page<CommuniqueReadDTO>>(
      url,
      communiqueFilter,
      { params }
    );
  }
}
