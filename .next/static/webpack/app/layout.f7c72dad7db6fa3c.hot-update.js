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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"2e93ec586a33\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvZ2xvYmFscy5jc3MiLCJtYXBwaW5ncyI6Ijs7OztBQUFBLGlFQUFlLGNBQWM7QUFDN0IsSUFBSSxJQUFVLElBQUksaUJBQWlCIiwic291cmNlcyI6WyIvVXNlcnMvaWJyYWtoaW11L0Rlc2t0b3AvUFJPSkVDVFMveGtsMXMvc3JjL2FwcC9nbG9iYWxzLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIjJlOTNlYzU4NmEzM1wiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/globals.css\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/components/mouse-blob.tsx":
/*!***************************************!*\
  !*** ./src/components/mouse-blob.tsx ***!
  \***************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MouseBlob: () => (/* binding */ MouseBlob)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/.pnpm/next@15.1.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! framer-motion */ \"(app-pages-browser)/./node_modules/.pnpm/framer-motion@12.0.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/framer-motion/dist/es/value/use-motion-value.mjs\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! framer-motion */ \"(app-pages-browser)/./node_modules/.pnpm/framer-motion@12.0.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/framer-motion/dist/es/value/use-spring.mjs\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! framer-motion */ \"(app-pages-browser)/./node_modules/.pnpm/framer-motion@12.0.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/.pnpm/next@15.1.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* __next_internal_client_entry_do_not_use__ MouseBlob auto */ \nvar _s = $RefreshSig$();\n\n\nfunction MouseBlob() {\n    _s();\n    const mouseX = (0,framer_motion__WEBPACK_IMPORTED_MODULE_2__.useMotionValue)(0);\n    const mouseY = (0,framer_motion__WEBPACK_IMPORTED_MODULE_2__.useMotionValue)(0);\n    const springConfig = {\n        damping: 20,\n        stiffness: 100,\n        mass: 0.5\n    };\n    const springX = (0,framer_motion__WEBPACK_IMPORTED_MODULE_3__.useSpring)(mouseX, springConfig);\n    const springY = (0,framer_motion__WEBPACK_IMPORTED_MODULE_3__.useSpring)(mouseY, springConfig);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"MouseBlob.useEffect\": ()=>{\n            const handleMouseMove = {\n                \"MouseBlob.useEffect.handleMouseMove\": (e)=>{\n                    mouseX.set(e.clientX - 16);\n                    mouseY.set(e.clientY - 16);\n                }\n            }[\"MouseBlob.useEffect.handleMouseMove\"];\n            window.addEventListener(\"mousemove\", handleMouseMove);\n            return ({\n                \"MouseBlob.useEffect\": ()=>window.removeEventListener(\"mousemove\", handleMouseMove)\n            })[\"MouseBlob.useEffect\"];\n        }\n    }[\"MouseBlob.useEffect\"], [\n        mouseX,\n        mouseY\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_4__.motion.div, {\n        className: \"pointer-events-none fixed z-[100] h-20 w-20 rounded-full bg-primary/40 blur-2xl\",\n        style: {\n            x: springX,\n            y: springY\n        }\n    }, void 0, false, {\n        fileName: \"/Users/ibrakhimu/Desktop/PROJECTS/xkl1s/src/components/mouse-blob.tsx\",\n        lineNumber: 30,\n        columnNumber: 5\n    }, this);\n}\n_s(MouseBlob, \"tYyvSQ5urcdhtK6BIpwzfjDDYaQ=\", false, function() {\n    return [\n        framer_motion__WEBPACK_IMPORTED_MODULE_2__.useMotionValue,\n        framer_motion__WEBPACK_IMPORTED_MODULE_2__.useMotionValue,\n        framer_motion__WEBPACK_IMPORTED_MODULE_3__.useSpring,\n        framer_motion__WEBPACK_IMPORTED_MODULE_3__.useSpring\n    ];\n});\n_c = MouseBlob;\nvar _c;\n$RefreshReg$(_c, \"MouseBlob\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL21vdXNlLWJsb2IudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVrRTtBQUNoQztBQUUzQixTQUFTSTs7SUFDZCxNQUFNQyxTQUFTSiw2REFBY0EsQ0FBQztJQUM5QixNQUFNSyxTQUFTTCw2REFBY0EsQ0FBQztJQUU5QixNQUFNTSxlQUFlO1FBQ25CQyxTQUFTO1FBQ1RDLFdBQVc7UUFDWEMsTUFBTTtJQUNSO0lBRUEsTUFBTUMsVUFBVVQsd0RBQVNBLENBQUNHLFFBQVFFO0lBQ2xDLE1BQU1LLFVBQVVWLHdEQUFTQSxDQUFDSSxRQUFRQztJQUVsQ0osZ0RBQVNBOytCQUFDO1lBQ1IsTUFBTVU7dURBQWtCLENBQUNDO29CQUN2QlQsT0FBT1UsR0FBRyxDQUFDRCxFQUFFRSxPQUFPLEdBQUc7b0JBQ3ZCVixPQUFPUyxHQUFHLENBQUNELEVBQUVHLE9BQU8sR0FBRztnQkFDekI7O1lBRUFDLE9BQU9DLGdCQUFnQixDQUFDLGFBQWFOO1lBQ3JDO3VDQUFPLElBQU1LLE9BQU9FLG1CQUFtQixDQUFDLGFBQWFQOztRQUN2RDs4QkFBRztRQUFDUjtRQUFRQztLQUFPO0lBRW5CLHFCQUNFLDhEQUFDTixpREFBTUEsQ0FBQ3FCLEdBQUc7UUFDVEMsV0FBVTtRQUNWQyxPQUFPO1lBQ0xDLEdBQUdiO1lBQ0hjLEdBQUdiO1FBQ0w7Ozs7OztBQUdOO0dBaENnQlI7O1FBQ0NILHlEQUFjQTtRQUNkQSx5REFBY0E7UUFRYkMsb0RBQVNBO1FBQ1RBLG9EQUFTQTs7O0tBWFhFIiwic291cmNlcyI6WyIvVXNlcnMvaWJyYWtoaW11L0Rlc2t0b3AvUFJPSkVDVFMveGtsMXMvc3JjL2NvbXBvbmVudHMvbW91c2UtYmxvYi50c3giXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XG5cbmltcG9ydCB7IG1vdGlvbiwgdXNlTW90aW9uVmFsdWUsIHVzZVNwcmluZyB9IGZyb20gXCJmcmFtZXItbW90aW9uXCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIE1vdXNlQmxvYigpIHtcbiAgY29uc3QgbW91c2VYID0gdXNlTW90aW9uVmFsdWUoMCk7XG4gIGNvbnN0IG1vdXNlWSA9IHVzZU1vdGlvblZhbHVlKDApO1xuXG4gIGNvbnN0IHNwcmluZ0NvbmZpZyA9IHtcbiAgICBkYW1waW5nOiAyMCxcbiAgICBzdGlmZm5lc3M6IDEwMCxcbiAgICBtYXNzOiAwLjUsXG4gIH07XG5cbiAgY29uc3Qgc3ByaW5nWCA9IHVzZVNwcmluZyhtb3VzZVgsIHNwcmluZ0NvbmZpZyk7XG4gIGNvbnN0IHNwcmluZ1kgPSB1c2VTcHJpbmcobW91c2VZLCBzcHJpbmdDb25maWcpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlTW91c2VNb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIG1vdXNlWC5zZXQoZS5jbGllbnRYIC0gMTYpO1xuICAgICAgbW91c2VZLnNldChlLmNsaWVudFkgLSAxNik7XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGhhbmRsZU1vdXNlTW92ZSk7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGhhbmRsZU1vdXNlTW92ZSk7XG4gIH0sIFttb3VzZVgsIG1vdXNlWV0pO1xuXG4gIHJldHVybiAoXG4gICAgPG1vdGlvbi5kaXZcbiAgICAgIGNsYXNzTmFtZT1cInBvaW50ZXItZXZlbnRzLW5vbmUgZml4ZWQgei1bMTAwXSBoLTIwIHctMjAgcm91bmRlZC1mdWxsIGJnLXByaW1hcnkvNDAgYmx1ci0yeGxcIlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgeDogc3ByaW5nWCxcbiAgICAgICAgeTogc3ByaW5nWSxcbiAgICAgIH19XG4gICAgLz5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJtb3Rpb24iLCJ1c2VNb3Rpb25WYWx1ZSIsInVzZVNwcmluZyIsInVzZUVmZmVjdCIsIk1vdXNlQmxvYiIsIm1vdXNlWCIsIm1vdXNlWSIsInNwcmluZ0NvbmZpZyIsImRhbXBpbmciLCJzdGlmZm5lc3MiLCJtYXNzIiwic3ByaW5nWCIsInNwcmluZ1kiLCJoYW5kbGVNb3VzZU1vdmUiLCJlIiwic2V0IiwiY2xpZW50WCIsImNsaWVudFkiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRpdiIsImNsYXNzTmFtZSIsInN0eWxlIiwieCIsInkiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/mouse-blob.tsx\n"));

/***/ })

});