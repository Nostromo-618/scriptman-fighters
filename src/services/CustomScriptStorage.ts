/**
 * =============================================================================
 * CUSTOM SCRIPT STORAGE - LocalStorage and File Import/Export
 * =============================================================================
 * 
 * Handles saving/loading scripts from localStorage and JSON file import/export.
 */

import { DEFAULT_FIGHTER_SCRIPT } from '../templates/defaultFighterScript';
import { DEFAULT_FIGHTER_SCRIPT_B } from '../templates/defaultFighterScriptB';
import {
  STORAGE,
  SCRIPT_EXPORT_TYPE,
  SCRIPT_EXPORT_TYPE_LEGACY,
} from '../constants/storageKeys';

const LOCALSTORAGE_SCRIPT_KEY_PREFIX = STORAGE.SCRIPT_PREFIX;

/**
 * Returns the appropriate default script template for a given slot.
 * - slot1 (Script A): Strategic, logical fighter template
 * - slot2 (Script B): Chaotic, randomized fighter template
 * 
 * @param slotId - The slot identifier
 * @returns The default script template for that slot
 */
function getDefaultScriptForSlot(slotId: string): string {
    if (slotId === 'slot2') {
        return DEFAULT_FIGHTER_SCRIPT_B;
    }
    return DEFAULT_FIGHTER_SCRIPT;
}

/**
 * Saves user script to the browser's localStorage.
 * 
 * @param scriptCode - The JavaScript code to save
 * @param slotId - The slot identifier (e.g., 'slot1', 'slot2')
 */
export function saveScript(scriptCode: string, slotId: string = 'slot1'): void {
    try {
        localStorage.setItem(`${LOCALSTORAGE_SCRIPT_KEY_PREFIX}${slotId}`, scriptCode);
    } catch (storageError) {
        console.warn('Failed to save script to localStorage:', storageError);
    }
}

/**
 * Loads user script from the browser's localStorage.
 * If no saved script exists, returns the slot-specific default template:
 * - slot1 → Strategic fighter (DEFAULT_FIGHTER_SCRIPT)
 * - slot2 → Chaotic fighter (DEFAULT_FIGHTER_SCRIPT_B)
 * 
 * @param slotId - The slot identifier (e.g., 'slot1', 'slot2')
 * @returns The saved script code, or the default template if none exists
 */
export function loadScript(slotId: string = 'slot1'): string {
    try {
        const savedScript = localStorage.getItem(`${LOCALSTORAGE_SCRIPT_KEY_PREFIX}${slotId}`);
        if (savedScript) {
            return savedScript;
        }
    } catch (storageError) {
        console.warn('Failed to load script from localStorage:', storageError);
    }
    return getDefaultScriptForSlot(slotId);
}

/**
 * Exports the user's script as a downloadable JSON file.
 * 
 * @param scriptCode - The script code to export
 */
export function exportScript(scriptCode: string): void {
    const exportData = {
        version: 1,
        type: SCRIPT_EXPORT_TYPE,
        code: scriptCode,
        exportedAt: new Date().toISOString()
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const fileBlob = new Blob([jsonString], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(fileBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = 'custom-fighter-script.json';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(downloadUrl);
}

/**
 * Imports a script from a JSON string (typically from a file).
 * 
 * @param jsonString - The JSON content to parse (from reading a .json file)
 * @returns The extracted script code, or null if the format is invalid
 */
export function importScript(jsonString: string): string | null {
    try {
        const parsedData = JSON.parse(jsonString);

        const isValidType =
            parsedData.type === SCRIPT_EXPORT_TYPE ||
            parsedData.type === SCRIPT_EXPORT_TYPE_LEGACY;
        const hasCodeString = typeof parsedData.code === 'string';

        if (!isValidType || !hasCodeString) {
            return null;
        }

        return parsedData.code;

    } catch (parseError) {
        console.warn('Failed to parse imported script:', parseError);
        return null;
    }
}
