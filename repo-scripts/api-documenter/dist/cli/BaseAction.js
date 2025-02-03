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
exports.BaseAction = void 0;
const tslib_1 = require("tslib");
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const path = tslib_1.__importStar(require("path"));
const colors_1 = tslib_1.__importDefault(require("colors"));
const ts_command_line_1 = require("@rushstack/ts-command-line");
const node_core_library_1 = require("@rushstack/node-core-library");
const api_extractor_model_me_1 = require("api-extractor-model-me");
class BaseAction extends ts_command_line_1.CommandLineAction {
    onDefineParameters() {
        // override
        this._inputFolderParameter = this.defineStringParameter({
            parameterLongName: '--input-folder',
            parameterShortName: '-i',
            argumentName: 'FOLDER1',
            description: `Specifies the input folder containing the *.api.json files to be processed.` +
                ` If omitted, the default is "./input"`
        });
        this._outputFolderParameter = this.defineStringParameter({
            parameterLongName: '--output-folder',
            parameterShortName: '-o',
            argumentName: 'FOLDER2',
            description: `Specifies the output folder where the documentation will be written.` +
                ` ANY EXISTING CONTENTS WILL BE DELETED!` +
                ` If omitted, the default is "./${this.actionName}"`
        });
        this._fileNameSuffixParameter = this.defineFlagParameter({
            parameterLongName: '--name-suffix',
            parameterShortName: '-s',
            description: `Add suffix to interface and class names in the file path.` +
                `For example, packageA.myinterface_i.md for MyInterface interface, ` +
                `Add packageA.myclass_c.md for MyClass class.` +
                `This is to avoid name conflict in case packageA also has, for example, an entry point with the same name in lowercase.` +
                `This option is specifically designed for the Admin SDK where such case occurs.`
        });
        this._projectNameParameter = this.defineStringParameter({
            parameterLongName: '--project',
            argumentName: 'PROJECT',
            description: `Name of the project (js, admin, functions, etc.). This will be ` +
                `used in the devsite header path to the _project.yaml file.`
        });
    }
    buildApiModel() {
        const apiModel = new api_extractor_model_me_1.ApiModel();
        const inputFolder = this._inputFolderParameter.value || './input';
        if (!node_core_library_1.FileSystem.exists(inputFolder)) {
            throw new Error('The input folder does not exist: ' + inputFolder);
        }
        const outputFolder = this._outputFolderParameter.value || `./${this.actionName}`;
        node_core_library_1.FileSystem.ensureFolder(outputFolder);
        const addFileNameSuffix = this._fileNameSuffixParameter.value;
        for (const filename of node_core_library_1.FileSystem.readFolder(inputFolder)) {
            if (filename.match(/\.api\.json$/i)) {
                console.log(`Reading ${filename}`);
                const filenamePath = path.join(inputFolder, filename);
                apiModel.loadPackage(filenamePath);
            }
        }
        this._applyInheritDoc(apiModel, apiModel);
        return {
            apiModel,
            inputFolder,
            outputFolder,
            addFileNameSuffix,
            projectName: this._projectNameParameter.value
        };
    }
    // TODO: This is a temporary workaround.  The long term plan is for API Extractor's DocCommentEnhancer
    // to apply all @inheritDoc tags before the .api.json file is written.
    // See DocCommentEnhancer._applyInheritDoc() for more info.
    _applyInheritDoc(apiItem, apiModel) {
        if (apiItem instanceof api_extractor_model_me_1.ApiDocumentedItem) {
            if (apiItem.tsdocComment) {
                const inheritDocTag = apiItem.tsdocComment.inheritDocTag;
                if (inheritDocTag && inheritDocTag.declarationReference) {
                    // Attempt to resolve the declaration reference
                    const result = apiModel.resolveDeclarationReference(inheritDocTag.declarationReference, apiItem);
                    if (result.errorMessage) {
                        console.log(colors_1.default.yellow(`Warning: Unresolved @inheritDoc tag for ${apiItem.displayName}: ` +
                            result.errorMessage));
                    }
                    else {
                        if (result.resolvedApiItem instanceof api_extractor_model_me_1.ApiDocumentedItem &&
                            result.resolvedApiItem.tsdocComment &&
                            result.resolvedApiItem !== apiItem) {
                            this._copyInheritedDocs(apiItem.tsdocComment, result.resolvedApiItem.tsdocComment);
                        }
                    }
                }
            }
        }
        // Recurse members
        if (api_extractor_model_me_1.ApiItemContainerMixin.isBaseClassOf(apiItem)) {
            for (const member of apiItem.members) {
                this._applyInheritDoc(member, apiModel);
            }
        }
    }
    /**
     * Copy the content from `sourceDocComment` to `targetDocComment`.
     * This code is borrowed from DocCommentEnhancer as a temporary workaround.
     */
    _copyInheritedDocs(targetDocComment, sourceDocComment) {
        targetDocComment.summarySection = sourceDocComment.summarySection;
        targetDocComment.remarksBlock = sourceDocComment.remarksBlock;
        targetDocComment.params.clear();
        for (const param of sourceDocComment.params) {
            targetDocComment.params.add(param);
        }
        for (const typeParam of sourceDocComment.typeParams) {
            targetDocComment.typeParams.add(typeParam);
        }
        targetDocComment.returnsBlock = sourceDocComment.returnsBlock;
        targetDocComment.inheritDocTag = undefined;
    }
}
exports.BaseAction = BaseAction;
//# sourceMappingURL=BaseAction.js.map