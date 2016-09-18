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
    function Filter($target, options) {
        this.$target = $target;
        this.options = $.extend({}, Filter.DEFAULTS, typeof options == "object" && options);
        this.init();
    };
    Filter.DEFAULTS = {
        name: "筛选",
        key: null,
        all: {
            name: "全部",
            value: "all"
        }
    };
    Filter.prototype = {
        init: function() {
            var me = this;
            me.onClick();
            if (typeof me.options.data == "object") {
                me.render(me.options.data);
            } else if (typeof me.options.url == "string") {
                me.getData();
            }
        },
        getData: function() {
            var me = this;
            $.ajax({
                url: me.options.url,
                type: "POST",
                dataType: "json",
                success: function(data) {
                    if (!data.error) {
                        me.render(data)
                    } else {
                        console.log(data.desc);
                    }
                },
                error: function(error) {
                    try {
                        console.log(error)
                    } catch (error) {}
                }
            });
        },
        render: function(data) {
            var me = this,
                // 数据值
                data = data[me.options.key],
                // 条目名称
                $filtername = $('<li></li>').text(me.options.name + ':'),
                // 全部标签
                filter = '<li class="active"><a href="javascript:void(0)">' + me.options.all.name + '</a></li>',
                $filter = $(filter).data("filter", me.options.all.value);
            // 生成全部标签元素
            me.$target.empty().append($filtername).append($filter);
            // 存储生成的标签
            var $filters = [];
            if (typeof data == "undefined") {
                throw new Error("没有数据！请确认key值是否正确");
                return;
            }
            $.each(data, function(i) {
                filter = '<li><a href="javascript:void(0)">' + data[i] + '</a></li>';
                $filter = $(filter).data("filter", data[i]);
                // 给已选中标签添加样式
                if (data[i] == me.$target.data("key")) {
                    me.$target.children("li.active").removeClass("active");
                    $filter.addClass("active");
                }
                $filters.push($filter);
            });
            me.$target.append($filters);
        },
        onClick: function() {
            var me = this;
            me.$target.on("click.filter", "li>a", function() {
                var $filter = $(this).parent("li");
                $filter.addClass("active").siblings("li").removeClass("active");
                me.$target.data("key", $filter.data("filter"));
            });
        }
    };
    // 外部可调用API
    Filter.API = ["getData", "render"];
    $.fn.filter = function(options, data) {
        if (this.length <= 0) {
            return this;
        }
        if (typeof this.data("filter") == "object") {
            if (typeof options == "string" && $.inArray(options, Filter.API) !== -1) {
                var API = options;
                var filter = this.data("filter");
                filter[API](data);
            }
        } else {
            this.data("filter", new Filter(this, options));
        }
        return this;
    }
});