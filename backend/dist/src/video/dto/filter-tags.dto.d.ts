export declare class FilterTagsDto {
    channeid?: string;
}
export interface FilterTagItem {
    index: number;
    classifyId: number;
    classifyName: string;
    isDefaultSelect: boolean;
}
export interface FilterTagGroup {
    name: string;
    list: FilterTagItem[];
}
export interface FilterTagsResponse {
    code: number;
    data: {
        list: FilterTagGroup[];
    };
    msg: string | null;
}
