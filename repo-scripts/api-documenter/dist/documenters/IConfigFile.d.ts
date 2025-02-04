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
/**
 * TypeScript interface describing the config schema for toc.yml file format.
 */
export interface IConfigTableOfContents {
    /**
     * Optional category name that is recommended to be included along with
     * one of the configs: {@link IConfigTableOfContents.categorizeByName} or
     * {@link IConfigTableOfContents.categoryInlineTag}.
     * Any items that are not matched according to the mentioned configuration options will be placed under this
     * catchAll category. If none provided the items will not be included in the final toc.yml file.
     */
    catchAllCategory?: string;
    /**
     * Toggle either categorization of the API items should be made based on category name presence
     * in the API item's name. Useful when there are API items without an inline tag to categorize them,
     * but still need to place the items under categories. Note: this type of categorization might place some items
     * under wrong categories if the names are similar but belong to different categories.
     * In case that {@link IConfigTableOfContents.categoryInlineTag} is provided it will try categorize by
     * using it and only if it didn't, it will attempt to categorize by name.
     */
    categorizeByName?: boolean;
    /**
     * Inline tag that will be used to categorize the API items. Will take precedence over the
     * {@link IConfigTableOfContents.categorizeByName} flag in trying to place the API item according to the
     * custom inline tag present in documentation of the source code.
     */
    categoryInlineTag?: string;
    /**
     * Array of node names that might have already items injected at the time of creating the
     * {@link IConfigTableOfContents.tocConfig} tree structure but are still needed to be included as category
     * nodes where API items will be pushed during the categorization algorithm.
     */
    nonEmptyCategoryNodeNames?: string[];
}
/**
 * Describes plugin packages to be loaded, and which features to enable.
 */
export interface IConfigPlugin {
    /**
     * Specifies the name of an API Documenter plugin package to be loaded.  By convention, the NPM package name
     * should have the prefix `doc-plugin-`.  Its main entry point should export an object named
     * `apiDocumenterPluginManifest` which implements the {@link IApiDocumenterPluginManifest} interface.
     */
    packageName: string;
    /**
     * A list of features to be enabled.  The features are defined in {@link IApiDocumenterPluginManifest.features}.
     * The `enabledFeatureNames` strings are matched with {@link IFeatureDefinition.featureName}.
     */
    enabledFeatureNames: string[];
}
/**
 * This interface represents the api-documenter.json file format.
 */
export interface IConfigFile {
    /**
     * Specifies the output target.
     */
    outputTarget: 'docfx' | 'markdown';
    /**
     * Specifies what type of newlines API Documenter should use when writing output files.
     *
     * @remarks
     * By default, the output files will be written with Windows-style newlines.
     * To use POSIX-style newlines, specify "lf" instead.
     * To use the OS's default newline kind, specify "os".
     */
    newlineKind?: 'crlf' | 'lf' | 'os';
    /**
     * This enables an experimental feature that will be officially released with the next major version
     * of API Documenter.  It requires DocFX 2.46 or newer.  It enables documentation for namespaces and
     * adds them to the table of contents.  This will also affect file layout as namespaced items will be nested
     * under a directory for the namespace instead of just within the package.
     *
     * This setting currently only affects the 'docfx' output target.  It is equivalent to the `--new-docfx-namespaces`
     * command-line parameter.
     */
    newDocfxNamespaces?: boolean;
    /** {@inheritDoc IConfigPlugin} */
    plugins?: IConfigPlugin[];
    /** {@inheritDoc IConfigTableOfContents} */
    tableOfContents?: IConfigTableOfContents;
}
