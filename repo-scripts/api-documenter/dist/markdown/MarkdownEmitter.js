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
exports.MarkdownEmitter = void 0;
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const tsdoc_1 = require("@microsoft/tsdoc");
const node_core_library_1 = require("@rushstack/node-core-library");
const IndentedWriter_1 = require("../utils/IndentedWriter");
/**
 * Renders MarkupElement content in the Markdown file format.
 * For more info:  https://en.wikipedia.org/wiki/Markdown
 */
class MarkdownEmitter {
    emit(stringBuilder, docNode, options) {
        const writer = new IndentedWriter_1.IndentedWriter(stringBuilder);
        const context = {
            writer,
            insideTable: false,
            boldRequested: false,
            italicRequested: false,
            writingBold: false,
            writingItalic: false,
            options
        };
        this.writeNode(docNode, context, false);
        writer.ensureNewLine(); // finish the last line
        return writer.toString();
    }
    getEscapedText(text) {
        const textWithBackslashes = text
            .replace(/\\/g, '\\\\') // first replace the escape character
            .replace(/[*#[\]_|`~]/g, x => '\\' + x) // then escape any special characters
            .replace(/---/g, '\\-\\-\\-') // hyphens only if it's 3 or more
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return textWithBackslashes;
    }
    getTableEscapedText(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\|/g, '&#124;');
    }
    /**
     * @virtual
     */
    writeNode(docNode, context, docNodeSiblings) {
        const writer = context.writer;
        switch (docNode.kind) {
            case "PlainText" /* DocNodeKind.PlainText */: {
                const docPlainText = docNode;
                this.writePlainText(docPlainText.text, context);
                break;
            }
            case "HtmlStartTag" /* DocNodeKind.HtmlStartTag */:
            case "HtmlEndTag" /* DocNodeKind.HtmlEndTag */: {
                const docHtmlTag = docNode;
                // write the HTML element verbatim into the output
                writer.write(docHtmlTag.emitAsHtml());
                break;
            }
            case "CodeSpan" /* DocNodeKind.CodeSpan */: {
                const docCodeSpan = docNode;
                if (context.insideTable) {
                    writer.write('<code>');
                }
                else {
                    writer.write('`');
                }
                if (context.insideTable) {
                    const code = this.getTableEscapedText(docCodeSpan.code);
                    const parts = code.split(/\r?\n/g);
                    writer.write(parts.join('</code><br/><code>'));
                }
                else {
                    writer.write(docCodeSpan.code);
                }
                if (context.insideTable) {
                    writer.write('</code>');
                }
                else {
                    writer.write('`');
                }
                break;
            }
            case "LinkTag" /* DocNodeKind.LinkTag */: {
                const docLinkTag = docNode;
                if (docLinkTag.codeDestination) {
                    this.writeLinkTagWithCodeDestination(docLinkTag, context);
                }
                else if (docLinkTag.urlDestination) {
                    this.writeLinkTagWithUrlDestination(docLinkTag, context);
                }
                else if (docLinkTag.linkText) {
                    this.writePlainText(docLinkTag.linkText, context);
                }
                break;
            }
            case "Paragraph" /* DocNodeKind.Paragraph */: {
                const docParagraph = docNode;
                const trimmedParagraph = tsdoc_1.DocNodeTransforms.trimSpacesInParagraph(docParagraph);
                if (context.insideTable) {
                    if (docNodeSiblings) {
                        writer.write('<p>');
                        this.writeNodes(trimmedParagraph.nodes, context);
                        writer.write('</p>');
                    }
                    else {
                        // Special case:  If we are the only element inside this table cell, then we can omit the <p></p> container.
                        this.writeNodes(trimmedParagraph.nodes, context);
                    }
                }
                else {
                    this.writeNodes(trimmedParagraph.nodes, context);
                    writer.ensureNewLine();
                    writer.writeLine();
                }
                break;
            }
            case "FencedCode" /* DocNodeKind.FencedCode */: {
                const docFencedCode = docNode;
                writer.ensureNewLine();
                writer.write('```');
                writer.write(docFencedCode.language);
                writer.writeLine();
                writer.write(docFencedCode.code);
                writer.writeLine();
                writer.writeLine('```');
                break;
            }
            case "Section" /* DocNodeKind.Section */: {
                const docSection = docNode;
                this.writeNodes(docSection.nodes, context);
                break;
            }
            case "SoftBreak" /* DocNodeKind.SoftBreak */: {
                if (!/^\s?$/.test(writer.peekLastCharacter())) {
                    writer.write(' ');
                }
                break;
            }
            case "EscapedText" /* DocNodeKind.EscapedText */: {
                const docEscapedText = docNode;
                this.writePlainText(docEscapedText.decodedText, context);
                break;
            }
            case "ErrorText" /* DocNodeKind.ErrorText */: {
                const docErrorText = docNode;
                this.writePlainText(docErrorText.text, context);
                break;
            }
            case "InlineTag" /* DocNodeKind.InlineTag */: {
                break;
            }
            case "BlockTag" /* DocNodeKind.BlockTag */: {
                const tagNode = docNode;
                console.warn('Unsupported block tag: ' + tagNode.tagName);
                break;
            }
            default:
                throw new node_core_library_1.InternalError('Unsupported DocNodeKind kind: ' + docNode.kind);
        }
    }
    /** @virtual */
    writeLinkTagWithCodeDestination(docLinkTag, context) {
        // The subclass needs to implement this to support code destinations
        throw new node_core_library_1.InternalError('writeLinkTagWithCodeDestination()');
    }
    /** @virtual */
    writeLinkTagWithUrlDestination(docLinkTag, context) {
        const linkText = docLinkTag.linkText !== undefined
            ? docLinkTag.linkText
            : docLinkTag.urlDestination;
        const encodedLinkText = this.getEscapedText(linkText.replace(/\s+/g, ' '));
        context.writer.write('[');
        context.writer.write(encodedLinkText);
        context.writer.write(`](${docLinkTag.urlDestination})`);
    }
    writePlainText(text, context) {
        const writer = context.writer;
        // split out the [ leading whitespace, content, trailing whitespace ]
        const parts = text.match(/^(\s*)(.*?)(\s*)$/) || [];
        writer.write(parts[1]); // write leading whitespace
        const middle = parts[2];
        if (middle !== '') {
            switch (writer.peekLastCharacter()) {
                case '':
                case '\n':
                case ' ':
                case '[':
                case '>':
                    // okay to put a symbol
                    break;
                default:
                    // This is no problem:        "**one** *two* **three**"
                    // But this is trouble:       "**one***two***three**"
                    // The most general solution: "**one**<!-- -->*two*<!-- -->**three**"
                    writer.write('<!-- -->');
                    break;
            }
            if (context.boldRequested) {
                writer.write('<b>');
            }
            if (context.italicRequested) {
                writer.write('<i>');
            }
            writer.write(this.getEscapedText(middle));
            if (context.italicRequested) {
                writer.write('</i>');
            }
            if (context.boldRequested) {
                writer.write('</b>');
            }
        }
        writer.write(parts[3]); // write trailing whitespace
    }
    writeNodes(docNodes, context) {
        for (const docNode of docNodes) {
            this.writeNode(docNode, context, docNodes.length > 1);
        }
    }
}
exports.MarkdownEmitter = MarkdownEmitter;
//# sourceMappingURL=MarkdownEmitter.js.map