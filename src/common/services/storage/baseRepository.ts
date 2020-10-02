import log from 'loglevel';

export class BaseRepository<T> {
    constructor(protected _moduleName: string) {}
    async get(): Promise<T> {
        const result = await browser.storage.local.get(this._moduleName);
        log.debug(`get ${this._moduleName}`, result);
        return result[this._moduleName] as T;
    }

    save(value: T): Promise<void> {
        log.debug(`save ${this._moduleName}`, value);
        return browser.storage.local.set({ [this._moduleName]: value }).catch((reason) => {
            log.error(`Error during save ${this._moduleName}`, reason);
        });
    }
}
