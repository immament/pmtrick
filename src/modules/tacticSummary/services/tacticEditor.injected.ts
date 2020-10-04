import { injectScript } from '@src/common/services/utils/injectScript';
/* eslint-disable no-console */
import { TacticEditorCustomEvents } from '@src/modules/tacticSummary/model/tacticEditorCustom.events';

type ExtendedWindow = typeof window & {
    changed: () => void;
    pmtOldChanged?: () => void;
    selectedpositions: string[];
};

const anyWindow = window as ExtendedWindow;

function listenSquandChanges(): void {
    anyWindow.pmtOldChanged = anyWindow.changed;
    anyWindow.changed = () => {
        console.log('my changed');
        anyWindow.pmtOldChanged && anyWindow.pmtOldChanged();
        notify('PMT_tacticSquadChanged', anyWindow.selectedpositions);
    };
}

function listenAdvanceTacticChanges() {
    // injected to use jquery
    injectScript(`$('#adv_options select').each(function(a, el) {
        $(el).selectmenu({
            change: function(a, e) {
                $(el).change(),
                console.log('selectmenu changed', a, e );
                pmtOldChanged();
                document.dispatchEvent(
                    new CustomEvent('PMT_advTacticChanged', {
                        detail: []
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
    console.log('prepare.......');
    const manager = document.querySelector('#managerTabs');
    if (!manager) {
        console.log('prepare....... managerTabs not avaiable..');
        setTimeout(prepare, 1000);
        return;
    }
    const style = window.getComputedStyle(manager);
    if (style.display === 'none') {
        console.log('prepare....... managerTabs no visible yet ... ');
        setTimeout(prepare, 1000);
        return;
    }

    listenSquandChanges();
    listenAdvanceTacticChanges();

    notify('PMT_tacticInit', 'prepare');
}

prepare();
