"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueueExampleMinionJobListener {
    constructor(queue, jobResultCallback, errorCallback) {
        this.queue = queue;
        this.jobResultCallback = jobResultCallback;
        this.errorCallback = errorCallback;
        this.queue.on('completed', jobResultCallback).on('error', errorCallback);
    }
}
exports.QueueExampleMinionJobListener = QueueExampleMinionJobListener;
class QueueExampleOverlordJobListener {
    constructor(queue, jobResultCallback, errorCallback) {
        this.queue = queue;
        this.jobResultCallback = jobResultCallback;
        this.errorCallback = errorCallback;
        this.queue.on('completed', jobResultCallback).on('error', errorCallback);
    }
}
exports.QueueExampleOverlordJobListener = QueueExampleOverlordJobListener;
//# sourceMappingURL=JobListeners.js.map