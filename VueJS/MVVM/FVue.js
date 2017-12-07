/**

	Simple version of Vue MVVM 
	View update Model => DOMListener
	Model update View => Data Binding (defineProperty) (Observer , Dep notify Watcher)
**/


function FVue(el, data, key){

	this.data = data;

	this.proxyKeys(data);

	new Observer(this.data);  

 	new Watcher(data, key, function(newVal){
		el.innerHTML = newVal;
	});

}


FVue.prototype.proxyKeys = function(data){

	var self = this; 

	Object.keys(data).forEach(function(key){
		
		Object.defineProperty(self, key, {
			enumerable: true,
			configuration: true,
			get: function(){
				return self.data[key];
			},
			set: function(newVal){
				self.data[key] = newVal;
			}
		});
	})
	
}