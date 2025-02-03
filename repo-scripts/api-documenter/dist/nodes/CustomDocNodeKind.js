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
exports.CustomDocNodes = void 0;
const tsdoc_1 = require("@microsoft/tsdoc");
const DocEmphasisSpan_1 = require("./DocEmphasisSpan");
const DocHeading_1 = require("./DocHeading");
const DocNoteBox_1 = require("./DocNoteBox");
const DocTable_1 = require("./DocTable");
const DocTableCell_1 = require("./DocTableCell");
const DocTableRow_1 = require("./DocTableRow");
class CustomDocNodes {
    static get configuration() {
        if (CustomDocNodes._configuration === undefined) {
            const configuration = new tsdoc_1.TSDocConfiguration();
            configuration.docNodeManager.registerDocNodes('@micrososft/api-documenter', [
                {
                    docNodeKind: "EmphasisSpan" /* CustomDocNodeKind.EmphasisSpan */,
                    constructor: DocEmphasisSpan_1.DocEmphasisSpan
                },
                { docNodeKind: "Heading" /* CustomDocNodeKind.Heading */, constructor: DocHeading_1.DocHeading },
                { docNodeKind: "NoteBox" /* CustomDocNodeKind.NoteBox */, constructor: DocNoteBox_1.DocNoteBox },
                { docNodeKind: "Table" /* CustomDocNodeKind.Table */, constructor: DocTable_1.DocTable },
                {
                    docNodeKind: "TableCell" /* CustomDocNodeKind.TableCell */,
                    constructor: DocTableCell_1.DocTableCell
                },
                { docNodeKind: "TableRow" /* CustomDocNodeKind.TableRow */, constructor: DocTableRow_1.DocTableRow }
            ]);
            configuration.docNodeManager.registerAllowableChildren("EmphasisSpan" /* CustomDocNodeKind.EmphasisSpan */, ["PlainText" /* DocNodeKind.PlainText */, "SoftBreak" /* DocNodeKind.SoftBreak */]);
            configuration.docNodeManager.registerAllowableChildren("Section" /* DocNodeKind.Section */, [
                "Heading" /* CustomDocNodeKind.Heading */,
                "NoteBox" /* CustomDocNodeKind.NoteBox */,
                "Table" /* CustomDocNodeKind.Table */
            ]);
            configuration.docNodeManager.registerAllowableChildren("Paragraph" /* DocNodeKind.Paragraph */, ["EmphasisSpan" /* CustomDocNodeKind.EmphasisSpan */]);
            CustomDocNodes._configuration = configuration;
        }
        return CustomDocNodes._configuration;
    }
}
exports.CustomDocNodes = CustomDocNodes;
//# sourceMappingURL=CustomDocNodeKind.js.map