'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _maxSafeInteger = require('babel-runtime/core-js/number/max-safe-integer');

var _maxSafeInteger2 = _interopRequireDefault(_maxSafeInteger);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env mocha */
var assert = require('assert');

var _require = require('./format'),
    encodeName = _require.encodeName,
    decodeName = _require.decodeName,
    encodeNameHex = _require.encodeNameHex,
    decodeNameHex = _require.decodeNameHex,
    isName = _require.isName,
    UDecimalPad = _require.UDecimalPad,
    UDecimalUnimply = _require.UDecimalUnimply,
    parseAssetSymbol = _require.parseAssetSymbol;

describe('format', function () {
  // In isname111111k, 'k' overflows the last 4 bits of the name
  describe('name', function () {
    var nameFixture = {
      isname: ['isname111111j', 'a', '1', '5', 'sam5', 'sam', 'adam.applejjj'],
      noname: ['isname111111k', undefined, null, 1, '6', 'a6', ' ']
    };

    it('isName', function () {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(nameFixture.isname), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var name = _step.value;

          assert(isName(name, function (err) {
            return console.log(err);
          }), name);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(nameFixture.noname), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _name = _step2.value;

          assert(!isName(_name), _name);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    });

    it('encode / decode', function () {
      assert.equal('12373', encodeName('eos'), 'encode');
      assert.equal('3055', encodeNameHex('eos'), 'encode hex');
      assert.equal(decodeName(encodeName('eos')), 'eos', 'decode');

      assert.equal('572d3ccdcd', encodeNameHex('transfer'), 'encode');
      assert.equal(decodeNameHex('572d3ccdcd'), 'transfer', 'decode');

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(nameFixture.isname), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var name = _step3.value;

          assert.equal(decodeName(encodeName(name)), name);
          assert.equal(decodeNameHex(encodeNameHex(name)), name);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = (0, _getIterator3.default)(nameFixture.isname), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _name2 = _step4.value;

          assert.equal(decodeName(encodeName(_name2, false), false), _name2);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      assert(decodeName(1));
      throws(function () {
        return decodeName(_maxSafeInteger2.default + 1);
      }, /overflow/);
      throws(function () {
        return decodeName({});
      }, /Long, Number or String/);
    });
  });

  it('UDecimalPad', function () {
    assert.throws(function () {
      return UDecimalPad();
    }, /value is required/);
    assert.throws(function () {
      return UDecimalPad(1);
    }, /precision/);
    assert.throws(function () {
      return UDecimalPad('$10', 0);
    }, /invalid decimal/);
    assert.throws(function () {
      return UDecimalPad('1.1.', 0);
    }, /invalid decimal/);
    assert.throws(function () {
      return UDecimalPad('1.1,1', 0);
    }, /invalid decimal/);
    assert.throws(function () {
      return UDecimalPad('1.11', 1);
    }, /exceeds precision/);

    var decFixtures = [{ value: 1, precision: 0, answer: '1' }, { value: '1', precision: 0, answer: '1' }, { value: '1.', precision: 0, answer: '1' }, { value: '1.0', precision: 0, answer: '1' }, { value: '1456.0', precision: 0, answer: '1456' }, { value: '1,456.0', precision: 0, answer: '1,456' },

    // does not validate commas
    { value: '1,4,5,6', precision: 0, answer: '1,4,5,6' }, { value: '1,4,5,6.0', precision: 0, answer: '1,4,5,6' }, { value: 1, precision: 1, answer: '1.0' }, { value: '1', precision: 1, answer: '1.0' }, { value: '1.', precision: 1, answer: '1.0' }, { value: '1.0', precision: 1, answer: '1.0' }, { value: '1.10', precision: 1, answer: '1.1' }, { value: '1.1', precision: 2, answer: '1.10' }, { value: '1.10', precision: 2, answer: '1.10' }, { value: '1.01', precision: 2, answer: '1.01' }, { value: '1', precision: 3, answer: '1.000' }];
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = (0, _getIterator3.default)(decFixtures), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var test = _step5.value;
        var answer = test.answer,
            value = test.value,
            precision = test.precision;

        assert.equal(UDecimalPad(value, precision), answer, (0, _stringify2.default)(test));
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  });

  it('UDecimalUnimply', function () {
    assert.throws(function () {
      return UDecimalUnimply('1.', 1);
    }, /invalid whole number/);
    assert.throws(function () {
      return UDecimalUnimply('.1', 1);
    }, /invalid whole number/);
    assert.throws(function () {
      return UDecimalUnimply('1.1', 1);
    }, /invalid whole number/);

    var decFixtures = [{ value: 1, precision: 0, answer: '1' }, { value: '1', precision: 0, answer: '1' }, { value: '10', precision: 0, answer: '10' }, { value: 1, precision: 1, answer: '0.1' }, { value: '10', precision: 1, answer: '1' }, { value: '11', precision: 2, answer: '0.11' }, { value: '110', precision: 2, answer: '1.1' }, { value: '101', precision: 2, answer: '1.01' }, { value: '0101', precision: 2, answer: '1.01' }];
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = (0, _getIterator3.default)(decFixtures), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var test = _step6.value;
        var answer = test.answer,
            value = test.value,
            precision = test.precision;

        assert.equal(UDecimalUnimply(value, precision), answer, (0, _stringify2.default)(test));
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  });

  it('parseAssetSymbol', function () {
    assert.deepEqual(parseAssetSymbol('SYM'), { precision: null, symbol: 'SYM' });
    assert.deepEqual(parseAssetSymbol('4,SYM'), { precision: 4, symbol: 'SYM' });

    assert.throws(function () {
      return parseAssetSymbol(369);
    }, /should be string/);
    assert.throws(function () {
      return parseAssetSymbol('4,SYM,2', 2);
    }, /precision like this/);
    assert.throws(function () {
      return parseAssetSymbol('4,SYM', 2);
    }, /Asset symbol precision mismatch/);
    assert.throws(function () {
      return parseAssetSymbol('-2,SYM');
    }, /precision must be positive/);
    assert.throws(function () {
      return parseAssetSymbol('sym');
    }, /only uppercase/);
    assert.throws(function () {
      return parseAssetSymbol('19,SYM');
    }, /18 characters or less/);
    assert.throws(function () {
      return parseAssetSymbol('TOOLONGSYM');
    }, /7 characters or less/);
  });
});

/* istanbul ignore next */
function throws(fn, match) {
  try {
    fn();
    assert(false, 'Expecting error');
  } catch (error) {
    if (!match.test(error)) {
      error.message = 'Error did not match ' + match + '\n' + error.message;
      throw error;
    }
  }
}