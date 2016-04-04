/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **Tab View** is the top-level piece of UI.
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
			console.log(this.origin);

			// calculating tabLine top and bottom padding
			this.paddingYratio = 0.10;
			this.paddingY = this.calPaddingY(this.height, this.paddingYratio);
			this.tabLineSpace = this.calTabLineSpace(this.height, this.paddingY);
			this.firstLineY = 0 * this.tabLineSpace + this.paddingY;
			this.sixthLineY = 5 * this.tabLineSpace + this.paddingY;

			// tab unit cell, cell height = distance between line
			this.widthRatio = 0.01;
			this.cellWidth = this.calUnitCellWidht(this.width, this.widthRatio);
			console.log('cellWidth:'+this.cellWidth);
			this.cellHeight = this.tabLineSpace;

			this.intiTabSize($(window).width(), this.height);
			this.drawTabLines();
			this.drawVirtualLine();

			// Event binding
			this.listenTo(app.MusicNotes, "add", this.addOneMN);

			// Show the default demo tab, create a TabModel
			// this part can be improvement by web worker
			this.tabModel = new app.Tab();

			// Check the JSON all added into MNs Collection
			$(document).bind("ajaxComplete", this.ajaxHandle.bind(this));

		},
		render: function () {

		},
		intiTabSize: function(w, h){
			// init tab width by window width
			$("#tabSVG").attr("width", w);
			$("#tabSVG").attr("height", h);
		},
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
		// Draw Virtual Line for cell alignment
		drawVirtualLine: function () {

			var HorLineNums = Math.ceil(this.width/this.cellWidth);
			console.log(HorLineNums);
			for (var i = HorLineNums - 1; i >= 0; i--) {
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
			if( i % 4 === 0){
				sw = 0.4;
				color = 'rgb(0, 153, 0)';
			}
			l.setAttributeNS(null,"x1",x);
			l.setAttributeNS(null,"y1",firstLineY - this.cellHeight/2);
			l.setAttributeNS(null,"x2",x);
			l.setAttributeNS(null,"y2",sixthLineY + this.cellHeight/2);
			l.setAttributeNS(null,"style", "stroke:"+color+";stroke-width:"+sw);
			l.setAttributeNS(null,"class","virtualLine");
			return l;
		},
		// Tab Event Listening
		coordinateConvert: function (x, y) {
			 return { 'x':Math.floor( (x-this.origin.x) / this.cellWidth ),
			 	'y': Math.floor( (y-this.origin.y) / this.cellHeight )
			 	};
		},
		rawPos: function(x, y){
			return {'x': x, 'y':y};
		},
		showMouseDownPos: function(event){
			console.log("mouse down at X:" + event.pageX +" Y:"+ event.pageY);
		 	var rawPos = this.rawPos( event.pageX, event.pageY );
			var pos = this.coordinateConvert(event.pageX, event.pageY);

			console.log("cell X: "+ pos.x+ " cell Y: "+ pos.y);

			// Create MusicNote Model and Views
			// var musicnote = new app.MusicNote( this.newAttribute(rawPos) );
			// var view = new app.MusicNoteView( {
				// model: musicnote,
				// xCellNum: pos.x,
				// yCellNum: pos.y - this.origin.y} );
			// view.dump();

			// draw MusicNote to SVG
			// this.$tabSVG.append(view.drawFretNum());

			// collection add MusicNote Model
			// app.MusicNotes.add( musicnote );
		},
		newAttribute: function (pos) {
			return {
				"tabLineNum": 0,
				"fretNum": 0,
				"tech": {}
			};
		},
		// allocate all the MN and assign MN view to draw
		ajaxHandle: function () {
			// console.log('ajax complete!');
 			// check the context of this function
 			// console.log(this);
 			this.allocateInitTab();


		},
		allocateInitTab: function () {

			for (var i = 0; i < app.MusicNotes.length - 1; i++) {
				var mn = app.MusicNotes.at(i);
				// console.log(this.getMNcells(mn));
				var view = new app.MusicNoteView({
						model: mn,
						cells: this.getMNcells(mn)
				});

				// view.dump();
				// draw MusicNote fret to SVG
				this.$tabSVG.append(
					view.drawFretNum(this.cellWidth, this.cellHeight, this.origin.y));

			}
		},
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
		addOneMN: function (mn) {
			console.log('fire MN collection add!');
			// console.log(mn.toJSON());
			// var view = new app.MusicNoteView({model: mn} );
			// view.dump();
			// this.$tabSVG.append(view.drawFretNum());
		}

	});
})(jQuery);
