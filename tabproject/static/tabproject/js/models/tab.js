define(['backbone', 'measure_model', 'musicnote_model', 'measure_set'],
function (Backbone, Measure_model, Musicnote_model, Measure_Set) {

	'use strict';
	// console.log('hello from Tab_model');
	var tab_model =Backbone.Model.extend({

		// Tab: the Model of Tab from XML
			data:{},
			measureSet:{},

			defaults:{

				"videoName":'',
				"url":'parsing',
			},

			initialize: function(){
				// console.log('init tabModel!');

				// Create MeasureSet
				this.measureSet = new Measure_Set();
				// this.set("MeasureSet", new MeasureSet());
			},
			getMeasureSet: function () {
				 return this.measureSet;
			},

			// fetch remote alg. result from server by ajax
			fetchRemoteFull: function(tabUrl) {

				if (typeof tabUrl === "undefined"){
					tabUrl = this.defaults.url;
				}else{
					console.log('use tabURL');
				}

				this.ajax = $.ajax({
					url: tabUrl,
					datatype:'json',
					async: 'true',
					success: this.ajaxHandle.bind(this)
				});

			},
			privateStore: function(data){
				this.data = data;
			},
			getMeasureLength: function(){
				return this.data['score-partwise'].part.measure.length;
			},
			// This function need to seperate into detail process for preformanace issue
			ajaxHandle: function (result) {
				// console.log('Tab_model @ajaxHandle');
				this.privateStore(JSON.parse(result));
				var measures = this.data['score-partwise'].part.measure;
				// console.log(measures);


				// need to get first measure attribute, get the divide
				// this.defaults.division = measures[0].attributes.divisions;
				console.log("total measure: " + measures.length);

				// ** Need to test draw all measure
				var l = measures.length;
				for (var i = 0; i < l; i++) {
					// console.log(" measure: "+i);
					// console.log(measures[i]);

					var m =  new Measure_model({MNsArray:this.retriveMNsArray(measures[i].note)});
					m.set({"number": measures[i]['@number']});

					if ( measures[i].hasOwnProperty("attributes") ){
						m.setAttr(measures[i].attributes);
						// console.log('has attributes');
					}

					// console.log(m.get("MNsArray"));
					this.measureSet.add(m);

				}
				// console.log('append finish done');
				// this.tabTree.dump();

			},
			retriveMNsArray: function(notes){
				var MNsArray = [];
				var l = notes.length;
				for(var j = 0; j < l; j++){

						// console.log("MN:"+j);
						if (notes[j].hasOwnProperty("rest")){
							// console.log('rest');
							MNsArray.push(new Musicnote_model({
									duration: notes[j].duration,
								})
							);
						}
						else{
							// Create a new MN for each note
							MNsArray.push(new Musicnote_model({

									tabLineNum: notes[j].notations.technical.string,
									fretNum: notes[j].notations.technical.fret,
									duration: notes[j].duration,
									alter: notes[j].pitch.alter,
									octave: notes[j].pitch.octave,
									step: notes[j].pitch.step,
								})
							);

							// console.log(musicnote);
						}
				}
				return MNsArray;
			}
	});
	return tab_model;

});

