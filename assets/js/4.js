(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

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

/***/ "./src/admin-app/pages/Carousels/List.jsx":
/*!************************************************!*\
  !*** ./src/admin-app/pages/Carousels/List.jsx ***!
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
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/index.js");
/* harmony import */ var _mui_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @mui/styles */ "./node_modules/@mui/styles/index.js");
/* harmony import */ var _mui_material_Table__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/material/Table */ "./node_modules/@mui/material/Table/index.js");
/* harmony import */ var _mui_material_TableBody__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mui/material/TableBody */ "./node_modules/@mui/material/TableBody/index.js");
/* harmony import */ var _mui_material_TableCell__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @mui/material/TableCell */ "./node_modules/@mui/material/TableCell/index.js");
/* harmony import */ var _mui_material_TableContainer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mui/material/TableContainer */ "./node_modules/@mui/material/TableContainer/index.js");
/* harmony import */ var _mui_material_TableHead__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @mui/material/TableHead */ "./node_modules/@mui/material/TableHead/index.js");
/* harmony import */ var _mui_material_TableRow__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @mui/material/TableRow */ "./node_modules/@mui/material/TableRow/index.js");
/* harmony import */ var _mui_material_Button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @mui/material/Button */ "./node_modules/@mui/material/Button/index.js");
/* harmony import */ var _mui_material_Paper__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @mui/material/Paper */ "./node_modules/@mui/material/Paper/index.js");
/* harmony import */ var _mui_material_Grid__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @mui/material/Grid */ "./node_modules/@mui/material/Grid/index.js");
/* harmony import */ var _mui_material_Chip__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @mui/material/Chip */ "./node_modules/@mui/material/Chip/index.js");
/* harmony import */ var _mui_material_Dialog__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @mui/material/Dialog */ "./node_modules/@mui/material/Dialog/index.js");
/* harmony import */ var _mui_material_DialogActions__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @mui/material/DialogActions */ "./node_modules/@mui/material/DialogActions/index.js");
/* harmony import */ var _mui_material_DialogContent__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @mui/material/DialogContent */ "./node_modules/@mui/material/DialogContent/index.js");
/* harmony import */ var _mui_material_DialogContentText__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @mui/material/DialogContentText */ "./node_modules/@mui/material/DialogContentText/index.js");
/* harmony import */ var _mui_material_DialogTitle__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @mui/material/DialogTitle */ "./node_modules/@mui/material/DialogTitle/index.js");
/* harmony import */ var _components_Api__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../components/Api */ "./src/admin-app/components/Api.js");
/* harmony import */ var _components_Tooltip__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../components/Tooltip */ "./src/admin-app/components/Tooltip.jsx");
/* harmony import */ var react_copy_to_clipboard__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! react-copy-to-clipboard */ "./node_modules/react-copy-to-clipboard/lib/index.js");
/* harmony import */ var react_copy_to_clipboard__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(react_copy_to_clipboard__WEBPACK_IMPORTED_MODULE_22__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }












 // import AddIcon from '@material-ui/icons/Add';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';












var __ = wp.i18n.__;
var pluginUrl = wpPostsCarouselPluginData.pluginUrl;

var List = function List(props) {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]),
      _useState2 = _slicedToArray(_useState, 2),
      list = _useState2[0],
      setList = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(''),
      _useState4 = _slicedToArray(_useState3, 2),
      hoveringOver = _useState4[0],
      setHoveringOver = _useState4[1];

  var handleRowHover = function handleRowHover(event, id) {
    return setHoveringOver(id);
  };

  var handleRowHoverLeave = function handleRowHoverLeave(event, id) {
    return setHoveringOver('');
  };

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState6 = _slicedToArray(_useState5, 2),
      openDeleteDialog = _useState6[0],
      setOpenDeleteDialog = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null),
      _useState8 = _slicedToArray(_useState7, 2),
      selectedCarousel = _useState8[0],
      setSelectedCarousel = _useState8[1];

  var handleOpenDeleteDialog = function handleOpenDeleteDialog(event, item) {
    setOpenDeleteDialog(true);
    setSelectedCarousel(item);
  };

  var handleCloseDeleteDialog = function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
    setSelectedCarousel(null);
  };

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false),
      _useState10 = _slicedToArray(_useState9, 2),
      copiedShortcode = _useState10[0],
      setCopiedShortcode = _useState10[1];

  var handleCopyShortcode = function handleCopyShortcode() {
    setCopiedShortcode(true);
    props.store.enqueueSnackbar({
      message: __('Skopiowano krótki kod,\nMożesz wkleić go w dowolnym miejscu na stronie', 'wp-posts-carousel'),
      options: {
        variant: 'success'
      }
    });
  };

  var handleGetCarousels = function handleGetCarousels() {
    var values = []; //const query = queryString.parse( props.location.search );

    _components_Api__WEBPACK_IMPORTED_MODULE_20__["default"].get('/wp-json/wp-posts-carousel/v1/admin/carousels', {}).then(function (response) {
      if (response.status == 200 && response.data) {
        setList(response.data);
      }
    })["catch"](function (error) {
      props.store.enqueueSnackbar({
        message: __('Failed fetching data', 'wp-posts-carousel'),
        options: {
          variant: 'error'
        }
      });
    });
  };

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    return handleGetCarousels();
  }, []);

  var handleDeleteCarousel = function handleDeleteCarousel() {
    _components_Api__WEBPACK_IMPORTED_MODULE_20__["default"]["delete"]("/wp-json/wp-posts-carousel/v1/admin/carousel/".concat(selectedCarousel.ID), {}).then(function (response) {
      handleCloseDeleteDialog();

      if (response.status == 200 && response.data) {
        props.store.enqueueSnackbar({
          message: __('Carousel was deleted', 'wp-posts-carousel'),
          options: {
            variant: 'success'
          }
        });
        handleGetCarousels();
      }
    })["catch"](function (error) {
      props.store.enqueueSnackbar({
        message: __('Failed delete carousel', 'wp-posts-carousel'),
        options: {
          variant: 'error'
        }
      });
    });
  };

  var CustomTableRow = Object(_mui_styles__WEBPACK_IMPORTED_MODULE_4__["withStyles"])(function (theme) {
    return {
      root: {
        verticalAlign: 'top'
      }
    };
  })(_mui_material_TableRow__WEBPACK_IMPORTED_MODULE_10__["default"]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
    size: "small",
    variant: "contained",
    color: "primary" // startIcon={ /*<AddIcon />*/ }
    ,
    component: react_router_dom__WEBPACK_IMPORTED_MODULE_3__["Link"],
    to: "admin.php?page=wp-posts-carousel&subpage=carousels&action=add-new"
  }, __('Add new carousel', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
    container: true,
    spacing: 3,
    style: {
      marginTop: '20px'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Grid__WEBPACK_IMPORTED_MODULE_13__["default"], {
    item: true,
    xs: 12,
    md: 12,
    lg: 12
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Paper__WEBPACK_IMPORTED_MODULE_12__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableContainer__WEBPACK_IMPORTED_MODULE_8__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Table__WEBPACK_IMPORTED_MODULE_5__["default"], {
    stickyHeader: true,
    "aria-label": " table"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableHead__WEBPACK_IMPORTED_MODULE_9__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableRow__WEBPACK_IMPORTED_MODULE_10__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableCell__WEBPACK_IMPORTED_MODULE_7__["default"], {
    key: 'post_title'
  }, __('Title', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableCell__WEBPACK_IMPORTED_MODULE_7__["default"], {
    key: 'user_nicename',
    style: {
      width: 250
    }
  }, __('Author', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableCell__WEBPACK_IMPORTED_MODULE_7__["default"], {
    key: 'shortcode',
    style: {
      width: 250,
      maxWidth: 300
    }
  }, "Shortcode"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableCell__WEBPACK_IMPORTED_MODULE_7__["default"], {
    key: 'post_date',
    style: {
      width: 150,
      maxWidth: 200
    }
  }, __('Date', 'wp-posts-carousel')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableBody__WEBPACK_IMPORTED_MODULE_6__["default"], null, list.length > 0 && list.map(function (row) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CustomTableRow, {
      hover: true,
      role: "checkbox",
      tabIndex: -1,
      key: row.ID,
      onMouseEnter: function onMouseEnter(e) {
        return handleRowHover(e, row.ID);
      },
      onMouseLeave: function onMouseLeave(e) {
        return handleRowHoverLeave(e, row.ID);
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableCell__WEBPACK_IMPORTED_MODULE_7__["default"], {
      key: 'post_title'
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, row.post_title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), hoveringOver === row.ID && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
      size: "small",
      variant: "contained",
      color: "primary" // startIcon={ /*<EditIcon />*/ }
      ,
      component: react_router_dom__WEBPACK_IMPORTED_MODULE_3__["Link"],
      to: "".concat(pluginUrl, "&subpage=carousels&action=edit&id=").concat(row.ID)
    }, __('Edytuj', 'wp-posts-carousel')), ' | ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
      size: "small",
      variant: "contained",
      color: "secondary" // startIcon={ /*<DeleteIcon />*/ }
      ,
      onClick: function onClick(e) {
        return handleOpenDeleteDialog(e, row);
      }
    }, __('Usuń', 'wp-posts-carousel')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableCell__WEBPACK_IMPORTED_MODULE_7__["default"], {
      key: 'user_nicename'
    }, row.user_nicename), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableCell__WEBPACK_IMPORTED_MODULE_7__["default"], {
      key: 'shortcode'
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Tooltip__WEBPACK_IMPORTED_MODULE_21__["CustomTooltip"], {
      title: __('Kliknij aby skopiować kod', 'wp-posts-carousel')
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Chip__WEBPACK_IMPORTED_MODULE_14__["default"], {
      color: "default",
      label: "[wp_posts_carousel id=".concat(row.ID, "]"),
      clickable: true
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_TableCell__WEBPACK_IMPORTED_MODULE_7__["default"], {
      key: 'post_date'
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, __(row.post_status, 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), row.post_date));
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Dialog__WEBPACK_IMPORTED_MODULE_15__["default"], {
    open: openDeleteDialog,
    onClose: handleCloseDeleteDialog,
    "aria-labelledby": "alert-dialog-title",
    "aria-describedby": "alert-dialog-description"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_DialogTitle__WEBPACK_IMPORTED_MODULE_19__["default"], {
    id: "alert-dialog-title"
  }, __('Czy na pewno chcesz ununąć ten element?', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_DialogContent__WEBPACK_IMPORTED_MODULE_17__["default"], null, selectedCarousel ? selectedCarousel.post_title : ''), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_DialogActions__WEBPACK_IMPORTED_MODULE_16__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
    onClick: handleCloseDeleteDialog,
    variant: "contained",
    color: "default"
  }, __('Anuluj', 'wp-posts-carousel')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_mui_material_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
    onClick: handleDeleteCarousel,
    variant: "contained",
    color: "secondary",
    autoFocus: true
  }, __('Tak', 'wp-posts-carousel'))))))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(List));

/***/ })

}]);
//# sourceMappingURL=4.js.map