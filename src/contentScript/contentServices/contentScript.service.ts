export interface ContentScriptService {
    name: string;
    apply(): void;
    match(url: string): boolean;
}
