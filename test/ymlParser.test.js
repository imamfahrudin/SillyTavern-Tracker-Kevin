import { yamlToJSON, jsonToYAML } from '../lib/ymlParser.js';
import assert from 'assert';

// Helper function to parse JSON string to object for comparison
function parseJSON(jsonString) {
    return JSON.parse(jsonString);
}

// Test cases for yamlToJSON
function testYamlToJSON() {
    console.log('Testing yamlToJSON...');

    // Test basic key-value
    const yaml1 = 'key: value';
    const expected1 = { key: 'value' };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml1)), expected1);

    // Test nested object
    const yaml2 = `parent:
  child: value`;
    const expected2 = { parent: { child: 'value' } };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml2)), expected2);

    // Test array
    const yaml3 = `list:
  - item1
  - item2`;
    const expected3 = { list: ['item1', 'item2'] };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml3)), expected3);

    // Test inline array
    const yaml4 = 'list: [item1, item2]';
    const expected4 = { list: ['item1', 'item2'] };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml4)), expected4);

    // Test quoted strings
    const yaml5 = 'key: "quoted value"';
    const expected5 = { key: 'quoted value' };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml5)), expected5);

    // Test multiline string
    const yaml6 = `key: "line1
line2"`;
    const expected6 = { key: 'line1\nline2' };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml6)), expected6);

    // Test boolean, null, number
    const yaml7 = `bool: true
nullVal: null
num: 42`;
    const expected7 = { bool: true, nullVal: null, num: 42 };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml7)), expected7);

    // Test empty object
    const yaml8 = 'obj: {}';
    const expected8 = { obj: {} };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml8)), expected8);

    // Test empty array
    const yaml9 = 'arr: []';
    const expected9 = { arr: [] };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml9)), expected9);

    // Test comments
    const yaml10 = `# comment
key: value # inline comment`;
    const expected10 = { key: 'value' };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml10)), expected10);

    // Test complex nesting
    const yaml11 = `level1:
  level2:
    - item1
    - item2
  level2b: value`;
    const expected11 = { level1: { level2: ['item1', 'item2'], level2b: 'value' } };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml11)), expected11);

    // Test only comments
    const yaml12 = `# comment1
# comment2`;
    const expected12 = {};
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml12)), expected12);

    // Test empty lines
    const yaml13 = `

key: value

`;
    const expected13 = { key: 'value' };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml13)), expected13);

    // Test array with mixed types
    const yaml14 = `mixed:
  - string
  - 123
  - true
  - null`;
    const expected14 = { mixed: ['string', 123, true, null] };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml14)), expected14);

    // Test negative and float numbers
    const yaml15 = `neg: -42
float: 3.14`;
    const expected15 = { neg: -42, float: 3.14 };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml15)), expected15);

    // Test string with spaces
    const yaml16 = 'key: value with spaces';
    const expected16 = { key: 'value with spaces' };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml16)), expected16);

    // Test key with underscores
    const yaml17 = 'key_name: value';
    const expected17 = { key_name: 'value' };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml17)), expected17);

    // Test deeper nesting
    const yaml18 = `a:
  b:
    c:
      d: value`;
    const expected18 = { a: { b: { c: { d: 'value' } } } };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml18)), expected18);

    // Test array in nested object
    const yaml19 = `nested:
  arr:
    - one
    - two`;
    const expected19 = { nested: { arr: ['one', 'two'] } };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml19)), expected19);

    // Test inline array with mixed types
    const yaml20 = 'mixed: [string, 123, true, null]';
    const expected20 = { mixed: ['string', 123, true, null] };
    assert.deepStrictEqual(parseJSON(yamlToJSON(yaml20)), expected20);

    console.log('yamlToJSON tests passed!');
}

// Test cases for jsonToYAML
function testJsonToYAML() {
    console.log('Testing jsonToYAML...');

    // Test basic object
    const json1 = { key: 'value' };
    const expected1 = 'key: "value"';
    assert.strictEqual(jsonToYAML(json1), expected1);

    // Test nested object
    const json2 = { parent: { child: 'value' } };
    const expected2 = `parent:
  child: "value"`;
    assert.strictEqual(jsonToYAML(json2), expected2);

    // Test array
    const json3 = { list: ['item1', 'item2'] };
    const expected3 = 'list: ["item1", "item2"]';
    assert.strictEqual(jsonToYAML(json3), expected3);

    // Test primitives
    const json4 = { bool: true, nullVal: null, num: 42, str: 'string' };
    const expected4 = `bool: true
nullVal: null
num: 42
str: "string"`;
    assert.strictEqual(jsonToYAML(json4), expected4);

    // Test empty object and array
    const json5 = { obj: {}, arr: [] };
    const expected5 = `obj: {}
arr: []`;
    assert.strictEqual(jsonToYAML(json5), expected5);

    // Test array with mixed types
    const json6 = { mixed: [1, 'string', true, null] };
    const expected6 = 'mixed: [1, "string", true, null]';
    assert.strictEqual(jsonToYAML(json6), expected6);

    // Test object with array
    const json7 = { data: { arr: [1, 2, 3] } };
    const expected7 = `data:
  arr: [1, 2, 3]`;
    assert.strictEqual(jsonToYAML(json7), expected7);

    // Test float and negative numbers
    const json8 = { float: 3.14, neg: -42 };
    const expected8 = `float: 3.14
neg: -42`;
    assert.strictEqual(jsonToYAML(json8), expected8);

    // Test deeper nesting
    const json9 = { a: { b: { c: { d: 'value' } } } };
    const expected9 = `a:
  b:
    c:
      d: "value"`;
    assert.strictEqual(jsonToYAML(json9), expected9);

    // Test string with spaces
    const json10 = { key: 'value with spaces' };
    const expected10 = 'key: "value with spaces"';
    assert.strictEqual(jsonToYAML(json10), expected10);

    console.log('jsonToYAML tests passed!');
}

// Round trip validation
function testRoundTrip() {
    console.log('Testing round trip validation...');

    const testYamls = [
        'key: value',
        `nested:
  key: value`,
        `list:
  - item1
  - item2`,
        'inline: [a, b, c]',
        `multiline: "line1
line2"`,
        `types:
  bool: true
  num: 123
  null: null
  str: string`,
        `empty:
  obj: {}
  arr: []`,
        `deep:
  level1:
    level2:
      level3: value`,
        `# comments only`,
        `mixed:
  - string
  - 123
  - true
  - null`,
        `numbers:
  neg: -42
  float: 3.14`,
        'spaces: value with spaces',
        'key_name: value',
        `nested_arr:
  arr:
    - one
    - two`,
        'mixed_inline: [string, 123, true, null]',
    ];

    for (const yaml of testYamls) {
        // yaml -> json string -> json object -> yaml -> json string -> json object
        const jsonStr1 = yamlToJSON(yaml);
        const jsonObj = parseJSON(jsonStr1);
        const yaml2 = jsonToYAML(jsonObj);
        const jsonStr2 = yamlToJSON(yaml2);
        const jsonObj2 = parseJSON(jsonStr2);

        assert.deepStrictEqual(jsonObj, jsonObj2, `Round trip failed for YAML: ${yaml}`);
    }

    console.log('Round trip tests passed!');
}

// Run all tests
function runTests() {
    try {
        testYamlToJSON();
        testJsonToYAML();
        testRoundTrip();
        console.log('All tests passed!');
    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    }
}

runTests();