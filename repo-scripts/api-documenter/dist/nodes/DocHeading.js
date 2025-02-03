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
exports.DocHeading = void 0;
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const tsdoc_1 = require("@microsoft/tsdoc");
/**
 * Represents a section header similar to an HTML `<h1>` or `<h2>` element.
 */
class DocHeading extends tsdoc_1.DocNode {
    /**
     * Don't call this directly.  Instead use {@link TSDocParser}
     * @internal
     */
    constructor(parameters) {
        super(parameters);
        this.title = parameters.title;
        this.level = parameters.level !== undefined ? parameters.level : 1;
        this.anchor = parameters.anchor;
        if (this.level < 1 || this.level > 5) {
            throw new Error('IDocHeadingParameters.level must be a number between 1 and 5');
        }
    }
    /** @override */
    get kind() {
        return "Heading" /* CustomDocNodeKind.Heading */;
    }
}
exports.DocHeading = DocHeading;
//# sourceMappingURL=DocHeading.js.map