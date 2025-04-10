import { LogCleaner } from "../utils/logCleaner.js";
export function initializeLogger() {
    const logCleaner = new LogCleaner();
    logCleaner.start();
    return logCleaner;
}
