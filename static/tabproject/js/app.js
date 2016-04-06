/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;



// app is the global variable as namespace for view, model class and controller //
// mainController is a singleton object, but others object are newable
$(function () {

    'use strict';
	app.mainController.getInstance().startApp();

});


$(function(){
    $("#searchbtn2").click(function(){
        // console.log(this);
//            this.focus();
    });
    $( "#searchForm2" ).delegate( "#keyword", "focus", function() {
         $("#videoresult").slideToggle("slow");
    });
});


// Initilize Google Youtube API

(function init(){
        gapi.client.setApiKey("AIzaSyA831jpqrfz8EShm673XANf-fktA-u-1Pw");
        gapi.client.load("youtube","v3",function(){
                console.log('load youtube API is done');
        });
})();

$(function(){


    // Url Search and replace youtube video
    $("#searchForm").on("submit", function(e){
        e.preventDefault();
        //prepare the request !=null

        if($("#search").val().substring(0,32)=="https://www.youtube.com/watch?v="){

            var Vid=$("#search").val().substring(32,43);
            var URLtext="https://www.youtube.com/embed/"+Vid;
            document.getElementById("demo").innerHTML=URLtext;
            document.getElementById("ytbox").src=URLtext;
            document.getElementById('ytbox').contentWindow.location.reload(true);
        }
    });
    // Keyword Search
    $("#searchForm2").on("submit", function(e){
        e.preventDefault();
        //prepare the request
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#keyword").val()).replace(/%20/g, "+"),
            maxResults: 4,
            order: "viewCount",
            publishedAfter: "2015-01-01T00:00:00Z"
        });
        // execute the request
       request.execute(function(response) {
           var results = response.result;
           $("#videoresult_btn").empty();
           $.each(results.items,function(index,item){

               $("#videoresult_btn").append('<div class="res_btn" id="'+item.id.videoId+'" style="cursor :pointer;"><img src=https://img.youtube.com/vi/'+item.id.videoId+'/1.jpg id="'+item.id.videoId+'" >'+item.snippet.title+'</div><br>');
               $(".res_btn").css({"background-color":"#e2ebf0"});
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