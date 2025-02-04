import 'firebase/compat/database';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import firebase from 'firebase/compat/app';

/**
 * @license
 * Copyright 2021 Google LLC
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
 * Return a connectable hostname, replacing wildcard 0.0.0.0 or :: with loopback
 * addresses 127.0.0.1 / ::1 correspondingly. See below for why this is needed:
 * https://github.com/firebase/firebase-tools-ui/issues/286
 *
 * This assumes emulators are running on the same device as fallbackHost (e.g.
 * hub), which should hold if both are started from the same CLI command.
 * @private
 */
function fixHostname(host, fallbackHost) {
    host = host.replace('[', '').replace(']', ''); // Remove IPv6 brackets
    if (host === '0.0.0.0') {
        host = fallbackHost || '127.0.0.1';
    }
    else if (host === '::') {
        host = fallbackHost || '::1';
    }
    return host;
}
/**
 * Create a URL with host, port, and path. Handles IPv6 bracketing correctly.
 * @private
 */
function makeUrl(hostAndPort, path) {
    if (typeof hostAndPort === 'object') {
        const { host, port } = hostAndPort;
        if (host.includes(':')) {
            hostAndPort = `[${host}]:${port}`;
        }
        else {
            hostAndPort = `${host}:${port}`;
        }
    }
    const url = new URL(`http://${hostAndPort}/`);
    url.pathname = path;
    return url;
}

/**
 * @license
 * Copyright 2021 Google LLC
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
 * Use the Firebase Emulator hub to discover other running emulators.
 *
 * @param hub the host and port where the Emulator Hub is running
 * @private
 */
async function discoverEmulators(hub, fetchImpl = fetch) {
    const res = await fetchImpl(makeUrl(hub, '/emulators'));
    if (!res.ok) {
        throw new Error(`HTTP Error ${res.status} when attempting to reach Emulator Hub at ${res.url}, are you sure it is running?`);
    }
    const emulators = {};
    const data = await res.json();
    if (data.database) {
        emulators.database = {
            host: data.database.host,
            port: data.database.port
        };
    }
    if (data.firestore) {
        emulators.firestore = {
            host: data.firestore.host,
            port: data.firestore.port
        };
    }
    if (data.storage) {
        emulators.storage = {
            host: data.storage.host,
            port: data.storage.port
        };
    }
    if (data.hub) {
        emulators.hub = {
            host: data.hub.host,
            port: data.hub.port
        };
    }
    return emulators;
}
/**
 * @private
 */
function getEmulatorHostAndPort(emulator, conf, discovered) {
    var _a, _b;
    if (conf && ('host' in conf || 'port' in conf)) {
        const { host, port } = conf;
        if (host || port) {
            if (!host || !port) {
                throw new Error(`Invalid configuration ${emulator}.host=${host} and ${emulator}.port=${port}. ` +
                    'If either parameter is supplied, both must be defined.');
            }
            if (discovered && !discovered[emulator]) {
                console.warn(`Warning: config for the ${emulator} emulator is specified, but the Emulator hub ` +
                    'reports it as not running. This may lead to errors such as connection refused.');
            }
            return {
                host: fixHostname(host, (_a = discovered === null || discovered === void 0 ? void 0 : discovered.hub) === null || _a === void 0 ? void 0 : _a.host),
                port: port
            };
        }
    }
    const envVar = EMULATOR_HOST_ENV_VARS[emulator];
    const fallback = (discovered === null || discovered === void 0 ? void 0 : discovered[emulator]) || emulatorFromEnvVar(envVar);
    if (fallback) {
        if (discovered && !discovered[emulator]) {
            console.warn(`Warning: the environment variable ${envVar} is set, but the Emulator hub reports the ` +
                `${emulator} emulator as not running. This may lead to errors such as connection refused.`);
        }
        return {
            host: fixHostname(fallback.host, (_b = discovered === null || discovered === void 0 ? void 0 : discovered.hub) === null || _b === void 0 ? void 0 : _b.host),
            port: fallback.port
        };
    }
}
// Visible for testing.
const EMULATOR_HOST_ENV_VARS = {
    'database': 'FIREBASE_DATABASE_EMULATOR_HOST',
    'firestore': 'FIRESTORE_EMULATOR_HOST',
    'hub': 'FIREBASE_EMULATOR_HUB',
    'storage': 'FIREBASE_STORAGE_EMULATOR_HOST'
};
function emulatorFromEnvVar(envVar) {
    const hostAndPort = process.env[envVar];
    if (!hostAndPort) {
        return undefined;
    }
    let parsed;
    try {
        parsed = new URL(`http://${hostAndPort}`);
    }
    catch (_a) {
        throw new Error(`Invalid format in environment variable ${envVar}=${hostAndPort} (expected host:port)`);
    }
    let host = parsed.hostname;
    const port = Number(parsed.port || '80');
    if (!Number.isInteger(port)) {
        throw new Error(`Invalid port in environment variable ${envVar}=${hostAndPort}`);
    }
    return { host, port };
}

/**
 * @license
 * Copyright 2021 Google LLC
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
 * An implementation of {@code RulesTestEnvironment}. This is private to hide the constructor,
 * which should never be directly called by the developer.
 * @private
 */
class RulesTestEnvironmentImpl {
    constructor(projectId, emulators) {
        this.projectId = projectId;
        this.emulators = emulators;
        this.contexts = new Set();
        this.destroyed = false;
    }
    authenticatedContext(user_id, tokenOptions) {
        this.checkNotDestroyed();
        return this.createContext(Object.assign(Object.assign({}, tokenOptions), { sub: user_id, user_id: user_id }));
    }
    unauthenticatedContext() {
        this.checkNotDestroyed();
        return this.createContext(/* authToken = */ undefined);
    }
    async withSecurityRulesDisabled(callback) {
        this.checkNotDestroyed();
        // The "owner" token is recognized by the emulators as a special value that bypasses Security
        // Rules. This should only ever be used in withSecurityRulesDisabled.
        // If you're reading this and thinking about doing this in your own app / tests / scripts, think
        // twice. Instead, just use withSecurityRulesDisabled for unit testing OR connect your Firebase
        // Admin SDKs to the emulators for integration testing via environment variables.
        // See: https://firebase.google.com/docs/emulator-suite/connect_firestore#admin_sdks
        const context = this.createContext('owner');
        try {
            await callback(context);
        }
        finally {
            // We eagerly clean up this context to actively prevent misuse outside of the callback, e.g.
            // storing the context in a variable.
            context.cleanup();
            this.contexts.delete(context);
        }
    }
    createContext(authToken) {
        const context = new RulesTestContextImpl(this.projectId, this.emulators, authToken);
        this.contexts.add(context);
        return context;
    }
    clearDatabase() {
        this.checkNotDestroyed();
        return this.withSecurityRulesDisabled(context => {
            return context.database().ref('/').set(null);
        });
    }
    async clearFirestore() {
        this.checkNotDestroyed();
        assertEmulatorRunning(this.emulators, 'firestore');
        const resp = await fetch(makeUrl(this.emulators.firestore, `/emulator/v1/projects/${this.projectId}/databases/(default)/documents`), {
            method: 'DELETE'
        });
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
    }
    clearStorage() {
        this.checkNotDestroyed();
        return this.withSecurityRulesDisabled(async (context) => {
            const { items } = await context.storage().ref().listAll();
            await Promise.all(items.map((item) => {
                return item.delete();
            }));
        });
    }
    async cleanup() {
        this.destroyed = true;
        this.contexts.forEach(context => {
            context.envDestroyed = true;
            context.cleanup();
        });
        this.contexts.clear();
    }
    checkNotDestroyed() {
        if (this.destroyed) {
            throw new Error('This RulesTestEnvironment has already been cleaned up. ' +
                '(This may indicate a leak or missing `await` in your test cases. If you do intend to ' +
                'perform more tests, please call cleanup() later or create another RulesTestEnvironment.)');
        }
    }
}
/**
 * An implementation of {@code RulesTestContext}. This is private to hide the constructor,
 * which should never be directly called by the developer.
 * @private
 */
class RulesTestContextImpl {
    constructor(projectId, emulators, authToken) {
        this.projectId = projectId;
        this.emulators = emulators;
        this.authToken = authToken;
        this.destroyed = false;
        this.envDestroyed = false;
    }
    cleanup() {
        var _a;
        this.destroyed = true;
        (_a = this.app) === null || _a === void 0 ? void 0 : _a.delete();
        this.app = undefined;
    }
    firestore(settings) {
        assertEmulatorRunning(this.emulators, 'firestore');
        const firestore = this.getApp().firestore();
        if (settings) {
            firestore.settings(settings);
        }
        firestore.useEmulator(this.emulators.firestore.host, this.emulators.firestore.port, { mockUserToken: this.authToken });
        return firestore;
    }
    database(databaseURL) {
        assertEmulatorRunning(this.emulators, 'database');
        if (!databaseURL) {
            const url = makeUrl(this.emulators.database, '');
            // Make sure to set the namespace equal to projectId -- otherwise the RTDB SDK will by default
            // use `${projectId}-default-rtdb`, which is treated as a different DB by the RTDB emulator
            // (and thus WON'T apply any rules set for the `projectId` DB during initialization).
            url.searchParams.append('ns', this.projectId);
            databaseURL = url.toString();
        }
        const database = this.getApp().database(databaseURL);
        database.useEmulator(this.emulators.database.host, this.emulators.database.port, { mockUserToken: this.authToken });
        return database;
    }
    storage(bucketUrl = `gs://${this.projectId}`) {
        assertEmulatorRunning(this.emulators, 'storage');
        const storage = this.getApp().storage(bucketUrl);
        storage.useEmulator(this.emulators.storage.host, this.emulators.storage.port, { mockUserToken: this.authToken });
        return storage;
    }
    getApp() {
        if (this.envDestroyed) {
            throw new Error('This RulesTestContext is no longer valid because its RulesTestEnvironment has been ' +
                'cleaned up. (This may indicate a leak or missing `await` in your test cases.)');
        }
        if (this.destroyed) {
            throw new Error('This RulesTestContext is no longer valid. When using withSecurityRulesDisabled, ' +
                'make sure to perform all operations on the context within the callback function and ' +
                'return a Promise that resolves when the operations are done.');
        }
        if (!this.app) {
            this.app = firebase.initializeApp({ projectId: this.projectId }, `_Firebase_RulesUnitTesting_${Date.now()}_${Math.random()}`);
        }
        return this.app;
    }
}
function assertEmulatorRunning(emulators, emulator) {
    if (!emulators[emulator]) {
        if (emulators.hub) {
            throw new Error(`The ${emulator} emulator is not running (according to Emulator hub). To force ` +
                'connecting anyway, please specify its host and port in initializeTestEnvironment({...}).');
        }
        else {
            throw new Error(`The host and port of the ${emulator} emulator must be specified. (You may wrap the test ` +
                "script with `firebase emulators:exec './your-test-script'` to enable automatic " +
                `discovery, or specify manually via initializeTestEnvironment({${emulator}: {host, port}}).`);
        }
    }
}

/**
 * @license
 * Copyright 2021 Google LLC
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
 * @private
 */
async function loadDatabaseRules(hostAndPort, databaseName, rules) {
    const url = makeUrl(hostAndPort, '/.settings/rules.json');
    url.searchParams.append('ns', databaseName);
    const resp = await fetch(url, {
        method: 'PUT',
        headers: { Authorization: 'Bearer owner' },
        body: rules
    });
    if (!resp.ok) {
        throw new Error(await resp.text());
    }
}
/**
 * @private
 */
async function loadFirestoreRules(hostAndPort, projectId, rules) {
    const resp = await fetch(makeUrl(hostAndPort, `/emulator/v1/projects/${projectId}:securityRules`), {
        method: 'PUT',
        body: JSON.stringify({
            rules: {
                files: [{ content: rules }]
            }
        })
    });
    if (!resp.ok) {
        throw new Error(await resp.text());
    }
}
/**
 * @private
 */
async function loadStorageRules(hostAndPort, rules) {
    const resp = await fetch(makeUrl(hostAndPort, '/internal/setRules'), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rules: {
                files: [{ name: 'storage.rules', content: rules }]
            }
        })
    });
    if (!resp.ok) {
        throw new Error(await resp.text());
    }
}

/**
 * @license
 * Copyright 2021 Google LLC
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
 * Initializes a test environment for rules unit testing. Call this function first for test setup.
 *
 * Requires emulators to be running. This function tries to discover those emulators via environment
 * variables or through the Firebase Emulator hub if hosts and ports are unspecified. It is strongly
 * recommended to specify security rules for emulators used for testing. See minimal example below.
 *
 * @param config - the configuration for emulators. Most fields are optional if they can be discovered
 * @returns a promise that resolves with an environment ready for testing, or rejects on error.
 * @public
 * @example
 * ```javascript
 * const testEnv = await initializeTestEnvironment({
 *   firestore: {
 *     rules: fs.readFileSync("/path/to/firestore.rules", "utf8"), // Load rules from file
 *     // host and port can be omitted if they can be discovered from the hub.
 *   },
 *   // ...
 * });
 * ```
 */
async function initializeTestEnvironment(config) {
    var _a, _b, _c;
    const projectId = config.projectId || process.env.GCLOUD_PROJECT;
    if (!projectId) {
        throw new Error('Missing projectId option or env var GCLOUD_PROJECT! Please specify the projectId either ' +
            'way.\n(A demo-* projectId is strongly recommended for unit tests, such as "demo-test".)');
    }
    const hub = getEmulatorHostAndPort('hub', config.hub);
    let discovered = hub ? Object.assign(Object.assign({}, (await discoverEmulators(hub))), { hub }) : undefined;
    const emulators = {};
    if (hub) {
        emulators.hub = hub;
    }
    for (const emulator of SUPPORTED_EMULATORS) {
        const hostAndPort = getEmulatorHostAndPort(emulator, config[emulator], discovered);
        if (hostAndPort) {
            emulators[emulator] = hostAndPort;
        }
    }
    if ((_a = config.database) === null || _a === void 0 ? void 0 : _a.rules) {
        assertEmulatorRunning(emulators, 'database');
        await loadDatabaseRules(emulators.database, projectId, config.database.rules);
    }
    if ((_b = config.firestore) === null || _b === void 0 ? void 0 : _b.rules) {
        assertEmulatorRunning(emulators, 'firestore');
        await loadFirestoreRules(emulators.firestore, projectId, config.firestore.rules);
    }
    if ((_c = config.storage) === null || _c === void 0 ? void 0 : _c.rules) {
        assertEmulatorRunning(emulators, 'storage');
        await loadStorageRules(emulators.storage, config.storage.rules);
    }
    return new RulesTestEnvironmentImpl(projectId, emulators);
}
const SUPPORTED_EMULATORS = ['database', 'firestore', 'storage'];

/**
 * @license
 * Copyright 2021 Google LLC
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
async function withFunctionTriggersDisabled(fnOrHub, maybeFn) {
    let hub;
    if (typeof fnOrHub === 'function') {
        maybeFn = fnOrHub;
        hub = getEmulatorHostAndPort('hub');
    }
    else {
        hub = getEmulatorHostAndPort('hub', fnOrHub);
        if (!maybeFn) {
            throw new Error('The callback function must be specified!');
        }
    }
    if (!hub) {
        throw new Error('Please specify the Emulator Hub host and port via arguments or set the environment ' +
            `variable ${EMULATOR_HOST_ENV_VARS.hub}!`);
    }
    hub.host = fixHostname(hub.host);
    makeUrl(hub, '/functions/disableBackgroundTriggers');
    // Disable background triggers
    const disableRes = await fetch(makeUrl(hub, '/functions/disableBackgroundTriggers'), {
        method: 'PUT'
    });
    if (!disableRes.ok) {
        throw new Error(`HTTP Error ${disableRes.status} when disabling functions triggers, are you using firebase-tools 8.13.0 or higher?`);
    }
    // Run the user's function
    let result = undefined;
    try {
        result = await maybeFn();
    }
    finally {
        // Re-enable background triggers
        const enableRes = await fetch(makeUrl(hub, '/functions/enableBackgroundTriggers'), {
            method: 'PUT'
        });
        if (!enableRes.ok) {
            throw new Error(`HTTP Error ${enableRes.status} when enabling functions triggers, are you using firebase-tools 8.13.0 or higher?`);
        }
    }
    // Return the user's function result
    return result;
}
/**
 * Assert the promise to be rejected with a "permission denied" error.
 *
 * Useful to assert a certain request to be denied by Security Rules. See example below.
 * This function recognizes permission-denied errors from Database, Firestore, and Storage JS SDKs.
 *
 * @param pr - the promise to be asserted
 * @returns a Promise that is fulfilled if pr is rejected with "permission denied". If pr is
 *          rejected with any other error or resolved, the returned promise rejects.
 * @public
 * @example
 * ```javascript
 * const unauthed = testEnv.unauthenticatedContext();
 * await assertFails(get(doc(unauthed.firestore(), '/private/doc'), { ... });
 * ```
 */
function assertFails(pr) {
    return pr.then(() => {
        return Promise.reject(new Error('Expected request to fail, but it succeeded.'));
    }, (err) => {
        var _a, _b;
        const errCode = ((_a = err === null || err === void 0 ? void 0 : err.code) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        const errMessage = ((_b = err === null || err === void 0 ? void 0 : err.message) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
        const isPermissionDenied = errCode === 'permission-denied' ||
            errCode === 'permission_denied' ||
            errMessage.indexOf('permission_denied') >= 0 ||
            errMessage.indexOf('permission denied') >= 0 ||
            // Storage permission errors contain message: (storage/unauthorized)
            errMessage.indexOf('unauthorized') >= 0;
        if (!isPermissionDenied) {
            return Promise.reject(new Error(`Expected PERMISSION_DENIED but got unexpected error: ${err}`));
        }
        return err;
    });
}
/**
 * Assert the promise to be successful.
 *
 * This is a no-op function returning the passed promise as-is, but can be used for documentational
 * purposes in test code to emphasize that a certain request should succeed (e.g. allowed by rules).
 *
 * @public
 * @example
 * ```javascript
 * const alice = testEnv.authenticatedContext('alice');
 * await assertSucceeds(get(doc(alice.firestore(), '/doc/readable/by/alice'), { ... });
 * ```
 */
function assertSucceeds(pr) {
    return pr;
}

export { assertFails, assertSucceeds, initializeTestEnvironment, withFunctionTriggersDisabled };
//# sourceMappingURL=index.esm.js.map
