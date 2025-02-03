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
import { DocTableCell } from './DocTableCell';
/**
 * Constructor parameters for {@link DocTableRow}.
 */
export interface IDocTableRowParameters extends IDocNodeParameters {
}
/**
 * Represents table row, similar to an HTML `<tr>` element.
 */
export declare class DocTableRow extends DocNode {
    private readonly _cells;
    constructor(parameters: IDocTableRowParameters, cells?: ReadonlyArray<DocTableCell>);
    /** @override */
    get kind(): string;
    get cells(): ReadonlyArray<DocTableCell>;
    addCell(cell: DocTableCell): void;
    createAndAddCell(): DocTableCell;
    addPlainTextCell(cellContent: string): DocTableCell;
    /** @override */
    protected onGetChildNodes(): ReadonlyArray<DocNode | undefined>;
}
