/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;
var disStatus="none";

// var tabCanvas = musicNotes[]
$(function () {
	'use strict';

	// start from create tab
	new app.AppView();

});

        $("#searchForm").on("submit", function(e){
            e.preventDefault();
            //prepare the request !=null
            
            if($("#search").val().substring(0,32)=="https://www.youtube.com/watch?v="){
            var Vid=$("#search").val().substring(32,43);
                
                var URLtext="https://www.youtube.com/embed/"+Vid;
                document.getElementById("demo").innerHTML=URLtext;
                document.getElementById("ytbox").src=URLtext;
                document.getElementById('ytbox').contentWindow.location.reload(true);
            };
               
                    
        });
$(function(){
    
    var disStatus = document.getElementById("videoresult").style.display;
        $( "#searchForm2").delegate( "#keyword", "click", function() {
                 disStatus = document.getElementById("videoresult").style.display;
            if(disStatus!="block"){    
                $("#videoresult").slideToggle("slow");
            }
            
        });
    
});

$("#videoresult").delegate("button","click",function(){
              $("#videoresult").slideToggle("slow");       
                     });
$(function(){
    $("#searchForm2").on("submit", function(e){
        e.preventDefault();
        //prepare the request
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            
            q: $("#keyword").val().replace(/%20/g, "+"),
            //encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            videoCategoryID: "Music",
            maxResults: 20,
            order: "viewCount",
            publishedAfter: "2000-01-01T00:00:00Z"
        });
        // execute the request
       request.execute(function(response) {
           var results = response.result;
           $("#videoresult_btn").empty();
           $.each(results.items,function(index,item){
               
               $("#videoresult_btn").append('<div class="res_btn" id="'+item.id.videoId+'" style="cursor :pointer;"><img src=https://img.youtube.com/vi/'+item.id.videoId+'/1.jpg id="'+item.id.videoId+'" >'+item.snippet.title+'</div><br>');
               
               $(".res_btn").css({"background-color":"#4169E1","border":"#000000 solid thin","border-radius": "10px"});
               $(".res_btn").mouseover(function(event){$(event.target).css({"background-color":"#FFDEAD","position": "relative","top": "2px","left": "2px"});});
               $(".res_btn").mouseout(function(event){$(event.target).css({"background-color":"#4169E1","position":"relative","top": "0px","left": "0px"});});
               /*$.get("./tpl/item.html", function(data) {
                $("#videoresult").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
                });
                
                '<div><img src=https://img.youtube.com/vi/'+item.id.videoId+'/1.jpg>'+item.snippet.title+'</div>'
                */
               //$("#results").append(item.id.videoId+""+item.snippet.title+"<br>");
           });
       });
          
    });
});


        function init(){
            
            gapi.client.setApiKey("AIzaSyA831jpqrfz8EShm673XANf-fktA-u-1Pw");
            gapi.client.load("youtube","v3",function(){
                    //api is ready
            });
            //console.log(gapi.client);
        }
        
        
        
        
        $(function resultchoice() {
	       $("#videoresult_btn").delegate(".res_btn","click",function(event){
                var Vid;
                Vid=$(event.target).attr("id");
               console.log(Vid);
               var URLtext="https://www.youtube.com/embed/"+Vid;
                document.getElementById("demo").innerHTML=URLtext;
                document.getElementById("ytbox").src=URLtext;
                document.getElementById('ytbox').contentWindow.location.reload(true);
            
               
               
           });
        });