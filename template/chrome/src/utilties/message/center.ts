export type TargetTag =
  | "background"
  | "content"
  | "sandbox"
  | "popup"
  | "options"
  | "install"
  | "confirm"
  | "all";

export type Target = { tag: TargetTag; id?: number[] };

export class MessageCenter {
  public connectMap: Map<TargetTag, Map<number, chrome.runtime.Port>> =
    new Map();

  public start() {
    chrome.runtime.onConnect.addListener((port) => {
      port.onDisconnect.addListener(() => {});

      port.onMessage.addListener(() => {});
    });
  }

  public send() {}

  public sendNative() {}
}
