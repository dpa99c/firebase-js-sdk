export function resolveBrowserExterns(id: any): boolean;
export function resolveNodeExterns(id: any): boolean;
export function onwarn(warning: any, defaultWarn: any): void;
export function applyPrebuilt(name?: string): any;
export function es2017Plugins(platform: any, mangled?: boolean): any[];
export function es2017PluginsCompat(platform: any, pathTransformer: any, mangled?: boolean): any[];
/**
 * Returns an replacement configuration for `@rollup/plugin-alias` that replaces
 * references to platform-specific files with implementations for the provided
 * target platform.
 */
export function generateAliasConfig(platform: any): {
    entries: {
        find: RegExp;
        replacement: string;
    }[];
};
/**
 * Transformers that remove calls to `debugAssert` and messages for 'fail` and
 * `hardAssert`.
 */
export function removeAssertTransformer(service: any): {
    before: typescript.TransformerFactory<typescript.SourceFile>[];
    after: never[];
};
/**
 * Transformers that remove calls to `debugAssert`, messages for 'fail` and
 * `hardAssert` and appends a __PRIVATE_ prefix to all internal symbols.
 */
export function removeAssertAndPrefixInternalTransformer(service: any): {
    before: typescript.TransformerFactory<typescript.SourceFile>[];
    after: never[];
};
export namespace manglePrivatePropertiesOptions {
    namespace output {
        let comments: string;
        let beautify: boolean;
    }
    let keep_fnames: boolean;
    let keep_classnames: boolean;
    namespace mangle {
        let reserved: string[];
        namespace properties {
            export let regex: RegExp;
            let reserved_1: string[];
            export { reserved_1 as reserved };
        }
    }
}
import typescript = require("typescript");
