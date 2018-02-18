
$(document).ready(function() {
$("#reset").text("Reset Board");

  $("input").keyup(function() {
    var value=$(this).val().toUpperCase();

    var message=" Wins! Congratulations!";
    var newGame="New game";
    if ($(this).val().toLowerCase()== "x" || $(this).val().toLowerCase()== "o") {
      $(this).css({ color: "#a31e1b" });
      $(this).attr("readonly", "readonly");
      $("#message").html("");
    } else if ($(this).val().toLowerCase() != "x" || $(this).val().toLowerCase() != "o") {
      $("#message").html("Please enter only a x or o");
      $(this).attr("value", "");
    }

    if (
      $(".boxOne").val().toLowerCase() == "x" &&
      $(".boxTwo").val().toLowerCase() == "x" &&
      $(".boxThree").val().toLowerCase() == "x"
      ||
      $(".boxOne").val().toLowerCase() == "o" &&
      $(".boxTwo").val().toLowerCase() == "o" &&
      $(".boxThree").val().toLowerCase() == "o"
    ) {
      $("#message").text( value + message);
      $("#reset").text(newGame);
      $(".boxOne, .boxTwo, .boxThree").css({ background: "#F0F0F0" });
      $("input").attr("readonly", "readonly");

    }

    if (
      $(".boxFour").val().toLowerCase()  == "x" &&
      $(".boxFive").val().toLowerCase()  == "x" &&
      $(".boxSix").val().toLowerCase()  == "x"
      ||
      $(".boxFour").val().toLowerCase()  == "o" &&
      $(".boxFive").val().toLowerCase()  == "o" &&
      $(".boxSix").val().toLowerCase()  == "o"
    ) {
      $("#message").text( value + message);
      $("#reset").text(newGame);
      $(".boxFour, .boxFive, .boxSix ").css({ background: "#F0F0F0" });
      $("input").attr("readonly", "readonly");
    }

    if (
      $(".boxSeven").val().toLowerCase()  == "x" &&
      $(".boxEight").val().toLowerCase()  == "x" &&
      $(".boxNine").val().toLowerCase()  == "x"
      ||
      $(".boxSeven").val().toLowerCase()  == "o" &&
      $(".boxEight").val().toLowerCase()  == "o" &&
      $(".boxNine").val().toLowerCase()  == "o"
    ) {
      $("#message").text( value + message);
      $("#reset").text(newGame);
      $(".boxSeven, .boxEight, .boxNine").css({ background: "#F0F0F0" });
      $("input").attr("readonly", "readonly");
    }

    if (
      $(".boxOne").val().toLowerCase()  == "x" &&
      $(".boxFour").val().toLowerCase()  == "x" &&
      $(".boxSeven").val().toLowerCase()  == "x"
      ||
      $(".boxOne").val().toLowerCase()  == "o" &&
      $(".boxFour").val().toLowerCase()  == "o" &&
      $(".boxSeven").val().toLowerCase()  == "o"
    ) {
      $("#message").text( value + message);
      $("#reset").text(newGame);
      $(".boxOne, .boxFour, .boxSeven").css({ background: "#F0F0F0" });
      $("input").attr("readonly", "readonly");
    }

    if (
      $(".boxTwo").val().toLowerCase()  == "x" &&
      $(".boxFive").val().toLowerCase()  == "x" &&
      $(".boxEight").val().toLowerCase()  == "x"
      ||
      $(".boxTwo").val().toLowerCase()  == "o" &&
      $(".boxFive").val().toLowerCase()  == "o" &&
      $(".boxEight").val().toLowerCase()  == "o"
    ) {
      $("#message").text( value + message);
      $("#reset").text(newGame);
      $(".boxTwo, .boxFive, .boxEight").css({ background: "#F0F0F0" });
      $("input").attr("readonly", "readonly");
    }

    if (
      $(".boxTwo").val().toLowerCase() == "x" &&
      $(".boxFive").val().toLowerCase()  == "x" &&
      $(".boxEight").val().toLowerCase()  == "x"
      ||
      $(".boxTwo").val().toLowerCase() == "o" &&
      $(".boxFive").val().toLowerCase()  == "o" &&
      $(".boxEight").val().toLowerCase()  == "o"
    ) {
      $("#message").text( value + message);
      $("#reset").text(newGame);
      $(".boxTwo, .boxFive, .boxEight").css({ background: "#F0F0F0" });
      $("input").attr("readonly", "readonly");
    }

    // third column, X
    if (
      $(".boxThree").val().toLowerCase()  == "x" &&
      $(".boxSix").val().toLowerCase()  == "x" &&
      $(".boxNine").val().toLowerCase()  == "x"
      ||
      $(".boxThree").val().toLowerCase()  == "o" &&
      $(".boxSix").val().toLowerCase()  == "o" &&
      $(".boxNine").val().toLowerCase()  == "o"
    ) {
      $("#message").text( value + message);
      $("#reset").text(newGame);
      $(".boxThree, .boxSix, .boxNine").css({ background: "#F0F0F0" });
      $("input").attr("readonly", "readonly");
    }
    // top to bottom diagonal, X
    if (
      $(".boxOne").val().toLowerCase()  == "x" &&
      $(".boxFive").val().toLowerCase()  == "x" &&
      $(".boxNine").val().toLowerCase() == "x"
      ||
      $(".boxOne").val().toLowerCase()  == "o" &&
      $(".boxFive").val().toLowerCase()  == "o" &&
      $(".boxNine").val().toLowerCase() == "o"
    ) {
      $("#message").text( value + message);
      $("#reset").text(newGame);
      $(".boxOne, .boxFive, .boxNine").css({ background: "#F0F0F0" });
      $("input").attr("readonly", "readonly");
    }
    // bottom to top diagonal, X
    if (
      $(".boxThree").val().toLowerCase()  == "x" &&
      $(".boxFive").val().toLowerCase()  == "x" &&
      $(".boxSeven").val().toLowerCase()  == "x"
      ||
      $(".boxThree").val().toLowerCase()  == "o" &&
      $(".boxFive").val().toLowerCase()  == "o" &&
      $(".boxSeven").val().toLowerCase()  == "o"
    ) {
      $("#message").text( value + message);
      $("#reset").text(newGame);
      $(".boxThree, .boxFive, .boxSeven").css({ background: "#F0F0F0" });
      $("input").attr("readonly", "readonly");
    }


    $("#reset").click(function() {
      window.location.assign("TicTacToeGame.html");
    });

  });

});
