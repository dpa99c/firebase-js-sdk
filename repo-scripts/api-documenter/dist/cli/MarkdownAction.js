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
exports.MarkdownAction = void 0;
const tslib_1 = require("tslib");
const BaseAction_1 = require("./BaseAction");
const MarkdownDocumenter_1 = require("../documenters/MarkdownDocumenter");
class MarkdownAction extends BaseAction_1.BaseAction {
    constructor(parser) {
        super({
            actionName: 'markdown',
            summary: 'Generate documentation as Markdown files (*.md)',
            documentation: 'Generates API documentation as a collection of files in' +
                ' Markdown format, suitable for example for publishing on a GitHub site.'
        });
    }
    onDefineParameters() {
        super.onDefineParameters();
        this._sortFunctions = this.defineStringParameter({
            parameterLongName: '--sort-functions',
            argumentName: 'PRIORITY_PARAMS',
            description: `Sorts functions tables and listings by first parameter. ` +
                `Provide comma-separated strings for preferred params to be ` +
                `ordered first. Alphabetical otherwise.`
        });
    }
    onExecute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // override
            const { apiModel, outputFolder, addFileNameSuffix, projectName } = this.buildApiModel();
            const sortFunctions = this._sortFunctions.value || '';
            if (!projectName) {
                throw new Error('No project name provided. Use --project.');
            }
            const markdownDocumenter = new MarkdownDocumenter_1.MarkdownDocumenter({
                apiModel,
                documenterConfig: undefined,
                outputFolder,
                addFileNameSuffix,
                projectName,
                sortFunctions
            });
            markdownDocumenter.generateFiles();
        });
    }
}
exports.MarkdownAction = MarkdownAction;
//# sourceMappingURL=MarkdownAction.js.map