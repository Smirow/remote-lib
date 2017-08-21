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

import ReferenceAction from './ReferenceAction';
import RemoteReferenceAction from './RemoteReferenceAction';

export default class LocalReferenceAction extends ReferenceAction {
  static fromArgumentsList(argumentsList) {
    // Switch to remote reference
    return new RemoteReferenceAction(...argumentsList);
  }

  fetch(session) {
    return session.get(this.reference);
  }

  release(session) {
    session.delete(this.reference);
    this.reference = null;
  }
}
