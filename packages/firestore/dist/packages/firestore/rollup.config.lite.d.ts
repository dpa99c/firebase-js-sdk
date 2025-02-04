export default allBuilds;
declare const allBuilds: ({
    input: string;
    output: {
        file: string;
        format: string;
        sourcemap: boolean;
    };
    plugins: import("rollup").Plugin[];
    external: (id: any) => boolean;
    treeshake: {
        moduleSideEffects: boolean;
    };
    onwarn: (warning: any, defaultWarn: any) => void;
} | {
    input: string;
    output: {
        file: string;
        format: string;
        sourcemap: boolean;
    };
    plugins: import("rollup").Plugin[];
    external: (id: any) => boolean;
    treeshake: {
        moduleSideEffects: boolean;
    };
    onwarn?: undefined;
} | {
    input: string;
    output: {
        file: string;
        format: string;
        sourcemap: boolean;
    }[];
    plugins: import("rollup").Plugin[];
    external: (id: any) => boolean;
    treeshake: {
        moduleSideEffects: boolean;
    };
    onwarn?: undefined;
})[];
