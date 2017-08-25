<h1 align="center">
  <br>
  RemoteLib
  <br>
  <br>
</h1>

<h4 align="center">Create a library and share it remotely with other peers via <strong>ANY</strong> stream object.</h4>

<p align="center">
<a href="https://www.npmjs.org/package/remote-lib"><img src="http://img.shields.io/npm/v/remote-lib.svg" alt="View On NPM"></a>
<a href="https://travis-ci.org/remotelib/remote-lib"><img src="https://travis-ci.org/remotelib/remote-lib.svg?branch=master" alt="Build Status"></a>
<a href="https://david-dm.org/remotelib/remote-lib"><img src="https://david-dm.org/remotelib/remote-lib.svg" alt="Dependency Status"></a>
<a href="https://codecov.io/gh/remotelib/remote-lib"><img src="https://codecov.io/gh/remotelib/remote-lib/branch/master/graph/badge.svg" alt="codecov"></a>
<a href="LICENSE"><img src="https://img.shields.io/npm/l/remote-lib.svg" alt="License"></a>
</p>
<br>

**RemoteLib** is library that can be shared remotely with other peers without worrying for API interfaces or RPC integration. Using only a [Duplex stream](https://nodejs.org/api/stream.html#stream_class_stream_duplex) such as 
[TCP soocket](https://nodejs.org/api/net.html#net_net_createconnection_options_connectlistener), 
[WebSocket](https://www.npmj.com/package/websocket-stream) or even 
[WebRTC DataChannel](https://www.npmjs.com/package/simple-peer), your users 
will be able to use your code remotely exactly as you write it. Including calling functions with 
callbacks, [Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise), class inheritance and more. See [usage](#usage) for some examples.

### Install
```
npm install remote-lib
```

### Ways to help
* **Join us in [Gitter](https://gitter.im/remotelib/Lobby)** to help with development or to hang out with some mad science hackers :)
* **[Create a new issue](https://github.com/remotelib/remote-lib/issues/new)** to report bugs
* **[Fix an issue](https://github.com/remotelib/remote-lib/issues?state=open)**. RemoteLib is an OPEN Open Source Project!

### API Documentation

**[See the API Reference bellow](#api-reference)**.


### Usage
#### On the server
```js
const net = require('net');
const { Library } = require('remote-lib');

// You can put any object, class or instance under the context and it will be proxied to the
// remote peer automatically
const library = new Library({
  // Static vars
  foo: 'bar',

  // Dynamic functions
  getRandom: () => Math.random(),

  // Async functions
  getData: () =>
    new Promise(resolve =>
      setTimeout(() => resolve({ data: 'Tada!' }), 100),
    ),

  // Classes and objects
  myThings: new Set(['car', 'keys', 'pizza']),
});

// Create a server and serve each client the context remotely
const server = net.createServer(socket => {
  library.serve(socket);
});

// Bind on port 3000
server.listen(3000);
```

#### On the client
```js
const net = require('net');
const { RemoteLibrary } = require('remote-lib');

// Connect to the server and get a stream
const socket = net.createConnection(3000);

// Create the remote library
const remoteLibrary = new RemoteLibrary(socket);

// Get the remote "foo"
remoteLibrary.foo.then(value => {
  // value === 'bar'
});

// Run the remote function "getRandom"
remoteLibrary.getRandom().then(value => {
  // `value` is random number
});

// Run the remote async function "getData"
remoteLibrary.getData().then(value => {
  // value === { data: 'Tada!' }
});

// Get remote instance set "myThings"
remoteLibrary.myThings.then(async set => {
  set instanceof Set; // true

  // All instance methods require await or #then() when calling
  await set.has('keys'); // true
  await set.has('cat'); // false

  // Change the remote instance
  await set.add('dog');
  await set.has('dog'); // true
});
```

### API Reference
Remote-lib is build with many small sub-packages, each package implement a small part of this library.
You can read here the [full API Reference](http://www.remotelib.com/identifiers.html).

| module | version | description |
|---|---|---|
| **[remote-lib](packages/remote-lib)** | [![view on npm](http://img.shields.io/npm/v/remote-lib.svg)](https://www.npmjs.org/package/remote-lib) | A high level API for creating remote libraries.
| **[remote-context](packages/remote-context)** | [![view on npm](http://img.shields.io/npm/v/remote-context.svg)](https://www.npmjs.org/package/remote-context) | The core of `remote-lib`, creating and serving remote context.
| **[remote-environment](packages/remote-environment)** | [![view on npm](http://img.shields.io/npm/v/remote-environment.svg)](https://www.npmjs.org/package/remote-environment) | A shared environment context between remote peers.
| **[remote-instance](packages/remote-instance)** | [![view on npm](http://img.shields.io/npm/v/remote-instance.svg)](https://www.npmjs.org/package/remote-instance) | A stream transformer that can parse and `construct` instances remotely.
| **[remote-protocol](packages/remote-protocol)** | [![view on npm](http://img.shields.io/npm/v/remote-protocol.svg)](https://www.npmjs.org/package/remote-protocol) | The core of `remote-context` protocol.
| **[reference-context](packages/reference-context)** | [![view on npm](http://img.shields.io/npm/v/reference-context.svg)](https://www.npmjs.org/package/reference-context) | Virtual context implementation on vanilla Javascript.
  
<br />
<br />

### License

&copy; 2017 Moshe Simantov

Licensed under the [Apache License, Version 2.0](LICENSE).
