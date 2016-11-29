/* jslint maxlen: 500 */

/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */
/*global console:true , io:true */
var main = function () {
    'use strict';
  
  
var socket= io.connect();  
var $userForm=$('#userForm');
var $username=$('#username');
var $mainArea=$('#mainArea');
var $userList=$('#userList');
var $pictureArea=$('#pictureArea') ;
var $indexbanner=$('#index-banner');

var ViewModel = {
  socket.on('get users', function(data){
    var html='';
    for (var i = 0; i < data.length; i++) {
   // html+='<li  class='bg-info' >'+ data[i] +'</li>';
   html+='<p class="btn-info btn-sm"> <span class="glyphicon glyphicon-user"></span>' + data[i]+ '</p>';
  }
  $userList.html(html);

   $userForm.submit(function(e){
      e.preventDefault();
      socket.emit('new user', $username.val(),function(data){
        if(data){
          $indexbanner.hide();
          $mainArea.show();

        }
      });
      $username.val('');
  });
};

   $("#addQueBtnId").click(function(){

        $("#addQueDivId").show();
        $("#displayQueId").hide();
        $("#addQueBtnId").hide();
        $("#playBtnId").hide();
    });

    $("#scoreBtnId").click(function(){

        $("#scoreDisplayId").show();
        var url = "score";

        $.ajax({
            method: "GET",
            url: "http://localhost:3000/"+url,
            crossDomain : true,
            dataType: "json"
            })
            .done(function(msg){
                if(msg.answer == false){
                    msg.answer = "false";
                    }
                console.log(msg);
                $("#rightId").val(msg.right);
                $("#wrongId").val(msg.wrong);
            });
    });


    $(".btn").click(function(){
        
    var url = "question";
    var question = $("#questionId").val();
   // console.log(question);
    var answer = $("#answerId").val();
    //console.log(answer);

    var data={
        "question":question,
        "answer":answer
    }    
    
    var dataJSON = JSON.stringify(data);
    console.log(dataJSON);
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/"+url,
        crossDomain : true,
        dataType: "json",
        data: data 
        })
        .done(function( msg ) {

        if(msg.answer==false){
            msg.answer="false";
        }
        $("#displayQueId").show();
        $("#addQueBtnId").show();
        $("#addQueDivId").hide();

        var displayQuestions = function(element, index, array){

            //console.log(array);
            var len = array.length;
            console.log(len);
            if(index == array.length - 1){

                var $item = $('<div id="allQueId" class="btn">' +
                            '<label >Question : </label><input type="text" name="que" id="queId'+ index +'"><br>' +
                            '<label>Answer : </label><input type="text" name="ans" id="ansId"><br></div>' +
                            '<input type="button"  data-bind="click:submitAnswer" value="Send"'+ index + '">');

                $("#displayQueId").append($item);
                $("#queId" + index).val(array[index].question);
            }

        }

        msg.forEach(displayQuestions);

        });    
    });

    $("#playBtnId").click(function(){

        var url = "question";

        $.ajax({
            method: "GET",
            url: "http://localhost:3000/"+url,
            crossDomain : true,
            dataType: "json",
            })
            
            .done(function( msg ) {

                //console.log(msg);
                if(msg.answer==false){
                    msg.answer="false";
                }
                $("#allQueId").show();
                $("#scoreBtnId").show();
                $("#addQueBtnId").show();
                $("#addQueDivId").hide();
                $("#playBtnId").hide();

            var displayQuestions = function(element, index, array){

                var $item = $('<div id="allQueId" class="btn">' +
                            '<br><label>Question : </label><input type="text" name="que" id="queId'+ index +'"><br>' +
                            '<label>Answer : </label><input type="text" name="ans" id="ansId'+ index +'"><br></div>' +
                            '<input type="button" data-bind="click:displayquestion" value="Send" id="sendBtnId'+ index + '"><br><br>');

                $("#displayQueId").append($item);
             $("#queId" + index).val(array[index].question);

            }

            msg.forEach(displayQuestions);
               

            var getAnswers = function(element, index, array){

                $("#sendBtnId" + index).click(function(){

                    var ans = $("#ansId" + index).val();
                    var ansId = array[index]._id;
                    var actualAns = array[index].answer;
                    var url = "answer";

                   // console.log(ans);
                    //console.log(ansId);

                    var data = {
                        "answerId" : ansId,
                        "possibleAns" : ans,
                        "answer" : actualAns
                    }
                    var dataJSON = JSON.stringify(data);
                   // console.log(JSON.stringify(data));
                    $.ajax({

                        method: "POST",
                        url: "http://localhost:3000/"+url,
                        crossDomain : true,
                        dataType: "json",
                        data : data
                        })

                        .done(function( msg ) {

                            //console.log(msg);
                            if(msg.answer==false){
                                msg.answer="false";
                            }


                        })

                });
            }
            msg.forEach(getAnswers);

        });    
    });
  };
    function ViewModel() {
    'use strict';
  
    this.getAnswers = ko.observable();
   
    this.username = ko.observable();
    this.displayQuestions = ko.observable();
   

    };

    

   



vm = new ViewModel();
ko.applyBindings(vm);



};
$(document).ready(main);
