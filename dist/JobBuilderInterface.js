"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExampleOverlordJob_1 = require("./ExampleOverlordJob");
const ExampleMinionJob_1 = require("./ExampleMinionJob");
class ExampleMinionJobBuilder {
    build(job) {
        switch (job.jobType) {
            case ExampleMinionJob_1.ExampleMinionJobType.Minion1:
                return new ExampleMinionJob_1.ExampleMinionJob(job);
        }
    }
}
exports.ExampleMinionJobBuilder = ExampleMinionJobBuilder;
class ExampleOverlordJobBuilder {
    build(job) {
        switch (job.jobType) {
            case ExampleOverlordJob_1.ExampleOverlordJobType.Overlord1:
                return new ExampleOverlordJob_1.ExampleOverlordJob(job);
        }
    }
}
exports.ExampleOverlordJobBuilder = ExampleOverlordJobBuilder;
//# sourceMappingURL=JobBuilderInterface.js.map