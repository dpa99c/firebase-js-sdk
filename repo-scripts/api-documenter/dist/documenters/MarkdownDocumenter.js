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
exports.MarkdownDocumenter = void 0;
const tslib_1 = require("tslib");
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const node_core_library_1 = require("@rushstack/node-core-library");
const tsdoc_1 = require("@microsoft/tsdoc");
const api_extractor_model_me_1 = require("api-extractor-model-me");
const CustomDocNodeKind_1 = require("../nodes/CustomDocNodeKind");
const CustomMarkdownEmitter_1 = require("../markdown/CustomMarkdownEmitter");
const PluginLoader_1 = require("../plugin/PluginLoader");
const MarkdownDocumenterFeature_1 = require("../plugin/MarkdownDocumenterFeature");
const MarkdownDocumenterAccessor_1 = require("../plugin/MarkdownDocumenterAccessor");
const MarkdownDocumenterHelpers_1 = require("./MarkdownDocumenterHelpers");
const path = tslib_1.__importStar(require("path"));
const DocHeading_1 = require("../nodes/DocHeading");
const DocNoteBox_1 = require("../nodes/DocNoteBox");
const DocTable_1 = require("../nodes/DocTable");
const DocTableRow_1 = require("../nodes/DocTableRow");
const DocTableCell_1 = require("../nodes/DocTableCell");
const DocEmphasisSpan_1 = require("../nodes/DocEmphasisSpan");
const Utilities_1 = require("../utils/Utilities");
/**
 * Renders API documentation in the Markdown file format.
 * For more info:  https://en.wikipedia.org/wiki/Markdown
 */
class MarkdownDocumenter {
    constructor(options) {
        this._apiModel = options.apiModel;
        this._documenterConfig = options.documenterConfig;
        this._outputFolder = options.outputFolder;
        this._addFileNameSuffix = options.addFileNameSuffix;
        this._projectName = options.projectName;
        this._sortFunctions = options.sortFunctions;
        this._tsdocConfiguration = CustomDocNodeKind_1.CustomDocNodes.configuration;
        this._markdownEmitter = new CustomMarkdownEmitter_1.CustomMarkdownEmitter(this._apiModel);
        this._pluginLoader = new PluginLoader_1.PluginLoader();
    }
    generateFiles() {
        if (this._documenterConfig) {
            this._pluginLoader.load(this._documenterConfig, () => {
                return new MarkdownDocumenterFeature_1.MarkdownDocumenterFeatureContext({
                    apiModel: this._apiModel,
                    outputFolder: this._outputFolder,
                    documenter: new MarkdownDocumenterAccessor_1.MarkdownDocumenterAccessor({
                        getLinkForApiItem: (apiItem) => {
                            return (0, MarkdownDocumenterHelpers_1.getLinkForApiItem)(apiItem, this._addFileNameSuffix);
                        }
                    })
                });
            });
        }
        this._deleteOldOutputFiles();
        this._writeApiItemPage(this._apiModel);
        if (this._pluginLoader.markdownDocumenterFeature) {
            this._pluginLoader.markdownDocumenterFeature.onFinished({});
        }
    }
    _writeApiItemPage(apiItem) {
        const output = new tsdoc_1.DocSection({
            configuration: this._tsdocConfiguration
        });
        const nodes = this._createCompleteOutputForApiItem(apiItem);
        /**
         * Remove the heading of the page from md output. (the first item is always a DocHeading)
         * Later we will add the heading to the devsite header {% block title %}
         */
        const headingNode = nodes[0];
        const pageWithoutHeading = nodes.slice(1);
        output.appendNodes(pageWithoutHeading);
        // write to file
        const filename = path.join(this._outputFolder, (0, MarkdownDocumenterHelpers_1.getFilenameForApiItem)(apiItem, this._addFileNameSuffix));
        const stringBuilder = new tsdoc_1.StringBuilder();
        // devsite headers
        stringBuilder.append(`Project: /docs/reference/${this._projectName}/_project.yaml
Book: /docs/reference/_book.yaml
page_type: reference
`);
        stringBuilder.append(`# ${headingNode.title}\n`);
        this._markdownEmitter.emit(stringBuilder, output, {
            contextApiItem: apiItem,
            onGetFilenameForApiItem: (apiItemForFilename) => {
                return (0, MarkdownDocumenterHelpers_1.getLinkForApiItem)(apiItemForFilename, this._addFileNameSuffix);
            }
        });
        let pageContent = stringBuilder.toString();
        if (this._pluginLoader.markdownDocumenterFeature) {
            // Allow the plugin to customize the pageContent
            const eventArgs = {
                apiItem: apiItem,
                outputFilename: filename,
                pageContent: pageContent
            };
            this._pluginLoader.markdownDocumenterFeature.onBeforeWritePage(eventArgs);
            pageContent = eventArgs.pageContent;
        }
        node_core_library_1.FileSystem.writeFile(filename, pageContent, {
            convertLineEndings: node_core_library_1.NewlineKind.Lf
        });
    }
    _functionHeadingLevel() {
        // If sorting functions by first parameter
        // then the function heading will be under
        // the parameter heading, so it will be level
        // 2. Otherwise, it will be level 1.
        return !!this._sortFunctions ? 2 : 1;
    }
    _createCompleteOutputForApiItem(apiItem) {
        const configuration = this._tsdocConfiguration;
        const output = [];
        const scopedName = apiItem.getScopedNameWithinPackage();
        switch (apiItem.kind) {
            case "Class" /* ApiItemKind.Class */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: `${scopedName} class` }));
                break;
            case "Enum" /* ApiItemKind.Enum */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: `${scopedName}` }));
                break;
            case "Interface" /* ApiItemKind.Interface */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: `${scopedName} interface` }));
                break;
            case "Constructor" /* ApiItemKind.Constructor */:
            case "ConstructSignature" /* ApiItemKind.ConstructSignature */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: scopedName }));
                break;
            case "Method" /* ApiItemKind.Method */:
            case "MethodSignature" /* ApiItemKind.MethodSignature */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: `${scopedName}` }));
                break;
            case "Function" /* ApiItemKind.Function */:
                const anchor = (0, MarkdownDocumenterHelpers_1.getHeadingAnchorForApiItem)(apiItem);
                output.push(new DocHeading_1.DocHeading({
                    configuration,
                    title: Utilities_1.Utilities.getConciseSignature(apiItem),
                    anchor: anchor,
                    level: this._functionHeadingLevel()
                }));
                break;
            case "Model" /* ApiItemKind.Model */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: `API Reference` }));
                break;
            case "Namespace" /* ApiItemKind.Namespace */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: `${scopedName} namespace` }));
                break;
            case "Package" /* ApiItemKind.Package */:
                const unscopedPackageName = node_core_library_1.PackageName.getUnscopedName(apiItem.displayName);
                output.push(new DocHeading_1.DocHeading({
                    configuration,
                    title: `${unscopedPackageName} package`
                }));
                break;
            case "EntryPoint" /* ApiItemKind.EntryPoint */:
                const packageName = apiItem.parent.displayName;
                output.push(new DocHeading_1.DocHeading({
                    configuration,
                    title: `${packageName}${apiItem.displayName && '/' + apiItem.displayName}`
                }));
                break;
            case "Property" /* ApiItemKind.Property */:
            case "PropertySignature" /* ApiItemKind.PropertySignature */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: `${scopedName}` }));
                break;
            case "TypeAlias" /* ApiItemKind.TypeAlias */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: `${scopedName}` }));
                break;
            case "Variable" /* ApiItemKind.Variable */:
                output.push(new DocHeading_1.DocHeading({ configuration, title: `${scopedName}` }));
                break;
            default:
                throw new Error('Unsupported API item kind:1 ' + apiItem.kind);
        }
        if (api_extractor_model_me_1.ApiReleaseTagMixin.isBaseClassOf(apiItem)) {
            if (apiItem.releaseTag === api_extractor_model_me_1.ReleaseTag.Beta) {
                output.push((0, MarkdownDocumenterHelpers_1.createBetaWarning)(configuration));
            }
        }
        if (apiItem instanceof api_extractor_model_me_1.ApiDocumentedItem) {
            const tsdocComment = apiItem.tsdocComment;
            if (tsdocComment) {
                if (tsdocComment.deprecatedBlock) {
                    output.push(new DocNoteBox_1.DocNoteBox({ configuration }, [
                        new tsdoc_1.DocParagraph({ configuration }, [
                            new tsdoc_1.DocPlainText({
                                configuration,
                                text: 'Warning: This API is now obsolete. '
                            })
                        ]),
                        ...tsdocComment.deprecatedBlock.content.nodes
                    ]));
                }
                output.push(...tsdocComment.summarySection.nodes);
            }
        }
        // render remark sections
        output.push(...(0, MarkdownDocumenterHelpers_1.createRemarksSection)(apiItem, configuration));
        if (apiItem instanceof api_extractor_model_me_1.ApiDeclaredItem) {
            output.push(...this._createSignatureSection(apiItem));
        }
        switch (apiItem.kind) {
            case "Class" /* ApiItemKind.Class */:
                output.push(...this._createClassTables(apiItem));
                break;
            case "Enum" /* ApiItemKind.Enum */:
                output.push(...(0, MarkdownDocumenterHelpers_1.createEnumTables)(apiItem, configuration));
                break;
            case "Interface" /* ApiItemKind.Interface */:
                output.push(...this._createInterfaceTables(apiItem));
                break;
            case "Constructor" /* ApiItemKind.Constructor */:
            case "ConstructSignature" /* ApiItemKind.ConstructSignature */:
            case "Method" /* ApiItemKind.Method */:
            case "MethodSignature" /* ApiItemKind.MethodSignature */:
            case "Function" /* ApiItemKind.Function */:
                output.push(...this._createParameterTables(apiItem, this._functionHeadingLevel()));
                output.push(...(0, MarkdownDocumenterHelpers_1.createThrowsSection)(apiItem, configuration, this._functionHeadingLevel()));
                break;
            case "Namespace" /* ApiItemKind.Namespace */:
                output.push(...this._createEntryPointOrNamespace(apiItem));
                break;
            case "Model" /* ApiItemKind.Model */:
                output.push(...this._createModelTable(apiItem));
                break;
            case "Package" /* ApiItemKind.Package */:
                output.push(...this._createPackage(apiItem));
                break;
            case "EntryPoint" /* ApiItemKind.EntryPoint */:
                output.push(...this._createEntryPointOrNamespace(apiItem));
                break;
            case "Property" /* ApiItemKind.Property */:
            case "PropertySignature" /* ApiItemKind.PropertySignature */:
                break;
            case "TypeAlias" /* ApiItemKind.TypeAlias */:
                break;
            case "Variable" /* ApiItemKind.Variable */:
                break;
            default:
                throw new Error('Unsupported API item kind:2 ' + apiItem.kind);
        }
        output.push(...(0, MarkdownDocumenterHelpers_1.createExampleSection)(apiItem, configuration));
        return output;
    }
    /**
     * GENERATE PAGE: CLASS
     *
     * TODO: generate member references in the same page
     */
    _createClassTables(apiClass) {
        const configuration = this._tsdocConfiguration;
        const output = [];
        const eventsTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Property', 'Modifiers', 'Type', 'Description']
        });
        const constructorsTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Constructor', 'Modifiers', 'Description']
        });
        const propertiesTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Property', 'Modifiers', 'Type', 'Description']
        });
        const methodsTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Method', 'Modifiers', 'Description']
        });
        const constructorsDefinitions = [];
        const methodsDefinitions = [];
        const propertiesDefinitions = [];
        const eventsDefinitions = [];
        for (const apiMember of apiClass.members) {
            switch (apiMember.kind) {
                case "Constructor" /* ApiItemKind.Constructor */: {
                    constructorsTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
                        (0, MarkdownDocumenterHelpers_1.createTitleCell)(apiMember, configuration, this._addFileNameSuffix),
                        (0, MarkdownDocumenterHelpers_1.createModifiersCell)(apiMember, configuration),
                        (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(apiMember, configuration)
                    ]));
                    constructorsDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    break;
                }
                case "Method" /* ApiItemKind.Method */: {
                    methodsTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
                        (0, MarkdownDocumenterHelpers_1.createTitleCell)(apiMember, configuration, this._addFileNameSuffix),
                        (0, MarkdownDocumenterHelpers_1.createModifiersCell)(apiMember, configuration),
                        (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(apiMember, configuration)
                    ]));
                    methodsDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    break;
                }
                case "Property" /* ApiItemKind.Property */: {
                    if (apiMember.isEventProperty) {
                        eventsTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
                            (0, MarkdownDocumenterHelpers_1.createTitleCell)(apiMember, configuration, this._addFileNameSuffix),
                            (0, MarkdownDocumenterHelpers_1.createModifiersCell)(apiMember, configuration),
                            this._createPropertyTypeCell(apiMember),
                            (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(apiMember, configuration)
                        ]));
                        eventsDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    }
                    else {
                        propertiesTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
                            (0, MarkdownDocumenterHelpers_1.createTitleCell)(apiMember, configuration, this._addFileNameSuffix),
                            (0, MarkdownDocumenterHelpers_1.createModifiersCell)(apiMember, configuration),
                            this._createPropertyTypeCell(apiMember),
                            (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(apiMember, configuration)
                        ]));
                        propertiesDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    }
                    break;
                }
            }
        }
        if (eventsTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Events' }));
            output.push(eventsTable);
        }
        if (constructorsTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Constructors' }));
            output.push(constructorsTable);
        }
        if (propertiesTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Properties' }));
            output.push(propertiesTable);
        }
        if (methodsTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Methods' }));
            output.push(methodsTable);
        }
        output.push(...eventsDefinitions);
        output.push(...constructorsDefinitions);
        output.push(...propertiesDefinitions);
        output.push(...methodsDefinitions);
        return output;
    }
    /**
     * GENERATE PAGE: INTERFACE
     */
    _createInterfaceTables(apiClass) {
        const configuration = this._tsdocConfiguration;
        const output = [];
        const eventsTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Property', 'Type', 'Description']
        });
        const propertiesTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Property', 'Type', 'Description']
        });
        const methodsTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Method', 'Description']
        });
        const methodsDefinitions = [];
        const propertiesDefinitions = [];
        const eventsDefinitions = [];
        for (const apiMember of apiClass.members) {
            switch (apiMember.kind) {
                case "ConstructSignature" /* ApiItemKind.ConstructSignature */:
                case "MethodSignature" /* ApiItemKind.MethodSignature */: {
                    methodsTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
                        (0, MarkdownDocumenterHelpers_1.createTitleCell)(apiMember, configuration, this._addFileNameSuffix),
                        (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(apiMember, configuration)
                    ]));
                    methodsDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    break;
                }
                case "PropertySignature" /* ApiItemKind.PropertySignature */: {
                    if (apiMember.isEventProperty) {
                        eventsTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
                            (0, MarkdownDocumenterHelpers_1.createTitleCell)(apiMember, configuration, this._addFileNameSuffix),
                            this._createPropertyTypeCell(apiMember),
                            (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(apiMember, configuration)
                        ]));
                        eventsDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    }
                    else {
                        propertiesTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
                            (0, MarkdownDocumenterHelpers_1.createTitleCell)(apiMember, configuration, this._addFileNameSuffix),
                            this._createPropertyTypeCell(apiMember),
                            (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(apiMember, configuration)
                        ]));
                        propertiesDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    }
                    break;
                }
            }
        }
        if (eventsTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Events' }));
            output.push(eventsTable);
        }
        if (propertiesTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Properties' }));
            output.push(propertiesTable);
        }
        if (methodsTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Methods' }));
            output.push(methodsTable);
        }
        output.push(...eventsDefinitions);
        output.push(...propertiesDefinitions);
        output.push(...methodsDefinitions);
        return output;
    }
    /**
     * GENERATE PAGE: FUNCTION-LIKE
     */
    _createParameterTables(apiParameterListMixin, parentHeadingLevel) {
        const configuration = this._tsdocConfiguration;
        const output = [];
        const parametersTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Parameter', 'Type', 'Description']
        });
        for (const apiParameter of apiParameterListMixin.parameters) {
            const parameterDescription = new tsdoc_1.DocSection({
                configuration
            });
            if (apiParameter.tsdocParamBlock) {
                parameterDescription.appendNodes(apiParameter.tsdocParamBlock.content.nodes);
            }
            parametersTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
                new DocTableCell_1.DocTableCell({ configuration }, [
                    new tsdoc_1.DocParagraph({ configuration }, [
                        new tsdoc_1.DocPlainText({ configuration, text: apiParameter.name })
                    ])
                ]),
                new DocTableCell_1.DocTableCell({ configuration }, [
                    this._createParagraphForTypeExcerpt(apiParameter.parameterTypeExcerpt)
                ]),
                new DocTableCell_1.DocTableCell({ configuration }, parameterDescription.nodes)
            ]));
        }
        if (parametersTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({
                configuration,
                title: 'Parameters',
                level: parentHeadingLevel + 1
            }));
            output.push(parametersTable);
        }
        if (api_extractor_model_me_1.ApiReturnTypeMixin.isBaseClassOf(apiParameterListMixin)) {
            const returnTypeExcerpt = apiParameterListMixin.returnTypeExcerpt;
            output.push(new tsdoc_1.DocParagraph({ configuration }, [
                new DocEmphasisSpan_1.DocEmphasisSpan({ configuration, bold: true }, [
                    new tsdoc_1.DocPlainText({ configuration, text: 'Returns:' })
                ])
            ]));
            output.push(this._createParagraphForTypeExcerpt(returnTypeExcerpt));
            if (apiParameterListMixin instanceof api_extractor_model_me_1.ApiDocumentedItem) {
                if (apiParameterListMixin.tsdocComment &&
                    apiParameterListMixin.tsdocComment.returnsBlock) {
                    output.push(...apiParameterListMixin.tsdocComment.returnsBlock.content.nodes);
                }
            }
        }
        return output;
    }
    _createParagraphForTypeExcerpt(excerpt) {
        const configuration = this._tsdocConfiguration;
        const paragraph = new tsdoc_1.DocParagraph({ configuration });
        if (!excerpt.text.trim()) {
            paragraph.appendNode(new tsdoc_1.DocPlainText({ configuration, text: '(not declared)' }));
        }
        else {
            this._appendExcerptWithHyperlinks(paragraph, excerpt);
        }
        return paragraph;
    }
    _appendExcerptWithHyperlinks(docNodeContainer, excerpt) {
        const configuration = this._tsdocConfiguration;
        for (const token of excerpt.spannedTokens) {
            // Markdown doesn't provide a standardized syntax for hyperlinks inside code spans, so we will render
            // the type expression as DocPlainText.  Instead of creating multiple DocParagraphs, we can simply
            // discard any newlines and let the renderer do normal word-wrapping.
            const unwrappedTokenText = token.text.replace(/[\r\n]+/g, ' ');
            // If it's hyperlinkable, then append a DocLinkTag
            if (token.kind === "Reference" /* ExcerptTokenKind.Reference */ &&
                token.canonicalReference) {
                const apiItemResult = this._apiModel.resolveDeclarationReference(token.canonicalReference, undefined);
                if (apiItemResult.resolvedApiItem) {
                    docNodeContainer.appendNode(new tsdoc_1.DocLinkTag({
                        configuration,
                        tagName: '@link',
                        linkText: unwrappedTokenText,
                        urlDestination: (0, MarkdownDocumenterHelpers_1.getLinkForApiItem)(apiItemResult.resolvedApiItem, this._addFileNameSuffix)
                    }));
                    continue;
                }
            }
            // Otherwise append non-hyperlinked text
            docNodeContainer.appendNode(new tsdoc_1.DocPlainText({ configuration, text: unwrappedTokenText }));
        }
    }
    /**
     * GENERATE PAGE: MODEL
     */
    _createModelTable(apiModel) {
        const configuration = this._tsdocConfiguration;
        const output = [];
        const packagesTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Package', 'Description']
        });
        for (const apiMember of apiModel.members) {
            const row = new DocTableRow_1.DocTableRow({ configuration }, [
                (0, MarkdownDocumenterHelpers_1.createTitleCell)(apiMember, configuration, this._addFileNameSuffix),
                (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(apiMember, configuration)
            ]);
            switch (apiMember.kind) {
                case "Package" /* ApiItemKind.Package */:
                    packagesTable.addRow(row);
                    this._writeApiItemPage(apiMember);
                    break;
            }
        }
        if (packagesTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Packages' }));
            output.push(packagesTable);
        }
        return output;
    }
    /**´
     * Generate a table of entry points if there are more than one entry points.
     * Otherwise, generate the entry point directly in the package page.
     */
    _createPackage(apiContainer) {
        const configuration = this._tsdocConfiguration;
        const output = [];
        // If a package has a single entry point, generate entry point page in the package page directly
        if (apiContainer.entryPoints.length === 1) {
            return this._createEntryPointOrNamespace(apiContainer.members[0]);
        }
        const entryPointsTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Entry Point', 'Description']
        });
        for (const entryPoint of apiContainer.entryPoints) {
            const row = new DocTableRow_1.DocTableRow({ configuration }, [
                (0, MarkdownDocumenterHelpers_1.createEntryPointTitleCell)(entryPoint, configuration, this._addFileNameSuffix),
                (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(entryPoint, configuration)
            ]);
            entryPointsTable.addRow(row);
        }
        output.push(entryPointsTable);
        // write entry point pages
        for (const entryPoint of apiContainer.entryPoints) {
            this._writeApiItemPage(entryPoint);
        }
        return output;
    }
    /**
     * GENERATE PAGE: ENTRYPOINT or NAMESPACE
     */
    _createEntryPointOrNamespace(apiContainer) {
        const configuration = this._tsdocConfiguration;
        const output = [];
        const classesTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Class', 'Description']
        });
        const enumerationsTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Enumeration', 'Description']
        });
        const finalFunctionsTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Function', 'Description']
        });
        const functionsRowGroup = {};
        const interfacesTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Interface', 'Description']
        });
        const namespacesTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Namespace', 'Description']
        });
        const variablesTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Variable', 'Description']
        });
        const typeAliasesTable = new DocTable_1.DocTable({
            configuration,
            headerTitles: ['Type Alias', 'Description']
        });
        const functionsDefinitionsGroup = {};
        const finalFunctionsDefinitions = [];
        const variablesDefinitions = [];
        const typeAliasDefinitions = [];
        const enumsDefinitions = [];
        const apiMembers = apiContainer.kind === "EntryPoint" /* ApiItemKind.EntryPoint */
            ? apiContainer.members
            : apiContainer.members;
        for (const apiMember of apiMembers) {
            const row = new DocTableRow_1.DocTableRow({ configuration }, [
                (0, MarkdownDocumenterHelpers_1.createTitleCell)(apiMember, configuration, this._addFileNameSuffix),
                (0, MarkdownDocumenterHelpers_1.createDescriptionCell)(apiMember, configuration)
            ]);
            switch (apiMember.kind) {
                case "Class" /* ApiItemKind.Class */:
                    classesTable.addRow(row);
                    this._writeApiItemPage(apiMember);
                    break;
                case "Enum" /* ApiItemKind.Enum */:
                    enumerationsTable.addRow(row);
                    enumsDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    break;
                case "Interface" /* ApiItemKind.Interface */:
                    interfacesTable.addRow(row);
                    this._writeApiItemPage(apiMember);
                    break;
                case "Namespace" /* ApiItemKind.Namespace */:
                    namespacesTable.addRow(row);
                    this._writeApiItemPage(apiMember);
                    break;
                case "Function" /* ApiItemKind.Function */:
                    /**
                     * If this option is set, group functions by first param.
                     * Organize using a map where the key is the first param.
                     */
                    if (this._sortFunctions) {
                        const firstParam = apiMember
                            .parameters[0] || { name: '' };
                        if (!functionsRowGroup[firstParam.name]) {
                            functionsRowGroup[firstParam.name] = [];
                        }
                        if (!functionsDefinitionsGroup[firstParam.name]) {
                            functionsDefinitionsGroup[firstParam.name] = [];
                        }
                        functionsRowGroup[firstParam.name].push(row);
                        functionsDefinitionsGroup[firstParam.name].push(...this._createCompleteOutputForApiItem(apiMember));
                    }
                    else {
                        finalFunctionsTable.addRow(row);
                        finalFunctionsDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    }
                    break;
                case "TypeAlias" /* ApiItemKind.TypeAlias */:
                    typeAliasesTable.addRow(row);
                    typeAliasDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    break;
                case "Variable" /* ApiItemKind.Variable */:
                    variablesTable.addRow(row);
                    variablesDefinitions.push(...this._createCompleteOutputForApiItem(apiMember));
                    break;
            }
        }
        /**
         * Sort the functions groups by first param. If priority params were
         * provided to --sort-functions, will put them first in the order
         * given.
         */
        if (this._sortFunctions) {
            let priorityParams = [];
            if (this._sortFunctions.includes(',')) {
                priorityParams = this._sortFunctions.split(',');
            }
            else {
                priorityParams = [this._sortFunctions];
            }
            const sortedFunctionsFirstParamKeys = Object.keys(functionsRowGroup).sort((a, b) => {
                if (priorityParams.includes(a) && priorityParams.includes(b)) {
                    return priorityParams.indexOf(a) - priorityParams.indexOf(b);
                }
                else if (priorityParams.includes(a)) {
                    return -1;
                }
                else if (priorityParams.includes(b)) {
                    return 1;
                }
                return a.localeCompare(b);
            });
            for (const paramKey of sortedFunctionsFirstParamKeys) {
                // Header for each group of functions grouped by first param.
                // Doesn't make sense if there's only one group.
                const headerText = paramKey
                    ? `function(${paramKey}, ...)`
                    : 'function()';
                if (sortedFunctionsFirstParamKeys.length > 1) {
                    finalFunctionsTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
                        new DocTableCell_1.DocTableCell({ configuration }, [
                            new tsdoc_1.DocParagraph({ configuration }, [
                                new DocEmphasisSpan_1.DocEmphasisSpan({ configuration, bold: true }, [
                                    new tsdoc_1.DocPlainText({ configuration, text: headerText })
                                ])
                            ])
                        ])
                    ]));
                }
                for (const functionsRow of functionsRowGroup[paramKey]) {
                    finalFunctionsTable.addRow(functionsRow);
                }
                // Create a heading that groups functions by the first param
                finalFunctionsDefinitions.push(new DocHeading_1.DocHeading({
                    configuration,
                    title: headerText
                }));
                for (const functionDefinition of functionsDefinitionsGroup[paramKey]) {
                    // const originalDocHeading = functionDefinition as DocHeading;
                    // // Increase the doc heading level so that this is a sub-section
                    // // of the function grouping heading
                    // const newDocHeading = new DocHeading({
                    //   configuration: originalDocHeading.configuration,
                    //   title: originalDocHeading.title,
                    //   level: originalDocHeading.level + 1,
                    //   anchor: originalDocHeading.anchor
                    // })
                    // finalFunctionsDefinitions.push(newDocHeading);
                    finalFunctionsDefinitions.push(functionDefinition);
                }
            }
        }
        if (finalFunctionsTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Functions' }));
            output.push(finalFunctionsTable);
        }
        if (classesTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Classes' }));
            output.push(classesTable);
        }
        if (enumerationsTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Enumerations' }));
            output.push(enumerationsTable);
        }
        if (interfacesTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Interfaces' }));
            output.push(interfacesTable);
        }
        if (namespacesTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Namespaces' }));
            output.push(namespacesTable);
        }
        if (variablesTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Variables' }));
            output.push(variablesTable);
        }
        if (typeAliasesTable.rows.length > 0) {
            output.push(new DocHeading_1.DocHeading({ configuration, title: 'Type Aliases' }));
            output.push(typeAliasesTable);
        }
        if (finalFunctionsDefinitions.length > 0) {
            output.push(...finalFunctionsDefinitions);
        }
        if (variablesDefinitions.length > 0) {
            output.push(...variablesDefinitions);
        }
        if (typeAliasDefinitions.length > 0) {
            output.push(...typeAliasDefinitions);
        }
        if (enumsDefinitions.length > 0) {
            output.push(...enumsDefinitions);
        }
        return output;
    }
    _createPropertyTypeCell(apiItem) {
        const section = new tsdoc_1.DocSection({
            configuration: this._tsdocConfiguration
        });
        if (apiItem instanceof api_extractor_model_me_1.ApiPropertyItem) {
            section.appendNode(this._createParagraphForTypeExcerpt(apiItem.propertyTypeExcerpt));
        }
        return new DocTableCell_1.DocTableCell({ configuration: this._tsdocConfiguration }, section.nodes);
    }
    _createSignatureSection(apiItem) {
        const configuration = this._tsdocConfiguration;
        const nodes = [];
        if (apiItem.excerpt.text.length > 0) {
            nodes.push(new tsdoc_1.DocParagraph({ configuration }, [
                new DocEmphasisSpan_1.DocEmphasisSpan({ configuration, bold: true }, [
                    new tsdoc_1.DocPlainText({ configuration, text: 'Signature:' })
                ])
            ]));
            nodes.push(new tsdoc_1.DocFencedCode({
                configuration,
                code: apiItem.getExcerptWithModifiers(),
                language: 'typescript'
            }));
        }
        nodes.push(...this._writeHeritageTypes(apiItem));
        return nodes;
    }
    _writeHeritageTypes(apiItem) {
        const configuration = this._tsdocConfiguration;
        const nodes = [];
        if (apiItem instanceof api_extractor_model_me_1.ApiClass) {
            if (apiItem.extendsType) {
                const extendsParagraph = new tsdoc_1.DocParagraph({ configuration }, [
                    new DocEmphasisSpan_1.DocEmphasisSpan({ configuration, bold: true }, [
                        new tsdoc_1.DocPlainText({ configuration, text: 'Extends: ' })
                    ])
                ]);
                this._appendExcerptWithHyperlinks(extendsParagraph, apiItem.extendsType.excerpt);
                nodes.push(extendsParagraph);
            }
            if (apiItem.implementsTypes.length > 0) {
                const implementsParagraph = new tsdoc_1.DocParagraph({ configuration }, [
                    new DocEmphasisSpan_1.DocEmphasisSpan({ configuration, bold: true }, [
                        new tsdoc_1.DocPlainText({ configuration, text: 'Implements: ' })
                    ])
                ]);
                let needsComma = false;
                for (const implementsType of apiItem.implementsTypes) {
                    if (needsComma) {
                        implementsParagraph.appendNode(new tsdoc_1.DocPlainText({ configuration, text: ', ' }));
                    }
                    this._appendExcerptWithHyperlinks(implementsParagraph, implementsType.excerpt);
                    needsComma = true;
                }
                nodes.push(implementsParagraph);
            }
        }
        if (apiItem instanceof api_extractor_model_me_1.ApiInterface) {
            if (apiItem.extendsTypes.length > 0) {
                const extendsParagraph = new tsdoc_1.DocParagraph({ configuration }, [
                    new DocEmphasisSpan_1.DocEmphasisSpan({ configuration, bold: true }, [
                        new tsdoc_1.DocPlainText({ configuration, text: 'Extends: ' })
                    ])
                ]);
                let needsComma = false;
                for (const extendsType of apiItem.extendsTypes) {
                    if (needsComma) {
                        extendsParagraph.appendNode(new tsdoc_1.DocPlainText({ configuration, text: ', ' }));
                    }
                    this._appendExcerptWithHyperlinks(extendsParagraph, extendsType.excerpt);
                    needsComma = true;
                }
                nodes.push(extendsParagraph);
            }
        }
        return nodes;
    }
    _deleteOldOutputFiles() {
        console.log('Deleting old output from ' + this._outputFolder);
        node_core_library_1.FileSystem.ensureEmptyFolder(this._outputFolder);
    }
}
exports.MarkdownDocumenter = MarkdownDocumenter;
//# sourceMappingURL=MarkdownDocumenter.js.map