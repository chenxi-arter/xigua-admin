export type IngestAction = 'created' | 'updated';
export interface IngestItemSuccess {
    statusCode: number;
    seriesId: number;
    shortId: string | null;
    externalId: string | null;
    action: IngestAction;
    title?: string;
}
export interface IngestItemError {
    statusCode: number;
    error: string;
    details?: any;
    externalId?: string | null;
    title?: string;
}
export type IngestItem = IngestItemSuccess | IngestItemError;
export interface IngestSummary {
    created: number;
    updated: number;
    failed: number;
    total: number;
}
export interface IngestResponseData {
    summary: IngestSummary;
    items: IngestItem[];
}
