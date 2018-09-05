Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _extends = Object.assign
  || function (target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/* eslint-disable max-len, react/prop-types */

const PlayForWorkIcon = function PlayForWorkIcon(props) {
  return _react2.default.createElement(
    'svg',
    _extends(
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
      },
      props,
      {
        className: `material material-arrow-up-icon ${props.className}`,
      },
    ),
    _react2.default.createElement('path', {
      d:
        'M11 5v5.59H7.5l4.5 4.5 4.5-4.5H13V5h-2zm-5 9c0 3.31 2.69 6 6 6s6-2.69 6-6h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H6z',
    }),
  );
};

exports.default = PlayForWorkIcon;
