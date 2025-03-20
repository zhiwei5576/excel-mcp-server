import { LogCleaner } from "../utils/logCleaner.js";


export function initializeLogger() {
    const logCleaner = new LogCleaner(7);
    logCleaner.start(24);
    
    return logCleaner;
}