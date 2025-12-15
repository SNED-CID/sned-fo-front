export function formatDateToLocalDateTime(date: Date | null): string | null {
    if (!date) return null;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
}

export function parseLocalDateTimeToDate(localDateTime: string | null | undefined): Date | null {
    if (!localDateTime) return null;
    const dateTime = localDateTime.split('.')[0]; // ignore fractions si présentes
    const [datePart, timePart] = dateTime.split('T');
    if (!datePart || !timePart) return null;
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm, ss] = timePart.split(':').map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, ss ?? 0);
}
