function Watcher(obj, key, fnCallBack){
	this.obj = obj;
	this.key = key;
	this.cbFunc = fnCallBack;
	this.watch();
	this.update();
}

Watcher.prototype.watch = function(){
	//把当前订阅者挂在到对象obj的key属性上

	//缓存自己
	Dep.target = this;

	//挂载 - 触发属性的getter function
	this.obj[this.key];

	//释放自己
	Dep.target = null;

}

Watcher.prototype.update = function(){
	var newVal = this.obj[this.key];
	this.cbFunc.call(this, newVal);
}