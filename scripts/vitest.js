/*
 * Starts Vitest. On Windows, a working folder with a lower-case drive letter (c:\…, which
 * VS Code's terminal often uses) makes Vitest load itself twice and fail with
 * "Cannot read properties of undefined (reading 'config')". Switching to the upper-case
 * form first, and loading Vitest from there, avoids that. Other systems are unaffected.
 */
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

process.chdir(process.cwd().replace(/^[a-z]:/, (drive) => drive.toUpperCase()));
await import(pathToFileURL(join(process.cwd(), 'node_modules/vitest/vitest.mjs')).href);
