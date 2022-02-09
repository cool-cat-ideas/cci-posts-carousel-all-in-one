(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ "./src/admin-app/components/Forms/CustomAutocomplete.jsx":
/*!***************************************************************!*\
  !*** ./src/admin-app/components/Forms/CustomAutocomplete.jsx ***!
  \***************************************************************/
/*! exports provided: customAutocompleteDefaultValue, CustomAutocomplete */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "customAutocompleteDefaultValue", function() { return customAutocompleteDefaultValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomAutocomplete", function() { return CustomAutocomplete; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var _mui_material_TextField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/TextField */ "./node_modules/@mui/material/TextField/index.js");
/* harmony import */ var _mui_material_Autocomplete__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material/Autocomplete */ "./node_modules/@mui/material/Autocomplete/index.js");
/* harmony import */ var _mui_material_CircularProgress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/CircularProgress */ "./node_modules/@mui/material/CircularProgress/index.js");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! formik */ "./node_modules/formik/dist/formik.esm.js");
/* harmony import */ var _Api__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Api */ "./src/admin-app/components/Api.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }








var customAutocompleteDefaultValue = function customAutocompleteDefaultValue(options, value) {
  var output = [];

  if (!options || options.length === 0 || !value) {
    return output;
  }

  if (_typeof(value) === 'object') {
    if (Array.isArray(value)) {
      var selectedIds = value.length > 0 ? value.map(function (option) {
        return option.value;
      }) : value.value;
      output = options.filter(function (option) {
        return selectedIds.includes(option.value);
      });
    } else {
      output = options.find(function (option) {
        return option.value.toLowerCase() === value.value.toLowerCase();
      });
    } //v = options.filter( ( option ) => value.includes( option.value ) );

  } else {
    output = options.find(function (option) {
      return option.value.toLowerCase() === value.toLowerCase();
    });
  }

  return output;
};
var CustomAutocomplete = function CustomAutocomplete(props) {
  var __ = wp.i18n.__;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState4 = _slicedToArray(_useState3, 2),
      endpoint = _useState4[0],
      setEndpoint = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(''),
      _useState6 = _slicedToArray(_useState5, 2),
      searchText = _useState6[0],
      setSearchText = _useState6[1];

  var _useFormikContext = Object(formik__WEBPACK_IMPORTED_MODULE_5__["useFormikContext"])(),
      values = _useFormikContext.values,
      errors = _useFormikContext.errors,
      touched = _useFormikContext.touched,
      setFieldValue = _useFormikContext.setFieldValue;

  var _useField = Object(formik__WEBPACK_IMPORTED_MODULE_5__["useField"])(props),
      _useField2 = _slicedToArray(_useField, 1),
      field = _useField2[0];

  var customProps = _objectSpread({}, props);

  customProps.customProps && delete customProps.customProps;

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]),
      _useState8 = _slicedToArray(_useState7, 2),
      postsOptions = _useState8[0],
      setPostsOptions = _useState8[1]; //const [ loading, setLoading ] = useState( false );


  var loading = open && postsOptions.length === 0;

  var searchApi = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(endpoint) {
      var searchText,
          values,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              searchText = _args.length > 1 && _args[1] !== undefined ? _args[1] : '';
              values = _args.length > 2 && _args[2] !== undefined ? _args[2] : [];

              if (!endpoint) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return _Api__WEBPACK_IMPORTED_MODULE_6__["default"].post(endpoint + searchText, values).then(function (response) {
                if (response.status == 200 && response.data) {
                  var _response$data;

                  setPostsOptions((_response$data = response.data) !== null && _response$data !== void 0 ? _response$data : []);
                }
              })["catch"](function (error) {
                props.customProps.store.enqueueSnackbar({
                  message: __('Failed get data from API', 'wp-posts-carousel'),
                  options: {
                    variant: 'error'
                  }
                });
              });

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function searchApi(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (options) {
      setPostsOptions(options);
    } else {
      setPostsOptions([]);
    }
  }, [options]);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (!open && endpoint !== false) {
      setPostsOptions([]);
    }
  }, [open]);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (props.customProps && props.customProps.endpoint !== undefined) {
      setEndpoint(props.customProps.endpoint);
    }
  }, [props.customProps]);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    var active = true;

    if (!loading) {
      return undefined;
    }

    searchApi(endpoint, searchText, values);
    return function () {
      active = false;
    };
  }, [loading]);
  var name = props.name,
      id = props.id,
      size = props.size,
      value = props.value,
      fullWidth = props.fullWidth,
      multiple = props.multiple,
      options = props.options,
      noOptionsText = props.noOptionsText,
      _onOpen = props.onOpen,
      _onInputChange = props.onInputChange,
      _onChange = props.onChange,
      _groupBy = props.groupBy,
      disableClearable = props.disableClearable;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Autocomplete__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({}, customProps, {
    name: name,
    options: postsOptions,
    id: id !== null && id !== void 0 ? id : name,
    size: size !== null && size !== void 0 ? size : 'small',
    fullWidth: fullWidth !== null && fullWidth !== void 0 ? fullWidth : true,
    multiple: multiple !== null && multiple !== void 0 ? multiple : false,
    disableClearable: disableClearable !== null && disableClearable !== void 0 ? disableClearable : true,
    autoComplete: false,
    noOptionsText: noOptionsText !== null && noOptionsText !== void 0 ? noOptionsText : __('No values', 'wp-posts-carousel'),
    value: endpoint !== false ? values[name] : customAutocompleteDefaultValue(postsOptions, value),
    isOptionEqualToValue: function isOptionEqualToValue(option, value) {
      return option.value === value.value;
    },
    onInputChange: function onInputChange(event, newValue) {
      setSearchText(newValue);

      if (_onInputChange && typeof _onInputChange === 'function') {
        _onInputChange(event, newValue);
      }
    },
    onOpen: function onOpen() {
      setOpen(true);

      if (_onOpen && typeof _onOpen === 'function') {
        _onOpen();
      }
    },
    onClose: function onClose() {
      setOpen(false);
    },
    onChange: function onChange(event, newValue) {
      setFieldValue(field.name, newValue);

      if (_onChange && typeof _onChange === 'function') {
        _onChange(event, newValue);
      }
    },
    getOptionLabel: function getOptionLabel(option) {
      var _option$label;

      return (_option$label = option.label) !== null && _option$label !== void 0 ? _option$label : '';
    },
    groupBy: function groupBy(option) {
      if (_groupBy && typeof _groupBy === 'function') {
        return _groupBy(option);
      }
    },
    filterSelectedOptions: true,
    loading: loading,
    renderInput: function renderInput(params) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TextField__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({}, params, {
        helperText: touched[name] ? errors[name] : '',
        error: touched[name] && Boolean(errors[name]),
        variant: "outlined",
        InputProps: _objectSpread(_objectSpread({}, params.InputProps), {}, {
          endAdornment: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, loading && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_CircularProgress__WEBPACK_IMPORTED_MODULE_4__["default"], {
            color: "inherit",
            size: 20
          }), params.InputProps.endAdornment)
        })
      }));
    }
  })));
};

/***/ }),

/***/ "./src/admin-app/components/Forms/index.jsx":
/*!**************************************************!*\
  !*** ./src/admin-app/components/Forms/index.jsx ***!
  \**************************************************/
/*! exports provided: CustomAutocomplete, customAutocompleteDefaultValue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CustomAutocomplete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CustomAutocomplete */ "./src/admin-app/components/Forms/CustomAutocomplete.jsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CustomAutocomplete", function() { return _CustomAutocomplete__WEBPACK_IMPORTED_MODULE_0__["CustomAutocomplete"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "customAutocompleteDefaultValue", function() { return _CustomAutocomplete__WEBPACK_IMPORTED_MODULE_0__["customAutocompleteDefaultValue"]; });



/***/ }),

/***/ "./src/admin-app/components/Tooltip.jsx":
/*!**********************************************!*\
  !*** ./src/admin-app/components/Tooltip.jsx ***!
  \**********************************************/
/*! exports provided: CustomTooltip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomTooltip", function() { return CustomTooltip; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mui_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mui/styles */ "./node_modules/@mui/styles/index.js");
/* harmony import */ var _mui_material_IconButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/IconButton */ "./node_modules/@mui/material/IconButton/index.js");
/* harmony import */ var _mui_material_Tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material/Tooltip */ "./node_modules/@mui/material/Tooltip/index.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }


 // import HelpIcon from '@material-ui/icons/Help';



var useStylesBootstrap = Object(_mui_styles__WEBPACK_IMPORTED_MODULE_1__["makeStyles"])(function (theme) {
  return {
    arrow: {
      color: theme.palette.dark.main
    },
    tooltip: {
      backgroundColor: theme.palette.dark.main,
      fontSize: 12
    }
  };
});
var CustomTooltip = function CustomTooltip(props) {
  var classes = useStylesBootstrap();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Tooltip__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({
    arrow: true
  }, props), props.helpIcon ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_IconButton__WEBPACK_IMPORTED_MODULE_2__["default"], {
    "aria-label": "help"
  }) : props.children);
};

/***/ }),

/***/ "./src/admin-app/components/Yup.jsx":
/*!******************************************!*\
  !*** ./src/admin-app/components/Yup.jsx ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var yup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! yup */ "./node_modules/yup/es/index.js");

var __ = wp.i18n.__;
yup__WEBPACK_IMPORTED_MODULE_0__["setLocale"]({
  mixed: {
    "default": __('Niewłaściwa wartość ', 'wp-posts-carousel'),
    required: __('To pole jest wymagane', 'wp-posts-carousel'),
    oneOf: __('Pole musi mieć jedną z wartości: ${values}', 'wp-posts-carousel'),
    notOneOf: __('Pole nie może przyjmować wartości: ${values}', 'wp-posts-carousel'),
    notType: __('Niewłaściwa wartość pola', 'wp-posts-carousel')
    /*notType: ({ path, type, value, originalValue }) => {
      let msg =`Pole musi być typu \`${type}\`` ;
      return msg;
    },*/

  },
  string: {
    length: __('Pole musi mieć długość ${length}', 'wp-posts-carousel'),
    min: __('Pole musi mieć przynajmniej ${min} znaków', 'wp-posts-carousel'),
    max: __('Pole może przyjąć maksymalnie ${max} znaków', 'wp-posts-carousel'),
    matches: __('Pole mus spełniać regułę: "${regex}"', 'wp-posts-carousel'),
    email: __('Pole musi być poprawnym adresem email', 'wp-posts-carousel'),
    url: __('Pole musi być poprawnym adresem URL', 'wp-posts-carousel'),
    trim: __('Pole musi być łańcuchem znaków', 'wp-posts-carousel'),
    lowercase: __('Dozwolone są tylko małe znaki', 'wp-posts-carousel'),
    uppercase: __('Dozwolone są tylko duże znaki', 'wp-posts-carousel')
  },
  number: {
    min: __('Wartość musi być większa lub równa ${min}', 'wp-posts-carousel'),
    max: __('Wartość musi być mniejsza lub równa ${max}', 'wp-posts-carousel'),
    lessThan: __('Wartość musi być mniejsza od ${less}', 'wp-posts-carousel'),
    moreThan: __('Wartość musi być większa od ${more}', 'wp-posts-carousel'),
    notEqual: __('Nie może być równe ${notEqual}', 'wp-posts-carousel'),
    positive: __('Wartość musi być liczbą dodatnią', 'wp-posts-carousel'),
    negative: __('Wartość musi być liczbą ujemną', 'wp-posts-carousel'),
    integer: __('Wartość musi być liczbą całkowitą', 'wp-posts-carousel')
  },
  date: {
    min: __('Musi być datą więszą niż ${min}', 'wp-posts-carousel'),
    max: __('Musi być datą mniejszą niż ${max}', 'wp-posts-carousel')
  },
  array: {
    min: __('Musi posiadać przynajmniej ${min} elementów', 'wp-posts-carousel'),
    max: __('Musi posiadać co najwyżej ${max} elementów', 'wp-posts-carousel')
  }
});
/* harmony default export */ __webpack_exports__["default"] = (yup__WEBPACK_IMPORTED_MODULE_0__);

/***/ }),

/***/ "./src/admin-app/components/myForm.jsx":
/*!*********************************************!*\
  !*** ./src/admin-app/components/myForm.jsx ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/dist/mobxreact.esm.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! formik */ "./node_modules/formik/dist/formik.esm.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }





var __ = wp.i18n.__;

var MyForm = function MyForm(props) {
  var Component = props.form;
  var filteredModel = props.model;

  if (props.response.values != null) {
    Object.keys(props.model).map(function (key) {
      filteredModel[key] = props.response.values[key] || filteredModel[key];
    });
  } // const formik = useFormik( {
  // 	initialValues: filteredModel,
  // 	enableReinitialize: props.enableReinitialize || false,
  // 	validationSchema: props.schema || {},
  // 	onSubmit: ( values ) => {
  // 		props.onSubmit( values );
  // 	},
  // } );
  // const { errors, isSubmitting } = useFormikContext();
  // useEffect( () => {
  // 	if ( Object.keys( errors ).length > 0 && isSubmitting === true ) {
  // 		props.props.store.enqueueSnackbar( {
  // 			message: __(
  // 				'Form contains errors.\nPlease check fields marked in red',
  // 				'wp-posts-carousel'
  // 			),
  // 			options: {
  // 				variant: 'error',
  // 			},
  // 		} );
  // 	}
  // 	return null;
  // }, [ errors, isSubmitting ] );


  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_3__["Formik"], {
    initialValues: filteredModel,
    enableReinitialize: props.enableReinitialize || false,
    validationSchema: props.schema || {},
    onSubmit: function onSubmit(values, actions) {
      props.onSubmit(values);
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(formik__WEBPACK_IMPORTED_MODULE_3__["Form"], {
    noValidate: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Component, _extends({}, props.props, {
    data: props.response.data
  }))));
};

MyForm.propTypes = {
  model: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.object.isRequired,
  schema: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.object.isRequired,
  onSubmit: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func.isRequired,
  form: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.elementType.isRequired
};
/* harmony default export */ __webpack_exports__["default"] = (MyForm);

/***/ }),

/***/ "./src/admin-app/pages/Carousels/Components/FormView.js":
/*!**************************************************************!*\
  !*** ./src/admin-app/pages/Carousels/Components/FormView.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mui_material_TextField__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mui/material/TextField */ "./node_modules/@mui/material/TextField/index.js");
/* harmony import */ var _mui_material_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/Button */ "./node_modules/@mui/material/Button/index.js");
/* harmony import */ var _mui_material_Paper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material/Paper */ "./node_modules/@mui/material/Paper/index.js");
/* harmony import */ var _mui_material_Grid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/Grid */ "./node_modules/@mui/material/Grid/index.js");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! formik */ "./node_modules/formik/dist/formik.esm.js");
/* harmony import */ var _Parts_PostSelectionCriteria__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Parts/PostSelectionCriteria */ "./src/admin-app/pages/Carousels/Components/Parts/PostSelectionCriteria.js");
/* harmony import */ var _Parts_TemplateOptions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Parts/TemplateOptions */ "./src/admin-app/pages/Carousels/Components/Parts/TemplateOptions.js");
/* harmony import */ var _Parts_DisplayOptions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Parts/DisplayOptions */ "./src/admin-app/pages/Carousels/Components/Parts/DisplayOptions.js");
/* harmony import */ var _Parts_CarouselOptions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Parts/CarouselOptions */ "./src/admin-app/pages/Carousels/Components/Parts/CarouselOptions.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











var __ = wp.i18n.__;

var Form = function Form(props) {
  var classes = props.classes;

  var _React$useState = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      expanded = _React$useState2[0],
      setExpanded = _React$useState2[1];

  var handleExpand = function handleExpand(panel) {
    return function (event, isExpanded) {
      setExpanded(isExpanded ? panel : false);
    };
  };

  var _useFormikContext = Object(formik__WEBPACK_IMPORTED_MODULE_5__["useFormikContext"])(),
      values = _useFormikContext.values,
      touched = _useFormikContext.touched,
      errors = _useFormikContext.errors,
      isSubmitting = _useFormikContext.isSubmitting,
      handleChange = _useFormikContext.handleChange,
      handleBlur = _useFormikContext.handleBlur;

  var data = props.data;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_4__["default"], {
    container: true,
    spacing: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_4__["default"], {
    item: true,
    xs: 12,
    md: 8,
    lg: 8
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_4__["default"], {
    container: true,
    spacing: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_4__["default"], {
    item: true,
    xs: 12,
    md: 12,
    lg: 12
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Paper__WEBPACK_IMPORTED_MODULE_3__["default"], {
    id: "wp-posts-carousel-right-sidebar-anchor",
    sx: {
      p: 1
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TextField__WEBPACK_IMPORTED_MODULE_1__["default"], {
    id: "title",
    label: "Title",
    value: values.title || '',
    onChange: handleChange,
    onBlur: handleBlur,
    helperText: touched.title ? errors.title : '',
    error: touched.title && Boolean(errors.title),
    margin: "dense",
    variant: "outlined",
    fullWidth: true,
    required: true,
    InputLabelProps: {
      shrink: true
    }
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_4__["default"], {
    item: true,
    xs: 12,
    md: 12,
    lg: 12
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Parts_PostSelectionCriteria__WEBPACK_IMPORTED_MODULE_6__["default"], _extends({}, props, {
    panelName: "panel-1",
    expanded: expanded,
    handleExpand: handleExpand
  }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_4__["default"], {
    item: true,
    xs: 12,
    md: 4,
    lg: 4
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "wp-posts-carousel-right-sidebar",
    ref: props.rightSidebar
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Paper__WEBPACK_IMPORTED_MODULE_3__["default"], null, data && data.post && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, ' ', data.post.user_nicename, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Button__WEBPACK_IMPORTED_MODULE_2__["default"], {
    type: "submit",
    color: "primary",
    disabled: isSubmitting
  }, "SUBMIT")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_4__["default"], {
    item: true,
    xs: 12,
    md: 12,
    lg: 12
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Parts_TemplateOptions__WEBPACK_IMPORTED_MODULE_7__["default"], _extends({}, props, {
    panelName: "panel-2",
    expanded: expanded,
    handleExpand: handleExpand
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_4__["default"], {
    item: true,
    xs: 12,
    md: 8,
    lg: 8
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Parts_DisplayOptions__WEBPACK_IMPORTED_MODULE_8__["default"], _extends({}, props, {
    panelName: "panel-3",
    expanded: expanded,
    handleExpand: handleExpand
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Parts_CarouselOptions__WEBPACK_IMPORTED_MODULE_9__["default"], _extends({}, props, {
    panelName: "panel-4",
    expanded: expanded,
    handleExpand: handleExpand
  }))));
};

/* harmony default export */ __webpack_exports__["default"] = (Form);

/***/ }),

/***/ "./src/admin-app/pages/Carousels/Components/Parts/CarouselOptions.js":
/*!***************************************************************************!*\
  !*** ./src/admin-app/pages/Carousels/Components/Parts/CarouselOptions.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/dist/mobxreact.esm.js");
/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/Typography */ "./node_modules/@mui/material/Typography/index.js");
/* harmony import */ var _mui_material_Accordion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material/Accordion */ "./node_modules/@mui/material/Accordion/index.js");
/* harmony import */ var _mui_material_AccordionSummary__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/AccordionSummary */ "./node_modules/@mui/material/AccordionSummary/index.js");
/* harmony import */ var _mui_material_AccordionDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/material/AccordionDetails */ "./node_modules/@mui/material/AccordionDetails/index.js");
/* harmony import */ var _mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mui/icons-material/ExpandMore */ "./node_modules/@mui/icons-material/ExpandMore.js");
/* harmony import */ var _mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mui/material/FormControl */ "./node_modules/@mui/material/FormControl/index.js");
/* harmony import */ var _mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mui/material/FormControlLabel */ "./node_modules/@mui/material/FormControlLabel/index.js");
/* harmony import */ var _mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @mui/material/OutlinedInput */ "./node_modules/@mui/material/OutlinedInput/index.js");
/* harmony import */ var _mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @mui/material/Switch */ "./node_modules/@mui/material/Switch/index.js");
/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @mui/material/Box */ "./node_modules/@mui/material/Box/index.js");
/* harmony import */ var _mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @mui/material/Grid */ "./node_modules/@mui/material/Grid/index.js");
/* harmony import */ var _mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @mui/material/InputLabel */ "./node_modules/@mui/material/InputLabel/index.js");
/* harmony import */ var _mui_material_InputAdornment__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @mui/material/InputAdornment */ "./node_modules/@mui/material/InputAdornment/index.js");
/* harmony import */ var _components_Forms__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../components/Forms */ "./src/admin-app/components/Forms/index.jsx");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! formik */ "./node_modules/formik/dist/formik.esm.js");

















var __ = wp.i18n.__;

var CarouselOptions = function CarouselOptions(props) {
  var _useFormikContext = Object(formik__WEBPACK_IMPORTED_MODULE_16__["useFormikContext"])(),
      values = _useFormikContext.values,
      handleChange = _useFormikContext.handleChange;

  var data = props.data,
      panelName = props.panelName,
      handleExpand = props.handleExpand,
      store = props.store;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Accordion__WEBPACK_IMPORTED_MODULE_3__["default"], {
    defaultExpanded: true,
    onChange: handleExpand(panelName)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_AccordionSummary__WEBPACK_IMPORTED_MODULE_4__["default"], {
    expandIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6___default.a, null),
    "aria-controls": "".concat(panelName, "-content"),
    id: "".concat(panelName, "-header")
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_2__["default"], null, __('Carousel options', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_AccordionDetails__WEBPACK_IMPORTED_MODULE_5__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Box__WEBPACK_IMPORTED_MODULE_11__["default"], {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    container: true,
    spacing: 2
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    cellSpacing: "0",
    cellPadding: "0",
    className: "wp-posts-carousel-table"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Items to show on different devices', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
    className: "wp-posts-carousel-table-col"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
    cellSpacing: "0",
    cellPadding: "0",
    className: "wp-posts-carousel-rwd-table"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, data && data.default_values.items_to_show && data.dictionaries.breakpoints ? Object.keys(data.dictionaries.breakpoints).map(function (device, index) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      key: "device-".concat(device)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
      className: "wp-posts-carousel-rwd-table-device wp-posts-carousel-rwd-table-device-".concat(device)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
      className: "fa fa-".concat(device)
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
      cellSpacing: "0",
      cellPadding: "0"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, Object.entries(data.dictionaries.breakpoints[device]).map(function (deviceDetails, index) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
        key: "deviceWidth-".concat(deviceDetails[0])
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, deviceDetails[0], "px"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
        variant: "outlined"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: "outlined-items_to_show_".concat(deviceDetails[0]),
        name: "items_to_show[".concat(deviceDetails[0], "]"),
        value: values.items_to_show[deviceDetails[0]],
        onChange: handleChange,
        "aria-describedby": "outlined-items_to_show-helper-text",
        type: "number",
        endAdornment: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputAdornment__WEBPACK_IMPORTED_MODULE_14__["default"], {
          position: "end"
        }, __('items', 'wp-posts-carousel')),
        inputProps: {
          min: 1
        }
      }))));
    })))));
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "wp-posts-carousel-message wp-posts-carousel-message-eror"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, __('Ups, make sure that you defined correctly breakpints in your filter "wp_posts_carousel_breakpoints".', 'wp-posts-carousel'))))))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Slide by', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
    variant: "outlined"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__["default"], {
    id: "outlined-slide_by",
    name: "slide_by",
    value: values.slide_by,
    onChange: handleChange,
    "aria-describedby": "outlined-slide_by-helper-text",
    type: "number",
    endAdornment: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputAdornment__WEBPACK_IMPORTED_MODULE_14__["default"], {
      position: "end"
    }, __('items', 'wp-posts-carousel')),
    inputProps: {
      min: 1
    }
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('RTL', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "rtl",
      checked: values.rtl,
      onChange: handleChange
    })
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Stage padding', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
    variant: "outlined"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__["default"], {
    id: "outlined-stage_padding",
    name: "stage_padding",
    value: values.stage_padding,
    onChange: handleChange,
    "aria-describedby": "outlined-stage_padding-helper-text",
    type: "number",
    endAdornment: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputAdornment__WEBPACK_IMPORTED_MODULE_14__["default"], {
      position: "end"
    }, "px"),
    inputProps: {
      min: 1
    }
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Margin', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
    variant: "outlined"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__["default"], {
    id: "outlined-margin",
    name: "margin",
    value: values.stage_padding,
    onChange: handleChange,
    "aria-describedby": "outlined-margin-helper-text",
    type: "number",
    endAdornment: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputAdornment__WEBPACK_IMPORTED_MODULE_14__["default"], {
      position: "end"
    }, "px")
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Inifnity loop', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "loop",
      checked: values.loop,
      onChange: handleChange
    })
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Pause on mouse hover', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "stop_on_hover",
      checked: values.stop_on_hover,
      onChange: handleChange
    })
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Auto play', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "auto_play",
      checked: values.auto_play,
      onChange: handleChange
    })
  }))), values.auto_play && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Autoplay interval timeout', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
    variant: "outlined"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__["default"], {
    id: "outlined-auto_play_timeout",
    name: "auto_play_timeout",
    value: values.auto_play_timeout,
    onChange: handleChange,
    "aria-describedby": "outlined-auto_play_timeout-helper-text",
    type: "number",
    endAdornment: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputAdornment__WEBPACK_IMPORTED_MODULE_14__["default"], {
      position: "end"
    }, "ms"),
    inputProps: {
      min: 1
    }
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Show "next" and "prev" buttons', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "nav",
      checked: values.nav,
      onChange: handleChange
    })
  }))), values.nav && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Navigation speed', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
    variant: "outlined"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__["default"], {
    id: "outlined-nav_speed",
    name: "nav_speed",
    value: values.nav_speed,
    onChange: handleChange,
    "aria-describedby": "outlined-nav_speed-helper-text",
    type: "number",
    endAdornment: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputAdornment__WEBPACK_IMPORTED_MODULE_14__["default"], {
      position: "end"
    }, "ms"),
    inputProps: {
      min: 1
    }
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Show dots navigation', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "dots",
      checked: values.dots,
      onChange: handleChange
    })
  }))), values.dots && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Dots speed', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
    variant: "outlined"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__["default"], {
    id: "outlined-dots_speed",
    name: "dots_speed",
    value: values.dots_speed,
    onChange: handleChange,
    "aria-describedby": "outlined-dots_speed-helper-text",
    type: "number",
    endAdornment: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputAdornment__WEBPACK_IMPORTED_MODULE_14__["default"], {
      position: "end"
    }, "ms"),
    inputProps: {
      min: 1
    }
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Delays loading of images', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "lazy_load",
      checked: values.lazy_load,
      onChange: handleChange
    })
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Mouse events', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "mouse_drag",
      checked: values.mouse_drag,
      onChange: handleChange
    })
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Mousewheel scrolling', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "mouse_wheel",
      checked: values.mouse_wheel,
      onChange: handleChange
    })
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Touch events', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "touch_drag",
      checked: values.touch_drag,
      onChange: handleChange
    })
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Animation', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Auto width', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "auto_width",
      checked: values.auto_width,
      onChange: handleChange
    })
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, __('Auto height', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      color: "primary",
      name: "auto_height",
      checked: values.auto_height,
      onChange: handleChange
    })
  }))))))));
};

/* harmony default export */ __webpack_exports__["default"] = (CarouselOptions);

/***/ }),

/***/ "./src/admin-app/pages/Carousels/Components/Parts/DisplayOptions.js":
/*!**************************************************************************!*\
  !*** ./src/admin-app/pages/Carousels/Components/Parts/DisplayOptions.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/dist/mobxreact.esm.js");
/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/Typography */ "./node_modules/@mui/material/Typography/index.js");
/* harmony import */ var _mui_material_Accordion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material/Accordion */ "./node_modules/@mui/material/Accordion/index.js");
/* harmony import */ var _mui_material_AccordionSummary__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/AccordionSummary */ "./node_modules/@mui/material/AccordionSummary/index.js");
/* harmony import */ var _mui_material_AccordionDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/material/AccordionDetails */ "./node_modules/@mui/material/AccordionDetails/index.js");
/* harmony import */ var _mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mui/icons-material/ExpandMore */ "./node_modules/@mui/icons-material/ExpandMore.js");
/* harmony import */ var _mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mui/material/FormControl */ "./node_modules/@mui/material/FormControl/index.js");
/* harmony import */ var _mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mui/material/FormControlLabel */ "./node_modules/@mui/material/FormControlLabel/index.js");
/* harmony import */ var _mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @mui/material/OutlinedInput */ "./node_modules/@mui/material/OutlinedInput/index.js");
/* harmony import */ var _mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @mui/material/Switch */ "./node_modules/@mui/material/Switch/index.js");
/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @mui/material/Box */ "./node_modules/@mui/material/Box/index.js");
/* harmony import */ var _mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @mui/material/Grid */ "./node_modules/@mui/material/Grid/index.js");
/* harmony import */ var _mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @mui/material/InputLabel */ "./node_modules/@mui/material/InputLabel/index.js");
/* harmony import */ var _components_Forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../components/Forms */ "./src/admin-app/components/Forms/index.jsx");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! formik */ "./node_modules/formik/dist/formik.esm.js");
















var __ = wp.i18n.__;

var DisplayOptions = function DisplayOptions(props) {
  var _useFormikContext = Object(formik__WEBPACK_IMPORTED_MODULE_15__["useFormikContext"])(),
      values = _useFormikContext.values,
      handleChange = _useFormikContext.handleChange;

  var data = props.data,
      panelName = props.panelName,
      handleExpand = props.handleExpand,
      store = props.store;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Accordion__WEBPACK_IMPORTED_MODULE_3__["default"], {
    defaultExpanded: true,
    onChange: handleExpand(panelName)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_AccordionSummary__WEBPACK_IMPORTED_MODULE_4__["default"], {
    expandIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6___default.a, null),
    "aria-controls": "".concat(panelName, "-content"),
    id: "".concat(panelName, "-header")
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_2__["default"], null, __('Display options', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_AccordionDetails__WEBPACK_IMPORTED_MODULE_5__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Box__WEBPACK_IMPORTED_MODULE_11__["default"], {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    container: true,
    spacing: 2
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    required: true,
    htmlFor: "template"
  }, __('Theme', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "show_title"
  }, __('Show title', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      name: 'show_title',
      checked: values['show_title'],
      onChange: handleChange,
      value: true,
      inputProps: {
        'aria-label': __('Show title', 'wp-posts-carousel')
      }
    })
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "show_author"
  }, __('Show author', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      name: 'show_author',
      checked: values['show_author'],
      onChange: handleChange,
      value: true,
      inputProps: {
        'aria-label': __('Show author', 'wp-posts-carousel')
      }
    })
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "show_created_date"
  }, __('Show created date', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      name: 'show_created_date',
      checked: values['show_created_date'],
      onChange: handleChange,
      value: true,
      inputProps: {
        'aria-label': __('Show created date', 'wp-posts-carousel')
      }
    })
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    required: true,
    htmlFor: "show_description"
  }, __('Show description', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    name: "show_description",
    options: data.dictionaries.description,
    value: values['show_description']
  })), values['show_description'].value === 'content' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "allow_shortcodes"
  }, __('Allow shortcodes in full content', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      name: 'allow_shortcodes',
      checked: values['allow_shortcodes'],
      onChange: handleChange,
      value: true,
      inputProps: {
        'aria-label': __('Allow shortcodes in full content', 'wp-posts-carousel')
      }
    })
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "show_category"
  }, __('Show category', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      name: 'show_category',
      checked: values['show_category'],
      onChange: handleChange,
      value: true,
      inputProps: {
        'aria-label': __('Show category', 'wp-posts-carousel')
      }
    })
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "show_tags"
  }, __('Show tags', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      name: 'show_tags',
      checked: values['show_tags'],
      onChange: handleChange,
      inputProps: {
        'aria-label': __('Show tags', 'wp-posts-carousel')
      }
    })
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "show_more_button"
  }, __('Show more button', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      name: 'show_more_button',
      checked: values['show_more_button'],
      onChange: handleChange,
      value: true,
      inputProps: {
        'aria-label': __('Show more button', 'wp-posts-carousel')
      }
    })
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "show_featured_image"
  }, __('Show featured image', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_8__["default"], {
    label: "",
    control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Switch__WEBPACK_IMPORTED_MODULE_10__["default"], {
      name: 'show_featured_image',
      checked: values['show_featured_image'],
      onChange: handleChange,
      value: true,
      inputProps: {
        'aria-label': __('Show featured image', 'wp-posts-carousel')
      }
    })
  })), values['show_featured_image'] && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "image_source"
  }, __('Image source', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    name: "image_source",
    options: data.dictionaries.image_sources,
    value: values['image_source']
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "image_width"
  }, __('Image width', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
    variant: "outlined"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__["default"], {
    id: "image_width",
    name: "image_width",
    value: values['image_width'],
    onChange: handleChange('image_width'),
    "aria-describedby": "outlined-image_width-helper-text",
    type: "number"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    name: "image_width_unit",
    fullWidth: false,
    options: data.dictionaries.image_units,
    value: values['image_width_unit'],
    sx: {
      width: '70px',
      display: 'inline-flex',
      ml: 1
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_13__["default"], {
    htmlFor: "image_height"
  }, __('Image height', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_12__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_7__["default"], {
    variant: "outlined"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_OutlinedInput__WEBPACK_IMPORTED_MODULE_9__["default"], {
    id: "image_height",
    name: "image_height",
    value: values['image_height'],
    onChange: handleChange('image_height'),
    "aria-describedby": "outlined-image_height-helper-text",
    type: "number"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    name: "image_height_unit",
    fullWidth: false,
    options: data.dictionaries.image_units,
    value: values['image_height_unit'],
    sx: {
      width: '70px',
      display: 'inline-flex',
      ml: 1
    }
  }))))))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(DisplayOptions)); // { __( 'Image width', 'wp-posts-carousel' ) }
// 		<FormControl
// 			className={ clsx( classes.margin, classes.textField ) }
// 			variant="outlined"
// 		>
// 			<OutlinedInput
// 				id="outlined-image_width"
// 				name="image_width"
// 				value={ values.image_width }
// 				onChange={ handleChange( 'image_width' ) }
// 				aria-describedby="outlined-image_width-helper-text"
// 				type="number"
// 			/>
// 		</FormControl>
// 		<FormControl
// 			variant="outlined"
// 			className={ classes.formControl }
// 			style={ { marginLeft: '5px' } }
// 			size="small"
// 		>
// 			<Select
// 				id="image_width_unit"
// 				value={ values.image_width_unit || '' }
// 				onChange={ handleChange }
// 				displayEmpty
// 				name="image_width_unit"
// 			>
// 				{ data &&
// 					data.dictionaries.image_units &&
// 					data.dictionaries.image_units.map( ( item, index ) => {
// 						return (
// 							<MenuItem
// 								value={ item.id }
// 								key={ `order_by${ index }` }
// 							>
// 								{ item.name }
// 							</MenuItem>
// 						);
// 					} ) }
// 			</Select>
// 		</FormControl>
// { __( 'Image height', 'wp-posts-carousel' ) }
// <FormControl
// 		className={ clsx( classes.margin, classes.textField ) }
// 		variant="outlined"
// 	>
// 		<OutlinedInput
// 			id="outlined-image_height"
// 			name="image_height"
// 			value={ values.image_height }
// 			onChange={ handleChange( 'image_height' ) }
// 			aria-describedby="outlined-image_height-helper-text"
// 			type="number"
// 		/>
// 	</FormControl>
// 	<FormControl
// 		variant="outlined"
// 		className={ classes.formControl }
// 		style={ { marginLeft: '5px' } }
// 		size="small"
// 	>
// 		<Select
// 			id="image_height_unit"
// 			value={ values.image_height_unit || '' }
// 			onChange={ handleChange }
// 			displayEmpty
// 			name="image_height_unit"
// 		>
// 			{ data &&
// 				data.dictionaries.image_units &&
// 				data.dictionaries.image_units.map( ( item, index ) => {
// 					return (
// 						<MenuItem
// 							value={ item.id }
// 							key={ `order_by${ index }` }
// 						>
// 							{ item.name }
// 						</MenuItem>
// 					);
// 				} ) }
// 		</Select>
// 	</FormControl>

/***/ }),

/***/ "./src/admin-app/pages/Carousels/Components/Parts/PostSelectionCriteria.js":
/*!*********************************************************************************!*\
  !*** ./src/admin-app/pages/Carousels/Components/Parts/PostSelectionCriteria.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/dist/mobxreact.esm.js");
/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/Typography */ "./node_modules/@mui/material/Typography/index.js");
/* harmony import */ var _mui_material_Accordion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material/Accordion */ "./node_modules/@mui/material/Accordion/index.js");
/* harmony import */ var _mui_material_AccordionSummary__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/AccordionSummary */ "./node_modules/@mui/material/AccordionSummary/index.js");
/* harmony import */ var _mui_material_AccordionDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/material/AccordionDetails */ "./node_modules/@mui/material/AccordionDetails/index.js");
/* harmony import */ var _mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mui/icons-material/ExpandMore */ "./node_modules/@mui/icons-material/ExpandMore.js");
/* harmony import */ var _mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mui_material_FormHelperText__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mui/material/FormHelperText */ "./node_modules/@mui/material/FormHelperText/index.js");
/* harmony import */ var _mui_material_FormControl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mui/material/FormControl */ "./node_modules/@mui/material/FormControl/index.js");
/* harmony import */ var _mui_material_TextField__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @mui/material/TextField */ "./node_modules/@mui/material/TextField/index.js");
/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @mui/material/Box */ "./node_modules/@mui/material/Box/index.js");
/* harmony import */ var _mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @mui/material/Grid */ "./node_modules/@mui/material/Grid/index.js");
/* harmony import */ var _mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @mui/material/InputLabel */ "./node_modules/@mui/material/InputLabel/index.js");
/* harmony import */ var _mui_material_Paper__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @mui/material/Paper */ "./node_modules/@mui/material/Paper/index.js");
/* harmony import */ var _components_Forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../components/Forms */ "./src/admin-app/components/Forms/index.jsx");
/* harmony import */ var _components_Tooltip__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./../../../../components/Tooltip */ "./src/admin-app/components/Tooltip.jsx");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! formik */ "./node_modules/formik/dist/formik.esm.js");

















var __ = wp.i18n.__;
var permalinkStructure = wpPostsCarouselPluginData.permalinkStructure;

var PostSelectionCriteria = function PostSelectionCriteria(props) {
  var _data$dictionaries$ca, _data$dictionaries$re, _data$dictionaries$ta2, _data$dictionaries$po, _data$dictionaries$ex;

  var _useFormikContext = Object(formik__WEBPACK_IMPORTED_MODULE_16__["useFormikContext"])(),
      values = _useFormikContext.values,
      touched = _useFormikContext.touched,
      errors = _useFormikContext.errors,
      handleChange = _useFormikContext.handleChange,
      setFieldValue = _useFormikContext.setFieldValue;

  var endpoints = {
    posts: '/wp-json/wp-posts-carousel/v1/admin/posts?s=',
    categories: '/wp-json/wp-posts-carousel/v1/admin/categories?s=',
    tags: '/wp-json/wp-posts-carousel/v1/admin/tags?s='
  };
  var data = props.data,
      panelName = props.panelName,
      handleExpand = props.handleExpand,
      store = props.store;
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    var posts = [];

    if (values['posts'] && values['posts'].length > 0) {
      posts = values['posts'].filter(function (option) {
        return values['post_types'].some(function (postType) {
          return option.post_type === postType.value;
        });
      });
    }

    setFieldValue('posts', posts);
  }, [values['post_types']]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Accordion__WEBPACK_IMPORTED_MODULE_3__["default"], {
    defaultExpanded: true,
    onChange: handleExpand(panelName)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_AccordionSummary__WEBPACK_IMPORTED_MODULE_4__["default"], {
    expandIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6___default.a, null),
    "aria-controls": "".concat(panelName, "-content"),
    id: "".concat(panelName, "-header")
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_2__["default"], null, __('Post selection criteria', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_AccordionDetails__WEBPACK_IMPORTED_MODULE_5__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Box__WEBPACK_IMPORTED_MODULE_10__["default"], {
    sx: {
      flexGrow: 1
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    container: true,
    spacing: 2
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__["default"], {
    required: true,
    htmlFor: "post_types"
  }, __('Post types', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    customProps: {
      store: store
    },
    name: "post_types",
    multiple: true,
    options: data.dictionaries.taxonomies,
    value: values['post_types']
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__["default"], {
    required: true,
    htmlFor: "order_by"
  }, __('Order by', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    customProps: {
      store: store
    },
    name: "order_by",
    options: data.dictionaries.order_by,
    value: values['order_by']
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__["default"], {
    required: true,
    htmlFor: "ordering"
  }, __('Ordering', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    customProps: {
      store: store
    },
    name: "ordering",
    options: data.dictionaries.ordering,
    value: values['ordering']
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__["default"], {
    required: true,
    htmlFor: "all_items"
  }, __('Posts limit', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_8__["default"], {
    variant: "outlined",
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TextField__WEBPACK_IMPORTED_MODULE_9__["default"], {
    id: "outlined-all_items",
    name: "all_items",
    value: values.all_items || '',
    onChange: handleChange,
    variant: "outlined",
    "aria-describedby": "outlined-all_items-helper-text",
    type: "number",
    helperText: touched.all_items ? errors.all_items : '',
    error: touched.all_items && Boolean(errors.all_items)
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Paper__WEBPACK_IMPORTED_MODULE_13__["default"], {
    sx: {
      p: 1
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    container: true,
    spacing: 2
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__["default"], {
    htmlFor: "categories"
  }, __('Posts from Categories', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    customProps: {
      store: store,
      endpoint: endpoints.categories
    },
    name: "categories",
    multiple: true,
    options: (_data$dictionaries$ca = data.dictionaries.categories) !== null && _data$dictionaries$ca !== void 0 ? _data$dictionaries$ca : [],
    value: values['categories'],
    noOptionsText: __('No categories', 'wp-posts-carousel'),
    groupBy: function groupBy(option) {
      var _data$dictionaries$ta;

      return (_data$dictionaries$ta = data.dictionaries.taxonomies.find(function (item) {
        return item.value === option.post_type;
      })) === null || _data$dictionaries$ta === void 0 ? void 0 : _data$dictionaries$ta.label;
    },
    disabled: !values['post_types']
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    name: "relation",
    options: (_data$dictionaries$re = data.dictionaries.relations) !== null && _data$dictionaries$re !== void 0 ? _data$dictionaries$re : [],
    value: values['relation'],
    disabled: !values['post_types']
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__["default"], {
    htmlFor: "tags"
  }, __('Posts with Tags', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    customProps: {
      store: store,
      endpoint: endpoints.tags
    },
    name: "tags",
    multiple: true,
    options: (_data$dictionaries$ta2 = data.dictionaries.tags) !== null && _data$dictionaries$ta2 !== void 0 ? _data$dictionaries$ta2 : [],
    value: values['tags'],
    noOptionsText: __('No tags', 'wp-posts-carousel'),
    groupBy: function groupBy(option) {
      var _data$dictionaries$ta3;

      return (_data$dictionaries$ta3 = data.dictionaries.taxonomies.find(function (item) {
        return item.value === option.post_type;
      })) === null || _data$dictionaries$ta3 === void 0 ? void 0 : _data$dictionaries$ta3.label;
    },
    disabled: !values['post_types']
  }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__["default"], {
    htmlFor: "posts"
  }, __('Posts', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    customProps: {
      store: store,
      endpoint: endpoints.posts
    },
    name: "posts",
    multiple: true,
    options: (_data$dictionaries$po = data.dictionaries.posts) !== null && _data$dictionaries$po !== void 0 ? _data$dictionaries$po : [],
    value: values['posts'],
    noOptionsText: __('No posts', 'wp-posts-carousel'),
    onOpen: function onOpen() {
      if (values['posts'].length >= values['all_items']) {
        store.enqueueSnackbar({
          message: __('The article limit has been reached.\nDelete an article or increase the "Posts limit"', 'wp-posts-carousel'),
          options: {
            variant: 'warning'
          }
        });
      }
    },
    groupBy: function groupBy(option) {
      var _data$dictionaries$ta4;

      return (_data$dictionaries$ta4 = data.dictionaries.taxonomies.find(function (item) {
        return item.value === option.post_type;
      })) === null || _data$dictionaries$ta4 === void 0 ? void 0 : _data$dictionaries$ta4.label;
    },
    disabled: !values['post_types']
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__["default"], {
    htmlFor: "exclude"
  }, __('Exclude Posts', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__["default"], {
    item: true,
    xs: 12,
    sm: 9
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Forms__WEBPACK_IMPORTED_MODULE_14__["CustomAutocomplete"], {
    customProps: {
      store: store,
      endpoint: endpoints.posts
    },
    name: "exclude",
    multiple: true,
    options: (_data$dictionaries$ex = data.dictionaries.exclude) !== null && _data$dictionaries$ex !== void 0 ? _data$dictionaries$ex : [],
    value: values['exclude'],
    noOptionsText: __('No posts', 'wp-posts-carousel'),
    groupBy: function groupBy(option) {
      var _data$dictionaries$ta5;

      return (_data$dictionaries$ta5 = data.dictionaries.taxonomies.find(function (item) {
        return item.value === option.post_type;
      })) === null || _data$dictionaries$ta5 === void 0 ? void 0 : _data$dictionaries$ta5.label;
    },
    disabled: !values['post_types']
  })))))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(PostSelectionCriteria));

/***/ }),

/***/ "./src/admin-app/pages/Carousels/Components/Parts/TemplateOptions.js":
/*!***************************************************************************!*\
  !*** ./src/admin-app/pages/Carousels/Components/Parts/TemplateOptions.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/dist/mobxreact.esm.js");
/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/Typography */ "./node_modules/@mui/material/Typography/index.js");
/* harmony import */ var _mui_material_Accordion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material/Accordion */ "./node_modules/@mui/material/Accordion/index.js");
/* harmony import */ var _mui_material_AccordionSummary__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/AccordionSummary */ "./node_modules/@mui/material/AccordionSummary/index.js");
/* harmony import */ var _mui_material_AccordionDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/material/AccordionDetails */ "./node_modules/@mui/material/AccordionDetails/index.js");
/* harmony import */ var _mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mui/icons-material/ExpandMore */ "./node_modules/@mui/icons-material/ExpandMore.js");
/* harmony import */ var _mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _mui_material_FormHelperText__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mui/material/FormHelperText */ "./node_modules/@mui/material/FormHelperText/index.js");
/* harmony import */ var _mui_material_FormControl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mui/material/FormControl */ "./node_modules/@mui/material/FormControl/index.js");
/* harmony import */ var _mui_material_TextField__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @mui/material/TextField */ "./node_modules/@mui/material/TextField/index.js");
/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @mui/material/Box */ "./node_modules/@mui/material/Box/index.js");
/* harmony import */ var _mui_material_Grid__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @mui/material/Grid */ "./node_modules/@mui/material/Grid/index.js");
/* harmony import */ var _mui_material_InputLabel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @mui/material/InputLabel */ "./node_modules/@mui/material/InputLabel/index.js");
/* harmony import */ var _mui_material_Paper__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @mui/material/Paper */ "./node_modules/@mui/material/Paper/index.js");
/* harmony import */ var _components_Forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../components/Forms */ "./src/admin-app/components/Forms/index.jsx");
/* harmony import */ var _components_Tooltip__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../components/Tooltip */ "./src/admin-app/components/Tooltip.jsx");
/* harmony import */ var formik__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! formik */ "./node_modules/formik/dist/formik.esm.js");

















var __ = wp.i18n.__;
var permalinkStructure = wpPostsCarouselPluginData.permalinkStructure;

var TemplateOptions = function TemplateOptions(props) {
  var _useFormikContext = Object(formik__WEBPACK_IMPORTED_MODULE_16__["useFormikContext"])(),
      values = _useFormikContext.values,
      touched = _useFormikContext.touched,
      errors = _useFormikContext.errors,
      handleChange = _useFormikContext.handleChange,
      setFieldValue = _useFormikContext.setFieldValue;

  var endpoints = {
    posts: '/wp-json/wp-posts-carousel/v1/admin/posts?s=',
    categories: '/wp-json/wp-posts-carousel/v1/admin/categories?s=',
    tags: '/wp-json/wp-posts-carousel/v1/admin/tags?s='
  };
  var classes = props.classes,
      data = props.data,
      panelName = props.panelName,
      handleExpand = props.handleExpand,
      store = props.store;
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    var posts = [];

    if (values['posts'] && values['posts'].length > 0) {
      posts = values['posts'].filter(function (option) {
        return values['post_types'].some(function (postType) {
          return option.post_type === postType.value;
        });
      });
    }

    setFieldValue('posts', posts);
  }, [values['post_types']]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Accordion__WEBPACK_IMPORTED_MODULE_3__["default"], {
    defaultExpanded: true,
    onChange: handleExpand(panelName)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_AccordionSummary__WEBPACK_IMPORTED_MODULE_4__["default"], {
    expandIcon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_icons_material_ExpandMore__WEBPACK_IMPORTED_MODULE_6___default.a, null),
    "aria-controls": "".concat(panelName, "-content"),
    id: "".concat(panelName, "-header")
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_2__["default"], null, __('Template', 'wp-posts-carousel'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_AccordionDetails__WEBPACK_IMPORTED_MODULE_5__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Box__WEBPACK_IMPORTED_MODULE_10__["default"], {
    sx: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > :not(style)': {
        m: 1,
        width: 128,
        height: 128
      }
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Paper__WEBPACK_IMPORTED_MODULE_13__["default"], {
    elevation: 1
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Paper__WEBPACK_IMPORTED_MODULE_13__["default"], {
    elevation: 1
  })))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(TemplateOptions));

/***/ }),

/***/ "./src/admin-app/pages/Carousels/Models/Schemas/CarouselSchema.jsx":
/*!*************************************************************************!*\
  !*** ./src/admin-app/pages/Carousels/Models/Schemas/CarouselSchema.jsx ***!
  \*************************************************************************/
/*! exports provided: CarouselSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CarouselSchema", function() { return CarouselSchema; });
/* harmony import */ var _components_Yup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../../../components/Yup */ "./src/admin-app/components/Yup.jsx");

var CarouselSchema = _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].object().shape({
  title: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].string().required(),
  post_types: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].array().min(1).required(),
  order_by: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].string().required(),
  ordering: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].string().required(),
  all_items: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].number().positive().required(),
  categories: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].array(),
  relation: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].string(),
  tags: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].array(),
  posts: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].array(),
  exclude: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].array() // template: '',
  // show_title: false,
  // show_author: false,
  // show_created_date: false,
  // show_description: false,
  // allow_shortcodes: false,
  // show_category: false,
  // show_tags: false,
  // show_more_button: false,
  // show_featured_image: false,
  // image_source: '',
  // image_width: '',
  // image_width_unit: '',
  // image_height: '',
  // image_height_unit: '',
  // items_to_show: '',
  // slide_by: '',
  // rtl: false,
  // stage_padding: '',
  // margin: '',
  // loop: false,
  // stop_on_hover: false,
  // auto_play: false,
  // auto_play_timeout: '',
  // nav: false,
  // nav_speed: '',
  // dots: false,
  // dots_speed: '',
  // lazy_load: false,
  // mouse_drag: false,
  // mouse_wheel:false,
  // touch_drag: false,
  // easing: '',
  // auto_width: false,
  // auto_height: false

});

/***/ })

}]);
//# sourceMappingURL=1.js.map