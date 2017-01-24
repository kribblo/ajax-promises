const ajaxPromises = require('../src/ajax-promises');
const test = require('tape');

test('Encode object', t => {
    const data = {
        single: 'abcdefghi',
        multiple: ['abc', 'def', 'ghi']
    };

    const encoded = ajaxPromises.encodeQuery(data);

    t.equals(encoded, 'single=abcdefghi&multiple=abc&multiple=def&multiple=ghi');

    t.end();
});
