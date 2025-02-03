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
exports.Utilities = void 0;
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const api_extractor_model_me_1 = require("api-extractor-model-me");
class Utilities {
    /**
     * Generates a concise signature for a function.  Example: "getArea(width, height)"
     */
    static getConciseSignature(apiItem) {
        if (api_extractor_model_me_1.ApiParameterListMixin.isBaseClassOf(apiItem)) {
            return (apiItem.displayName +
                '(' +
                apiItem.parameters.map(x => x.name).join(', ') +
                ')');
        }
        return apiItem.displayName;
    }
    /**
     * Converts bad filename characters to underscores.
     */
    static getSafeFilenameForName(name) {
        // TODO: This can introduce naming collisions.
        // We will fix that as part of https://github.com/microsoft/rushstack/issues/1308
        return name.replace(Utilities._badFilenameCharsRegExp, '_').toLowerCase();
    }
}
exports.Utilities = Utilities;
Utilities._badFilenameCharsRegExp = /[^a-z0-9_\-\.]/gi;
//# sourceMappingURL=Utilities.js.map