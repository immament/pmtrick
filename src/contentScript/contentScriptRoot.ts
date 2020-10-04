// import 'react-devtools';
import 'reflect-metadata';
import '../scss/content.scss';
import './services/contentScript.bootstrap';

import { container } from 'tsyringe';

import { ContentScriptRegistry } from './services/contentScript.registry';

const contentScriptRegistry = container.resolve<ContentScriptRegistry>(ContentScriptRegistry);

contentScriptRegistry.applyContent();
