# category
这是一个基于jQuery的分类标签选择列表
## html
	<ul id="category-1" class="category"></ul>
	<ul id="category-2" class="category"></ul>
	<ul id="category-3" class="category"></ul>
	<ul id="category-4" class="category"></ul>
## js
	$("#category-1").category({
		name:"分类1",
		data:["分类1-1","分类1-2","分类1-3","分类1-4","分类1-5","分类1-6"]
	});
	$("#category-2").category({
		name:"分类2",
		key:"tag",
		data:{
			tag:{
				1:"分类2-1",
				2:"分类2-2",
				3:"分类2-3",
				4:"分类2-4",
				5:"分类2-5",
				6:"分类2-6",
				7:"分类2-7",
				8:"分类2-8",
				9:"分类2-9",
				10:"分类2-10"
			}
		}
	});
	$("#category-3").category({
		name:"分类3",
		key:"category",
		data:{
			category:["分类3-1","分类3-2","分类3-3","分类3-4","分类3-5","分类3-6"]
		}
	});
	$("#category-4").category({
		name:"分类4",
		key:"category"
	});