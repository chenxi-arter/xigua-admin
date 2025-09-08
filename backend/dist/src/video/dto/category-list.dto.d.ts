export declare class CategoryListDto {
    versionNo?: number;
}
export interface CategoryItem {
    channeid: number;
    name: string;
    routeName: string;
}
export interface CategoryListData {
    versionNo: number;
    list: CategoryItem[];
}
export interface CategoryListResponse {
    ret: number;
    data: CategoryListData;
    msg: string | null;
}
