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
import { ApiItem } from 'api-extractor-model-me';
export declare class Utilities {
    private static readonly _badFilenameCharsRegExp;
    /**
     * Generates a concise signature for a function.  Example: "getArea(width, height)"
     */
    static getConciseSignature(apiItem: ApiItem): string;
    /**
     * Converts bad filename characters to underscores.
     */
    static getSafeFilenameForName(name: string): string;
}
