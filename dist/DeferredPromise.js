"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeferredPromise {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.DeferredPromise = DeferredPromise;
//# sourceMappingURL=DeferredPromise.js.map