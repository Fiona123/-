    

/**

	Complie DOM Elements 
	el = "#id", pass id to Complie
	New watchers for DOM elments. 
**/

    function Compile(el, fvm){

    		this.fvm = fvm;

	    	this.el = document.querySelector(el);

	    	this.fragment = this.nodeToFragment(this.el);

	    	this.compileElement(this.fragment);

	    	this.el.appendChild(this.fragment);
	    }

	    Compile.prototype.nodeToFragment = function(el){

	    	var fragment = document.createDocumentFragment();
	    	var child = el.firstChild;
	    	while(child){
	    		fragment.appendChild(child);
	    		child = el.firstChild;
	    	}

	    	return fragment;
	    }

	    Compile.prototype.compileElement = function(el){
	    	var childNodes = el.childNodes;
	    	var self = this;

	    	[].slice.call(childNodes).forEach(function(node){

	    		var reg = /\{\{(.*)\}\}/;
	    		var text = node.textContent;

	    		if(self.isElementNode(node)){
	    			self.compileAttributes(node);
	    		}
	    		else if(self.isTextNode(node) && reg.test(text)){
	    			self.complileText(node, reg.exec(text)[1]);
	    		}

	    	 
	    		if(node.childNodes && node.childNodes.length){
	    			self.compileElement(node);
	    		}
	    	});
	    }

	     Compile.prototype.complileText = function(node, key){

	    	new Watcher(this.fvm.data, key, function(newVal){
	    		node.textContent = newVal === undefined? "": newVal;
	    	})
	    }

	    Compile.prototype.compileAttributes = function(node){
	    	var attrs = node.attributes;
	    	var self = this;
	    	[].slice.call(attrs).forEach(function(attr){
	    		var attrName = attr.name;
	    		if(self.isModelDirective(attrName)){
	    			self.compileModel(node, attr.value);
	    		}else if(self.isEventDirective(attrName)){
	    			self.compileEvent(node, attrName.split(":")[1], attr.value);
	    		}
	    	})
	    }

	    Compile.prototype.compileModel = function(node, key){

	    	new Watcher(this.fvm.data, key, function(newVal){
	    		node.value = newVal === undefined? "": newVal;
	    	});

	    	node.addEventListener('input', function(event){
	    		self.fvm[key] = event.target.value;
	    	});
	    }

	    Compile.prototype.compileEvent = function(node, eventType, method){
	    	var cbMethod = this.fvm.methods[method];
	    	if(eventType && cbMethod){
	    		node.addEventListener(eventType, cbMethod.bind(this.fvm), false);
	    	}
	    }


	    Compile.prototype.isTextNode = function(node){
	    	return node.nodeType === 3;
	    }

	    Compile.prototype.isElementNode = function(node){
	    	return node.nodeType === 1;
	    }

	    Compile.prototype.isModelDirective = function(attr) {
	        return attr.indexOf('v-model') === 0;
	    } 

	    Compile.prototype.isEventDirective = function(attr){
	    	return attr.indexOf("v-on:") === 0;
	    }



