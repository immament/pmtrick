export interface HtmlElementExtractor<S extends Element, R> {
    extract(element: S): R | undefined;
}
