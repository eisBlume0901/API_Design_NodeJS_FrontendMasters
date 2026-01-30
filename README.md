- Notes: https://api-design-with-node-v5.super.site/


- npm install [package-name] - to install dependencies.
- npm uninstall [package-name] - to uninstall dependencies.
- npm run dev - only works when the scripts field in package.json has a dev command. It runs the command defined there.
- npm start - only works when the scripts field in package.json has a start command. It runs the command defined there.
- main of package.json specifies the entry point of the application (e.g., "main": "index.js or "main": "src/index.js").
- npx gitignore node - to generate a .gitignore file for Node.js projects.
- npm install -D typescript @types/node - to install TypeScript and Node.js type definitions as development dependencies.
- npx tsc --init - to create a tsconfig.json file for TypeScript configuration.
- npm install @epic-web/remember - to install @epic-web/remember package for singleton caching (caching database connection as pool)
- npm install -D drizzle-kit - to install drizzle-kit as a dev dependency (since we are using it to test database CRUD)
- npm install drizzle-orm - to install drizzle-orm
- npm install bcrypt - to install bcrypt for password hashing
- npm install @types/bcrypt - to install TypeScript type definitions for bcrypt

Test related commands:
- npm install -D supertest @types/supertest - the -D flag installs supertest as a development dependency, supertest is used for testing HTTP servers.
- npm install -D jest @types/jest ts-jest - to install Jest testing framework, its TypeScript type definitions, and ts-jest for running TypeScript tests with Jest as development dependencies.
- npm install -D vitest


Middleware related commands
- npm install helmet - helmet helps secure Express apps by setting various HTTP headers.
- npm install cors - to enable Cross-Origin Resource Sharing (CORS) in Express applications.
- npm install morgan - morgan is an HTTP request logger middleware for Node.js applications (logger means it logs requests to the console or a file for debugging and monitoring purposes).


Terms Learned:
1. Payload 
- data sent by the client to the server in an HTTP request, typically in 
- the body of POST, PUT, or PATCH requests
- can include JSON, XML, form data, or binary data
2. Server Hanging
- issue when the server does not exit or stop responding because the process still has 
- something keeping the event loop alive, or it is stuck waiting forever
- in relation to http verbs, it can happen if there are open connections or pending requests that prevent the server from shutting down properly.
3. Middleware
- functions that have access to the request and response objects in an Express application
- can modify the request and response objects, end the request-response cycle, or call the next middleware in the stack
- commonly used for tasks like logging, authentication, error handling, and parsing request bodies
- a router handler can return a JSON response (expected response from the client) and a plain "return" statement 
- (which is used to stop further execution of code in that handler opposite to next() which passes control to the next middleware)
4. CORS Preflight
- an initial request made by the browser using the OPTIONS HTTP verb to determine if the actual request is safe to send to the server
6. High Order Function
- a function that takes another function as an argument or returns a function as its result


IMPORTANT 
1. Route order matters, the specific routes should be defined before the general ones to prevent unintended matches.
- /profile is more specific to /:id because profile matches to exactly one literal path segment while :id can match any value.
2. Node requires explicit file extensions when using ES modules (like putting .ts at the end of the import)
3. Nesting routes by using other's routers, for instance habitRouter is nested inside userRouter 
- child router like habitRouter can access parameters defined in the parent router like userId from userRouter
4. Async/Await should be handled properly by implementing try/catch blocks to manage errors effectively.
5. Request/Respond - can only respond to one request and a request can only get one response. 
6. .json() vs .send() + .setHeader - .json() automatically sets the Content-Type header to application/json and serializes the object to a JSON string.
7. .next() - used to pass control to the next middleware function in the stack (useful for chaining multiple middleware functions together)
9. Passing an argument to next() indicates an error occurred and skips all remaining non-error handling middleware, passing control to the error-handling middleware.
10. A handler should always end with return or next() to prevent hanging requests.
11. CORS is only relevant to browsers, not server-to-server communication or tools like terminals like Postman.
12. Pattern for putting .next() function
- Go to the topic: Building Validation Middleware https://api-design-with-node-v5.super.site/3-middleware
- You always need to create a separate TypeScript file for your middleware functions to keep your code organized and maintainable.
- .next() should not be called inside a handler
13. Closest counterpart of Zod Validation in Django REST is Serializer Validation
14. Database IDs should always be UUID instead of auto-incrementing integers for better security and scalability.
15. Params vs Query 
- Params - part of the URL path (dynamic segments) used to identify specific resources
- Query - part of the URL after the ?, often a key-value pair used for filtering, sorting, or pagination
16. Handling async/await (such as databases or schedulers) 
- can create one async handler (OOP concept is Factory) for all since creating each try/catch is repetitive
17. Handling background work (asynchronous) after responding a request can cause race conditions
18. Create a script for db too (see package.json) to easily call (by shortening its command or making a command familiar with you) database related commands like generate and seed
- "db:generate": "drizzle-kit generate", - compares current Drizzle schema to the last known state and writes migrations to migrations folder
- useful for database versioning
- "db:push": "drizzle-kit push", - pushes the current schema directly to the database (no migrations)
- useful for prototyping and quick iteration
- "db:migrate": "drizzle-kit migrate", - runs generated migrations against the database
- db:generate -> db:migrate to properly create a database versioning and populate the database with the schema
- always use db:push first before db:generate and db:migrate for testing because it will be harder to
- maintain (as every experiment, creating an extra migration might make you have the need to delete, rebase, fix
- "db:studio": "drizzle-kit studio", - opens Drizzle Studio to inspect and manage database
- "db:seed": "node src/db/seed.ts", - populate the database schemas with an initial/dummy/test data (create seed.ts first)
- To run a another seed (scenario-specific) script, go to package.json and change the source path
- Make sure that you have drizzle.config.ts and the imports are installed so that there will be no issues


Project Initialization
1. Install necessary packages and dependencies
- can separate dev dependencies and regular dependencies (package.json)
2. Structure the project directories and files
- Route Organization Strategies
- GitHub Branch Strategies and Workflows
- Environment Variables Management (with Zod for RUNTIME validation)
- Separate environment for development, test, and production
3. Setup Gitignore
4. Setup TypeScript configuration (tsconfig.json)
5. Setup package.json scripts
- npm run dev - to start the development server with automatic restarts on file changes
- npm start - to start the production server
- npm test - to run the test suite


Database-Related Commands and Notes with Neon Postgres
- Migrations is a database version control
- Create a new folder called db and create a schema.ts
- Import pgTableCreator to create tables and also import other data types
- Use Drizzle ORM because it's syntax is aligned with typescript/javascript structure
- Use Relations to Join two or more different tables (by specifying if it is one-to-one, one-to-many, many-to-many)
- Zod checks runtime validation (validated data at real time - running)
- TypeScript checks compile time validation
- Use Pooling to establish pre-existing connection for better performance and scalability and reduce connection overhead per request
- Disadvantages of pooling: every restart of the development server it would cause a new pool and old pool would still exists
- @epic-web/remember allows us to use remember() function which acts as a singleton cache 
  - A singleton cache is a pattern where you keep one shared instance of some cached value for the entire running process,
- instead of recreating it on every import/reload/call
- Database pooling is not the same as caching (It is only focused on connection reuse not caching)


Security(Authenticate, Authorize)
- https://api-design-with-node-v5.super.site/7-user-signup-with-password
- Passwords (using bcrypt): Combine user password + random salt -> add encryption algorithm -> repeat hashing process multiple times (2^n rounds)
- JWT Tokens are stateless (server [database] does not need to store a session record for them) wherein user info (usually the id, role, scope 
- DO NOT SEND THE PASSWORD OR ANY SENSITIVE INFO HERE) are signed
- JWT Tokens cannot be revoked easily (only setting the expiration date-time)
- API Key - to identify applications and apply quotas or limits
- JWT Tokens - to authenticate users and sessions and carry authorization claims
- After user sign up, generate JSON Web Token
- Hashed passwords should be put in an async function so that it would prevent timing attacks 
- which measure hashing time to gain insights about the password or system


Express vs Django Comparison
- Express Controller somewhat similar to Django Views
- Express Router somewhat similar to Django URLs
- TypeScript somewhat similar to Serializers in Django REST Framework
- Express Drizzle ORM somewhat similar to Django ORM


