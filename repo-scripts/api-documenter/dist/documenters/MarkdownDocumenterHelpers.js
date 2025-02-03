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
exports.getLinkForApiItem = getLinkForApiItem;
exports.getFilenameForApiItem = getFilenameForApiItem;
exports.getHeadingAnchorForApiItem = getHeadingAnchorForApiItem;
exports.createBetaWarning = createBetaWarning;
exports.createRemarksSection = createRemarksSection;
exports.createExampleSection = createExampleSection;
exports.createTitleCell = createTitleCell;
exports.createDescriptionCell = createDescriptionCell;
exports.createModifiersCell = createModifiersCell;
exports.createThrowsSection = createThrowsSection;
exports.createEntryPointTitleCell = createEntryPointTitleCell;
exports.createEnumTables = createEnumTables;
const tsdoc_1 = require("@microsoft/tsdoc");
const api_extractor_model_me_1 = require("api-extractor-model-me");
const DocEmphasisSpan_1 = require("../nodes/DocEmphasisSpan");
const DocHeading_1 = require("../nodes/DocHeading");
const DocTable_1 = require("../nodes/DocTable");
const Utilities_1 = require("../utils/Utilities");
const node_core_library_1 = require("@rushstack/node-core-library");
const DocNoteBox_1 = require("../nodes/DocNoteBox");
const DocTableRow_1 = require("../nodes/DocTableRow");
const DocTableCell_1 = require("../nodes/DocTableCell");
const crypto_1 = require("crypto");
function getLinkForApiItem(apiItem, addFileNameSuffix) {
    const fileName = getFilenameForApiItem(apiItem, addFileNameSuffix);
    const headingAnchor = getHeadingAnchorForApiItem(apiItem);
    return `./${fileName}#${headingAnchor}`;
}
function getFilenameForApiItem(apiItem, addFileNameSuffix) {
    if (apiItem.kind === "Model" /* ApiItemKind.Model */) {
        return 'index.md';
    }
    let baseName = '';
    let multipleEntryPoints = false;
    for (const hierarchyItem of apiItem.getHierarchy()) {
        // For overloaded methods, add a suffix such as "MyClass.myMethod_2".
        let qualifiedName = Utilities_1.Utilities.getSafeFilenameForName(hierarchyItem.displayName);
        if (api_extractor_model_me_1.ApiParameterListMixin.isBaseClassOf(hierarchyItem)) {
            if (hierarchyItem.overloadIndex > 1) {
                // Subtract one for compatibility with earlier releases of API Documenter.
                // (This will get revamped when we fix GitHub issue #1308)
                qualifiedName += `_${hierarchyItem.overloadIndex - 1}`;
            }
        }
        switch (hierarchyItem.kind) {
            case "Model" /* ApiItemKind.Model */:
                break;
            case "EntryPoint" /* ApiItemKind.EntryPoint */:
                const packageName = hierarchyItem.parent.displayName;
                let entryPointName = node_core_library_1.PackageName.getUnscopedName(packageName);
                if (multipleEntryPoints) {
                    entryPointName = `${node_core_library_1.PackageName.getUnscopedName(packageName)}/${hierarchyItem.displayName}`;
                }
                baseName = Utilities_1.Utilities.getSafeFilenameForName(entryPointName);
                break;
            case "Package" /* ApiItemKind.Package */:
                baseName = Utilities_1.Utilities.getSafeFilenameForName(node_core_library_1.PackageName.getUnscopedName(hierarchyItem.displayName));
                if (hierarchyItem.entryPoints.length > 1) {
                    multipleEntryPoints = true;
                }
                break;
            case "Namespace" /* ApiItemKind.Namespace */:
                baseName += '.' + qualifiedName;
                if (addFileNameSuffix) {
                    baseName += '_n';
                }
                break;
            case "Class" /* ApiItemKind.Class */:
            case "Interface" /* ApiItemKind.Interface */:
                baseName += '.' + qualifiedName;
                break;
        }
    }
    return baseName + '.md';
}
// TODO: handle namespace?
function getHeadingAnchorForApiItem(apiItem) {
    const scopedName = lowercaseAndRemoveSymbols(apiItem.getScopedNameWithinPackage());
    switch (apiItem.kind) {
        case "Function" /* ApiItemKind.Function */:
            return lowercaseAndRemoveSymbols(getFunctionOverloadAnchor(apiItem));
        case "Variable" /* ApiItemKind.Variable */:
            return `${scopedName}`;
        case "TypeAlias" /* ApiItemKind.TypeAlias */:
            return `${scopedName}`;
        case "Enum" /* ApiItemKind.Enum */:
            return `${scopedName}`;
        case "Method" /* ApiItemKind.Method */:
        case "MethodSignature" /* ApiItemKind.MethodSignature */:
            return `${scopedName}`;
        case "Property" /* ApiItemKind.Property */:
        case "PropertySignature" /* ApiItemKind.PropertySignature */:
            return `${scopedName}`;
        case "Constructor" /* ApiItemKind.Constructor */:
        case "ConstructSignature" /* ApiItemKind.ConstructSignature */:
            return `${scopedName}`;
        case "Class" /* ApiItemKind.Class */:
            return `${scopedName}_class`;
        case "Interface" /* ApiItemKind.Interface */:
            return `${scopedName}_interface`;
        case "Model" /* ApiItemKind.Model */:
            return `api-reference`;
        case "Namespace" /* ApiItemKind.Namespace */:
            return `${scopedName}_namespace`;
        case "Package" /* ApiItemKind.Package */:
            const unscopedPackageName = lowercaseAndRemoveSymbols(node_core_library_1.PackageName.getUnscopedName(apiItem.displayName));
            return `${unscopedPackageName}_package`;
        case "EntryPoint" /* ApiItemKind.EntryPoint */:
            const packageName = apiItem.parent.displayName;
            return lowercaseAndRemoveSymbols(`${packageName}${apiItem.displayName && '/' + apiItem.displayName}`);
        case "EnumMember" /* ApiItemKind.EnumMember */:
            return `${scopedName}_enummember`;
        default:
            throw new Error('Unsupported API item kind:3 ' + apiItem.kind + apiItem.displayName);
    }
}
/**
 * Generates a unique link for a function.  Example: "getArea_paramhashhere"
 */
function getFunctionOverloadAnchor(apiItem) {
    if (api_extractor_model_me_1.ApiParameterListMixin.isBaseClassOf(apiItem) &&
        apiItem.parameters.length > 0) {
        // Create a sha256 hash from the parameter names and types.
        const hash = (0, crypto_1.createHash)('sha256');
        apiItem.parameters.forEach(param => hash.update(`${param.name}:${param.parameterTypeExcerpt.text}`));
        // Use the first 7 characters of the hash for an easier to read URL.
        const paramHash = hash.digest('hex').substring(0, 7);
        // Suffix the API item name with the paramHash to generate a unique
        // anchor for function overloads
        return apiItem.getScopedNameWithinPackage() + '_' + paramHash;
    }
    return apiItem.getScopedNameWithinPackage();
}
function lowercaseAndRemoveSymbols(input) {
    return input.replace(/[\.()]/g, '').toLowerCase();
}
function createBetaWarning(configuration) {
    const betaWarning = 'This API is provided as a preview for developers and may change' +
        ' based on feedback that we receive.  Do not use this API in a production environment.';
    return new DocNoteBox_1.DocNoteBox({ configuration }, [
        new tsdoc_1.DocParagraph({ configuration }, [
            new tsdoc_1.DocPlainText({ configuration, text: betaWarning })
        ])
    ]);
}
function createRemarksSection(apiItem, configuration) {
    const nodes = [];
    if (apiItem instanceof api_extractor_model_me_1.ApiDocumentedItem) {
        const tsdocComment = apiItem.tsdocComment;
        if (tsdocComment) {
            // Write the @remarks block
            if (tsdocComment.remarksBlock) {
                nodes.push(...tsdocComment.remarksBlock.content.nodes);
            }
        }
    }
    return nodes;
}
function createExampleSection(apiItem, configuration) {
    const nodes = [];
    if (apiItem instanceof api_extractor_model_me_1.ApiDocumentedItem) {
        const tsdocComment = apiItem.tsdocComment;
        if (tsdocComment) {
            // Write the @example blocks
            const exampleBlocks = tsdocComment.customBlocks.filter(x => x.blockTag.tagNameWithUpperCase ===
                tsdoc_1.StandardTags.example.tagNameWithUpperCase);
            let exampleNumber = 1;
            for (const exampleBlock of exampleBlocks) {
                const heading = exampleBlocks.length > 1 ? `Example ${exampleNumber}` : 'Example';
                nodes.push(new DocHeading_1.DocHeading({ configuration, title: heading, level: 2 }));
                nodes.push(...exampleBlock.content.nodes);
                ++exampleNumber;
            }
        }
    }
    return nodes;
}
function createTitleCell(apiItem, configuration, addFileNameSuffix) {
    return new DocTableCell_1.DocTableCell({ configuration }, [
        new tsdoc_1.DocParagraph({ configuration }, [
            new tsdoc_1.DocLinkTag({
                configuration,
                tagName: '@link',
                linkText: Utilities_1.Utilities.getConciseSignature(apiItem),
                urlDestination: getLinkForApiItem(apiItem, addFileNameSuffix)
            })
        ])
    ]);
}
/**
 * This generates a DocTableCell for an ApiItem including the summary section and "(BETA)" annotation.
 *
 * @remarks
 * We mostly assume that the input is an ApiDocumentedItem, but it's easier to perform this as a runtime
 * check than to have each caller perform a type cast.
 */
function createDescriptionCell(apiItem, configuration) {
    const section = new tsdoc_1.DocSection({ configuration });
    if (api_extractor_model_me_1.ApiReleaseTagMixin.isBaseClassOf(apiItem)) {
        if (apiItem.releaseTag === api_extractor_model_me_1.ReleaseTag.Beta) {
            section.appendNodesInParagraph([
                new DocEmphasisSpan_1.DocEmphasisSpan({ configuration, bold: true, italic: true }, [
                    new tsdoc_1.DocPlainText({ configuration, text: '(BETA)' })
                ]),
                new tsdoc_1.DocPlainText({ configuration, text: ' ' })
            ]);
        }
    }
    if (apiItem instanceof api_extractor_model_me_1.ApiDocumentedItem) {
        if (apiItem.tsdocComment !== undefined) {
            appendAndMergeSection(section, apiItem.tsdocComment.summarySection);
        }
    }
    return new DocTableCell_1.DocTableCell({ configuration }, section.nodes);
}
function createModifiersCell(apiItem, configuration) {
    const section = new tsdoc_1.DocSection({ configuration });
    if (api_extractor_model_me_1.ApiStaticMixin.isBaseClassOf(apiItem)) {
        if (apiItem.isStatic) {
            section.appendNodeInParagraph(new tsdoc_1.DocCodeSpan({ configuration, code: 'static' }));
        }
    }
    return new DocTableCell_1.DocTableCell({ configuration }, section.nodes);
}
function appendAndMergeSection(output, docSection) {
    let firstNode = true;
    for (const node of docSection.nodes) {
        if (firstNode) {
            if (node.kind === "Paragraph" /* DocNodeKind.Paragraph */) {
                output.appendNodesInParagraph(node.getChildNodes());
                firstNode = false;
                continue;
            }
        }
        firstNode = false;
        output.appendNode(node);
    }
}
function createThrowsSection(apiItem, configuration, parentHeadingLevel) {
    const output = [];
    if (apiItem instanceof api_extractor_model_me_1.ApiDocumentedItem) {
        const tsdocComment = apiItem.tsdocComment;
        if (tsdocComment) {
            // Write the @throws blocks
            const throwsBlocks = tsdocComment.customBlocks.filter(x => x.blockTag.tagNameWithUpperCase ===
                tsdoc_1.StandardTags.throws.tagNameWithUpperCase);
            if (throwsBlocks.length > 0) {
                const heading = 'Exceptions';
                output.push(new DocHeading_1.DocHeading({
                    configuration,
                    title: heading,
                    level: parentHeadingLevel + 1
                }));
                for (const throwsBlock of throwsBlocks) {
                    output.push(...throwsBlock.content.nodes);
                }
            }
        }
    }
    return output;
}
function createEntryPointTitleCell(apiItem, configuration, addFileNameSuffix) {
    return new DocTableCell_1.DocTableCell({ configuration }, [
        new tsdoc_1.DocParagraph({ configuration }, [
            new tsdoc_1.DocLinkTag({
                configuration,
                tagName: '@link',
                linkText: `/${apiItem.displayName}`,
                urlDestination: getLinkForApiItem(apiItem, addFileNameSuffix)
            })
        ])
    ]);
}
/**
 * GENERATE PAGE: ENUM
 */
function createEnumTables(apiEnum, configuration) {
    const output = [];
    const enumMembersTable = new DocTable_1.DocTable({
        configuration,
        headerTitles: ['Member', 'Value', 'Description']
    });
    for (const apiEnumMember of apiEnum.members) {
        enumMembersTable.addRow(new DocTableRow_1.DocTableRow({ configuration }, [
            new DocTableCell_1.DocTableCell({ configuration }, [
                new tsdoc_1.DocParagraph({ configuration }, [
                    new tsdoc_1.DocPlainText({
                        configuration,
                        text: Utilities_1.Utilities.getConciseSignature(apiEnumMember)
                    })
                ])
            ]),
            new DocTableCell_1.DocTableCell({ configuration }, [
                new tsdoc_1.DocParagraph({ configuration }, [
                    new tsdoc_1.DocCodeSpan({
                        configuration,
                        code: apiEnumMember.initializerExcerpt.text
                    })
                ])
            ]),
            createDescriptionCell(apiEnumMember, configuration)
        ]));
    }
    if (enumMembersTable.rows.length > 0) {
        output.push(new DocHeading_1.DocHeading({ configuration, title: 'Enumeration Members' }));
        output.push(enumMembersTable);
    }
    return output;
}
//# sourceMappingURL=MarkdownDocumenterHelpers.js.map