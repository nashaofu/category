/**
 * 文件筛选标签显示
 * @param  {[type]} factory [description]
 * options={
 *     name: "筛选",
 *     key: null,
 *     all: {
 *         name: "全部",
 *         value: "all"
 *     }
 * }
 * @return {[type]}         [description]
 */
(function(factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        /** AMD规范模块调用 */
        define(["jquery"], factory);
    } else if (typeof define === "function" && define.cmd) {
        /** CMD规范模块调用 */
        define(function(require, exports, module) {
            factory(require("jquery"));
        });
    } else {
        /** 浏览器全局调用 */
        factory(jQuery);
    }
})(function($) {
    function Category($target, options) {
        this.$target = $target;
        this.options = $.extend({}, Category.DEFAULTS, typeof options == "object" && options);
        this.init();
    };
    Category.DEFAULTS = {
        name: "分类",
        key: null,
        url: undefined,
        formdata: null,
        all: {
            name: "全部",
            value: "all"
        }
    };
    Category.prototype = {
        init: function() {
            var me = this;
            me.bindEvent();
            // 优先加载本地数据
            if (typeof me.options.data == "object") {
                me.render();
            } else if (typeof me.options.url == "string") {
                me.getData();
            }
        },
        getData: function(options) {
            var me = this;
            me.options = $.extend({}, me.options, typeof options == "object" && options);
            if (typeof me.options.url == "undefined") {
                throw new Error("未定义url");
                return false;
            }
            $.ajax({
                url: me.options.url,
                type: "POST",
                data: me.options.formdata,
                dataType: "json",
                success: function(data) {
                    me.render({
                        data: data
                    });
                },
                error: function(error) {
                    try {
                        console.warn(error);
                    } catch (error) {}
                }
            });
        },
        render: function(options) {
            var me = this;
            me.options = $.extend({}, me.options, typeof options == "object" && options);
            // 获取数据
            me.options.data = me.options.key && me.options.data[me.options.key] ? me.options.data[me.options.key] : me.options.data;
            // 条目名称
            var $name = $('<li></li>').text(me.options.name + ':'),
                // 全部标签
                $all = $('<li class="active"><a href="javascript:void(0)">' + me.options.all.name + '</a></li>');
            $all.data(me.options.key, me.options.all.value);
            // 生成全部标签元素
            me.$target.empty().append($name).append($all).data("key", me.options.all.value);
            // 存储生成的标签
            var $categorys = [];
            $.each(me.options.data, function(i, item) {
                var $category = $('<li><a href="javascript:void(0)">' + item + '</a></li>');
                $category.data(me.options.key, item);
                $categorys.push($category);
            });
            me.$target.append($categorys);
        },
        bindEvent: function() {
            var me = this;
            me.$target.on("click.category", "li>a", function() {
                var $category = $(this).parent("li");
                $category.addClass("active").siblings("li").removeClass("active");
                me.$target.data("key", $category.data(me.options.key));
            });
        }
    };
    // 外部可调用API
    Category.API = ["getData", "render"];
    $.fn.category = function(options, parameter) {
        if (this.length <= 0) {
            return this;
        }
        if (typeof this.data("category") == "object") {
            if (typeof options == "string" && $.inArray(options, Category.API) !== -1) {
                var API = options;
                var category = this.data("category");
                category[API](parameter);
            }
        } else {
            this.data("category", new Category(this, options));
        }
        return this;
    }
});