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
exports.DocNoteBox = void 0;
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const tsdoc_1 = require("@microsoft/tsdoc");
/**
 * Represents a note box, which is typically displayed as a bordered box containing informational text.
 */
class DocNoteBox extends tsdoc_1.DocNode {
    constructor(parameters, sectionChildNodes) {
        super(parameters);
        this.content = new tsdoc_1.DocSection({ configuration: this.configuration }, sectionChildNodes);
    }
    /** @override */
    get kind() {
        return "NoteBox" /* CustomDocNodeKind.NoteBox */;
    }
    /** @override */
    onGetChildNodes() {
        return [this.content];
    }
}
exports.DocNoteBox = DocNoteBox;
//# sourceMappingURL=DocNoteBox.js.map