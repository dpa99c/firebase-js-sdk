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
import { EmulatorConfig, HostAndPort } from '../public_types';
/**
 * Use the Firebase Emulator hub to discover other running emulators.
 *
 * @param hub the host and port where the Emulator Hub is running
 * @private
 */
export declare function discoverEmulators(hub: HostAndPort, fetchImpl?: typeof fetch): Promise<DiscoveredEmulators>;
/**
 * @private
 */
export interface DiscoveredEmulators {
    database?: HostAndPort;
    firestore?: HostAndPort;
    storage?: HostAndPort;
    hub?: HostAndPort;
}
/**
 * @private
 */
export declare function getEmulatorHostAndPort(emulator: keyof DiscoveredEmulators, conf?: EmulatorConfig, discovered?: DiscoveredEmulators): {
    host: string;
    port: any;
} | undefined;
export declare const EMULATOR_HOST_ENV_VARS: {
    database: string;
    firestore: string;
    hub: string;
    storage: string;
};
