import log from 'loglevel';
import { container, singleton } from 'tsyringe';

import { ContentScriptService } from '../contentServices/contentScript.service';
import TacticEditorContentService from '../contentServices/tacticEditorContent.service';

@singleton()
export class ContentScriptRegistry {
    constructor() {
        this.registryContent();
    }

    applyContent(): void {
        const url = location.href;
        const services = container.resolveAll<ContentScriptService>('ContentScriptService');
        log.debug('ContentScriptRegistry.applyContent: ', services.length);

        for (const service of services) {
            if (service.match(url)) {
                log.info('ContentScriptRegistry.apply', service.name);
                service.apply();
            }
        }
    }

    registryContent(): void {
        log.debug('ContentScriptRegistry.registryContent+');
        // container.register('ContentScriptService', PlayersSkillsContentService);
        container.register('ContentScriptService', TacticEditorContentService);
    }
}
