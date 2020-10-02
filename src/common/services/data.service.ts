import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class DataService<T> {
    private readonly subject: Subject<T>;
    private _observable: Observable<T>;

    public get observable(): Observable<T> {
        return this._observable;
    }

    constructor(initData?: T) {
        if (initData) {
            this.subject = new BehaviorSubject<T>(initData);
        } else {
            this.subject = new Subject<T>();
        }
        this._observable = this.subject.asObservable();
    }

    newData(data: T): void {
        this.subject.next(data);
    }
}
