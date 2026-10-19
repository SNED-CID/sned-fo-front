import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { PreviewTokenService } from './preview-token.service';


export interface CommuniqueReadDTO {
  id: number;
  title: string;
  datePosting: Date | null;
  details: string;
  frLink: string | null;
    enLink: string | null;
    esLink: string | null;
  // communiqueUrl: string;
  imageUUID: string;
  publicationStatus: PublicationStatus;
  filesUUID?: string[];
}

/** Fichier attaché à une publication (nom d'origine lu dans Content-Disposition) */
export interface CommuniqueFileInfo {
  uuid: string;
  /** null si le nom n'a pas pu être récupéré */
  name: string | null;
  contentType: string | null;
  size: number | null;
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
  sortDirection?: SortDirection;
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Injectable({
  providedIn: 'root',
})
export class CommuniqueService {

  BASE_URL: string = `${environment.apiUrl}/v1/communiques`;
  
  //BASE_URL: string = `http://localhost:8081/api/v1/communiques`;

  public communiqueImages: { [key: string]: string } = {};

  constructor(
    private http: HttpClient,
    private previewTokenService: PreviewTokenService,
  ) {}


  getImageByUUID(
    imageUUID: string,
    publicationStatus: PublicationStatus = PublicationStatus.PUBLISHED,
  ): Observable<Blob> {
    return this.http.get(
      `${this.BASE_URL}/${publicationStatus.toLowerCase()}/${imageUUID}/image`,
      { responseType: 'blob' },
    );
  }

  /** URL de téléchargement direct d'un fichier (le backend répond en Content-Disposition: attachment) */
  getFileUrl(fileUUID: string): string {
    return `${this.BASE_URL}/files/${encodeURIComponent(fileUUID)}`;
  }

  /** Extrait le nom du fichier depuis l'en-tête Content-Disposition (filename* prioritaire) */
  private parseFilename(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;

    const utf8Match = /filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/.exec(contentDisposition);
    if (utf8Match) {
      try {
        return decodeURIComponent(utf8Match[1].trim().replace(/^"|"$/g, ''));
      } catch {
        // nom mal encodé : on tente le paramètre filename classique
      }
    }

    const match = /filename\s*=\s*"?([^";]+)"?/.exec(contentDisposition);
    return match ? match[1].trim() : null;
  }

  /** Nom / type / taille d'un fichier, sans télécharger son contenu (requête HEAD) */
  getFileInfo(fileUUID: string): Observable<CommuniqueFileInfo> {
    return this.http
      .head(this.getFileUrl(fileUUID), { observe: 'response' })
      .pipe(
        map((res) => {
          const size = res.headers.get('Content-Length');
          return {
            uuid: fileUUID,
            name: this.parseFilename(res.headers.get('Content-Disposition')),
            contentType: res.headers.get('Content-Type'),
            size: size != null ? Number(size) : null,
          };
        }),
      );
  }

  /** Infos de plusieurs fichiers ; un fichier en erreur est conservé avec un nom null */
  getFilesInfo(filesUUID: string[] | null | undefined): Observable<CommuniqueFileInfo[]> {
    if (!filesUUID?.length) return of([]);

    return forkJoin(
      filesUUID.map((uuid) =>
        this.getFileInfo(uuid).pipe(
          catchError(() =>
            of<CommuniqueFileInfo>({ uuid, name: null, contentType: null, size: null }),
          ),
        ),
      ),
    );
  }

  getFilteredCommunique(
    communiqueFilter: CommuniqueFilterClass,
    page: number = 0,
    size: number = 5,
  ): Observable<Page<CommuniqueReadDTO>> {
    const hasPreviewToken = this.previewTokenService.hasToken();
    const endpoint = hasPreviewToken ? '/filter/preview' : '/filter';
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    const url: string = this.BASE_URL + endpoint;
    console.log("voici url " , url);

    return this.http.post<Page<CommuniqueReadDTO>>(url, communiqueFilter, {
      params,
    });
  }

}
