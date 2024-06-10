import { setupWorker } from "msw/browser";
import { setupHandlers } from "./handlers";
import { UserTable } from "./db";

export const worker = setupWorker(...setupHandlers(UserTable));
