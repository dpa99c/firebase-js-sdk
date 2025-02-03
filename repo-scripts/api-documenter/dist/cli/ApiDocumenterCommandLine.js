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
exports.ApiDocumenterCommandLine = void 0;
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const ts_command_line_1 = require("@rushstack/ts-command-line");
const MarkdownAction_1 = require("./MarkdownAction");
const TocAction_1 = require("./TocAction");
class ApiDocumenterCommandLine extends ts_command_line_1.CommandLineParser {
    constructor() {
        super({
            toolFilename: 'api-documenter',
            toolDescription: 'Reads *.api.json files produced by api-extractor, ' +
                ' and generates API documentation in various output formats.'
        });
        this._populateActions();
    }
    onDefineParameters() {
        // override
        // No parameters
    }
    _populateActions() {
        this.addAction(new MarkdownAction_1.MarkdownAction(this));
        this.addAction(new TocAction_1.TocAction(this));
    }
}
exports.ApiDocumenterCommandLine = ApiDocumenterCommandLine;
//# sourceMappingURL=ApiDocumenterCommandLine.js.map