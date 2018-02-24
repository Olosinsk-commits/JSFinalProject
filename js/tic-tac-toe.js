/**
 * @author Olga Osinskaya <ssinsk@yandex.ru>
 * 02/19/2018
 * Winter 2018
 * CSD 122 - JavaScript & jQuery
 * Group Project - Group 3 (Olga Osinskaya, Noah Greer, and Topher Gidos)
 *
 * Code to play a game of Tic Tac Toe.
 */
$(document).ready(function() {

//whoTurn helps to keep track of users turns and changes from true to false with every turn
var whoTurn = false;
//var whoTurn;
//Setting text content "Reset Board" for button <reset>
$("#reset").text("Reset Board");

//count helps designate correct error message when user does first turn
var count=0;

  $("input").keyup(function() {
    var value = $(this)
      .val()
      .toUpperCase();

//start counting when player does turns
  if ($(this).val().toLowerCase() != "")
  {
    count+=1;
  }

//var message keeps Congratulations message
    var message = " Wins! Congratulations!";

//var newGame keeps <New game> value for <reset> button
    var newGame = "New game";

//check if user entered correct value o or x and x turns first
    if (
      ($(this)
        .val()
        .toLowerCase() == "x" &&
        whoTurn == false) ||
      ($(this)
        .val()
        .toLowerCase() == "o" &&
        whoTurn == true)
    ) {
      if (
        $(this)
          .val()
          .toLowerCase() == "x"
      )
      //change value whoTurn
        whoTurn = true;
      else {
        whoTurn = false;
      }
//setting new text color for current element
      $(this).css({ color: "#a31e1b" });
//making box read only
      $(this).attr("readonly", true);
//message box doexn't display text
      $("#message").html("");
    }

    else if (
      ($(this)
        .val()
        .toLowerCase() == "x" &&
        whoTurn == true) ||
      ($(this)
        .val()
        .toLowerCase() == "o" &&
        whoTurn == false)
    ) {
      $("#message").html("It's not your turn!");
      $(this).attr("value", "");
    }


    else if (
      ($(this)
        .val()
        .toLowerCase() != "x" ||
      $(this)
        .val()
        .toLowerCase() != "o"
    )) {
      if(count==1)
      {
      $("#message").html("Please enter X");
      $(this).attr("value", "");
      }
      else {
        $("#message").html("Please enter only X or O");
        $(this).attr("value", "");
      }
    }


    //check if all fields filled in and where is no winner combination
    if (
      $(".boxOne")
        .val()
        .toLowerCase() != "" &&
      $(".boxTwo")
        .val()
        .toLowerCase() != "" &&
      $(".boxThree")
        .val()
        .toLowerCase() != "" &&
      $(".boxFour")
        .val()
        .toLowerCase() != "" &&
      $(".boxFive")
        .val()
        .toLowerCase() != "" &&
      $(".boxSix")
        .val()
        .toLowerCase() != "" &&
      $(".boxSeven")
        .val()
        .toLowerCase() != "" &&
      $(".boxEight")
        .val()
        .toLowerCase() != "" &&
      $(".boxNine")
        .val()
        .toLowerCase() != ""
    ) {
      //print correct message for draw and change <reset> button to <new game>
      $("#message").text("Result is Tie!");
      $("#reset").text(newGame);
    }

    if (
      ($(".boxOne")
        .val()
        .toLowerCase() == "x" &&
        $(".boxTwo")
          .val()
          .toLowerCase() == "x" &&
        $(".boxThree")
          .val()
          .toLowerCase() == "x") ||
      ($(".boxOne")
        .val()
        .toLowerCase() == "o" &&
        $(".boxTwo")
          .val()
          .toLowerCase() == "o" &&
        $(".boxThree")
          .val()
          .toLowerCase() == "o")
    ) {
      $("#message").text(value + message);
      $("#reset").text(newGame);
      $(".boxOne, .boxTwo, .boxThree").css({ background: "#F0F0F0" });
      $("input").attr("readonly", true);
    }

    if (
      ($(".boxFour")
        .val()
        .toLowerCase() == "x" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "x" &&
        $(".boxSix")
          .val()
          .toLowerCase() == "x") ||
      ($(".boxFour")
        .val()
        .toLowerCase() == "o" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "o" &&
        $(".boxSix")
          .val()
          .toLowerCase() == "o")
    ) {
      $("#message").text(value + message);
      $("#reset").text(newGame);
      $(".boxFour, .boxFive, .boxSix ").css({ background: "#F0F0F0" });
      $("input").attr("readonly", true);
    }

    if (
      ($(".boxSeven")
        .val()
        .toLowerCase() == "x" &&
        $(".boxEight")
          .val()
          .toLowerCase() == "x" &&
        $(".boxNine")
          .val()
          .toLowerCase() == "x") ||
      ($(".boxSeven")
        .val()
        .toLowerCase() == "o" &&
        $(".boxEight")
          .val()
          .toLowerCase() == "o" &&
        $(".boxNine")
          .val()
          .toLowerCase() == "o")
    ) {
      $("#message").text(value + message);
      $("#reset").text(newGame);
      $(".boxSeven, .boxEight, .boxNine").css({ background: "#F0F0F0" });
      $("input").attr("readonly", true);
    }

    if (
      ($(".boxOne")
        .val()
        .toLowerCase() == "x" &&
        $(".boxFour")
          .val()
          .toLowerCase() == "x" &&
        $(".boxSeven")
          .val()
          .toLowerCase() == "x") ||
      ($(".boxOne")
        .val()
        .toLowerCase() == "o" &&
        $(".boxFour")
          .val()
          .toLowerCase() == "o" &&
        $(".boxSeven")
          .val()
          .toLowerCase() == "o")
    ) {
      $("#message").text(value + message);
      $("#reset").text(newGame);
      $(".boxOne, .boxFour, .boxSeven").css({ background: "#F0F0F0" });
      $("input").attr("readonly", true);
    }

    if (
      ($(".boxTwo")
        .val()
        .toLowerCase() == "x" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "x" &&
        $(".boxEight")
          .val()
          .toLowerCase() == "x") ||
      ($(".boxTwo")
        .val()
        .toLowerCase() == "o" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "o" &&
        $(".boxEight")
          .val()
          .toLowerCase() == "o")
    ) {
      $("#message").text(value + message);
      $("#reset").text(newGame);
      $(".boxTwo, .boxFive, .boxEight").css({ background: "#F0F0F0" });
      $("input").attr("readonly", true);
    }

    if (
      ($(".boxTwo")
        .val()
        .toLowerCase() == "x" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "x" &&
        $(".boxEight")
          .val()
          .toLowerCase() == "x") ||
      ($(".boxTwo")
        .val()
        .toLowerCase() == "o" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "o" &&
        $(".boxEight")
          .val()
          .toLowerCase() == "o")
    ) {
      $("#message").text(value + message);
      $("#reset").text(newGame);
      $(".boxTwo, .boxFive, .boxEight").css({ background: "#F0F0F0" });
      $("input").attr("readonly", true);
    }

    // third column, X
    if (
      ($(".boxThree")
        .val()
        .toLowerCase() == "x" &&
        $(".boxSix")
          .val()
          .toLowerCase() == "x" &&
        $(".boxNine")
          .val()
          .toLowerCase() == "x") ||
      ($(".boxThree")
        .val()
        .toLowerCase() == "o" &&
        $(".boxSix")
          .val()
          .toLowerCase() == "o" &&
        $(".boxNine")
          .val()
          .toLowerCase() == "o")
    ) {
      $("#message").text(value + message);
      $("#reset").text(newGame);
      $(".boxThree, .boxSix, .boxNine").css({ background: "#F0F0F0" });
      $("input").attr("readonly", true);
    }
    // top to bottom diagonal, X
    if (
      ($(".boxOne")
        .val()
        .toLowerCase() == "x" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "x" &&
        $(".boxNine")
          .val()
          .toLowerCase() == "x") ||
      ($(".boxOne")
        .val()
        .toLowerCase() == "o" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "o" &&
        $(".boxNine")
          .val()
          .toLowerCase() == "o")
    ) {
      $("#message").text(value + message);
      $("#reset").text(newGame);
      $(".boxOne, .boxFive, .boxNine").css({ background: "#F0F0F0" });
      $("input").attr("readonly", true);
    }
    // bottom to top diagonal, X
    if (
      ($(".boxThree")
        .val()
        .toLowerCase() == "x" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "x" &&
        $(".boxSeven")
          .val()
          .toLowerCase() == "x") ||
      ($(".boxThree")
        .val()
        .toLowerCase() == "o" &&
        $(".boxFive")
          .val()
          .toLowerCase() == "o" &&
        $(".boxSeven")
          .val()
          .toLowerCase() == "o")
    ) {
      $("#message").text(value + message);
      $("#reset").text(newGame);
      $(".boxThree, .boxFive, .boxSeven").css({ background: "#F0F0F0" });
      $("input").attr("readonly", true);
    }

    $("#reset").click(function() {
      window.location.assign("tic-tac-toe.html");
    });
  });
});
