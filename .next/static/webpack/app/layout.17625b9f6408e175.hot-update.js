"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./src/app/globals.css":
/*!*****************************!*\
  !*** ./src/app/globals.css ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"80b5ca50a4bd\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvZ2xvYmFscy5jc3MiLCJtYXBwaW5ncyI6Ijs7OztBQUFBLGlFQUFlLGNBQWM7QUFDN0IsSUFBSSxJQUFVLElBQUksaUJBQWlCIiwic291cmNlcyI6WyIvVXNlcnMvaWJyYWtoaW11L0Rlc2t0b3AvUFJPSkVDVFMveGtsMXMvc3JjL2FwcC9nbG9iYWxzLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIjgwYjVjYTUwYTRiZFwiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/globals.css\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/components/navbar.tsx":
/*!***********************************!*\
  !*** ./src/components/navbar.tsx ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Navbar: () => (/* binding */ Navbar)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/.pnpm/next@15.1.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/link */ \"(app-pages-browser)/./node_modules/.pnpm/next@15.1.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/client/app-dir/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/.pnpm/next@15.1.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _barrel_optimize_names_Menu_X_lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! __barrel_optimize__?names=Menu,X!=!lucide-react */ \"(app-pages-browser)/./node_modules/.pnpm/lucide-react@0.474.0_react@19.0.0/node_modules/lucide-react/dist/esm/icons/x.js\");\n/* harmony import */ var _barrel_optimize_names_Menu_X_lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! __barrel_optimize__?names=Menu,X!=!lucide-react */ \"(app-pages-browser)/./node_modules/.pnpm/lucide-react@0.474.0_react@19.0.0/node_modules/lucide-react/dist/esm/icons/menu.js\");\n/* __next_internal_client_entry_do_not_use__ Navbar auto */ \nvar _s = $RefreshSig$();\n\n\n\nfunction Navbar() {\n    _s();\n    const [isMenuOpen, setIsMenuOpen] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);\n    const navLinks = [\n        {\n            href: \"/\",\n            label: \"Home\"\n        },\n        {\n            href: \"/about\",\n            label: \"About\"\n        },\n        {\n            href: \"/services\",\n            label: \"Services\"\n        },\n        {\n            href: \"/contact\",\n            label: \"Contact\"\n        }\n    ];\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n        className: \"fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/40 backdrop-blur-md rounded-full px-6 py-3 shadow-lg w-[90%] md:w-[720px] lg:w-[960px] flex justify-end md:justify-center items-center\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                className: \"md:hidden\",\n                onClick: ()=>setIsMenuOpen(!isMenuOpen),\n                \"aria-label\": \"Toggle menu\",\n                children: isMenuOpen ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Menu_X_lucide_react__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                    className: \"h-6 w-6\"\n                }, void 0, false, {\n                    fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n                    lineNumber: 25,\n                    columnNumber: 11\n                }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_Menu_X_lucide_react__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                    className: \"h-6 w-6\"\n                }, void 0, false, {\n                    fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n                    lineNumber: 27,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n                lineNumber: 19,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                className: \"hidden md:flex items-center space-x-4\",\n                children: navLinks.map((link)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {\n                            href: link.href,\n                            className: \"text-base font-medium px-4 py-2 rounded-md hover:bg-muted hover:text-primary hover:ring-1 hover:ring-primary/20 transition-all duration-300\",\n                            children: link.label\n                        }, void 0, false, {\n                            fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n                            lineNumber: 35,\n                            columnNumber: 13\n                        }, this)\n                    }, link.href, false, {\n                        fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n                        lineNumber: 34,\n                        columnNumber: 11\n                    }, this))\n            }, void 0, false, {\n                fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n                lineNumber: 32,\n                columnNumber: 7\n            }, this),\n            isMenuOpen && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                className: \"md:hidden absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md rounded-lg py-2 shadow-lg\",\n                children: navLinks.map((link)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {\n                            href: link.href,\n                            className: \"block px-4 py-2 text-base font-medium hover:bg-muted hover:text-primary hover:ring-1 hover:ring-primary/20 transition-all duration-300\",\n                            onClick: ()=>setIsMenuOpen(false),\n                            children: link.label\n                        }, void 0, false, {\n                            fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n                            lineNumber: 50,\n                            columnNumber: 15\n                        }, this)\n                    }, link.href, false, {\n                        fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n                        lineNumber: 49,\n                        columnNumber: 13\n                    }, this))\n            }, void 0, false, {\n                fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n                lineNumber: 47,\n                columnNumber: 9\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/navbar.tsx\",\n        lineNumber: 17,\n        columnNumber: 5\n    }, this);\n}\n_s(Navbar, \"vK10R+uCyHfZ4DZVnxbYkMWJB8g=\");\n_c = Navbar;\nvar _c;\n$RefreshReg$(_c, \"Navbar\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL25hdmJhci50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUM0QjtBQUNJO0FBQ007QUFFL0IsU0FBU0k7O0lBQ2QsTUFBTSxDQUFDQyxZQUFZQyxjQUFjLEdBQUdMLCtDQUFRQSxDQUFDO0lBRTdDLE1BQU1NLFdBQVc7UUFDZjtZQUFFQyxNQUFNO1lBQUtDLE9BQU87UUFBTztRQUMzQjtZQUFFRCxNQUFNO1lBQVVDLE9BQU87UUFBUTtRQUNqQztZQUFFRCxNQUFNO1lBQWFDLE9BQU87UUFBVztRQUN2QztZQUFFRCxNQUFNO1lBQVlDLE9BQU87UUFBVTtLQUN0QztJQUVELHFCQUNFLDhEQUFDQztRQUFJQyxXQUFVOzswQkFFYiw4REFBQ0M7Z0JBQ0NELFdBQVU7Z0JBQ1ZFLFNBQVMsSUFBTVAsY0FBYyxDQUFDRDtnQkFDOUJTLGNBQVc7MEJBRVZULDJCQUNDLDhEQUFDRixrRkFBQ0E7b0JBQUNRLFdBQVU7Ozs7O3lDQUViLDhEQUFDVCxrRkFBSUE7b0JBQUNTLFdBQVU7Ozs7Ozs7Ozs7OzBCQUtwQiw4REFBQ0k7Z0JBQUdKLFdBQVU7MEJBQ1hKLFNBQVNTLEdBQUcsQ0FBQyxDQUFDQyxxQkFDYiw4REFBQ0M7a0NBQ0MsNEVBQUNsQixrREFBSUE7NEJBQ0hRLE1BQU1TLEtBQUtULElBQUk7NEJBQ2ZHLFdBQVU7c0NBRVRNLEtBQUtSLEtBQUs7Ozs7Ozt1QkFMTlEsS0FBS1QsSUFBSTs7Ozs7Ozs7OztZQVlyQkgsNEJBQ0MsOERBQUNVO2dCQUFHSixXQUFVOzBCQUNYSixTQUFTUyxHQUFHLENBQUMsQ0FBQ0MscUJBQ2IsOERBQUNDO2tDQUNDLDRFQUFDbEIsa0RBQUlBOzRCQUNIUSxNQUFNUyxLQUFLVCxJQUFJOzRCQUNmRyxXQUFVOzRCQUNWRSxTQUFTLElBQU1QLGNBQWM7c0NBRTVCVyxLQUFLUixLQUFLOzs7Ozs7dUJBTk5RLEtBQUtULElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjOUI7R0F6RGdCSjtLQUFBQSIsInNvdXJjZXMiOlsiL1VzZXJzL2licmFraGltdS9EZXNrdG9wL1BST0pFQ1RTL3hrbDFzL3NyYy9jb21wb25lbnRzL25hdmJhci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCJcbmltcG9ydCBMaW5rIGZyb20gXCJuZXh0L2xpbmtcIlxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IHsgTWVudSwgWCB9IGZyb20gXCJsdWNpZGUtcmVhY3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gTmF2YmFyKCkge1xuICBjb25zdCBbaXNNZW51T3Blbiwgc2V0SXNNZW51T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICBjb25zdCBuYXZMaW5rcyA9IFtcbiAgICB7IGhyZWY6IFwiL1wiLCBsYWJlbDogXCJIb21lXCIgfSxcbiAgICB7IGhyZWY6IFwiL2Fib3V0XCIsIGxhYmVsOiBcIkFib3V0XCIgfSxcbiAgICB7IGhyZWY6IFwiL3NlcnZpY2VzXCIsIGxhYmVsOiBcIlNlcnZpY2VzXCIgfSxcbiAgICB7IGhyZWY6IFwiL2NvbnRhY3RcIiwgbGFiZWw6IFwiQ29udGFjdFwiIH0sXG4gIF1cblxuICByZXR1cm4gKFxuICAgIDxuYXYgY2xhc3NOYW1lPVwiZml4ZWQgdG9wLTQgbGVmdC0xLzIgdHJhbnNmb3JtIC10cmFuc2xhdGUteC0xLzIgei01MCBiZy1iYWNrZ3JvdW5kLzQwIGJhY2tkcm9wLWJsdXItbWQgcm91bmRlZC1mdWxsIHB4LTYgcHktMyBzaGFkb3ctbGcgdy1bOTAlXSBtZDp3LVs3MjBweF0gbGc6dy1bOTYwcHhdIGZsZXgganVzdGlmeS1lbmQgbWQ6anVzdGlmeS1jZW50ZXIgaXRlbXMtY2VudGVyXCI+XG4gICAgICB7LyogTW9iaWxlIE1lbnUgQnV0dG9uICovfVxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJtZDpoaWRkZW5cIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc01lbnVPcGVuKCFpc01lbnVPcGVuKX1cbiAgICAgICAgYXJpYS1sYWJlbD1cIlRvZ2dsZSBtZW51XCJcbiAgICAgID5cbiAgICAgICAge2lzTWVudU9wZW4gPyAoXG4gICAgICAgICAgPFggY2xhc3NOYW1lPVwiaC02IHctNlwiIC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPE1lbnUgY2xhc3NOYW1lPVwiaC02IHctNlwiIC8+XG4gICAgICAgICl9XG4gICAgICA8L2J1dHRvbj5cblxuICAgICAgey8qIERlc2t0b3AgTWVudSAqL31cbiAgICAgIDx1bCBjbGFzc05hbWU9XCJoaWRkZW4gbWQ6ZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC00XCI+XG4gICAgICAgIHtuYXZMaW5rcy5tYXAoKGxpbmspID0+IChcbiAgICAgICAgICA8bGkga2V5PXtsaW5rLmhyZWZ9PlxuICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgaHJlZj17bGluay5ocmVmfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWJhc2UgZm9udC1tZWRpdW0gcHgtNCBweS0yIHJvdW5kZWQtbWQgaG92ZXI6YmctbXV0ZWQgaG92ZXI6dGV4dC1wcmltYXJ5IGhvdmVyOnJpbmctMSBob3ZlcjpyaW5nLXByaW1hcnkvMjAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2xpbmsubGFiZWx9XG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgKSl9XG4gICAgICA8L3VsPlxuXG4gICAgICB7LyogTW9iaWxlIE1lbnUgKi99XG4gICAgICB7aXNNZW51T3BlbiAmJiAoXG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJtZDpoaWRkZW4gYWJzb2x1dGUgdG9wLWZ1bGwgbGVmdC0wIHJpZ2h0LTAgbXQtMiBiZy1iYWNrZ3JvdW5kLzk1IGJhY2tkcm9wLWJsdXItbWQgcm91bmRlZC1sZyBweS0yIHNoYWRvdy1sZ1wiPlxuICAgICAgICAgIHtuYXZMaW5rcy5tYXAoKGxpbmspID0+IChcbiAgICAgICAgICAgIDxsaSBrZXk9e2xpbmsuaHJlZn0+XG4gICAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgICAgaHJlZj17bGluay5ocmVmfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJsb2NrIHB4LTQgcHktMiB0ZXh0LWJhc2UgZm9udC1tZWRpdW0gaG92ZXI6YmctbXV0ZWQgaG92ZXI6dGV4dC1wcmltYXJ5IGhvdmVyOnJpbmctMSBob3ZlcjpyaW5nLXByaW1hcnkvMjAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMzAwXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc01lbnVPcGVuKGZhbHNlKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtsaW5rLmxhYmVsfVxuICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3VsPlxuICAgICAgKX1cbiAgICA8L25hdj5cbiAgKVxufVxuIl0sIm5hbWVzIjpbIkxpbmsiLCJ1c2VTdGF0ZSIsIk1lbnUiLCJYIiwiTmF2YmFyIiwiaXNNZW51T3BlbiIsInNldElzTWVudU9wZW4iLCJuYXZMaW5rcyIsImhyZWYiLCJsYWJlbCIsIm5hdiIsImNsYXNzTmFtZSIsImJ1dHRvbiIsIm9uQ2xpY2siLCJhcmlhLWxhYmVsIiwidWwiLCJtYXAiLCJsaW5rIiwibGkiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/navbar.tsx\n"));

/***/ })

});