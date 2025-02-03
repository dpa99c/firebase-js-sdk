"use strict";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumenterConfig = void 0;
const tslib_1 = require("tslib");
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const path = tslib_1.__importStar(require("path"));
const node_core_library_1 = require("@rushstack/node-core-library");
/**
 * Helper for loading the api-documenter.json file format.  Later when the schema is more mature,
 * this class will be used to represent the validated and normalized configuration, whereas `IConfigFile`
 * represents the raw JSON file structure.
 */
class DocumenterConfig {
    constructor(filePath, configFile) {
        this.configFilePath = filePath;
        this.configFile = configFile;
        switch (configFile.newlineKind) {
            case 'lf':
                this.newlineKind = node_core_library_1.NewlineKind.Lf;
                break;
            case 'os':
                this.newlineKind = node_core_library_1.NewlineKind.OsDefault;
                break;
            default:
                this.newlineKind = node_core_library_1.NewlineKind.CrLf;
                break;
        }
    }
    /**
     * Load and validate an api-documenter.json file.
     */
    static loadFile(configFilePath) {
        const configFile = node_core_library_1.JsonFile.loadAndValidate(configFilePath, DocumenterConfig.jsonSchema);
        return new DocumenterConfig(path.resolve(configFilePath), configFile);
    }
}
exports.DocumenterConfig = DocumenterConfig;
/**
 * The JSON Schema for API Extractor config file (api-extractor.schema.json).
 */
DocumenterConfig.jsonSchema = node_core_library_1.JsonSchema.fromFile(path.join(__dirname, '..', 'schemas', 'api-documenter.schema.json'));
/**
 * The config file name "api-extractor.json".
 */
DocumenterConfig.FILENAME = 'api-documenter.json';
//# sourceMappingURL=DocumenterConfig.js.map