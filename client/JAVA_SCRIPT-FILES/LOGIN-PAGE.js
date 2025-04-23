$(document).ready(function () {
    // When clicking the Register button
    $("#RightToLeft").on("click", function () {
        slideTransition("register");
    });
  
    // When clicking the Login button
    $("#LeftToRight").on("click", function () {
        slideTransition("login");
    });
  });
  
  function slideTransition(target) {
    // Simultaneously trigger the form slide transition
    if (target === "register") {
        $("#slide").animate({ marginLeft: "0" }, 500);
        $(".top").animate({ marginLeft: "100%" }, 500);
    } else {
        $("#slide").animate({ marginLeft: "50%" }, 500);
        $(".top").animate({ marginLeft: "0" }, 500);
    }
  }

