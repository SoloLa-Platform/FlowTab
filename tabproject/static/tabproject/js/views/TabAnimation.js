define(
	function () {

	var tabAnimation = function TabAnimation(selectorId, tabView){

		 	this.obj = document.querySelector(selectorId);

		 	this.viewBox_x = 0;
		 	this.xStr = "";
		 	this.padDelta = 0;
		 	this.tabView = tabView;

		 	// moving animation render
		 	this.render = function () {
		 		// @ I guess access the object too fast causing retriving undefined object
		 		if(this.obj !== null){
		 			this.xStr = String(this.viewBox_x);
			 		this.obj.setAttribute('viewBox', this.xStr+=',0,1440,300');
			 		this.viewBox_x+=this.padDelta;

			 		window.requestAnimationFrame(this.render);
		 		}

		 	};

		 	this.setPadSpeed = function (delta) {
		 		this.padDelta = delta;
		 	};

		 	this.setViewBox_x = function (presentage) {
		 		 // 0.5 scaling is for fixing over viewbox range
		 		 this.viewBox_x = presentage * this.tabView.getTabSVGLength() * 0.70;
		 	};

	};
	return tabAnimation;

});

