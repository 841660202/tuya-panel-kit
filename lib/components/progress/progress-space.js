Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'src/components/progress/progress-space.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNativeSvg = require('react-native-svg');

var _reactNativeSvg2 = _interopRequireDefault(_reactNativeSvg);

var _reactNative = require('react-native');

var _gesture = require('./gesture');

var _gesture2 = _interopRequireDefault(_gesture);

var _pathCustom = require('./path-custom');

var _pathCustom2 = _interopRequireDefault(_pathCustom);

var _gradient = require('./gradient');

var _gradient2 = _interopRequireDefault(_gradient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProgressSpace = function (_Gesture) {
  _inherits(ProgressSpace, _Gesture);

  function ProgressSpace(props) {
    _classCallCheck(this, ProgressSpace);

    var _this = _possibleConstructorReturn(this, (ProgressSpace.__proto__ || Object.getPrototypeOf(ProgressSpace)).call(this, props));

    _this.fixDegreeAndBindToInstance(props);
    _this.state = {
      value: props.value
    };
    return _this;
  }

  _createClass(ProgressSpace, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.fixDegreeAndBindToInstance(nextProps);
    }
  }, {
    key: 'fixDegreeAndBindToInstance',
    value: function fixDegreeAndBindToInstance(props) {
      var startDegree = props.startDegree,
          andDegree = props.andDegree,
          value = props.value;

      this.startDegree = startDegree;
      this.endDegree = startDegree + andDegree;

      if (startDegree >= 360) {
        this.startDegree = startDegree % 360;
        this.endDegree = (startDegree + andDegree) % 360;
      }

      this.backScalePath = this.createSvgPath(andDegree);

      var deltaDeg = this.mapValueToDeltaDeg(value);

      this.foreScalePath = this.createSvgPath(deltaDeg);
    }
  }, {
    key: 'onStartShouldSetResponder',
    value: function onStartShouldSetResponder(_ref) {
      var _ref$nativeEvent = _ref.nativeEvent,
          locationX = _ref$nativeEvent.locationX,
          locationY = _ref$nativeEvent.locationY;

      return this.shouldSetResponder(locationX, locationY);
    }
  }, {
    key: 'shouldSetResponder',
    value: function shouldSetResponder(x0, y0) {
      var _props = this.props,
          scaleHeight = _props.scaleHeight,
          disabled = _props.disabled;

      if (disabled) {
        return false;
      }

      var _getCircleInfo = this.getCircleInfo(),
          r = _getCircleInfo.r;

      var _getXYRelativeCenter = this.getXYRelativeCenter(x0, y0),
          x = _getXYRelativeCenter.x,
          y = _getXYRelativeCenter.y;

      var len = Math.sqrt(x * x + y * y);
      var innerR = r - scaleHeight;
      var should = this.shouldUpdateScale(x0, y0);
      var finalShould = should && len <= r && len >= innerR;
      return finalShould;
    }
  }, {
    key: 'shouldUpdateScale',
    value: function shouldUpdateScale(x, y) {
      var startDegree = this.startDegree,
          endDegree = this.endDegree;

      var deg = this.getDegRelativeCenter(x, y);
      var should = void 0;
      if (endDegree < 360) {
        should = deg >= startDegree && deg <= endDegree;
      } else {
        should = deg >= startDegree || deg <= endDegree % 360;
      }
      return should;
    }
  }, {
    key: 'onMoveShouldSetResponder',
    value: function onMoveShouldSetResponder() {
      return false;
    }
  }, {
    key: 'onGrant',
    value: function onGrant(e, gestureState) {
      var onValueChange = this.props.onValueChange;

      this.eventHandle(gestureState, onValueChange);
    }
  }, {
    key: 'onMove',
    value: function onMove(e, gestureState) {
      var onValueChange = this.props.onValueChange;

      this.eventHandle(gestureState, onValueChange);
    }
  }, {
    key: 'onRelease',
    value: function onRelease(e, gestureState) {
      var onSlidingComplete = this.props.onSlidingComplete;

      this.eventHandle(gestureState, onSlidingComplete);
    }
  }, {
    key: 'eventHandle',
    value: function eventHandle(_ref2, fn) {
      var locationX = _ref2.locationX,
          locationY = _ref2.locationY;
      var startDegree = this.startDegree;

      var deg = this.getDegRelativeCenter(locationX, locationY);
      if (this.shouldUpdateScale(locationX, locationY)) {
        var deltaDeg = deg - startDegree;
        if (deltaDeg < 0) {
          deltaDeg = deg + 360 - startDegree;
        }
        this.foreScalePath = this.createSvgPath(deltaDeg);
        var value = this.mapDeltaDegToValue(deltaDeg);
        if (typeof fn === 'function') fn(value);
        this.setState({
          value: value
        });
      }
    }
  }, {
    key: 'getLayoutFromStyle',
    value: function getLayoutFromStyle(style) {
      var _ref3 = _reactNative.StyleSheet.flatten(style) || {},
          _ref3$width = _ref3.width,
          width = _ref3$width === undefined ? 125 : _ref3$width,
          _ref3$height = _ref3.height,
          height = _ref3$height === undefined ? 125 : _ref3$height;

      return {
        width: width,
        height: height
      };
    }
  }, {
    key: 'getCircleInfo',
    value: function getCircleInfo() {
      var _getLayoutFromStyle = this.getLayoutFromStyle(this.props.style),
          width = _getLayoutFromStyle.width,
          height = _getLayoutFromStyle.height;

      var size = Math.min(width, height);
      var r = size / 2;
      var cx = r;
      var cy = r;
      return {
        r: r,
        cx: cx,
        cy: cy
      };
    }
  }, {
    key: 'getXYRelativeCenter',
    value: function getXYRelativeCenter(x, y) {
      var _getCircleInfo2 = this.getCircleInfo(),
          cx = _getCircleInfo2.cx,
          cy = _getCircleInfo2.cy;

      return {
        x: x - cx,
        y: y - cy
      };
    }
  }, {
    key: 'getDegRelativeCenter',
    value: function getDegRelativeCenter(x, y) {
      var _getXYRelativeCenter2 = this.getXYRelativeCenter(x, y),
          _x = _getXYRelativeCenter2.x,
          _y = _getXYRelativeCenter2.y;

      var deg = Math.atan2(_y, _x) * 180 / Math.PI;
      if (deg < 0) {
        deg += 360;
      }
      return parseInt(deg, 10);
    }
  }, {
    key: 'mapDeltaDegToScaleCount',
    value: function mapDeltaDegToScaleCount(deltaDeg) {
      var _props2 = this.props,
          scaleNumber = _props2.scaleNumber,
          andDegree = _props2.andDegree;

      var eachDeg = andDegree / scaleNumber;
      var count = Math.ceil(deltaDeg / eachDeg);
      if (count > scaleNumber) count = scaleNumber;
      return count;
    }
  }, {
    key: 'mapDeltaDegToValue',
    value: function mapDeltaDegToValue(deltaDeg) {
      var count = this.mapDeltaDegToScaleCount(deltaDeg);
      var _props3 = this.props,
          min = _props3.min,
          max = _props3.max,
          scaleNumber = _props3.scaleNumber,
          andDegree = _props3.andDegree,
          stepValue = _props3.stepValue;

      if (stepValue) {
        var _eachDeg = andDegree / scaleNumber;
        var _deltaValue = max - min;
        var _value = Math.round(count * _eachDeg * _deltaValue / stepValue / andDegree);
        return Math.max(min, Math.min(max, _value * stepValue + min));
      }
      var eachDeg = andDegree / scaleNumber;
      var deltaValue = max - min;
      var value = count * eachDeg * deltaValue / andDegree;
      return Math.max(min, Math.min(max, value + min));
    }
  }, {
    key: 'mapValueToDeltaDeg',
    value: function mapValueToDeltaDeg(value) {
      var _props4 = this.props,
          min = _props4.min,
          max = _props4.max,
          andDegree = _props4.andDegree;

      return (value - min) * andDegree / (max - min);
    }
  }, {
    key: 'createSvgPath',
    value: function createSvgPath() {
      var deltaDeg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (deltaDeg === 0) return '';

      var _getCircleInfo3 = this.getCircleInfo(),
          r = _getCircleInfo3.r;

      var startDegree = this.startDegree;
      var _props5 = this.props,
          scaleNumber = _props5.scaleNumber,
          scaleHeight = _props5.scaleHeight,
          andDegree = _props5.andDegree;

      var eachDeg = andDegree / scaleNumber;
      var innerRadius = r - scaleHeight;

      var count = this.mapDeltaDegToScaleCount(deltaDeg);
      var path = '';

      for (var i = 0; i <= count; i++) {
        var pointDeg = startDegree + i * eachDeg;
        var pointAngle = pointDeg * Math.PI / 180;
        var _x1 = r + r * Math.cos(pointAngle);
        var _y1 = r + r * Math.sin(pointAngle);
        var _x2 = r + innerRadius * Math.cos(pointAngle);
        var _y2 = r + innerRadius * Math.sin(pointAngle);
        path += 'M' + _x1 + ' ' + _y1 + ' L' + _x2 + ' ' + _y2;
      }
      return path;
    }
  }, {
    key: 'render',
    value: function render() {
      var responder = this.getResponder();
      var _props6 = this.props,
          backColor = _props6.backColor,
          backStrokeOpacity = _props6.backStrokeOpacity,
          foreStrokeOpacity = _props6.foreStrokeOpacity,
          foreColor = _props6.foreColor,
          style = _props6.style,
          gradientId = _props6.gradientId,
          x1 = _props6.x1,
          x2 = _props6.x2,
          y1 = _props6.y1,
          y2 = _props6.y2,
          renderCenterView = _props6.renderCenterView,
          min = _props6.min;

      var _getCircleInfo4 = this.getCircleInfo(),
          r = _getCircleInfo4.r;

      var size = r * 2;
      var isGradient = foreColor && typeof foreColor === 'object';
      var greater = this.state.value !== min;
      return _react2.default.createElement(
        _reactNative.View,
        _extends({}, responder, {
          style: [{
            width: 125,
            height: 125
          }, style],
          __source: {
            fileName: _jsxFileName,
            lineNumber: 340
          }
        }),
        _react2.default.createElement(
          _reactNativeSvg2.default,
          { width: size, height: size, __source: {
              fileName: _jsxFileName,
              lineNumber: 350
            }
          },
          _react2.default.createElement(_reactNativeSvg.Path, {
            d: this.backScalePath,
            x: '0',
            y: '0',
            fill: 'none',
            stroke: backColor,
            strokeOpacity: backStrokeOpacity,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 351
            }
          }),
          isGradient && greater && _react2.default.createElement(_gradient2.default, {
            gradientId: gradientId,
            x1: x1,
            x2: x2,
            y1: y1,
            y2: y2,
            isGradient: isGradient,
            foreColor: foreColor,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 360
            }
          }),
          _react2.default.createElement(_pathCustom2.default, {
            isGradient: isGradient,
            path: this.foreScalePath,
            strokeOpacity: foreStrokeOpacity,
            strokeWidth: 0,
            gradientId: gradientId,
            foreColor: foreColor,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 370
            }
          })
        ),
        renderCenterView
      );
    }
  }]);

  return ProgressSpace;
}(_gesture2.default);

ProgressSpace.propTypes = _extends({}, _gesture2.default.propTypes, {
  gradientId: _propTypes2.default.string,

  style: _reactNative.ViewPropTypes.style,

  value: _propTypes2.default.number,

  startDegree: _propTypes2.default.number,

  andDegree: _propTypes2.default.number,

  min: _propTypes2.default.number,

  max: _propTypes2.default.number,

  stepValue: _propTypes2.default.number,

  backStrokeOpacity: _propTypes2.default.number,

  foreStrokeOpacity: _propTypes2.default.number,

  scaleNumber: _propTypes2.default.number,

  scaleHeight: _propTypes2.default.number,

  disabled: _propTypes2.default.bool,

  backColor: _propTypes2.default.string,

  foreColor: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),

  onValueChange: _propTypes2.default.func,

  onSlidingComplete: _propTypes2.default.func,

  x1: _propTypes2.default.string,

  x2: _propTypes2.default.string,

  y1: _propTypes2.default.string,

  y2: _propTypes2.default.string,

  renderCenterView: _propTypes2.default.element
});
ProgressSpace.defaultProps = _extends({}, _gesture2.default.defaultProps, {
  gradientId: 'Space',
  value: 50,
  startDegree: 135,
  andDegree: 270,
  min: 0,
  max: 100,
  stepValue: 0,
  scaleNumber: 120,
  scaleHeight: 9,
  disabled: false,
  backColor: '#E5E5E5',
  foreColor: '#FF4800',
  onValueChange: function onValueChange() {},
  onSlidingComplete: function onSlidingComplete() {},

  style: null,
  backStrokeOpacity: 1,
  foreStrokeOpacity: 1,
  x1: '0%',
  y1: '0%',
  x2: '100%',
  y2: '0%',
  renderCenterView: null
});
exports.default = ProgressSpace;