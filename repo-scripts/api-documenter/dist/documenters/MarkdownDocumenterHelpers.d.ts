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
import { TSDocConfiguration, DocNode } from '@microsoft/tsdoc';
import { ApiItem, ApiEntryPoint, ApiEnum } from 'api-extractor-model-me';
import { DocTableCell } from '../nodes/DocTableCell';
export declare function getLinkForApiItem(apiItem: ApiItem, addFileNameSuffix: boolean): string;
export declare function getFilenameForApiItem(apiItem: ApiItem, addFileNameSuffix: boolean): string;
export declare function getHeadingAnchorForApiItem(apiItem: ApiItem): string;
export declare function createBetaWarning(configuration: TSDocConfiguration): DocNode;
export declare function createRemarksSection(apiItem: ApiItem, configuration: TSDocConfiguration): DocNode[];
export declare function createExampleSection(apiItem: ApiItem, configuration: TSDocConfiguration): DocNode[];
export declare function createTitleCell(apiItem: ApiItem, configuration: TSDocConfiguration, addFileNameSuffix: boolean): DocTableCell;
/**
 * This generates a DocTableCell for an ApiItem including the summary section and "(BETA)" annotation.
 *
 * @remarks
 * We mostly assume that the input is an ApiDocumentedItem, but it's easier to perform this as a runtime
 * check than to have each caller perform a type cast.
 */
export declare function createDescriptionCell(apiItem: ApiItem, configuration: TSDocConfiguration): DocTableCell;
export declare function createModifiersCell(apiItem: ApiItem, configuration: TSDocConfiguration): DocTableCell;
export declare function createThrowsSection(apiItem: ApiItem, configuration: TSDocConfiguration, parentHeadingLevel: number): DocNode[];
export declare function createEntryPointTitleCell(apiItem: ApiEntryPoint, configuration: TSDocConfiguration, addFileNameSuffix: boolean): DocTableCell;
/**
 * GENERATE PAGE: ENUM
 */
export declare function createEnumTables(apiEnum: ApiEnum, configuration: TSDocConfiguration): DocNode[];
