import { TypeDuplicate } from './duplicate';

export type ReportResult = {
  data: TypeDuplicate[];
  meta: Metadata;
};

export type Metadata = {
  projectName: string;
  projectFilesScanned: number;
  projectLocScanned: number;
  projectTypesScanned: number;
  projectFilesWithTypesDeclarations: number;
  reportSize: number;
  scanDuration: number;
  scannedAt: string;
};
