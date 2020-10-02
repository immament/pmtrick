import { injectable } from 'tsyringe';

import { ContentScriptService } from '@src/contentScript/contentServices/contentScript.service';

import { TacticEditorService } from '../modules/tactidEditor.service';

@injectable()
export default class TacticEditorContentService implements ContentScriptService {
    constructor(private teacticEditorService: TacticEditorService) {}
    name = 'TacticEditor';

    match(url: string): boolean {
        return (
            url.indexOf('titulares_v3.asp') > -1 || // match tactic editor
            url.indexOf('ver_jogador.asp') > -1 // ! TEMP
        );
    }

    apply(): void {
        this.teacticEditorService.run();
    }
}
