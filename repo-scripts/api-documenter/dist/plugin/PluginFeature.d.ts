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
 * This is an internal part of the plugin infrastructure.
 *
 * @remarks
 * This object is the constructor parameter for API Documenter plugin features.
 *
 * @public
 */
export declare class PluginFeatureInitialization {
    /** @internal */
    _context: PluginFeatureContext;
    /** @internal */
    constructor();
}
/**
 * Context object for {@link PluginFeature}.
 * Exposes various services that can be used by a plugin.
 *
 * @public
 */
export declare class PluginFeatureContext {
}
/**
 * The abstract base class for all API Documenter plugin features.
 * @public
 */
export declare abstract class PluginFeature {
    /**
     * Exposes various services that can be used by a plugin.
     */
    context: PluginFeatureContext;
    /**
     * The subclass should pass the `initialization` through to the base class.
     * Do not put custom initialization code in the constructor.  Instead perform your initialization in the
     * `onInitialized()` event function.
     * @internal
     */
    constructor(initialization: PluginFeatureInitialization);
    /**
     * This event function is called after the feature is initialized, but before any processing occurs.
     * @virtual
     */
    onInitialized(): void;
    static [Symbol.hasInstance](instance: object): boolean;
}
