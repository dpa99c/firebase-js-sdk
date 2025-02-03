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
import { IDocNodeParameters, DocNode } from '@microsoft/tsdoc';
/**
 * Constructor parameters for {@link DocHeading}.
 */
export interface IDocHeadingParameters extends IDocNodeParameters {
    title: string;
    level?: number;
    anchor?: string;
}
/**
 * Represents a section header similar to an HTML `<h1>` or `<h2>` element.
 */
export declare class DocHeading extends DocNode {
    readonly title: string;
    readonly level: number;
    readonly anchor?: string;
    /**
     * Don't call this directly.  Instead use {@link TSDocParser}
     * @internal
     */
    constructor(parameters: IDocHeadingParameters);
    /** @override */
    get kind(): string;
}
