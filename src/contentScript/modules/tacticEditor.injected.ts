import { injectScript } from '@src/common/services/utils/injectScript';
/* eslint-disable no-console */
import { TacticEditorCustomEvents } from '@src/modules/tacticSummary/model/tacticEditorCustom.events';

type ExtendedWindow = typeof window & {
    changed: () => void;
    oldChanged: () => void;
    selectedpositions: string[];
};

const anyWindow = window as ExtendedWindow;

function listenSquandChanges(): void {
    anyWindow.oldChanged = anyWindow.changed;
    anyWindow.changed = () => {
        console.log('my changed');
        anyWindow.oldChanged();
        notify('PMT_tacticSquadChanged', anyWindow.selectedpositions);
    };
}

function listenAdvenceTacticChanges() {
    // injected to use jquery
    injectScript(`$('#adv_options select').each(function(a, el) {
        $(el).selectmenu({
            change: function(a, e) {
                $(el).change(),
                console.log('selectmenu changed', a, e );
                oldChanged();
                document.dispatchEvent(
                    new CustomEvent('PMT_advTacticChanged', {
                        detail: ['aaa', 'bbb']
                    })
                );
            }
        })
      });`);
}

function notify<T>(eventName: TacticEditorCustomEvents, data: T) {
    document.dispatchEvent(
        new CustomEvent<T>(eventName, {
            detail: data,
        }),
    );
}

function prepare() {
    listenSquandChanges();
    setTimeout(() => listenAdvenceTacticChanges(), 1000);
    notify('PMT_tacticInit', '');
}

prepare();
