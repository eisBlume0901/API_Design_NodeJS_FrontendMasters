- Notes: https://api-design-with-node-v5.super.site/

- npm install [package-name] - to install dependencies.
- npm uninstall [package-name] - to uninstall dependencies.
- npm run dev - only works when the scripts field in package.json has a dev command. It runs the command defined there.
- npm start - only works when the scripts field in package.json has a start command. It runs the command defined there.
- main of package.json specifies the entry point of the application (e.g., "main": "index.js or "main": "src/index.js").
- npx gitignore node - to generate a .gitignore file for Node.js projects.
- npm install -D typescript @types/node - to install TypeScript and Node.js type definitions as development dependencies.
- npx tsc --init - to create a tsconfig.json file for TypeScript configuration.

Test related commands:
- npm install -D supertest @types/supertest - the -D flag installs supertest as a development dependency, supertest is used for testing HTTP servers.
- npm install -D jest @types/jest ts-jest - to install Jest testing framework, its TypeScript type definitions, and ts-jest for running TypeScript tests with Jest as development dependencies.
- npm install -D vitest 

Terms Learned:
1. Payload 
- data sent by the client to the server in an HTTP request, typically in 
- the body of POST, PUT, or PATCH requests
- can include JSON, XML, form data, or binary data
2. Server Hanging
- issue when the server does not exit or stop responding because the process still has 
- something keeping the event loop alive, or it is stuck waiting forever
- in relation to http verbs, it can happen if there are open connections or pending requests that prevent the server from shutting down properly.


IMPORTANT 
1. Route order matters, the specific routes should be defined before the general ones to prevent unintended matches.
- /profile is more specific to /:id because profile matches to exactly one literal path segment while :id can match any value.
2. Node requires explicit file extensions when using ES modules (like putting .ts at the end of the import)
3. Nesting routes by using other's routers, for instance habitRouter is nested inside userRouter 
- child router like habitRouter can access parameters defined in the parent router like userId from userRouter
4. Async/Await should be handled properly by implementing try/catch blocks to manage errors effectively.