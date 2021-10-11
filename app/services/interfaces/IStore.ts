

export interface IStore {
    set(item: any): Promise<Boolean | null>
}