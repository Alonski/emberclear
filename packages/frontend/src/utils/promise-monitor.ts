import { set } from '@ember/object';

export default class PromiseMonitor<T> {
  _promise!: Promise<T>;
  isRejected = false;
  isFulfilled = false;
  isPending = true;
  result: T | Error | undefined;

  constructor(promise: Promise<T>) {
    this._promise = promise;

    this._evaluatePromise();
  }

  async _evaluatePromise() {
    try {
      const result = await this._promise;

      this._didFulfill(result);
    } catch (e) {
      this._didReject(e);
    }
  }

  _didFulfill(result: T) {
    set(this, 'isPending', false);
    set(this, 'isFulfilled', true);
    set(this, 'result', result);
  }

  _didReject(error: Error) {
    set(this, 'isPending', false);
    set(this, 'isRejected', true);
    set(this, 'result', error);
  }
}
