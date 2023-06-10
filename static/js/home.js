function toaddf() { //function to open the pop form when click to add a todo.
  let form_add = document.getElementById("toadd");
  form_add.style.display = "block";
}
function hide() { //function to hide the pop add todo form.
  let form_add = document.getElementById("toadd");
  form_add.style.display = "none";
}
function toupdatef() { //function to open the pop form when click to update a todo.
  let form_add = document.getElementById("toupdate");
  form_add.style.display = "block";
}
function hide_update() { //function to hide the pop update todo form.
  let form_add = document.getElementById("toupdate");
  form_add.style.display = "none";
}


let p;
//this function fetch all the todo's added till now and add them in html to show the todo list.
function fetch_all() {
  $.ajax({
    url: "/api/todos",
    type: "POST",
    beforeSend: function () {
      $("#list-loader").show();
    },
    success: function (data) {
      let t = document.getElementById("list");
      let c = document.getElementById("content");
      t.innerHTML = "";
      p = data;
      var k = 1;
      for (let i = data[0].length - 1; i >= 0; i--) {
        for (var key in data[0][i]) {
          // console.log(key,data[i][key]);  //important
          t.innerHTML +=
            '<div class="single-todo" onclick="get_desc(' +
            i +
            ');"><p>' +
            Number(i + 1) +
            ") " +
            key +
            '</p><div><img style="background-color:white;padding:4px" class="delete" id="delete" onclick="delete_todo(' +
            i +
            ');" src="../static/img/delete.png"/><img style="background-color:white;padding:4px" class="update" id="update" onclick="update_todo(' +
            i +
            ');" src="../static/img/update.png"/></div></div>';

          if (k == 1) {
            k = key;
          }
          // break;
          // console.log(data[i]['practical']);
        }
      }

      get_desc(data[0].length - 1, k);
    },
    complete: function (data) {
      $("#list-loader").hide();
    },
    error: function (e) {
      alert("fail");
    },
  });
}

fetch_all();

// this form will submit the form to add new todo.
$("#add").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
    url: "/api/todos/add",
    type: "POST",
    data: new FormData(this),
    beforeSend: function () {
      $("#add-loader").show();
      $("#add :input").prop("disabled", true);
    },
    success: function (data) {
      hide();
      fetch_all();
    },
    complete: function (data) {
      $("#add-loader").hide();
      $("#add :input").prop("disabled", false);
    },
    error: function (e) {
      alert("fail");
    },
  });
});

// this particular function get the description or details of specific todo on which we click to Selection and add the description
// to the html to show.
function get_desc(i, key) {
  for (var key in p[0][i]) {
    // console.log(key,data[i][key]); 
    document.getElementById("content").innerHTML =
      '<div class="heading" id="heading"><h1>' +
      key +
      "</h1><p>" +
      p[1][i] +
      '</p></div><div class="description"><p class"p_desc">' +
      p[0][i][key] +
      "</p></div>";
  }
}

// this function will delete a particular todo on a particular index i.
function delete_todo(i) {
  let brand = document.getElementById("brands");
  let load = document.getElementById("ud-loader");
  for (var key in p[0][i]) {
    $.ajax({
      url: "/api/todos/delete",
      type: "POST",
      data: JSON.stringify({ title: key, desc: p[0][i][key], "d/t": p[1][i] }),
      beforeSend: function () {
        brand.style.display = "none";
        load.style.display = "block";
      },
      contentType: "application/json",
      dataType: "json",
      success: function (data) {
        brand.style.display = "block";
        load.style.display = "none";
        fetch_all();
      },
      error: function (e) {
        alert("failed deleting");
      },
    });
  }
}

// this function will show form and set the values in input tag values of the form for a particular todo on the index i.
function update_todo(i) {
  toupdatef();
  for (var key in p[0][i]) {
    document.getElementById("utitle").value = key; //index number is set to the value which is to be update.
    document.getElementById("udescription").value = p[0][i][key]; //old title is set to the title input value.
    document.getElementById("who").value = i; //old description is set to the description input value.
  }
}

// this function will submit the new title and its description to update the values.
$("#update").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
    url: "/api/todos/update",
    type: "POST",
    data: new FormData(this),
    beforeSend: function () {
      $("#update-loader").show();
      $("#update :input").prop("disabled", true);
    },
    success: function (data) {
      hide_update();
      fetch_all();
    },
    complete: function (data) {
      $("#update-loader").hide();
      $("#update :input").prop("disabled", false);
    },
    error: function (e) {
      alert("fail");
    },
  });
});