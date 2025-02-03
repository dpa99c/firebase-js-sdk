"use strict";
/**
 * @license
 * Copyright 2021 Google LLC
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
exports.generateToc = generateToc;
const tslib_1 = require("tslib");
const js_yaml_1 = tslib_1.__importDefault(require("js-yaml"));
const MarkdownDocumenterHelpers_1 = require("./documenters/MarkdownDocumenterHelpers");
const fs_1 = require("fs");
const path_1 = require("path");
function generateToc({ apiModel, g3Path, outputFolder, addFileNameSuffix, jsSdk }) {
    const toc = [];
    if (jsSdk) {
        const firebaseToc = {
            title: 'firebase',
            path: `${g3Path}/index`
        };
        toc.push(firebaseToc);
    }
    generateTocRecursively(apiModel, g3Path, addFileNameSuffix, toc);
    (0, fs_1.writeFileSync)((0, path_1.resolve)(outputFolder, 'toc.yaml'), js_yaml_1.default.dump({ toc }, {
        quotingType: '"',
        noArrayIndent: true
    }));
}
function generateTocRecursively(apiItem, g3Path, addFileNameSuffix, toc) {
    // generate toc item only for entry points
    if (apiItem.kind === "EntryPoint" /* ApiItemKind.EntryPoint */) {
        // Entry point
        const entryPointName = apiItem.canonicalReference.source.escapedPath.replace('@firebase/', '');
        const entryPointToc = {
            title: entryPointName,
            path: `${g3Path}/${(0, MarkdownDocumenterHelpers_1.getFilenameForApiItem)(apiItem, addFileNameSuffix)}`,
            section: []
        };
        for (const member of apiItem.members) {
            // only classes and interfaces have dedicated pages
            if (member.kind === "Class" /* ApiItemKind.Class */ ||
                member.kind === "Interface" /* ApiItemKind.Interface */) {
                const fileName = (0, MarkdownDocumenterHelpers_1.getFilenameForApiItem)(member, addFileNameSuffix);
                entryPointToc.section.push({
                    title: member.displayName,
                    path: `${g3Path}/${fileName}`
                });
            }
        }
        toc.push(entryPointToc);
    }
    else {
        // travel the api tree to find the next entry point
        for (const member of apiItem.members) {
            generateTocRecursively(member, g3Path, addFileNameSuffix, toc);
        }
    }
}
//# sourceMappingURL=toc.js.map