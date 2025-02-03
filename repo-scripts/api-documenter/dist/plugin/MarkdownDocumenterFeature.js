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
exports.MarkdownDocumenterFeature = exports.MarkdownDocumenterFeatureContext = void 0;
const node_core_library_1 = require("@rushstack/node-core-library");
const PluginFeature_1 = require("./PluginFeature");
/**
 * Context object for {@link MarkdownDocumenterFeature}.
 * Exposes various services that can be used by a plugin.
 *
 * @public
 */
class MarkdownDocumenterFeatureContext {
    /** @internal */
    constructor(options) {
        this.apiModel = options.apiModel;
        this.outputFolder = options.outputFolder;
        this.documenter = options.documenter;
    }
}
exports.MarkdownDocumenterFeatureContext = MarkdownDocumenterFeatureContext;
const uuidMarkdownDocumenterFeature = '34196154-9eb3-4de0-a8c8-7e9539dfe216';
/**
 * Inherit from this base class to implement an API Documenter plugin feature that customizes
 * the generation of markdown output.
 *
 * @public
 */
class MarkdownDocumenterFeature extends PluginFeature_1.PluginFeature {
    /**
     * This event occurs before each markdown file is written.  It provides an opportunity to customize the
     * content of the file.
     * @virtual
     */
    onBeforeWritePage(eventArgs) {
        // (implemented by child class)
    }
    /**
     * This event occurs after all output files have been written.
     * @virtual
     */
    onFinished(eventArgs) {
        // (implemented by child class)
    }
    static [Symbol.hasInstance](instance) {
        return node_core_library_1.TypeUuid.isInstanceOf(instance, uuidMarkdownDocumenterFeature);
    }
}
exports.MarkdownDocumenterFeature = MarkdownDocumenterFeature;
node_core_library_1.TypeUuid.registerClass(MarkdownDocumenterFeature, uuidMarkdownDocumenterFeature);
//# sourceMappingURL=MarkdownDocumenterFeature.js.map