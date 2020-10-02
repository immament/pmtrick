import 'react-devtools';
import 'reflect-metadata';
import '../scss/content.scss';
import './services/contentScript.bootstrap';

import log from 'loglevel';
import { container } from 'tsyringe';

import { ContentScriptRegistry } from './services/contentScript.registry';

log.info('contentScriptRoot +');

const contentScriptRegistry = container.resolve<ContentScriptRegistry>(ContentScriptRegistry);

contentScriptRegistry.applyContent();
