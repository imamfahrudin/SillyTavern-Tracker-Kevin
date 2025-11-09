# YML Parser Tests

This directory contains unit tests for the `ymlParser.js` module.

## Running Tests

To run the tests, ensure you have Node.js installed, then run:

```bash
npm test
```

This will execute the test suite and validate all functionality, including round-trip conversion between YAML and JSON.

## Test Coverage

The tests cover:

- YAML to JSON conversion (`yamlToJSON`):
  - Basic key-value pairs
  - Nested objects (multiple levels deep)
  - Arrays (both multiline and inline, including empty arrays)
  - Primitive types (strings, numbers including negatives and floats, booleans, null)
  - Quoted strings and multiline strings
  - Comments (ignored, including inline and full-line)
  - Empty objects and arrays
  - Mixed-type arrays
  - Keys with underscores and values with spaces
  - Complex nesting with arrays inside objects
  - Edge cases like only comments or empty lines

- JSON to YAML conversion (`jsonToYAML`):
  - Nested objects (including empty and deeply nested)
  - Arrays (including empty and mixed-type)
  - Primitive values (strings, numbers, booleans, null)
  - Objects containing arrays

- Round-trip validation:
  - Ensures that YAML → JSON → YAML → JSON produces equivalent results
  - Tests various combinations including comments, mixed types, nested structures, and edge cases

## Notes

- The parser supports a subset of YAML features focused on simple data structures.
- Complex YAML features like multi-line arrays with nested objects are not supported.
- All strings in JSON to YAML conversion are quoted for consistency.