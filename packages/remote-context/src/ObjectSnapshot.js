/**
 * Copyright 2017 Moshe Simantov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import deepEqual from 'deep-equal';

const kPrototype = Symbol('prototype');
const kDescriptors = Symbol('descriptors');

export default class ObjectSnapshot {
  /**
   * Create a snapshot from the given object.
   *
   * @param {object|function} object The given object
   */
  constructor(object) {
    if (!(object instanceof Object)) return;

    /**
     * @type {Object}
     * @private
     */
    this[kPrototype] = Object.getPrototypeOf(object);

    /**
     * @type {object}
     * @private
     */
    this[kDescriptors] = Object.getOwnPropertyDescriptors(object);
  }

  /**
   * Update the local reference of this value with a new version of this snapshot value.
   *
   * @param {object|function} target The new version of this value
   * @param {LocalReference} localReference The local reference of this snapshot value
   * @return {void}
   */
  update(target, localReference) {
    if (this[kDescriptors] === undefined) return;

    const prototype = Object.getPrototypeOf(target);
    const descriptors = Object.getOwnPropertyDescriptors(target);

    // Update snapshot immediately before any other actions
    const oldPrototype = this[kPrototype];
    this[kPrototype] = prototype;
    const oldDescriptors = this[kDescriptors];
    this[kDescriptors] = descriptors;

    // Update prototype
    if (oldPrototype !== prototype) {
      localReference.setPrototypeOf(prototype);
    }

    // Remove deleted properties
    Object.keys(oldDescriptors).forEach(property => {
      const newDesc = descriptors[property];
      if (newDesc === undefined) {
        localReference.deleteProperty(property);
      }
    });

    // Add or update existed properties
    Object.keys(descriptors).forEach(property => {
      const newDesc = descriptors[property];
      const oldDesc = oldDescriptors[property];

      if (!deepEqual(newDesc, oldDesc, { strict: true })) {
        localReference.defineProperty(property, newDesc);
      }
    });
  }
}
