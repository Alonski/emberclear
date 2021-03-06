import Component from '@ember/component';
import { later } from '@ember/runloop';

import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import MessageDispatcher from 'emberclear/services/messages/dispatcher';
import MessageFactory from 'emberclear/services/messages/factory';
import Identity from 'emberclear/data/models/identity/model';


export default class ChatEntry extends Component {
  @service('messages/dispatcher') messageDispatcher!: MessageDispatcher;
  @service('messages/factory') messageFactory!: MessageFactory;

  to!: Identity;
  // value from the input field
  text?: string;
  // disable the text field while sending
  isDisabled = false;

  didRender() {
    const mainInput = this.element.querySelector('textarea.chat-entry') as HTMLElement;

    mainInput.onkeypress = this.onKeyPress.bind(this);
    mainInput.onkeyup = this.onKeyUp.bind(this);
    mainInput.onkeydown = this.onKeyUp.bind(this);
  }

  @computed('to.name')
  get messageTarget() {
    if (this.to) {
      return this.to.name;
    }

    // TODO: i18n
    // TODO: support more channels
    return 'Everyone in your contacts';
  }

  @computed('messageTarget')
  get placeholder() {
    return `Send a message to ${this.messageTarget}`;
  }

  @action
  async sendMessage(this: ChatEntry) {
    if (!this.text) return;

    this.set('isDisabled', true);

    await this.dispatchMessage(this.text);

    this.set('isDisabled', false);
    this.set('text', '');

    later(this, () => {
      this.adjustHeightOfTextInput();
    });
  }

  @action
  onKeyPress(this: ChatEntry, event: KeyboardEvent) {
    const { keyCode, shiftKey } = event;

    this.adjustHeightOfTextInput();
    // don't submit when shift is being held.
    if (!shiftKey && keyCode === 13) {
      this.send('sendMessage');

      // prevent regular 'Enter' from inserting a linebreak
      return false;
    }

    return true;
  }

  @action
  onKeyUp(_event: KeyboardEvent) {
    this.adjustHeightOfTextInput();
  }

  adjustHeightOfTextInput() {
    const textarea = this.element.querySelector('textarea') as HTMLTextAreaElement;
    const sizer = this.element.querySelector('.textarea-size')!;

    sizer.innerHTML = textarea.value + '\n';
  }

  async dispatchMessage(text: string) {
    this.messageDispatcher.send(text, this.to);
  }
}
