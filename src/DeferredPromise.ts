export class DeferredPromise {
  public promise: Promise<any>;
  public resolve: (value?: any) => void;
  public reject: (reason?: any) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
