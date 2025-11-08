# SillyTavern Tracker Extension - AI Coding Guidelines

## Architecture Overview

This is a SillyTavern extension that automatically generates and manages scene trackers for roleplay conversations. The extension uses a modular architecture with event-driven integration.

**Core Components:**
- `src/tracker.js` - Main tracker logic and prompt injection
- `src/generation.js` - AI-powered tracker generation with templating
- `src/events.js` - Event handlers for chat lifecycle integration
- `src/ui/` - Interface components (TrackerInterface, modals, previews)
- `src/settings/` - Configuration management with migration support
- `lib/` - Utilities (interconnection, utils, YAML parser)

## Key Patterns & Conventions

### Event-Driven Integration
```javascript
// Hook into SillyTavern events
eventSource.on(event_types.CHAT_CHANGED, eventHandlers.onChatChanged);
eventSource.on(event_types.GENERATION_AFTER_COMMANDS, eventHandlers.onGenerateAfterCommands);
```

### Extension Prompt Injection
```javascript
// Inject trackers into AI context
await setExtensionPrompt("tracker", trackerYAML, 1, position, true, EXTENSION_PROMPT_ROLES.SYSTEM);
```

### Generation Mutex Coordination
```javascript
// Coordinate with other extensions
await generationCaptured(); // Check/capture generation mutex
await releaseGeneration(); // Release when done
```

### Logging Hierarchy
```javascript
log("Info message");           // Always visible
warn("Warning message");       // Console warnings
error("Error message");        // Console errors
debug("Debug info");           // Only when extensionSettings.debugMode = true
```

### Settings Migration Pattern
```javascript
// In initSettings(): merge old settings with defaults, preserve allowed keys
const allowedKeys = ["enabled", "generateContextTemplate", /* ... */];
const newSettings = {
    ...defaultSettings,
    ...Object.fromEntries(allowedKeys.map(key => [key, currentSettings[key] || defaultSettings[key]]))
};
```

## Slash Commands

**Core Commands:**
- `/generate-tracker [message]` - Generate tracker for specific/last message
- `/tracker-override <tracker>` - Override next generation's tracker
- `/save-tracker [message] <tracker>` - Save tracker to message
- `/get-tracker [message]` - Retrieve tracker from message
- `/tracker-state [enabled]` - Toggle extension state

## Generation Modes

**Inline Mode:** Direct tracker generation in conversation flow
**Single-Stage:** One-step tracker generation with context
**Two-Stage:** Context generation → tracker generation pipeline

## Data Formats

**Tracker Structure:** JSON/YAML with configurable schema from `extensionSettings.trackerDef`
**Templates:** Handlebars-style `{{variable}}` replacement with conditional blocks like `{{#if condition}}...{{/if}}`
**Field Types:** STRING, ARRAY, OBJECT, FOR_EACH_OBJECT, FOR_EACH_ARRAY, ARRAY_OBJECT

## UI Patterns

**Modal System:** Use `TrackerEditorModal` for complex editing, follow existing modal patterns
**Preview System:** `TrackerPreviewManager` handles live tracker previews in chat
**Interface Components:** Extend `TrackerContentRenderer` for custom field displays

## Development Workflow

1. **Enable Debug Mode:** Set `extensionSettings.debugMode = true` for detailed logging
2. **Test Integration:** Use generation mutex events to coordinate with other extensions
3. **Validate Settings:** Always check `await isEnabled()` before operations
4. **Handle Migration:** Update settings initialization when adding new config options

## Common Integration Points

- **Chat Events:** `CHAT_CHANGED`, `MESSAGE_RENDERED`, `GENERATION_AFTER_COMMANDS`
- **Extension Settings:** Access via `extension_settings.tracker` (lowercase)
- **Prompt System:** Inject via `setExtensionPrompt()` with proper roles and positioning
- **Generation Flow:** Respect `generationCaptured()` mutex for coordination

## File Organization

- `src/` - Core business logic
- `lib/` - Shared utilities and cross-cutting concerns
- `ui/` - Interface components and rendering
- `settings/` - Configuration management
- `html/` - UI templates and settings panels
- `sass/` - Styling (compiles to `style.css`)

## Key Files to Reference

- `src/tracker.js` - Core tracker operations and prompt injection
- `src/generation.js` - AI generation pipeline and templating
- `src/settings/settings.js` - Configuration management
- `lib/utils.js` - Logging and utility functions
- `lib/interconnection.js` - Extension coordination patterns

## Advanced Patterns

### Profile/Preset Switching
```javascript
// Temporarily switch connection profiles for generation
await changeProfileAndCompletionPreset(extensionSettings.selectedProfile, extensionSettings.selectedCompletionPreset);
// ... perform generation ...
await changeProfileAndCompletionPreset(preselectedProfile, preselectedPreset);
```

### Tracker Data Reconciliation
```javascript
// Merge tracker updates with existing data
const updatedTracker = updateTracker(lastTracker, tracker, extensionSettings.trackerDef, true, OUTPUT_FORMATS.JSON, true);
```

### Message Processing
```javascript
// Extract clean message text (remove existing trackers)
const messageText = message.mes.replace(/<tracker>[\s\S]*?<\/tracker>/g, "").trim();
```

### Field Inclusion Logic
```javascript
// Control which tracker fields to include
const includeFields = FIELD_INCLUDE_OPTIONS.DYNAMIC; // DYNAMIC, STATIC, or ALL
```

### Data Handler Patterns
```javascript
// Reconcile tracker data with schema
const reconciledTracker = {};
reconcileTracker(tracker, backendObject, reconciledTracker, extraFields, includeFields);

// Update existing tracker with new data
const updatedTracker = updateTracker(lastTracker, tracker, extensionSettings.trackerDef, true, OUTPUT_FORMATS.JSON, true);

// Check if tracker has meaningful content
const hasTracker = trackerExists(tracker, extensionSettings.trackerDef);
```

### Error Handling
```javascript
try {
    const tracker = await generateTracker(mesNum, includedFields);
    if (!tracker) throw new Error("Generation failed");
} catch (e) {
    error("Failed to generate tracker", e);
    toastr.error("Failed to generate tracker");
}
```</content>
<parameter name="filePath">e:\Project\SillyTavern-Tracker\.github\copilot-instructions.md