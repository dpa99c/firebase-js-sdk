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
import { DocNode, DocLinkTag, StringBuilder } from '@microsoft/tsdoc';
import { ApiModel, ApiItem } from 'api-extractor-model-me';
import { MarkdownEmitter, IMarkdownEmitterContext, IMarkdownEmitterOptions } from './MarkdownEmitter';
export interface ICustomMarkdownEmitterOptions extends IMarkdownEmitterOptions {
    contextApiItem: ApiItem | undefined;
    onGetFilenameForApiItem: (apiItem: ApiItem) => string | undefined;
}
export declare class CustomMarkdownEmitter extends MarkdownEmitter {
    private _apiModel;
    constructor(apiModel: ApiModel);
    emit(stringBuilder: StringBuilder, docNode: DocNode, options: ICustomMarkdownEmitterOptions): string;
    /** @override */
    protected writeNode(docNode: DocNode, context: IMarkdownEmitterContext, docNodeSiblings: boolean): void;
    /** @override */
    protected writeLinkTagWithCodeDestination(docLinkTag: DocLinkTag, context: IMarkdownEmitterContext<ICustomMarkdownEmitterOptions>): void;
}
