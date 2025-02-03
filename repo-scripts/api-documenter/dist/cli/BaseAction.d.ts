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
import { CommandLineAction } from '@rushstack/ts-command-line';
import { ApiModel } from 'api-extractor-model-me';
export interface IBuildApiModelResult {
    apiModel: ApiModel;
    inputFolder: string;
    outputFolder: string;
    addFileNameSuffix: boolean;
    projectName?: string;
}
export declare abstract class BaseAction extends CommandLineAction {
    private _inputFolderParameter;
    private _outputFolderParameter;
    private _fileNameSuffixParameter;
    private _projectNameParameter;
    protected onDefineParameters(): void;
    protected buildApiModel(): IBuildApiModelResult;
    private _applyInheritDoc;
    /**
     * Copy the content from `sourceDocComment` to `targetDocComment`.
     * This code is borrowed from DocCommentEnhancer as a temporary workaround.
     */
    private _copyInheritedDocs;
}
