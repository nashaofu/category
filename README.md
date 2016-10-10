# category
这是一个基于jQuery的分类标签选择列表
## 插件示例
[DEMO](https://diaocheng.github.io/category/)
## html
	<ul id="category-1" class="category"></ul>
	<ul id="category-2" class="category"></ul>
	<ul id="category-3" class="category"></ul>
	<ul id="category-4" class="category"></ul>
## js
	/** 初始化插件 */
	$("#category-1").category({
	    name: "分类1",
	    data: ["分类1-1", "分类1-2", "分类1-3", "分类1-4", "分类1-5", "分类1-6"]
	});
	$("#category-2").category({
	    name: "分类2",
	    key: "tag",
	    data: {
	        tag: {
	            1: "分类2-1",
	            2: "分类2-2",
	            3: "分类2-3",
	            4: "分类2-4",
	            5: "分类2-5",
	            6: "分类2-6",
	            7: "分类2-7",
	            8: "分类2-8",
	            9: "分类2-9",
	            10: "分类2-10"
	        }
	    }
	});
	$("#category-3").category({
	    name: "分类3",
	    key: "category",
	    data: {
	        category: ["分类3-1", "分类3-2", "分类3-3", "分类3-4", "分类3-5", "分类3-6"]
	    }
	});
	$("#category-4").category({
	    url: "json/json.json",
	    key: "category"
	});
	/** 初始化插件 end */
	// 请求远程数据
	$("#button-1").click(function() {
	    $("#category-1").category("getData", {
	        url: "json/test1.json",
	        key: "category",
	        formdata: {
	            test: "this is a test formdata"
	        }
	    });
	});
	// 显示本地数据,并且数据下标不变
	$("#button-2").click(function() {
	    $("#category-2").category("render", {
	        data: {
	            tag: ["本地测试数据1-1", "本地测试数据1-2", "本地测试数据1-3", "本地测试数据1-4", "本地测试数据1-5", "本地测试数据1-6"]
	        }
	    });
	});
	// 请求服务器数据，并改变插件配置
	$("#button-3").click(function() {
	    $("#category-3").category("getData", {
	        name: "test",
	        key: 'test',
	        url: "json/test2.json",
	        formdata: {
	            test: 'this is a test formdata'
	        },
	        all: {
	            name: "所有",
	            value: "all"
	        }
	    });
	});
