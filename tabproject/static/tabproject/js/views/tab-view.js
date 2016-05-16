/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {

	'use strict';


	app.TabView = Backbone.View.extend({

		// Property
		el: '#tab',
		xPtr: 0,
		divisionUnit: 256,
		events:{
			"mousedown" : "showMouseDownPos"
		},
		initialize: function () {

			// temp tabLine
			this.$tabSVG = $("#tabSVG");
			this.tabLines = [];
			this.width = $("#tab").width();
			this.height = $("#tab").height();
			this.origin =  this.origin2int($("#tab"));

			// calculating tabLine top and bottom padding
			this.paddingYratio = 0.10;
			this.paddingY = this.calPaddingY(this.height, this.paddingYratio);
			this.tabLineSpace = this.calTabLineSpace(this.height, this.paddingY);
			this.firstLineY = 0 * this.tabLineSpace + this.paddingY;
			this.sixthLineY = 5 * this.tabLineSpace + this.paddingY;

			// tab unit cell, cell height = distance between line
			this.widthRatio = 0.01;
			this.cellWidth = this.calUnitCellWidht(this.width, this.widthRatio);
			this.cellHeight = this.tabLineSpace;

			this.intiTabSize($(window).width(), this.height);
			this.drawTabLines();

			this.drawVirtualLine(); // ** move to each measure

			//
			// Event Handler
			//
			// this.listenTo(app.MusicNotes, "add", this.addOneMN);
			// this.listenTo(app.Measures, "add", this.addOneMeasure);

			// Check the JSON all added into MNs Collection
			// $(document).bind("ajaxComplete", this.ajaxHandle.bind(this));

		},
		render: function () {

		},
		intiTabSize: function(w, h){
			// init tab width by window width
			$("#tabSVG").attr("width", w);
			$("#tabSVG").attr("height", h);
		},
		//
		// This is initilization helper function
		//
		origin2int: function (o){
			return { 'x': Math.ceil($("#tab").offset().left),
				'y': Math.ceil(o.offset().top) };
		},
		// layout calculation
		calTabLineSpace: function (h, paddingY) {
			 return (h - paddingY*2) / 5;
		},
		calPaddingY: function (h, ratio) {
			 return h * ratio;
		},
		calUnitCellWidht: function (w, ratio) {
			 return w * ratio;
		},

		// TabLine Svg Drawing Function
		drawTabLines: function(){
			for (var i = 0; i < 6; i++) {
				// console.log('initialize in drawTabLines');
				this.tabLines[i] = this.createHorizonalLine(i,
					this.width, this.paddingY, this.tabLineSpace);
				document.getElementById("tabSVG").appendChild(this.tabLines[i]);
			}
		},

		createHorizonalLine: function(lineNum, w, paddingY, tabLineSpace){
			var xmlns = "http://www.w3.org/2000/svg";
			var l = document.createElementNS(xmlns, "line");

			l.setAttributeNS(null,"x1",0);
			l.setAttributeNS(null,"y1",lineNum*tabLineSpace+paddingY);
			l.setAttributeNS(null,"x2",w*2);
			l.setAttributeNS(null,"y2",lineNum*tabLineSpace+paddingY);
			l.setAttributeNS(null,"style", "stroke:rgb(0,0,0);stroke-width:2");
			l.setAttributeNS(null,"class","tabLine");
			return l;
		},
		//
		// Draw Virtual Line for cell alignment (this function should move to measure mnv)
		//
		drawVirtualLine: function () {

			var HorLineNums = Math.ceil(this.width/this.cellWidth);
			console.log(HorLineNums);
			for (var i = 0; i < HorLineNums; i++) {
				document.getElementById("tabSVG")
					.appendChild(this
						.createVerticalLine(i, this.firstLineY, this.sixthLineY));
			}
		},
		createVerticalLine: function(i,firstLineY, sixthLineY){
			var xmlns = "http://www.w3.org/2000/svg";
			var l = document.createElementNS(xmlns, "line");
			var x = i*this.cellWidth;
			var color = 'rgb(0,0,0)';
			var sw = 0.1;
			// if( i % 16 === 0){
			// 	sw = 0.8;
			// 	color = 'rgb(100, 100, 100)';
			// }
			l.setAttributeNS(null,"x1",x);
			l.setAttributeNS(null,"y1",firstLineY - this.cellHeight/2);
			l.setAttributeNS(null,"x2",x);
			l.setAttributeNS(null,"y2",sixthLineY + this.cellHeight/2);
			l.setAttributeNS(null,"style", "stroke:"+color+";stroke-width:"+sw);
			l.setAttributeNS(null,"class","virtualLine");
			return l;
		},

		showMouseDownPos: function(event){
			console.log("mouse down at X:" + event.pageX +" Y:"+ event.pageY);
		 	var rawPos = this.rawPos( event.pageX, event.pageY );
			var pos = this.coordinateConvert(event.pageX, event.pageY);

			console.log("cell X: "+ pos.x+ " cell Y: "+ pos.y);

			// Create MusicNote Model and Views
			// var musicnote = new app.MusicNote( this.newAttribute(rawPos) );
			// var mnv = new app.MusicNoteView( {
				// model: musicnote,
				// xCellNum: pos.x,
				// yCellNum: pos.y - this.origin.y} );
			// mnv.dump();

			// draw MusicNote to SVG
			// this.$tabSVG.append(mnv.drawFretNum());

			// collection add MusicNote Model
			// app.MusicNotes.add( musicnote );
		},
		//
		//  Helper functions
		//
		coordinateConvert: function (x, y) {
			 return { 'x':Math.floor( (x-this.origin.x) / this.cellWidth ),
			 	'y': Math.floor( (y-this.origin.y) / this.cellHeight )
			 	};
		},
		rawPos: function(x, y){
			return {'x': x, 'y':y};
		},
		newAttribute: function (pos) {
			return {
				"tabLineNum": 0,
				"fretNum": 0,
				"tech": {}
			};
		},
		// this function better to be re-implemented by less objects method
		getMNcells: function (mn) {
			// Use 1/16 as the cell, equal 256 division
			var xDuration = mn.get("duration")/this.divisionUnit;
			var str = mn.get("tabLineNum");
			var fret = mn.get("fret");
			var cells = [];
			// calculate how many cell for x dimension

			for (var i = 0; i < xDuration; i++) {
				cells.push({'x': i+this.xPtr, 'y': parseInt(str)});
			}
			// Move xPtr for insert next note
			this.xPtr = this.xPtr + xDuration;
			return cells;

		},
		//
		// helper function end
		//

		// High coupling function, shoulb be in controller
		allocateInitTab: function (measureSet) {
			// referenc of 1/4 duration value
			var tmp_division = 1024;

			console.log('in allocateInitTab');
			var l = measureSet.length; //optimized perf. style
			var df = document.createDocumentFragment();
			for (var i = 0; i < l - 100; i++) {

				var mv = new app.MeasureView({model: measureSet.at(i)});
				// var measG = document.createElementNS(this.xmlns, "g");
				// measG.setAttributeNS(null,"id","m"+i);

				var l2 = measureSet.at(i).get("mnsArray").length; //optimized perf. style
				for( var j = 0; j < l2; j++){
					var mnv = new app.MusicNoteView({

						model: measureSet.at(i).get("mnsArray")[j],
						cells: this.getMNcells(measureSet.at(i).get("mnsArray")[j]) // dependency in tab View
					});
					mv.addMView(mnv);

					// draw MusicNote fret to SVG
					$(df).append($(mnv.getSVGGroup())
						.append(mnv.drawFretNum(this.cellWidth, this.cellHeight, this.origin.y))
						.append(mnv.drawDurBar(this.cellWidth, this.cellHeight)));
				}
				// console.log(measG);
				// df.appendChild(measG);
				// console.log(mv.getMNViewsArray());

			}
			this.$tabSVG.append(df);
		},


		addOneMN: function (mn) {
			// console.log('fire MN collection add!');
			// console.log(mn.toJSON());
			// var mnv = new app.MusicNoteView({model: mn} );
			// mnv.dump();
			// this.$tabSVG.append(mnv.drawFretNum());
		},
		//
		// Measures Collection Handle
		//
		addOneMeasure: function (m) {
			 // console.log('fire add one measure');
			 // console.log(m);
		}

	});
})(jQuery);
