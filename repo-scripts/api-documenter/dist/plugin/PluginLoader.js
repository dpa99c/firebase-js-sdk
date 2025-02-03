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
exports.PluginLoader = void 0;
const tslib_1 = require("tslib");
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const path = tslib_1.__importStar(require("path"));
const resolve = tslib_1.__importStar(require("resolve"));
const MarkdownDocumenterFeature_1 = require("./MarkdownDocumenterFeature");
const PluginFeature_1 = require("./PluginFeature");
class PluginLoader {
    load(documenterConfig, createContext) {
        const configFileFolder = path.dirname(documenterConfig.configFilePath);
        for (const configPlugin of documenterConfig.configFile.plugins || []) {
            try {
                // Look for the package name in the same place as the config file
                const resolvedEntryPointPath = resolve.sync(configPlugin.packageName, {
                    basedir: configFileFolder
                });
                // Load the package
                const entryPoint = require(resolvedEntryPointPath);
                if (!entryPoint) {
                    throw new Error('Invalid entry point');
                }
                if (!entryPoint.apiDocumenterPluginManifest) {
                    throw new Error(`The package is not an API documenter plugin;` +
                        ` the "apiDocumenterPluginManifest" export was not found`);
                }
                const manifest = entryPoint.apiDocumenterPluginManifest;
                if (manifest.manifestVersion !== 1000) {
                    throw new Error(`The plugin is not compatible with this version of API Documenter;` +
                        ` unsupported manifestVersion`);
                }
                const loadedPlugin = {
                    packageName: configPlugin.packageName,
                    manifest
                };
                const featureDefinitionsByName = new Map();
                for (const featureDefinition of manifest.features) {
                    featureDefinitionsByName.set(featureDefinition.featureName, featureDefinition);
                }
                for (const featureName of configPlugin.enabledFeatureNames) {
                    const featureDefinition = featureDefinitionsByName.get(featureName);
                    if (!featureDefinition) {
                        throw new Error(`The plugin ${loadedPlugin.packageName} does not have a feature with name "${featureName}"`);
                    }
                    if (featureDefinition.kind === 'MarkdownDocumenterFeature') {
                        if (this.markdownDocumenterFeature) {
                            throw new Error('A MarkdownDocumenterFeature is already loaded');
                        }
                        const initialization = new PluginFeature_1.PluginFeatureInitialization();
                        initialization._context = createContext();
                        let markdownDocumenterFeature = undefined;
                        try {
                            markdownDocumenterFeature = new featureDefinition.subclass(initialization);
                        }
                        catch (e) {
                            throw new Error(`Failed to construct feature subclass:\n` +
                                (e === null || e === void 0 ? void 0 : e.toString()));
                        }
                        if (!(markdownDocumenterFeature instanceof MarkdownDocumenterFeature_1.MarkdownDocumenterFeature)) {
                            throw new Error('The constructed subclass was not an instance of MarkdownDocumenterFeature');
                        }
                        try {
                            markdownDocumenterFeature.onInitialized();
                        }
                        catch (e) {
                            throw new Error('Error occurred during the onInitialized() event: ' +
                                (e === null || e === void 0 ? void 0 : e.toString()));
                        }
                        this.markdownDocumenterFeature = markdownDocumenterFeature;
                    }
                    else {
                        throw new Error(`Unknown feature definition kind: "${featureDefinition.kind}"`);
                    }
                }
            }
            catch (e) {
                throw new Error(`Error loading plugin ${configPlugin.packageName}: ` +
                    (e === null || e === void 0 ? void 0 : e.message));
            }
        }
    }
}
exports.PluginLoader = PluginLoader;
//# sourceMappingURL=PluginLoader.js.map