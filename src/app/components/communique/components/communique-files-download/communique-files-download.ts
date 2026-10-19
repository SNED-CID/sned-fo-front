import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
  SimpleChanges,
  inject,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CommuniqueFileInfo,
  CommuniqueService,
} from '../../../../services/communique.service';

/** Délai entre deux téléchargements successifs : évite que le navigateur en ignore certains */
const DOWNLOAD_INTERVAL_MS = 400;

@Component({
  selector: 'app-communique-files-download',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './communique-files-download.html',
  styleUrl: './communique-files-download.scss',
})
export class CommuniqueFilesDownload implements OnChanges, OnDestroy {
  private communiqueService = inject(CommuniqueService);
  private destroyRef = inject(DestroyRef);

  @Input() filesUUID: string[] | null | undefined = [];

  /** Titre de la publication, affiché dans l'en-tête de la fenêtre */
  @Input() title: string | null = null;

  open = signal(false);
  loadingInfos = signal(false);
  downloading = signal(false);
  files = signal<CommuniqueFileInfo[]>([]);
  selected = signal<Set<string>>(new Set());

  /** les infos (noms) ne sont chargées qu'à la première ouverture */
  private infosLoaded = false;

  selectedCount = computed(() => this.selected().size);
  allSelected = computed(
    () => this.files().length > 0 && this.selected().size === this.files().length,
  );
  someSelected = computed(
    () => this.selected().size > 0 && this.selected().size < this.files().length,
  );

  /**
   * La fenêtre est rendue dans une ligne de la liste qui a un effet de survol (transform).
   * Un élément position: fixed dans un parent transformé est positionné par rapport à ce parent :
   * au survol la fenêtre bougeait avec la ligne -> la souris sortait -> la ligne revenait -> etc.
   * On déplace donc le nœud dans <body> ; Angular le retire normalement à la fermeture.
   */
  @ViewChild('modal')
  set modalRef(ref: ElementRef<HTMLElement> | undefined) {
    if (ref) {
      document.body.appendChild(ref.nativeElement);
    }
  }

  get count(): number {
    return this.filesUUID?.length ?? 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filesUUID']) {
      this.infosLoaded = false;
      this.files.set([]);
      this.selected.set(new Set());
    }
  }

  /** Lenis (défilement fluide global) ferait défiler la page derrière la fenêtre */
  private setPageScroll(enabled: boolean): void {
    const lenis = (window as any).lenis;
    if (lenis) enabled ? lenis.start() : lenis.stop();
  }

  ngOnDestroy(): void {
    if (this.open()) this.setPageScroll(true);
  }

  openDialog(): void {
    this.open.set(true);
    this.setPageScroll(false);
    if (this.infosLoaded) return;

    this.loadingInfos.set(true);
    this.communiqueService
      .getFilesInfo(this.filesUUID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((files) => {
        this.files.set(files);
        // par défaut tous les fichiers sont sélectionnés
        this.selected.set(new Set(files.map((f) => f.uuid)));
        this.infosLoaded = true;
        this.loadingInfos.set(false);
      });
  }

  close(): void {
    this.open.set(false);
    this.setPageScroll(true);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.close();
  }

  isSelected(uuid: string): boolean {
    return this.selected().has(uuid);
  }

  toggle(uuid: string): void {
    const next = new Set(this.selected());
    next.has(uuid) ? next.delete(uuid) : next.add(uuid);
    this.selected.set(next);
  }

  toggleAll(): void {
    this.selected.set(
      this.allSelected() ? new Set() : new Set(this.files().map((f) => f.uuid)),
    );
  }

  /** Télécharge un seul fichier, directement depuis la liste */
  downloadOne(file: CommuniqueFileInfo): void {
    this.triggerDownload(file);
  }

  /** Télécharge les fichiers sélectionnés, l'un après l'autre */
  downloadSelected(): void {
    const toDownload = this.files().filter((f) => this.selected().has(f.uuid));
    if (!toDownload.length || this.downloading()) return;

    this.downloading.set(true);
    toDownload.forEach((file, i) =>
      setTimeout(() => {
        this.triggerDownload(file);
        if (i === toDownload.length - 1) this.downloading.set(false);
      }, i * DOWNLOAD_INTERVAL_MS),
    );
  }

  /**
   * Lien direct vers l'API : le backend renvoie Content-Disposition: attachment,
   * le navigateur télécharge le fichier sans le charger en mémoire dans la page.
   */
  private triggerDownload(file: CommuniqueFileInfo): void {
    const a = document.createElement('a');
    a.href = this.communiqueService.getFileUrl(file.uuid);
    a.download = file.name ?? '';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  formatSize(size: number | null): string {
    if (size == null) return '';
    if (size < 1024) return `${size} o`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
    return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
  }

  /** Icône Font Awesome selon l'extension / le type du fichier */
  fileIcon(file: CommuniqueFileInfo): string {
    const type = (file.contentType ?? '').toLowerCase();
    const ext = file.name?.split('.').pop()?.toLowerCase() ?? '';

    if (type === 'application/pdf' || ext === 'pdf') return 'fas fa-file-pdf text-red-500';
    if (['doc', 'docx', 'odt'].includes(ext)) return 'fas fa-file-word text-blue-600';
    if (['xls', 'xlsx', 'ods', 'csv'].includes(ext)) return 'fas fa-file-excel text-green-600';
    if (['ppt', 'pptx', 'odp'].includes(ext)) return 'fas fa-file-powerpoint text-orange-500';
    if (['zip', 'rar', '7z'].includes(ext)) return 'fas fa-file-zipper text-amber-600';
    if (type.startsWith('image/')) return 'fas fa-file-image text-indigo-500';
    if (type.startsWith('video/')) return 'fas fa-file-video text-purple-500';
    if (type.startsWith('audio/')) return 'fas fa-file-audio text-pink-500';
    return 'fas fa-file text-slate-400';
  }
}
