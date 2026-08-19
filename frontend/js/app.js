$(function () {

     const API_BASE = "http://localhost:3000/api/v1/students"
     const $tbody=$("#studentTableBody");
     const $status=$("#statusMsg");
     const $rowTemplate=$("#rowTemplate");

     function showStatus(message, isError=false){
        $status.text(message).toggleClass("error-text" ,isError);
     }

      function extractErrorMessage(xhr){
        const body=xhr.responseJSON;
        if(body && Array.isArray(body.errors)) return body.errors.join(",");
        if( body && body.error)return body.error;
        return "Something went wrong.Please try again";
      }

      
    function renderStudentRow(student) {
    const $row = $("<tr>").attr("data-id", student.id);
 
    $row.append(
      $("<td>").text(student.name),
      $("<td>").text(student.email),
      $("<td>").text(student.roll_number),
      $("<td>").text(student.course || "—"),
      $("<td>").text(student.phone || "—"),
      $("<td>").text(student.birthdate || "—"),
      $("<td class='actions'>").append(
        $("<button class='btn btn-edit'>Edit</button>"),
        $("<button class='btn btn-delete'>Delete</button>")
      )
    );
 
    return $row;
  }

  function renderEditableRow(student=null){
    const $row=$($rowTemplate.prop("content")).find("tr").clone();
    $row.attr("data-mode", student? "edit":"create");
    if(student){
      $row.attr("data-id", student.id);
      $row.find(".input-name").val(student.name);
      $row.find(".input-email").val(student.email);
      $row.find(".input-roll").val(student.roll_number);
      $row.find(".input-course").val(student.course);
      $row.find(".input-phone").val(student.phone);
      $row.find(".input-birthdate").val(student.birthdate);
    
    }
    $row.find(".input-birthdate").attr("max", new Date().toISOString().split("T")[0]);
    return $row;
  }

  function fetchStudents(query=""){
    return $.ajax({
      url:API_BASE,
      method:"GET",
      data:query? {q:query}:{},
      dataType:"json"
    });
  }

  function updateStudent(id, payload){
    return $.ajax({
      url:`${API_BASE}/${id}`,
      method:"PATCH",
      contentType:"application/json",
      data:JSON.stringify({student:payload})
    });
  }

  function createStudent(payload){
    return $.ajax({
      url:API_BASE,
      method:"POST",
      contentType:"application/json",
      data:JSON.stringify({student:payload}),
      dataType:"json"
    });
  }

  function deleteStudent(id){
    return $.ajax({
      url:`${API_BASE}/${id}`,
      method:"DELETE"
    });
  }

   function loadTable(query = "") {
    showStatus("Loading...");
    fetchStudents(query)
      .done(function (students) {
        $tbody.empty();
        if (students.length === 0) {
          $tbody.append("<tr><td colspan='7' style='text-align:center;color:#9ca3af;'>No students yet</td></tr>");
        } else {
          students.forEach(s => $tbody.append(renderStudentRow(s)));
        }
        showStatus(`${students.length} student(s)`);
      })
      .fail(function (xhr) {
        showStatus("Failed to load students: " + extractErrorMessage(xhr), true);
      });
  }
function collectFormData($row) {
    return {
      name: $row.find(".input-name").val().trim(),
      email: $row.find(".input-email").val().trim(),
      roll_number: $row.find(".input-roll").val().trim(),
      course: $row.find(".input-course").val().trim(),
      phone: $row.find(".input-phone").val().trim(),
      birthdate: $row.find(".input-birthdate").val() || null
    };
  }
 
   $("#addRowBtn").on("click", function () {
    // Avoid stacking multiple unsaved "create" rows — keeps state simple.
    if ($tbody.find("tr[data-mode='create']").length > 0) {
      showStatus("Finish or cancel the row you're already adding.", true);
      return;
    }
    $tbody.prepend(renderEditableRow());
    $tbody.find("tr[data-mode='create'] .input-name").trigger("focus");
  });

  $tbody.on("click", ".btn-edit", function () {
    const $row = $(this).closest("tr");
    const id = $row.data("id");
    const cells = $row.find("td");
 
    const student = {
      id,
      name: cells.eq(0).text(),
      email: cells.eq(1).text(),
      roll_number: cells.eq(2).text(),
      course: cells.eq(3).text() === "—" ? "" : cells.eq(3).text(),
      phone: cells.eq(4).text() === "—" ? "" : cells.eq(4).text(),
      birthdate: cells.eq(5).text() === "—" ? "" : cells.eq(5).text()
    };
 
    $row.replaceWith(renderEditableRow(student));
  });

 $tbody.on("click", ".btn-delete", function () {
    const $row = $(this).closest("tr");
    const id = $row.data("id");
    const name = $row.find("td").eq(0).text();
 
    if (!confirm(`Delete ${name}?`)) return;
 
    deleteStudent(id)
      .done(function () {
        $row.fadeOut(150, () => $row.remove());
        showStatus(`Deleted ${name}`);
      })
      .fail(function (xhr) {
        showStatus("Delete failed: " + extractErrorMessage(xhr), true);
      });
  });

  $tbody.on("click", ".btn-cancel", function () {
    const $row = $(this).closest("tr");
    if ($row.data("mode") === "create") {
      $row.remove();
      if ($tbody.children().length === 0) loadTable(); // restore "no students" row if needed
    } else {
      loadTable(); // simplest correct way to restore the original view row
    }
  });

$tbody.on("click", ".btn-save", function(){
  const $row=$(this).closest("tr");
  const mode=$row.data("mode");
  const payload=collectFormData($row);

  if (!payload.name || !payload.email || !payload.roll_number || !payload.course) {
      showStatus("Name, email, roll number, and course are required.", true);
      return;
    }

  const request=mode==="edit"? updateStudent($row.data("id"), payload):
  createStudent(payload);

  request.done(function(student){
    $row.replaceWith(renderStudentRow(student));
    showStatus(mode=="edit"? "Student updated" : "Student added");
  })
  .fail(function(xhr){
    showStatus("Save failed:"+ extractErrorMessage(xhr), true);
  });
})

let searchTimer= null;
$("#searchInput").on("input", function(){
  clearTimeout(searchTimer);
  const query=$(this).val();
  searchTimer=setTimeout(()=>loadTable(query), 300);
});

loadTable();


});