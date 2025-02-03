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
import { DocNode } from '@microsoft/tsdoc';
import { ApiModel, ApiItem } from 'api-extractor-model-me';
import { DocumenterConfig } from './DocumenterConfig';
export interface IMarkdownDocumenterOptions {
    apiModel: ApiModel;
    documenterConfig: DocumenterConfig | undefined;
    outputFolder: string;
    addFileNameSuffix: boolean;
    projectName: string;
    sortFunctions: string;
}
/**
 * Renders API documentation in the Markdown file format.
 * For more info:  https://en.wikipedia.org/wiki/Markdown
 */
export declare class MarkdownDocumenter {
    private readonly _apiModel;
    private readonly _documenterConfig;
    private readonly _tsdocConfiguration;
    private readonly _markdownEmitter;
    private readonly _outputFolder;
    private readonly _pluginLoader;
    private readonly _addFileNameSuffix;
    private readonly _projectName;
    private readonly _sortFunctions;
    constructor(options: IMarkdownDocumenterOptions);
    generateFiles(): void;
    _writeApiItemPage(apiItem: ApiItem): void;
    _functionHeadingLevel(): number;
    _createCompleteOutputForApiItem(apiItem: ApiItem): DocNode[];
    /**
     * GENERATE PAGE: CLASS
     *
     * TODO: generate member references in the same page
     */
    private _createClassTables;
    /**
     * GENERATE PAGE: INTERFACE
     */
    private _createInterfaceTables;
    /**
     * GENERATE PAGE: FUNCTION-LIKE
     */
    private _createParameterTables;
    private _createParagraphForTypeExcerpt;
    private _appendExcerptWithHyperlinks;
    /**
     * GENERATE PAGE: MODEL
     */
    private _createModelTable;
    /**´
     * Generate a table of entry points if there are more than one entry points.
     * Otherwise, generate the entry point directly in the package page.
     */
    private _createPackage;
    /**
     * GENERATE PAGE: ENTRYPOINT or NAMESPACE
     */
    private _createEntryPointOrNamespace;
    private _createPropertyTypeCell;
    private _createSignatureSection;
    private _writeHeritageTypes;
    private _deleteOldOutputFiles;
}
