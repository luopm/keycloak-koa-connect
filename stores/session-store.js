/*
 * Copyright 2016 Red Hat Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
'use strict';

function SessionStore() {
}

SessionStore.TOKEN_KEY = 'keycloak-token';

SessionStore.prototype.get = (ctx) => ctx.session[SessionStore.TOKEN_KEY];


let store = (grant) => {
  return (ctx) => {
    ctx.session[SessionStore.TOKEN_KEY] = grant.__raw;
  };
};

let unstore = (ctx) => {
  delete ctx.session[SessionStore.TOKEN_KEY];
};

// clear app session by sessionId
SessionStore.prototype.clear = (ctx, sessionId) => {

  if( ctx.app.config && ctx.app.config.session && 
    ctx.app.config.session.store ) {
      
    const store = ctx.app.config.session.store;
    const session = store.get(sessionId);
    if(!session) {
      console.log("Session has clear!");
      return ; 
    }

    delete session[SessionStore.TOKEN_KEY];
    store.set(sessionId, session)

  } else console.log("Please config SessionStore in default.config.js") 
 
}

SessionStore.prototype.wrap = (grant) => {
  if (grant) {
    grant.store = store(grant);
    grant.unstore = unstore;
  }
};

module.exports = SessionStore;
