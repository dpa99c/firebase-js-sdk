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
import { JsonSchema, NewlineKind } from '@rushstack/node-core-library';
import { IConfigFile } from './IConfigFile';
/**
 * Helper for loading the api-documenter.json file format.  Later when the schema is more mature,
 * this class will be used to represent the validated and normalized configuration, whereas `IConfigFile`
 * represents the raw JSON file structure.
 */
export declare class DocumenterConfig {
    readonly configFilePath: string;
    readonly configFile: IConfigFile;
    /**
     * Specifies what type of newlines API Documenter should use when writing output files.  By default, the output files
     * will be written with Windows-style newlines.
     */
    readonly newlineKind: NewlineKind;
    /**
     * The JSON Schema for API Extractor config file (api-extractor.schema.json).
     */
    static readonly jsonSchema: JsonSchema;
    /**
     * The config file name "api-extractor.json".
     */
    static readonly FILENAME: string;
    private constructor();
    /**
     * Load and validate an api-documenter.json file.
     */
    static loadFile(configFilePath: string): DocumenterConfig;
}
