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
exports.DocTableRow = void 0;
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const tsdoc_1 = require("@microsoft/tsdoc");
const DocTableCell_1 = require("./DocTableCell");
/**
 * Represents table row, similar to an HTML `<tr>` element.
 */
class DocTableRow extends tsdoc_1.DocNode {
    constructor(parameters, cells) {
        super(parameters);
        this._cells = [];
        if (cells) {
            for (const cell of cells) {
                this.addCell(cell);
            }
        }
    }
    /** @override */
    get kind() {
        return "TableRow" /* CustomDocNodeKind.TableRow */;
    }
    get cells() {
        return this._cells;
    }
    addCell(cell) {
        this._cells.push(cell);
    }
    createAndAddCell() {
        const newCell = new DocTableCell_1.DocTableCell({
            configuration: this.configuration
        });
        this.addCell(newCell);
        return newCell;
    }
    addPlainTextCell(cellContent) {
        const cell = this.createAndAddCell();
        cell.content.appendNodeInParagraph(new tsdoc_1.DocPlainText({
            configuration: this.configuration,
            text: cellContent
        }));
        return cell;
    }
    /** @override */
    onGetChildNodes() {
        return this._cells;
    }
}
exports.DocTableRow = DocTableRow;
//# sourceMappingURL=DocTableRow.js.map