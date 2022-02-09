(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "./src/admin-app/pages/Carousels/Edit.jsx":
/*!************************************************!*\
  !*** ./src/admin-app/pages/Carousels/Edit.jsx ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var queryString__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! queryString */ "./node_modules/queryString/index.js");
/* harmony import */ var queryString__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(queryString__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/dist/mobxreact.esm.js");
/* harmony import */ var _mui_material_Typography__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @mui/material/Typography */ "./node_modules/@mui/material/Typography/index.js");
/* harmony import */ var _mui_material_Container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/material/Container */ "./node_modules/@mui/material/Container/index.js");
/* harmony import */ var _Components_FormView__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Components/FormView */ "./src/admin-app/pages/Carousels/Components/FormView.js");
/* harmony import */ var _Models_EditCarouselModel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Models/EditCarouselModel */ "./src/admin-app/pages/Carousels/Models/EditCarouselModel.jsx");
/* harmony import */ var _Models_Schemas_EditCarouselSchema__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Models/Schemas/EditCarouselSchema */ "./src/admin-app/pages/Carousels/Models/Schemas/EditCarouselSchema.jsx");
/* harmony import */ var _components_Api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/Api */ "./src/admin-app/components/Api.js");
/* harmony import */ var _components_myForm__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../../components/myForm */ "./src/admin-app/components/myForm.jsx");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











var __ = wp.i18n.__;
var pluginUrl = wpPostsCarouselPluginData.pluginUrl;

var Edit = function Edit(props) {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(),
      _useState2 = _slicedToArray(_useState, 2),
      carousel = _useState2[0],
      setCarousel = _useState2[1];

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var values, query;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            values = [];
            query = queryString__WEBPACK_IMPORTED_MODULE_1___default.a.parse(props.location.search);
            _context.next = 4;
            return _components_Api__WEBPACK_IMPORTED_MODULE_8__["default"].get('/wp-json/wp-posts-carousel/v1/admin/carousel/' + query.id, {}).then(function (response) {
              if (response.status == 200 && response.data) {
                values.data = response.data;
                values.values = [];
                values.values.id = response.data.post.ID;
                values.values.title = response.data.post.post_title;
                var carousel_data = response.data.post.params ? JSON.parse(response.data.post.params) : response.data.default_values;
                values.values = Object.assign(values.values, carousel_data);
                setCarousel(values);
                props.store.setFormValues({
                  options: values.data.dictionaries,
                  values: carousel_data
                }); //console.log(values)
              }
            })["catch"](function (error) {
              props.store.enqueueSnackbar({
                message: __('Failed fetching data', 'wp-posts-carousel'),
                options: {
                  variant: 'error'
                }
              });
            });

          case 4:
            return _context.abrupt("return", function () {
              return setCarousel([]);
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Container__WEBPACK_IMPORTED_MODULE_4__["default"], {
    component: "main"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Typography__WEBPACK_IMPORTED_MODULE_3__["default"], {
    component: "h1",
    variant: "h5"
  }, __('Edit carousel', 'wp-posts-carousel')), carousel && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_myForm__WEBPACK_IMPORTED_MODULE_9__["default"], {
    model: _Models_EditCarouselModel__WEBPACK_IMPORTED_MODULE_6__["EditCarouselModel"],
    schema: _Models_Schemas_EditCarouselSchema__WEBPACK_IMPORTED_MODULE_7__["EditCarouselSchema"],
    response: carousel,
    enableReinitialize: true,
    onSubmit: function onSubmit(values) {
      _components_Api__WEBPACK_IMPORTED_MODULE_8__["default"].put("/wp-json/wp-posts-carousel/v1/admin/carousel/".concat(carousel.values.id), values).then(function (response) {
        if (response.status == 200 && response.data) {
          props.store.enqueueSnackbar({
            message: __('Carousel was saved', 'wp-posts-carousel'),
            options: {
              variant: 'success',
              autoHideDuration: 1000,
              onExiting: function onExiting() {
                props.history.push("".concat(pluginUrl, "&subpage=carousels&action=edit&id=").concat(carousel.values.id));
              }
            }
          });
        }
      })["catch"](function (error) {
        props.store.enqueueSnackbar({
          message: __('Failed save carousel', 'wp-posts-carousel'),
          options: {
            variant: 'error'
          }
        });
      });
    },
    props: props,
    form: _Components_FormView__WEBPACK_IMPORTED_MODULE_5__["default"]
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(Edit));

/***/ }),

/***/ "./src/admin-app/pages/Carousels/Models/EditCarouselModel.jsx":
/*!********************************************************************!*\
  !*** ./src/admin-app/pages/Carousels/Models/EditCarouselModel.jsx ***!
  \********************************************************************/
/*! exports provided: EditCarouselModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditCarouselModel", function() { return EditCarouselModel; });
var EditCarouselModel = {
  id: '',
  title: '',
  post_types: [],
  order_by: '',
  posts: '',
  exclude: '',
  categories: '',
  relation: '',
  tags: '',
  all_items: '',
  ordering: '',
  template: '',
  show_title: false,
  show_author: false,
  show_created_date: false,
  show_description: false,
  allow_shortcodes: false,
  show_category: false,
  show_tags: false,
  show_more_button: false,
  show_featured_image: false,
  image_source: '',
  image_width: '',
  image_width_unit: '',
  image_height: '',
  image_height_unit: '',
  items_to_show: '',
  slide_by: '',
  rtl: false,
  stage_padding: '',
  margin: '',
  loop: false,
  stop_on_hover: false,
  auto_play: false,
  auto_play_timeout: '',
  nav: false,
  nav_speed: '',
  dots: false,
  dots_speed: '',
  lazy_load: false,
  mouse_drag: false,
  mouse_wheel: false,
  touch_drag: false,
  easing: '',
  auto_width: false,
  auto_height: false
};

/***/ }),

/***/ "./src/admin-app/pages/Carousels/Models/Schemas/EditCarouselSchema.jsx":
/*!*****************************************************************************!*\
  !*** ./src/admin-app/pages/Carousels/Models/Schemas/EditCarouselSchema.jsx ***!
  \*****************************************************************************/
/*! exports provided: EditCarouselSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditCarouselSchema", function() { return EditCarouselSchema; });
/* harmony import */ var _components_Yup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../../../components/Yup */ "./src/admin-app/components/Yup.jsx");
/* harmony import */ var _CarouselSchema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CarouselSchema */ "./src/admin-app/pages/Carousels/Models/Schemas/CarouselSchema.jsx");


var EditCarouselSchema = _CarouselSchema__WEBPACK_IMPORTED_MODULE_1__["CarouselSchema"].shape({
  id: _components_Yup__WEBPACK_IMPORTED_MODULE_0__["default"].string().required()
});

/***/ })

}]);
//# sourceMappingURL=3.js.map