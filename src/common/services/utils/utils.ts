import log from 'loglevel';
import { useEffect, useRef } from 'react';

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) result[key] = obj[key];
    return result;
}

// TS Helpers

type FilterFlags<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
export type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;

export type NumberKeys<T, C> = { [k in keyof T]: T[k] extends C ? k : never }[keyof T];

export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]; // Inferred type is T[K]
}

export function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
    obj[key] = value;
}

export function usePrevious<T>(value?: T): T | undefined {
    const ref = useRef<T>();
    log.trace('utils', 'ref.current', ref.current, value);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

// Subtype in one expression
// export type SubType2<Base, Condition> = Pick<
//     Base,
//     {
//         [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
//     }[keyof Base]
// >;

export type CancelablePromise<T> = {
    promise: Promise<T>;
    cancel(): void;
};

export const makeCancelable = <T>(promise: Promise<T>): CancelablePromise<T> => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise<T>((resolve, reject) => {
        promise.then(
            (val) => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
            (error) => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error)),
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};
