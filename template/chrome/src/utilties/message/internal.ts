import { type TargetTag, type Target } from "./center";

export class MessageInternal {
  public port!: chrome.runtime.Port;

  public tag: TargetTag;

  public constructor(tag: TargetTag) {
    this.tag = tag;
    this.reconnect();
  }

  public reconnect() {
    this.port = chrome.runtime.connect({
      name: this.tag,
    });
  }

  public nativeSend<T>(data: T): void {
    this.port.postMessage(data);
  }

  public send<T>(action: string, data: T): void {
    this.port.postMessage({
      action,
      data,
    });
  }

  public syncSend<T>(action: string, data: T) {}

  public broadcast<T>(target: Target, action: string, data: T) {
    this.nativeSend({
      target,
      action,
      data,
      broadcast: true,
    });
  }
}
