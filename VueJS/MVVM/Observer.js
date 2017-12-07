/**

	Observer - 监听器
	劫持监听属性变化

**/ 


function Observer(data){
	this.data = data;  
	this.observe(data);
}

Observer.prototype.observe = function(data){
	
	if(!data || typeof data !== "object"){
		return; 
	}

	var self = this; 
	Object.keys(data).forEach(function(key){
		if(typeof data[key] === "object" && data[key] !== null){
			self.observe(data[key]);
		} 
		self.defineReactive(data, key, data[key]);
		 
	});

}


Observer.prototype.defineReactive = function(data, key, val){

	if(!data){
		return;
	}

	var dep = new Dep();

	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,
		get: function(){
			 
			//查看是否需要挂在到消息订阅器的订阅者，如果有便挂载
			if(Dep.target){
				dep.addWatcher(Dep.target);
			}
			return val; 
		},
		set: function(newValue){
			val = newValue;
			//通知消息订阅器中的订阅者，去update视图层数据 
			dep.notify(); 
		}
	});

}


/**
	消息订阅器
	管理订阅者列表， 监听者为每一个属性创建一个消息订阅器，用来收集以及通知该属性的订阅者
**/ 
function Dep(){
	this.watchers = [];
}

Dep.prototype.addWatcher = function(watcher){
	this.watchers.push(watcher);
}

Dep.prototype.notify = function(){
	
	this.watchers.forEach(function(watcher){
		watcher.update();
	})
}
