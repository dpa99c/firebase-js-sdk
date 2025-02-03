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
import { DocTableRow } from './DocTableRow';
import { DocTableCell } from './DocTableCell';
/**
 * Constructor parameters for {@link DocTable}.
 */
export interface IDocTableParameters extends IDocNodeParameters {
    headerCells?: ReadonlyArray<DocTableCell>;
    headerTitles?: string[];
}
/**
 * Represents table, similar to an HTML `<table>` element.
 */
export declare class DocTable extends DocNode {
    readonly header: DocTableRow;
    private _rows;
    constructor(parameters: IDocTableParameters, rows?: ReadonlyArray<DocTableRow>);
    /** @override */
    get kind(): string;
    get rows(): ReadonlyArray<DocTableRow>;
    addRow(row: DocTableRow): void;
    createAndAddRow(): DocTableRow;
    /** @override */
    protected onGetChildNodes(): ReadonlyArray<DocNode | undefined>;
}
