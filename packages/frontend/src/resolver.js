import Resolver from 'ember-resolver/resolvers/fallback';
// import Resolver from 'ember-resolver/resolvers/glimmer-wrapper';

import { merge } from '@ember/polyfills';

import buildResolverConfig from 'ember-resolver/ember-config';
import config from '../config/environment';

let moduleConfig = buildResolverConfig(config.modulePrefix);
/*
 * If your application has custom types and collections, modify moduleConfig here
 * to add support for them.
 */

merge(moduleConfig.types, {
  config: { definitiveCollection: 'main' },
  util: { definitiveCollection: 'utils' },
  // ember-intl
  'ember-intl@adapter': { definitiveCollection: 'main' },
  'ember-intl@translation': { definitiveCollection: 'main' },
  translation: { definitiveCollection: 'main' },
  formats: { definitiveCollection: 'main' },
  cldr: { definitiveCollection: 'main' },
  'util:intl': { definitiveCollection: 'utils' },
  // ember-gestures
  'ember-gesture': { definitiveCollection: 'main' }
});

moduleConfig.collections.main.types.push('config');
moduleConfig.collections.main.types.push('translation');

export default Resolver.extend({
  config: moduleConfig,
});
