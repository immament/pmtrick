export {};

declare global {
    // note, if you augment `WindowEventMap`, the event would be recognized if you
    // are doing window.addEventListener(...), but element would not recognize I believe;
    // there are also

    // - HTMLElementEventMap (extends ElementEventMap), allows you to element.addEventListener();
    interface DocumentEventMap {
        PMT_tacticSquadChanged: CustomEvent<{ data: unknown }>;
        PMT_advTacticChanged: CustomEvent<{ data: unknown }>;
        PMT_tacticInit: CustomEvent<{ data: string }>;
    }
}
