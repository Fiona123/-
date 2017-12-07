    

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

	    		if(self.isTextNode(node) && reg.test(text)){
	    			self.complileText(node, reg.exec(text)[1]);
	    		}

	    	 
	    		if(node.childNodes && node.childNodes.length){
	    			self.compileElement(node);
	    		}
	    	});
	    }

	    Compile.prototype.isTextNode = function(node){
	    	return node.nodeType === 3;
	    }

	    Compile.prototype.complileText = function(node, key){

	    	new Watcher(this.fvm.data, key, function(newVal){
	    		node.textContent = newVal === undefined? "": newVal;
	    	})
	    }
