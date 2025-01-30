"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@radix-ui+react-presence@1.1.2_@types+react-dom@19.0.3_@types+react@19.0.8__@types+react@19.0_rh3kivui4zlptcqwdsogz5u2py";
exports.ids = ["vendor-chunks/@radix-ui+react-presence@1.1.2_@types+react-dom@19.0.3_@types+react@19.0.8__@types+react@19.0_rh3kivui4zlptcqwdsogz5u2py"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/@radix-ui+react-presence@1.1.2_@types+react-dom@19.0.3_@types+react@19.0.8__@types+react@19.0_rh3kivui4zlptcqwdsogz5u2py/node_modules/@radix-ui/react-presence/dist/index.mjs":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@radix-ui+react-presence@1.1.2_@types+react-dom@19.0.3_@types+react@19.0.8__@types+react@19.0_rh3kivui4zlptcqwdsogz5u2py/node_modules/@radix-ui/react-presence/dist/index.mjs ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Presence: () => (/* binding */ Presence)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/.pnpm/next@15.1.6_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var _radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @radix-ui/react-compose-refs */ \"(ssr)/./node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.1_@types+react@19.0.8_react@19.0.0/node_modules/@radix-ui/react-compose-refs/dist/index.mjs\");\n/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ \"(ssr)/./node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.1.0_@types+react@19.0.8_react@19.0.0/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs\");\n/* __next_internal_client_entry_do_not_use__ Presence auto */ // packages/react/presence/src/Presence.tsx\n\n\n\n// packages/react/presence/src/useStateMachine.tsx\n\nfunction useStateMachine(initialState, machine) {\n    return react__WEBPACK_IMPORTED_MODULE_0__.useReducer({\n        \"useStateMachine.useReducer\": (state, event)=>{\n            const nextState = machine[state][event];\n            return nextState ?? state;\n        }\n    }[\"useStateMachine.useReducer\"], initialState);\n}\n// packages/react/presence/src/Presence.tsx\nvar Presence = (props)=>{\n    const { present, children } = props;\n    const presence = usePresence(present);\n    const child = typeof children === \"function\" ? children({\n        present: presence.isPresent\n    }) : react__WEBPACK_IMPORTED_MODULE_0__.Children.only(children);\n    const ref = (0,_radix_ui_react_compose_refs__WEBPACK_IMPORTED_MODULE_1__.useComposedRefs)(presence.ref, getElementRef(child));\n    const forceMount = typeof children === \"function\";\n    return forceMount || presence.isPresent ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(child, {\n        ref\n    }) : null;\n};\nPresence.displayName = \"Presence\";\nfunction usePresence(present) {\n    const [node, setNode] = react__WEBPACK_IMPORTED_MODULE_0__.useState();\n    const stylesRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef({});\n    const prevPresentRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(present);\n    const prevAnimationNameRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(\"none\");\n    const initialState = present ? \"mounted\" : \"unmounted\";\n    const [state, send] = useStateMachine(initialState, {\n        mounted: {\n            UNMOUNT: \"unmounted\",\n            ANIMATION_OUT: \"unmountSuspended\"\n        },\n        unmountSuspended: {\n            MOUNT: \"mounted\",\n            ANIMATION_END: \"unmounted\"\n        },\n        unmounted: {\n            MOUNT: \"mounted\"\n        }\n    });\n    react__WEBPACK_IMPORTED_MODULE_0__.useEffect({\n        \"usePresence.useEffect\": ()=>{\n            const currentAnimationName = getAnimationName(stylesRef.current);\n            prevAnimationNameRef.current = state === \"mounted\" ? currentAnimationName : \"none\";\n        }\n    }[\"usePresence.useEffect\"], [\n        state\n    ]);\n    (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect)({\n        \"usePresence.useLayoutEffect\": ()=>{\n            const styles = stylesRef.current;\n            const wasPresent = prevPresentRef.current;\n            const hasPresentChanged = wasPresent !== present;\n            if (hasPresentChanged) {\n                const prevAnimationName = prevAnimationNameRef.current;\n                const currentAnimationName = getAnimationName(styles);\n                if (present) {\n                    send(\"MOUNT\");\n                } else if (currentAnimationName === \"none\" || styles?.display === \"none\") {\n                    send(\"UNMOUNT\");\n                } else {\n                    const isAnimating = prevAnimationName !== currentAnimationName;\n                    if (wasPresent && isAnimating) {\n                        send(\"ANIMATION_OUT\");\n                    } else {\n                        send(\"UNMOUNT\");\n                    }\n                }\n                prevPresentRef.current = present;\n            }\n        }\n    }[\"usePresence.useLayoutEffect\"], [\n        present,\n        send\n    ]);\n    (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect)({\n        \"usePresence.useLayoutEffect\": ()=>{\n            if (node) {\n                let timeoutId;\n                const ownerWindow = node.ownerDocument.defaultView ?? window;\n                const handleAnimationEnd = {\n                    \"usePresence.useLayoutEffect.handleAnimationEnd\": (event)=>{\n                        const currentAnimationName = getAnimationName(stylesRef.current);\n                        const isCurrentAnimation = currentAnimationName.includes(event.animationName);\n                        if (event.target === node && isCurrentAnimation) {\n                            send(\"ANIMATION_END\");\n                            if (!prevPresentRef.current) {\n                                const currentFillMode = node.style.animationFillMode;\n                                node.style.animationFillMode = \"forwards\";\n                                timeoutId = ownerWindow.setTimeout({\n                                    \"usePresence.useLayoutEffect.handleAnimationEnd\": ()=>{\n                                        if (node.style.animationFillMode === \"forwards\") {\n                                            node.style.animationFillMode = currentFillMode;\n                                        }\n                                    }\n                                }[\"usePresence.useLayoutEffect.handleAnimationEnd\"]);\n                            }\n                        }\n                    }\n                }[\"usePresence.useLayoutEffect.handleAnimationEnd\"];\n                const handleAnimationStart = {\n                    \"usePresence.useLayoutEffect.handleAnimationStart\": (event)=>{\n                        if (event.target === node) {\n                            prevAnimationNameRef.current = getAnimationName(stylesRef.current);\n                        }\n                    }\n                }[\"usePresence.useLayoutEffect.handleAnimationStart\"];\n                node.addEventListener(\"animationstart\", handleAnimationStart);\n                node.addEventListener(\"animationcancel\", handleAnimationEnd);\n                node.addEventListener(\"animationend\", handleAnimationEnd);\n                return ({\n                    \"usePresence.useLayoutEffect\": ()=>{\n                        ownerWindow.clearTimeout(timeoutId);\n                        node.removeEventListener(\"animationstart\", handleAnimationStart);\n                        node.removeEventListener(\"animationcancel\", handleAnimationEnd);\n                        node.removeEventListener(\"animationend\", handleAnimationEnd);\n                    }\n                })[\"usePresence.useLayoutEffect\"];\n            } else {\n                send(\"ANIMATION_END\");\n            }\n        }\n    }[\"usePresence.useLayoutEffect\"], [\n        node,\n        send\n    ]);\n    return {\n        isPresent: [\n            \"mounted\",\n            \"unmountSuspended\"\n        ].includes(state),\n        ref: react__WEBPACK_IMPORTED_MODULE_0__.useCallback({\n            \"usePresence.useCallback\": (node2)=>{\n                if (node2) stylesRef.current = getComputedStyle(node2);\n                setNode(node2);\n            }\n        }[\"usePresence.useCallback\"], [])\n    };\n}\nfunction getAnimationName(styles) {\n    return styles?.animationName || \"none\";\n}\nfunction getElementRef(element) {\n    let getter = Object.getOwnPropertyDescriptor(element.props, \"ref\")?.get;\n    let mayWarn = getter && \"isReactWarning\" in getter && getter.isReactWarning;\n    if (mayWarn) {\n        return element.ref;\n    }\n    getter = Object.getOwnPropertyDescriptor(element, \"ref\")?.get;\n    mayWarn = getter && \"isReactWarning\" in getter && getter.isReactWarning;\n    if (mayWarn) {\n        return element.props.ref;\n    }\n    return element.props.ref || element.ref;\n}\n //# sourceMappingURL=index.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vQHJhZGl4LXVpK3JlYWN0LXByZXNlbmNlQDEuMS4yX0B0eXBlcytyZWFjdC1kb21AMTkuMC4zX0B0eXBlcytyZWFjdEAxOS4wLjhfX0B0eXBlcytyZWFjdEAxOS4wX3JoM2tpdnVpNHpscHRjcXdkc29nejV1MnB5L25vZGVfbW9kdWxlcy9AcmFkaXgtdWkvcmVhY3QtcHJlc2VuY2UvZGlzdC9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBdUI7QUFDUztBQUNBOztBQ0ZUO0FBV2hCLFNBQVMsZ0JBQ2QsY0FDQSxTQUNBO0lBQ0EsT0FBYTtzQ0FBVyxDQUFDLE9BQXdCO1lBQy9DLE1BQU0sWUFBYSxRQUFRLEtBQUssRUFBVSxLQUFLO1lBQy9DLE9BQU8sYUFBYTtRQUN0QjtxQ0FBRyxZQUFZO0FBQ2pCOztBRFRBLElBQU0sV0FBb0MsQ0FBQztJQUN6QyxNQUFNLEVBQUUsU0FBUyxTQUFTLElBQUk7SUFDOUIsTUFBTSxXQUFXLFlBQVksT0FBTztJQUVwQyxNQUFNLFFBQ0osT0FBTyxhQUFhLGFBQ2hCLFNBQVM7UUFBRSxTQUFTLFNBQVM7SUFBVSxDQUFDLElBQ2xDLDRDQUFTLEtBQUssUUFBUTtJQUdsQyxNQUFNLE1BQU0sNkVBQWUsQ0FBQyxTQUFTLEtBQUssY0FBYyxLQUFLLENBQUM7SUFDOUQsTUFBTSxhQUFhLE9BQU8sYUFBYTtJQUN2QyxPQUFPLGNBQWMsU0FBUywwQkFBa0IsZ0RBQWEsT0FBTztRQUFFO0lBQUksQ0FBQyxJQUFJO0FBQ2pGO0FBRUEsU0FBUyxjQUFjO0FBTXZCLFNBQVMsWUFBWSxTQUFrQjtJQUNyQyxNQUFNLENBQUMsTUFBTSxPQUFPLElBQVUsNENBQXNCO0lBQ3BELE1BQU0sWUFBa0IsMENBQTRCLENBQUMsQ0FBUTtJQUM3RCxNQUFNLGlCQUF1QiwwQ0FBTyxPQUFPO0lBQzNDLE1BQU0sdUJBQTZCLDBDQUFlLE1BQU07SUFDeEQsTUFBTSxlQUFlLFVBQVUsWUFBWTtJQUMzQyxN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LFVBQVUsb0JBQW9CLFVBQVUsT0FBTztJQUM3RCxJQUFJLFNBQVM7UUFDWCxPQUFRLFFBQWdCO0lBQzFCO0lBR0EsU0FBUyxPQUFPLHlCQUF5QixTQUFTLEtBQUssR0FBRztJQUMxRCxVQUFVLFVBQVUsb0JBQW9CLFVBQVUsT0FBTztJQUN6RCxJQUFJLFNBQVM7UUFDWCxPQUFPLFFBQVEsTUFBTTtJQUN2QjtJQUdBLE9BQU8sUUFBUSxNQUFNLE9BQVEsUUFBZ0I7QUFDL0MiLCJzb3VyY2VzIjpbIi9Vc2Vycy9pYnJha2hpbXUvRGVza3RvcC9QUk9KRUNUUy9zcmMvUHJlc2VuY2UudHN4IiwiL1VzZXJzL2licmFraGltdS9EZXNrdG9wL1BST0pFQ1RTL3NyYy91c2VTdGF0ZU1hY2hpbmUudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUNvbXBvc2VkUmVmcyB9IGZyb20gJ0ByYWRpeC11aS9yZWFjdC1jb21wb3NlLXJlZnMnO1xuaW1wb3J0IHsgdXNlTGF5b3V0RWZmZWN0IH0gZnJvbSAnQHJhZGl4LXVpL3JlYWN0LXVzZS1sYXlvdXQtZWZmZWN0JztcbmltcG9ydCB7IHVzZVN0YXRlTWFjaGluZSB9IGZyb20gJy4vdXNlU3RhdGVNYWNoaW5lJztcblxuaW50ZXJmYWNlIFByZXNlbmNlUHJvcHMge1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3RFbGVtZW50IHwgKChwcm9wczogeyBwcmVzZW50OiBib29sZWFuIH0pID0+IFJlYWN0LlJlYWN0RWxlbWVudCk7XG4gIHByZXNlbnQ6IGJvb2xlYW47XG59XG5cbmNvbnN0IFByZXNlbmNlOiBSZWFjdC5GQzxQcmVzZW5jZVByb3BzPiA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHByZXNlbnQsIGNoaWxkcmVuIH0gPSBwcm9wcztcbiAgY29uc3QgcHJlc2VuY2UgPSB1c2VQcmVzZW5jZShwcmVzZW50KTtcblxuICBjb25zdCBjaGlsZCA9IChcbiAgICB0eXBlb2YgY2hpbGRyZW4gPT09ICdmdW5jdGlvbidcbiAgICAgID8gY2hpbGRyZW4oeyBwcmVzZW50OiBwcmVzZW5jZS5pc1ByZXNlbnQgfSlcbiAgICAgIDogUmVhY3QuQ2hpbGRyZW4ub25seShjaGlsZHJlbilcbiAgKSBhcyBSZWFjdC5SZWFjdEVsZW1lbnQ8eyByZWY/OiBSZWFjdC5SZWY8SFRNTEVsZW1lbnQ+IH0+O1xuXG4gIGNvbnN0IHJlZiA9IHVzZUNvbXBvc2VkUmVmcyhwcmVzZW5jZS5yZWYsIGdldEVsZW1lbnRSZWYoY2hpbGQpKTtcbiAgY29uc3QgZm9yY2VNb3VudCA9IHR5cGVvZiBjaGlsZHJlbiA9PT0gJ2Z1bmN0aW9uJztcbiAgcmV0dXJuIGZvcmNlTW91bnQgfHwgcHJlc2VuY2UuaXNQcmVzZW50ID8gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkLCB7IHJlZiB9KSA6IG51bGw7XG59O1xuXG5QcmVzZW5jZS5kaXNwbGF5TmFtZSA9ICdQcmVzZW5jZSc7XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIHVzZVByZXNlbmNlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmZ1bmN0aW9uIHVzZVByZXNlbmNlKHByZXNlbnQ6IGJvb2xlYW4pIHtcbiAgY29uc3QgW25vZGUsIHNldE5vZGVdID0gUmVhY3QudXNlU3RhdGU8SFRNTEVsZW1lbnQ+KCk7XG4gIGNvbnN0IHN0eWxlc1JlZiA9IFJlYWN0LnVzZVJlZjxDU1NTdHlsZURlY2xhcmF0aW9uPih7fSBhcyBhbnkpO1xuICBjb25zdCBwcmV2UHJlc2VudFJlZiA9IFJlYWN0LnVzZVJlZihwcmVzZW50KTtcbiAgY29uc3QgcHJldkFuaW1hdGlvbk5hbWVSZWYgPSBSZWFjdC51c2VSZWY8c3RyaW5nPignbm9uZScpO1xuICBjb25zdCBpbml0aWFsU3RhdGUgPSBwcmVzZW50ID8gJ21vdW50ZWQnIDogJ3VubW91bnRlZCc7XG4gIGNvbnN0IFtzdGF0ZSwgc2VuZF0gPSB1c2VTdGF0ZU1hY2hpbmUoaW5pdGlhbFN0YXRlLCB7XG4gICAgbW91bnRlZDoge1xuICAgICAgVU5NT1VOVDogJ3VubW91bnRlZCcsXG4gICAgICBBTklNQVRJT05fT1VUOiAndW5tb3VudFN1c3BlbmRlZCcsXG4gICAgfSxcbiAgICB1bm1vdW50U3VzcGVuZGVkOiB7XG4gICAgICBNT1VOVDogJ21vdW50ZWQnLFxuICAgICAgQU5JTUFUSU9OX0VORDogJ3VubW91bnRlZCcsXG4gICAgfSxcbiAgICB1bm1vdW50ZWQ6IHtcbiAgICAgIE1PVU5UOiAnbW91bnRlZCcsXG4gICAgfSxcbiAgfSk7XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50QW5pbWF0aW9uTmFtZSA9IGdldEFuaW1hdGlvbk5hbWUoc3R5bGVzUmVmLmN1cnJlbnQpO1xuICAgIHByZXZBbmltYXRpb25OYW1lUmVmLmN1cnJlbnQgPSBzdGF0ZSA9PT0gJ21vdW50ZWQnID8gY3VycmVudEFuaW1hdGlvbk5hbWUgOiAnbm9uZSc7XG4gIH0sIFtzdGF0ZV0pO1xuXG4gIHVzZUxheW91dEVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3R5bGVzID0gc3R5bGVzUmVmLmN1cnJlbnQ7XG4gICAgY29uc3Qgd2FzUHJlc2VudCA9IHByZXZQcmVzZW50UmVmLmN1cnJlbnQ7XG4gICAgY29uc3QgaGFzUHJlc2VudENoYW5nZWQgPSB3YXNQcmVzZW50ICE9PSBwcmVzZW50O1xuXG4gICAgaWYgKGhhc1ByZXNlbnRDaGFuZ2VkKSB7XG4gICAgICBjb25zdCBwcmV2QW5pbWF0aW9uTmFtZSA9IHByZXZBbmltYXRpb25OYW1lUmVmLmN1cnJlbnQ7XG4gICAgICBjb25zdCBjdXJyZW50QW5pbWF0aW9uTmFtZSA9IGdldEFuaW1hdGlvbk5hbWUoc3R5bGVzKTtcblxuICAgICAgaWYgKHByZXNlbnQpIHtcbiAgICAgICAgc2VuZCgnTU9VTlQnKTtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudEFuaW1hdGlvbk5hbWUgPT09ICdub25lJyB8fCBzdHlsZXM/LmRpc3BsYXkgPT09ICdub25lJykge1xuICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBleGl0IGFuaW1hdGlvbiBvciB0aGUgZWxlbWVudCBpcyBoaWRkZW4sIGFuaW1hdGlvbnMgd29uJ3QgcnVuXG4gICAgICAgIC8vIHNvIHdlIHVubW91bnQgaW5zdGFudGx5XG4gICAgICAgIHNlbmQoJ1VOTU9VTlQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGVuIGBwcmVzZW50YCBjaGFuZ2VzIHRvIGBmYWxzZWAsIHdlIGNoZWNrIGNoYW5nZXMgdG8gYW5pbWF0aW9uLW5hbWUgdG9cbiAgICAgICAgICogZGV0ZXJtaW5lIHdoZXRoZXIgYW4gYW5pbWF0aW9uIGhhcyBzdGFydGVkLiBXZSBjaG9zZSB0aGlzIGFwcHJvYWNoIChyZWFkaW5nXG4gICAgICAgICAqIGNvbXB1dGVkIHN0eWxlcykgYmVjYXVzZSB0aGVyZSBpcyBubyBgYW5pbWF0aW9ucnVuYCBldmVudCBhbmQgYGFuaW1hdGlvbnN0YXJ0YFxuICAgICAgICAgKiBmaXJlcyBhZnRlciBgYW5pbWF0aW9uLWRlbGF5YCBoYXMgZXhwaXJlZCB3aGljaCB3b3VsZCBiZSB0b28gbGF0ZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGlzQW5pbWF0aW5nID0gcHJldkFuaW1hdGlvbk5hbWUgIT09IGN1cnJlbnRBbmltYXRpb25OYW1lO1xuXG4gICAgICAgIGlmICh3YXNQcmVzZW50ICYmIGlzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgc2VuZCgnQU5JTUFUSU9OX09VVCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbmQoJ1VOTU9VTlQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwcmV2UHJlc2VudFJlZi5jdXJyZW50ID0gcHJlc2VudDtcbiAgICB9XG4gIH0sIFtwcmVzZW50LCBzZW5kXSk7XG5cbiAgdXNlTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICBpZiAobm9kZSkge1xuICAgICAgbGV0IHRpbWVvdXRJZDogbnVtYmVyO1xuICAgICAgY29uc3Qgb3duZXJXaW5kb3cgPSBub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgPz8gd2luZG93O1xuICAgICAgLyoqXG4gICAgICAgKiBUcmlnZ2VyaW5nIGFuIEFOSU1BVElPTl9PVVQgZHVyaW5nIGFuIEFOSU1BVElPTl9JTiB3aWxsIGZpcmUgYW4gYGFuaW1hdGlvbmNhbmNlbGBcbiAgICAgICAqIGV2ZW50IGZvciBBTklNQVRJT05fSU4gYWZ0ZXIgd2UgaGF2ZSBlbnRlcmVkIGB1bm1vdW50U3VzcGVuZGVkYCBzdGF0ZS4gU28sIHdlXG4gICAgICAgKiBtYWtlIHN1cmUgd2Ugb25seSB0cmlnZ2VyIEFOSU1BVElPTl9FTkQgZm9yIHRoZSBjdXJyZW50bHkgYWN0aXZlIGFuaW1hdGlvbi5cbiAgICAgICAqL1xuICAgICAgY29uc3QgaGFuZGxlQW5pbWF0aW9uRW5kID0gKGV2ZW50OiBBbmltYXRpb25FdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50QW5pbWF0aW9uTmFtZSA9IGdldEFuaW1hdGlvbk5hbWUoc3R5bGVzUmVmLmN1cnJlbnQpO1xuICAgICAgICBjb25zdCBpc0N1cnJlbnRBbmltYXRpb24gPSBjdXJyZW50QW5pbWF0aW9uTmFtZS5pbmNsdWRlcyhldmVudC5hbmltYXRpb25OYW1lKTtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gbm9kZSAmJiBpc0N1cnJlbnRBbmltYXRpb24pIHtcbiAgICAgICAgICAvLyBXaXRoIFJlYWN0IDE4IGNvbmN1cnJlbmN5IHRoaXMgdXBkYXRlIGlzIGFwcGxpZWQgYSBmcmFtZSBhZnRlciB0aGVcbiAgICAgICAgICAvLyBhbmltYXRpb24gZW5kcywgY3JlYXRpbmcgYSBmbGFzaCBvZiB2aXNpYmxlIGNvbnRlbnQuIEJ5IHNldHRpbmcgdGhlXG4gICAgICAgICAgLy8gYW5pbWF0aW9uIGZpbGwgbW9kZSB0byBcImZvcndhcmRzXCIsIHdlIGZvcmNlIHRoZSBub2RlIHRvIGtlZXAgdGhlXG4gICAgICAgICAgLy8gc3R5bGVzIG9mIHRoZSBsYXN0IGtleWZyYW1lLCByZW1vdmluZyB0aGUgZmxhc2guXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBQcmV2aW91c2x5IHdlIGZsdXNoZWQgdGhlIHVwZGF0ZSB2aWEgUmVhY3REb20uZmx1c2hTeW5jLCBidXQgd2l0aFxuICAgICAgICAgIC8vIGV4aXQgYW5pbWF0aW9ucyB0aGlzIHJlc3VsdGVkIGluIHRoZSBub2RlIGJlaW5nIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgICAgICAvLyBET00gYmVmb3JlIHRoZSBzeW50aGV0aWMgYW5pbWF0aW9uRW5kIGV2ZW50IHdhcyBkaXNwYXRjaGVkLCBtZWFuaW5nXG4gICAgICAgICAgLy8gdXNlci1wcm92aWRlZCBldmVudCBoYW5kbGVycyB3b3VsZCBub3QgYmUgY2FsbGVkLlxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yYWRpeC11aS9wcmltaXRpdmVzL3B1bGwvMTg0OVxuICAgICAgICAgIHNlbmQoJ0FOSU1BVElPTl9FTkQnKTtcbiAgICAgICAgICBpZiAoIXByZXZQcmVzZW50UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRGaWxsTW9kZSA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uRmlsbE1vZGU7XG4gICAgICAgICAgICBub2RlLnN0eWxlLmFuaW1hdGlvbkZpbGxNb2RlID0gJ2ZvcndhcmRzJztcbiAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBzdHlsZSBhZnRlciB0aGUgbm9kZSBoYWQgdGltZSB0byB1bm1vdW50IChmb3IgY2FzZXNcbiAgICAgICAgICAgIC8vIHdoZXJlIHRoZSBjb21wb25lbnQgY2hvb3NlcyBub3QgdG8gdW5tb3VudCkuIERvaW5nIHRoaXMgYW55XG4gICAgICAgICAgICAvLyBzb29uZXIgdGhhbiBgc2V0VGltZW91dGAgKGUuZy4gd2l0aCBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYClcbiAgICAgICAgICAgIC8vIHN0aWxsIGNhdXNlcyBhIGZsYXNoLlxuICAgICAgICAgICAgdGltZW91dElkID0gb3duZXJXaW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChub2RlLnN0eWxlLmFuaW1hdGlvbkZpbGxNb2RlID09PSAnZm9yd2FyZHMnKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zdHlsZS5hbmltYXRpb25GaWxsTW9kZSA9IGN1cnJlbnRGaWxsTW9kZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3QgaGFuZGxlQW5pbWF0aW9uU3RhcnQgPSAoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IG5vZGUpIHtcbiAgICAgICAgICAvLyBpZiBhbmltYXRpb24gb2NjdXJyZWQsIHN0b3JlIGl0cyBuYW1lIGFzIHRoZSBwcmV2aW91cyBhbmltYXRpb24uXG4gICAgICAgICAgcHJldkFuaW1hdGlvbk5hbWVSZWYuY3VycmVudCA9IGdldEFuaW1hdGlvbk5hbWUoc3R5bGVzUmVmLmN1cnJlbnQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25zdGFydCcsIGhhbmRsZUFuaW1hdGlvblN0YXJ0KTtcbiAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uY2FuY2VsJywgaGFuZGxlQW5pbWF0aW9uRW5kKTtcbiAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgaGFuZGxlQW5pbWF0aW9uRW5kKTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIG93bmVyV2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbnN0YXJ0JywgaGFuZGxlQW5pbWF0aW9uU3RhcnQpO1xuICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmNhbmNlbCcsIGhhbmRsZUFuaW1hdGlvbkVuZCk7XG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgaGFuZGxlQW5pbWF0aW9uRW5kKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRyYW5zaXRpb24gdG8gdGhlIHVubW91bnRlZCBzdGF0ZSBpZiB0aGUgbm9kZSBpcyByZW1vdmVkIHByZW1hdHVyZWx5LlxuICAgICAgLy8gV2UgYXZvaWQgZG9pbmcgc28gZHVyaW5nIGNsZWFudXAgYXMgdGhlIG5vZGUgbWF5IGNoYW5nZSBidXQgc3RpbGwgZXhpc3QuXG4gICAgICBzZW5kKCdBTklNQVRJT05fRU5EJyk7XG4gICAgfVxuICB9LCBbbm9kZSwgc2VuZF0pO1xuXG4gIHJldHVybiB7XG4gICAgaXNQcmVzZW50OiBbJ21vdW50ZWQnLCAndW5tb3VudFN1c3BlbmRlZCddLmluY2x1ZGVzKHN0YXRlKSxcbiAgICByZWY6IFJlYWN0LnVzZUNhbGxiYWNrKChub2RlOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKG5vZGUpIHN0eWxlc1JlZi5jdXJyZW50ID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgIHNldE5vZGUobm9kZSk7XG4gICAgfSwgW10pLFxuICB9O1xufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmZ1bmN0aW9uIGdldEFuaW1hdGlvbk5hbWUoc3R5bGVzPzogQ1NTU3R5bGVEZWNsYXJhdGlvbikge1xuICByZXR1cm4gc3R5bGVzPy5hbmltYXRpb25OYW1lIHx8ICdub25lJztcbn1cblxuLy8gQmVmb3JlIFJlYWN0IDE5IGFjY2Vzc2luZyBgZWxlbWVudC5wcm9wcy5yZWZgIHdpbGwgdGhyb3cgYSB3YXJuaW5nIGFuZCBzdWdnZXN0IHVzaW5nIGBlbGVtZW50LnJlZmBcbi8vIEFmdGVyIFJlYWN0IDE5IGFjY2Vzc2luZyBgZWxlbWVudC5yZWZgIGRvZXMgdGhlIG9wcG9zaXRlLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L3B1bGwvMjgzNDhcbi8vXG4vLyBBY2Nlc3MgdGhlIHJlZiB1c2luZyB0aGUgbWV0aG9kIHRoYXQgZG9lc24ndCB5aWVsZCBhIHdhcm5pbmcuXG5mdW5jdGlvbiBnZXRFbGVtZW50UmVmKGVsZW1lbnQ6IFJlYWN0LlJlYWN0RWxlbWVudDx7IHJlZj86IFJlYWN0LlJlZjx1bmtub3duPiB9Pikge1xuICAvLyBSZWFjdCA8PTE4IGluIERFVlxuICBsZXQgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihlbGVtZW50LnByb3BzLCAncmVmJyk/LmdldDtcbiAgbGV0IG1heVdhcm4gPSBnZXR0ZXIgJiYgJ2lzUmVhY3RXYXJuaW5nJyBpbiBnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nO1xuICBpZiAobWF5V2Fybikge1xuICAgIHJldHVybiAoZWxlbWVudCBhcyBhbnkpLnJlZjtcbiAgfVxuXG4gIC8vIFJlYWN0IDE5IGluIERFVlxuICBnZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGVsZW1lbnQsICdyZWYnKT8uZ2V0O1xuICBtYXlXYXJuID0gZ2V0dGVyICYmICdpc1JlYWN0V2FybmluZycgaW4gZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZztcbiAgaWYgKG1heVdhcm4pIHtcbiAgICByZXR1cm4gZWxlbWVudC5wcm9wcy5yZWY7XG4gIH1cblxuICAvLyBOb3QgREVWXG4gIHJldHVybiBlbGVtZW50LnByb3BzLnJlZiB8fCAoZWxlbWVudCBhcyBhbnkpLnJlZjtcbn1cblxuZXhwb3J0IHsgUHJlc2VuY2UgfTtcbmV4cG9ydCB0eXBlIHsgUHJlc2VuY2VQcm9wcyB9O1xuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG50eXBlIE1hY2hpbmU8Uz4gPSB7IFtrOiBzdHJpbmddOiB7IFtrOiBzdHJpbmddOiBTIH0gfTtcbnR5cGUgTWFjaGluZVN0YXRlPFQ+ID0ga2V5b2YgVDtcbnR5cGUgTWFjaGluZUV2ZW50PFQ+ID0ga2V5b2YgVW5pb25Ub0ludGVyc2VjdGlvbjxUW2tleW9mIFRdPjtcblxuLy8g8J+kryBodHRwczovL2ZldHRibG9nLmV1L3R5cGVzY3JpcHQtdW5pb24tdG8taW50ZXJzZWN0aW9uL1xudHlwZSBVbmlvblRvSW50ZXJzZWN0aW9uPFQ+ID0gKFQgZXh0ZW5kcyBhbnkgPyAoeDogVCkgPT4gYW55IDogbmV2ZXIpIGV4dGVuZHMgKHg6IGluZmVyIFIpID0+IGFueVxuICA/IFJcbiAgOiBuZXZlcjtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVN0YXRlTWFjaGluZTxNPihcbiAgaW5pdGlhbFN0YXRlOiBNYWNoaW5lU3RhdGU8TT4sXG4gIG1hY2hpbmU6IE0gJiBNYWNoaW5lPE1hY2hpbmVTdGF0ZTxNPj5cbikge1xuICByZXR1cm4gUmVhY3QudXNlUmVkdWNlcigoc3RhdGU6IE1hY2hpbmVTdGF0ZTxNPiwgZXZlbnQ6IE1hY2hpbmVFdmVudDxNPik6IE1hY2hpbmVTdGF0ZTxNPiA9PiB7XG4gICAgY29uc3QgbmV4dFN0YXRlID0gKG1hY2hpbmVbc3RhdGVdIGFzIGFueSlbZXZlbnRdO1xuICAgIHJldHVybiBuZXh0U3RhdGUgPz8gc3RhdGU7XG4gIH0sIGluaXRpYWxTdGF0ZSk7XG59XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJub2RlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/@radix-ui+react-presence@1.1.2_@types+react-dom@19.0.3_@types+react@19.0.8__@types+react@19.0_rh3kivui4zlptcqwdsogz5u2py/node_modules/@radix-ui/react-presence/dist/index.mjs\n");

/***/ })

};
;