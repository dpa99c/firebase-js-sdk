#!/usr/bin/env node
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
const tslib_1 = require("tslib");
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
const os = tslib_1.__importStar(require("os"));
const colors_1 = tslib_1.__importDefault(require("colors"));
const node_core_library_1 = require("@rushstack/node-core-library");
const ApiDocumenterCommandLine_1 = require("./cli/ApiDocumenterCommandLine");
const myPackageVersion = node_core_library_1.PackageJsonLookup.loadOwnPackageJson(__dirname).version;
console.log(os.EOL + colors_1.default.bold(`@firebase/api-documenter ${myPackageVersion} ` + os.EOL));
const parser = new ApiDocumenterCommandLine_1.ApiDocumenterCommandLine();
parser.execute().catch(console.error); // CommandLineParser.execute() should never reject the promise
//# sourceMappingURL=start.js.map