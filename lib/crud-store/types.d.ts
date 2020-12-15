export interface Apis {
    getList: (params?: any) => Promise<any>;
    count: (params?: any) => Promise<{
        count: number;
    }>;
    getOne: (id: string | number) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string | number, data: any) => Promise<any>;
    remove: (id: string | number) => Promise<any>;
    trashGetList: (params?: any) => Promise<any>;
    trashCount: (params?: any) => Promise<{
        count: number;
    }>;
    trashRestore: (id: string | number) => Promise<any>;
    trashPurge: (id: string | number) => Promise<any>;
    trashEmpty: () => Promise<any>;
}
