import log from 'loglevel';
import { container, registry, singleton } from 'tsyringe';

import { ContentScriptService } from '../contentServices/contentScript.service';
import PlayersSkillsContentService from '../contentServices/playersSkillsContent.service';
import TacticEditorContentService from '../contentServices/tacticEditorContent.service';

@singleton()
@registry([
    { token: 'ContentScriptService', useClass: PlayersSkillsContentService },
    { token: 'ContentScriptService', useClass: TacticEditorContentService },
])
export class ContentScriptRegistry {
    applyContent(): void {
        const url = location.href;
        const services = container.resolveAll<ContentScriptService>('ContentScriptService');
        log.trace('ContentScriptRegistry.applyContent size:', services.length);

        for (const service of services) {
            if (service.match(url)) {
                log.info('ContentScriptRegistry.apply:', service.name);
                service.apply();
            }
        }
    }
}
