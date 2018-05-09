import Service, { Registry as ServiceRegistry } from '@ember/service';
import { isBlank, isPresent } from '@ember/utils';

import { service } from '@ember-decorators/service';

import { generateNewKeys } from 'emberclear/src/utils/nacl/utils';
import { toBase64 } from 'emberclear/src/utils/string-encoding';
import Identity from 'emberclear/data/models/identity';


export default class IdentityService extends Service {
  @service store!: ServiceRegistry['store'];

  name?: string;
  publicKey?: string;
  privateKey?: string;

  async create(this: IdentityService, name: string) {
    const { publicKey, privateKey } = await generateNewKeys();
    const pub = await toBase64(publicKey);
    const priv = await toBase64(privateKey);

    this.store.createRecord('identity', {
      id: 'me',
      name,
      privateKey: priv,
      publicKey: pub
    })
  }

  exists(): boolean {
    const identity = this._identity();

    if (identity === null) return false;
    if (isBlank(identity)) return false;

    return isPresent(identity.privateKey);
  }

  // load() {
  //   const json = JSON.parse(localStorage.identity);
  //
  //   this.store.createRecord('identity', json);
  // }
  //
  // dump() {
  //   const identity = this._identity();
  //
  //   if (isBlank(identity)) return;
  //
  //   const json = identity.serialize({ includeId: true });
  //
  //   localStorage.identity = json;
  // }

  _identity(): Identity | null {
    return this.store.peekRecord('identity', 'me');
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'identity': IdentityService;
  }
}
