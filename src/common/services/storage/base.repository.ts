import log from 'loglevel';

type StorageAreaType = 'local' | 'sync';

export class BaseRepository<T> {
    private area: browser.storage.StorageArea;
    constructor(protected _moduleName: string, storageArea: StorageAreaType = 'local') {
        switch (storageArea) {
            case 'local':
                this.area = browser.storage.local;
                break;
            case 'sync':
                this.area = browser.storage.sync;
                break;
        }
    }

    async get(): Promise<T> {
        const result = await this.area.get(this._moduleName);
        log.trace(`get ${this._moduleName}`, result);
        return result[this._moduleName] as T;
    }

    save(value: T): Promise<void> {
        log.trace(`save ${this._moduleName}`, value);
        return this.area.set({ [this._moduleName]: value }).catch((reason) => {
            log.error(`Error during save ${this._moduleName}`, reason);
        });
    }
}
