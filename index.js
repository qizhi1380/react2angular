"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.react2angular = void 0;
const lodash_1 = require("lodash");
const ngcomponent_1 = __importDefault(require("ngcomponent"));
const React = __importStar(require("react"));
const client_1 = require("react-dom/client");
/**
 * Wraps a React component in Angular. Returns a new Angular component.
 *
 * Usage:
 *
 *   ```ts
 *   type Props = { foo: number }
 *   class ReactComponent extends React.Component<Props, S> {}
 *   const AngularComponent = react2angular(ReactComponent, ['foo'])
 *   ```
 */
function react2angular(Class, bindingNames = null, injectNames = []) {
    const names = bindingNames ||
        (Class.propTypes && Object.keys(Class.propTypes)) ||
        [];
    return {
        bindings: lodash_1.fromPairs(names.map((_) => [_, '<'])),
        controller: [
            '$element',
            ...injectNames,
            class extends ngcomponent_1.default {
                constructor($element, ...injectedProps) {
                    super();
                    this.$element = $element;
                    this.isDestroyed = false;
                    this.injectedProps = {};
                    injectNames.forEach((name, i) => {
                        this.injectedProps[name] = injectedProps[i];
                    });
                    this.root = client_1.createRoot($element[0]);
                }
                static get $$ngIsClass() {
                    return true;
                }
                $onInit() {
                    names.forEach((name) => {
                        this.props[name] = this[name];
                    });
                }
                render() {
                    if (!this.isDestroyed) {
                        this.root.render(React.createElement(Class, Object.assign({}, this.props, this.injectedProps)));
                    }
                }
                componentWillUnmount() {
                    this.isDestroyed = true;
                    if (this.$element[0] && this.root) {
                        this.root.unmount();
                    }
                }
            }
        ]
    };
}
exports.react2angular = react2angular;
//# sourceMappingURL=index.js.map