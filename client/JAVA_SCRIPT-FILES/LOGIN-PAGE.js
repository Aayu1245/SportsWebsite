$(document).ready(function () {
    $("#RightToLeft").on("click", function () {
        slideTransition("register");
    });
  
    $("#LeftToRight").on("click", function () {
        slideTransition("login");
    });
  });
  
  function slideTransition(target) {
    if (target === "register") {
        $("#slide").animate({ marginLeft: "0" }, 500);
        $(".top").animate({ marginLeft: "100%" }, 500);
    } else {
        $("#slide").animate({ marginLeft: "50%" }, 500);
        $(".top").animate({ marginLeft: "0" }, 500);
    }
  }

