// #region YAML to JSON Conversion

/**
 * Converts a YAML string to a JSON string.
 * @param {string} yaml - The YAML string to convert.
 * @returns {string} - The resulting JSON string.
 */
export function yamlToJSON(yaml) {
	const lines = yaml.split("\n");
	let result = {};
	let path = [];
	let currentIndent = -1;
	let inMultilineString = false;
	let multilineBuffer = "";
	
	// Pre-compile regex patterns for better performance
	const commentRegex = /^\s*#/;
	const listItemRegex = /^\s*-\s+/;
	const quotedStringRegex = /^"(.*)"$/;
	const multilineStartRegex = /^"[^"]*$/;
	const inlineListRegex = /^\[.*\]$/;
	const emptyObjectRegex = /^\{\s*\}\s*$/;
	const emptyArrayRegex = /^\[\s*\]\s*$/;
	const objectKeyRegex = /^(.+):$/;

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];

		// Skip empty lines and comments (unless in multiline string)
		if (!inMultilineString && (line === "" || commentRegex.test(line))) continue;

		// Handle multiline string continuation
		if (inMultilineString) {
			multilineBuffer += "\n" + line;
			if (line.trimEnd().endsWith('"')) {
				// End of multiline string
				setValueAtPath(result, path, multilineBuffer.slice(1, -1)); // Remove outer quotes
				inMultilineString = false;
				multilineBuffer = "";
			}
			continue;
		}

		// Determine the indentation level
		const indent = line.search(/\S|$/);
		const trimmedLine = line.trim();
		const isListItem = listItemRegex.test(trimmedLine);
		const keyValueSeparator = line.indexOf(": ");

		if (isListItem) {
			// Handle list items - don't modify path, add to current array
			const value = trimmedLine.slice(2).trim();

			let currentArray = getValueAtPath(result, path);
			if (!Array.isArray(currentArray)) {
				setValueAtPath(result, path, []);
				currentArray = getValueAtPath(result, path);
			}

			const quotedMatch = quotedStringRegex.exec(value);
			if (quotedMatch) {
				currentArray.push(quotedMatch[1]); // Quoted string
			} else {
				currentArray.push(parseValue(value));
			}
		} else {
			// Adjust the path based on indentation for non-list items
			if (indent > currentIndent) {
				path.push("");
			} else if (indent < currentIndent) {
				path = path.slice(0, indent / 2 + 1);
			}
			currentIndent = indent;

			if (keyValueSeparator !== -1) {
				// Handle key-value pairs
				const key = line.slice(0, keyValueSeparator).trim();
				let value = line.slice(keyValueSeparator + 1).trim();
				
				// Remove inline comments more efficiently
				const commentIndex = value.indexOf('#');
				if (commentIndex !== -1 && !value.includes('"')) {
					value = value.substring(0, commentIndex).trim();
				}

				path[path.length - 1] = key;

				if (multilineStartRegex.test(value)) {
					// Start of a multiline string
					inMultilineString = true;
					multilineBuffer = value;
				} else if (emptyObjectRegex.test(value)) {
					// Empty object
					setValueAtPath(result, path, {});
				} else if (emptyArrayRegex.test(value)) {
					// Empty array
					setValueAtPath(result, path, []);
				} else if (inlineListRegex.test(value)) {
					// Inline list
					setValueAtPath(result, path, parseInlineList(value));
				} else {
					const quotedMatch = quotedStringRegex.exec(value);
					if (quotedMatch) {
						// Quoted string
						setValueAtPath(result, path, quotedMatch[1]);
					} else {
						// Plain value
						setValueAtPath(result, path, parseValue(value));
					}
				}
			} else {
				// Handle keys without values (objects)
				const objectMatch = objectKeyRegex.exec(trimmedLine);
				if (objectMatch) {
					const key = objectMatch[1].trim();
					path[path.length - 1] = key;
					setValueAtPath(result, path, {});
				}
			}
		}
	}

	return JSON.stringify(result, null, 2);
}

/**
 * Sets a value in an object at the specified path.
 * @param {object} obj - The object to modify.
 * @param {Array} path - An array representing the path to the value.
 * @param {*} value - The value to set.
 */
function setValueAtPath(obj, path) {
	let current = obj;
	const lastIndex = path.length - 1;
	for (let i = 0; i < lastIndex; i++) {
		const segment = path[i];
		if (!current[segment]) {
			current[segment] = {};
		}
		current = current[segment];
	}
	current[path[lastIndex]] = arguments[2]; // value is the third argument
}

/**
 * Retrieves a value from an object at the specified path.
 * @param {object} obj - The object to access.
 * @param {Array} path - An array representing the path to the value.
 * @returns {*} - The value at the specified path, or null if not found.
 */
function getValueAtPath(obj, path) {
	let current = obj;
	for (let i = 0; i < path.length; i++) {
		current = current[path[i]];
		if (current == null) return undefined;
	}
	return current;
}

/**
 * Parses a YAML value into a JavaScript value.
 * @param {string} value - The value to parse.
 * @returns {*} - The parsed value.
 */
function parseValue(value) {
	if (value === "true") return true;
	if (value === "false") return false;
	if (value === "null") return null;
	const num = Number(value);
	return isNaN(num) ? value : num;
}

/**
 * Parses an inline YAML list into a JavaScript array.
 * @param {string} listString - The inline list to parse.
 * @returns {Array} - The resulting JavaScript array.
 */
function parseInlineList(listString) {
	// Remove brackets and split by comma, then trim and remove quotes
	return listString
		.slice(1, -1) // Remove brackets
		.split(',') // Split by comma
		.map(item => {
			item = item.trim();
			if (item.startsWith('"') && item.endsWith('"')) {
				return item.slice(1, -1);
			}
			return parseValue(item);
		});
}

// #endregion

// #region JSON to YAML Conversion

/**
 * Converts a JSON object to a YAML string.
 * @param {object} json - The JSON object to convert.
 * @param {number} [indent=0] - The current indentation level.
 * @returns {string} - The resulting YAML string.
 */
export function jsonToYAML(json, indent = 0) {
	const lines = [];
	const indentation = "  ".repeat(indent);

	for (const key in json) {
		const value = json[key];

		if (typeof value === "object" && !Array.isArray(value) && value !== null) {
			// Handle nested objects
			if (Object.keys(value).length === 0) {
				lines.push(`${indentation}${key}: {}`);
			} else {
				lines.push(`${indentation}${key}:`);
				lines.push(jsonToYAML(value, indent + 1));
			}
		} else if (Array.isArray(value)) {
			// Handle arrays
			const arrayValues = value.map((item) => 
				item === null ? "null" :
				typeof item === "string" ? `"${item}"` : 
				item?.toString() ?? ""
			).join(", ");
			lines.push(`${indentation}${key}: [${arrayValues}]`);
		} else {
			// Handle primitive values
			lines.push(`${indentation}${key}: ${parseValueToString(value)}`);
		}
	}

	return lines.join("\n");
}

/**
 * Converts a JavaScript value into a YAML-compatible string.
 * @param {*} value - The value to convert.
 * @returns {string} - The YAML-compatible string representation of the value.
 */
function parseValueToString(value) {
	if (value === null) return "null";
	if (typeof value === "string") return `"${value}"`;
	if (typeof value === "boolean") return value.toString();
	if (typeof value === "number") return value.toString();
	return "";
}

// #endregion
