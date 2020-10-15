import log from 'loglevel';
import { Observable, Subject } from 'rxjs';
import { singleton } from 'tsyringe';

import { BaseSettings, settingsConfig } from './settings';

export type SettingsChange = browser.storage.StorageChange;

@singleton()
export class SettingsRepository {
    private onChangedSubject = new Subject<Record<string, SettingsChange>>();

    private _onChanged = this.onChangedSubject.asObservable();
    public get onChanged(): Observable<Record<string, SettingsChange>> {
        return this._onChanged;
    }

    constructor() {
        this.listen();
    }

    async getMultipleSettings<T extends Record<string, BaseSettings | undefined>>(keys: (keyof T)[]): Promise<T> {
        const keyDictionary: Record<string, BaseSettings | undefined> = {};
        for (const key of keys) {
            const defaultValue = settingsConfig[key as string];
            keyDictionary[key as string] = defaultValue;
        }
        return (browser.storage.sync.get(keyDictionary) as unknown) as T;
    }

    async getSettings<T extends BaseSettings>(key: string): Promise<T> {
        const defaultValue = settingsConfig[key];
        const settings = await this.get<T>(key, defaultValue);
        return settings;
    }

    save<T extends BaseSettings>(key: string, value: T): Promise<void> {
        return this.set<T>(value, key);
    }

    private listen(): void {
        browser.storage.onChanged.addListener((changes, areaName) => {
            log.trace('settings.repository', 'changes', changes, areaName);
            if (areaName === 'sync') {
                this.onChangedSubject.next(changes);
            }
        });
    }

    //  HELPERS

    protected async get<T extends BaseSettings>(key: string, defaultValue?: BaseSettings): Promise<T> {
        const result = await browser.storage.sync.get({ [key]: defaultValue });
        return (result[key] ?? {}) as T;
    }

    protected set<T extends BaseSettings>(value: T, key: string): Promise<void> {
        return browser.storage.sync.set({ [key]: value });
    }
}
