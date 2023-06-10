let a = document.getElementById('signup-container');
  let b = document.getElementById('container');
  function show_signup() {
    a.style.display = "block";
    b.style.display = "none";
  }
  function show_login() {
    a.style.display = "none";
    b.style.display = "block";
  }

  $("#login").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "/login",
      type: "POST",
      data: new FormData(this),
      beforeSend: function () {
        $("#loader").show();
        $("#login :input").prop("disabled", true);
      },
      contentType: false,
      cache: false,
      processData: false,
      success: function (data) {
        var p = data;
        console.log(data)
        if (data[0].msg == "found") {
          document.location = "/";
          // document.location = "{{url_for('home')}}";
        }

        let msg = document.getElementById('msg');
        document.getElementById('msg-div').style.display = "block";
        msg.innerHTML = data[0].msg;
      },
      complete: function (data) {
        $("#loader").hide();
        $("#login :input").prop("disabled", false);
      },
      error: function (e) {
        alert("fail");
      },
    });
  });





  $("#signup").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "/signup",
      type: "POST",
      data: new FormData(this),
      beforeSend: function () {
        $("#loader").show();
        $("#signup :input").prop("disabled", true);
      },
      contentType: false,
      cache: false,
      processData: false,
      success: function (data) {
        var p = data;
        console.log(data)

        let msg = document.getElementById('msg2');
        document.getElementById('msg-div2').style.display = "block";
        msg.innerHTML = data[0].msg;
        show_login();
      },
      complete: function (data) {
        $("#loader").hide();
        $("#signup :input").prop("disabled", false);
      },
      error: function (e) {
        alert("fail");
      },
    });
  });
