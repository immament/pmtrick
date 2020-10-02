import log from 'loglevel';
import { container, injectable } from 'tsyringe';

import PlayersSkillsContentService from '@src/contentScript/contentServices/playersSkillsContent.service';

import { ContentScriptService } from '../contentServices/contentScript.service';
import TacticEditorContentService from '../contentServices/tacticEditorContent.service';

@injectable()
export class ContentScriptRegistry {
    constructor() {
        this.registryContent();
    }

    applyContent(): void {
        const url = location.href;
        const services = container.resolveAll<ContentScriptService>('ContentScriptService');
        log.info('ContentScriptRegistry.applyContent: ', services.length);

        for (const service of services) {
            if (service.match(url)) {
                log.info('ContentScriptRegistry.apply', service.name);
                service.apply();
            }
        }
    }

    registryContent(): void {
        log.info('ContentScriptRegistry.registryContent+');
        container.register('ContentScriptService', PlayersSkillsContentService);
        container.register('ContentScriptService', TacticEditorContentService);
    }
}
