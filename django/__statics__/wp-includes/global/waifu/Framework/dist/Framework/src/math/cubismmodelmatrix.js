"use strict";
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live2DCubismFramework = exports.CubismModelMatrix = void 0;
var cubismmatrix44_1 = require("./cubismmatrix44");
var lappdefine_1 = require("../../../Samples/TypeScript/Demo/src/lappdefine");
/**
 * モデル座標設定用の4x4行列
 *
 * モデル座標設定用の4x4行列クラス
 *
 *
 */
var CubismModelMatrix = /** @class */ (function (_super) {
    __extends(CubismModelMatrix, _super);
    /**
     * コンストラクタ
     *
     * @param w 横幅
     * @param h 縦幅
     */
    function CubismModelMatrix(w, h) {
        var _this = _super.call(this) || this;
        _this._width = w !== undefined ? w : 0.0;
        _this._height = h !== undefined ? h : 0.0;
        var consumer_sacle = lappdefine_1.resourcesConfig.getModelScale();
        _this.scale(consumer_sacle, consumer_sacle);
        _this.setCenterPosition(consumer_sacle * w * lappdefine_1.resourcesConfig.getXscale() / 2, consumer_sacle * h * lappdefine_1.resourcesConfig.getYscale() / 2);
        return _this;
    }
    /**
     * 横幅を設定
     *
     * @param w 横幅
     */
    CubismModelMatrix.prototype.setWidth = function (w) {
        var scaleX = w / this._width;
        var scaleY = scaleX;
        this.scale(scaleX, scaleY);
    };
    /**
     * 縦幅を設定
     * @param h 縦幅
     */
    CubismModelMatrix.prototype.setHeight = function (h) {
        var scaleX = h / this._height;
        var scaleY = scaleX;
        this.scale(scaleX, scaleY);
    };
    /**
     * 位置を設定
     *
     * @param x X軸の位置
     * @param y Y軸の位置
     */
    CubismModelMatrix.prototype.setPosition = function (x, y) {
        this.translate(x, y);
    };
    /**
     * 设置live2d模型的中心位置
     *
     * @param x x轴的中点（即canvas宽度的一半值{x/2}）
     * @param y y轴的中点（即canvas高度的一半值{x/2}）
     *
     * @note widthかheightを設定したあとでないと、拡大率が正しく取得できないためずれる。
     */
    CubismModelMatrix.prototype.setCenterPosition = function (x, y) {
        this.centerX(x);
        this.centerY(y);
    };
    /**
     * 上辺の位置を設定する
     *
     * @param y 上辺のY軸位置
     */
    CubismModelMatrix.prototype.top = function (y) {
        this.setY(y);
    };
    /**
     * 下辺の位置を設定する
     *
     * @param y 下辺のY軸位置
     */
    CubismModelMatrix.prototype.bottom = function (y) {
        var h = this._height * this.getScaleY();
        this.translateY(y - h);
    };
    /**
     * 左辺の位置を設定
     *
     * @param x 左辺のX軸位置
     */
    CubismModelMatrix.prototype.left = function (x) {
        this.setX(x);
    };
    /**
     * 右辺の位置を設定
     *
     * @param x 右辺のX軸位置
     */
    CubismModelMatrix.prototype.right = function (x) {
        var w = this._width * this.getScaleX();
        this.translateX(x - w);
    };
    /**
     * X軸の中心位置を設定
     *
     * @param x X軸の中心位置
     */
    CubismModelMatrix.prototype.centerX = function (x) {
        var w = this._width * this.getScaleX();
        this.translateX(x - w / 2.0);
    };
    /**
     * X軸の位置を設定
     *
     * @param x X軸の位置
     */
    CubismModelMatrix.prototype.setX = function (x) {
        this.translateX(x);
    };
    /**
     * Y軸の中心位置を設定
     *
     * @param y Y軸の中心位置
     */
    CubismModelMatrix.prototype.centerY = function (y) {
        var h = this._height * this.getScaleY();
        this.translateY(y - h / 2.0);
    };
    /**
     * Y軸の位置を設定する
     *
     * @param y Y軸の位置
     */
    CubismModelMatrix.prototype.setY = function (y) {
        this.translateY(y);
    };
    /**
     * レイアウト情報から位置を設定
     *
     * @param layout レイアウト情報
     */
    CubismModelMatrix.prototype.setupFromLayout = function (layout) {
        var keyWidth = 'width';
        var keyHeight = 'height';
        var keyX = 'x';
        var keyY = 'y';
        var keyCenterX = 'center_x';
        var keyCenterY = 'center_y';
        var keyTop = 'top';
        var keyBottom = 'bottom';
        var keyLeft = 'left';
        var keyRight = 'right';
        for (var ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
            var key = ite.ptr().first;
            var value = ite.ptr().second;
            if (key == keyWidth) {
                this.setWidth(value);
            }
            else if (key == keyHeight) {
                this.setHeight(value);
            }
        }
        for (var ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
            var key = ite.ptr().first;
            var value = ite.ptr().second;
            if (key == keyX) {
                this.setX(value);
            }
            else if (key == keyY) {
                this.setY(value);
            }
            else if (key == keyCenterX) {
                this.centerX(value);
            }
            else if (key == keyCenterY) {
                this.centerY(value);
            }
            else if (key == keyTop) {
                this.top(value);
            }
            else if (key == keyBottom) {
                this.bottom(value);
            }
            else if (key == keyLeft) {
                this.left(value);
            }
            else if (key == keyRight) {
                this.right(value);
            }
        }
    };
    CubismModelMatrix.prototype.getWidth = function () { return this._width; };
    CubismModelMatrix.prototype.getHeight = function () { return this._height; };
    return CubismModelMatrix;
}(cubismmatrix44_1.CubismMatrix44));
exports.CubismModelMatrix = CubismModelMatrix;
// Namespace definition for compatibility.
var $ = __importStar(require("./cubismmodelmatrix"));
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismModelMatrix = $.CubismModelMatrix;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmodelmatrix.js.map