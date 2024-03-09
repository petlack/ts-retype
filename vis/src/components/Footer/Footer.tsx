import { formatDistance, formatDuration, isValid, parseISO, format } from 'date-fns';
import './Footer.scss';

import { Metadata } from '@ts-retype/retype/src/types';

export function formatSize(bytes: number): string {
  const B = 1;
  const KB = 1024*B;
  const MB = 1024*KB;
  if (bytes < 100) {
    return `${bytes} B`;
  }
  if (bytes < MB) {
    return `${(bytes / KB).toFixed(0)} kB`;
  }
  return `${(bytes / MB).toFixed(1)} MB`;
}

export function formatAge(date: Date) {
  if (isValid(date)) {
    return formatDistance(date, new Date(), { addSuffix: true });
  }
  return 'never';
}

export function formatDate(date: Date) {
  if (isValid(date)) {
    return format(date, 'do MMM yyyy');
  }
  return 'never';
}

export function formatNumber(num: number | null | undefined) {
  if (num != null) {
    return num.toLocaleString();
  }
  return '∞';
}

export const Footer = ({ meta }: { meta: Metadata }) => {
  return (
    <footer>
      <div className="section">
        <span>Scan done in </span>
        <span className="strong">{formatDuration({ seconds: meta.scanDuration })}</span>
        <span> on </span>
        <span className="strong">{formatDate(parseISO(meta.scannedAt))}</span>
        <span className="strong"> ({formatAge(parseISO(meta.scannedAt))})</span>
      </div>
      <div className="section">
        <span>Scanned </span>
        <span className="strong">{formatNumber(meta.projectLocScanned)}</span>
        <span> LOCs in </span>
        <span className="strong">{formatNumber(meta.projectFilesScanned)}</span>
        <span> files</span>
      </div>
      <div className="section">
        <span>Found</span>
        <span className="strong">{formatNumber(meta.projectTypesScanned)}</span>
        <span> types defined in </span>
        <span className="strong">{formatNumber(meta.projectFilesWithTypesDeclarations)}</span>
        <span> files</span>
      </div>
      <div className="section">
        <span>Size of this report is </span>
        <span className="strong">{formatSize(meta.reportSize)}</span>
      </div>
    </footer>
  );
};