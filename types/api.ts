// types/api.ts
export interface PageData {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  }
  
  export interface GetPageDataQuery {
    getPageData: PageData;
  }