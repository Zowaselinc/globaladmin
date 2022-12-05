// this holds the request headers and bodies
// allows u to make a request
const querySetting = (URL, METHOD, AUTHKEY, DATA = {}) => {
    const settings = {
        "url": `https://zowaseladmin.loclx.io/${URL}`,
        "method": METHOD,
        "timeout": 0,
        "headers": {
            "Authorization": AUTHKEY,
            "Content-Type": "application/json"
        },
        data: DATA
    }

    return settings;
}

// end //


/* -------------------------------------------------------------------------- */
/*                    FETCHING ADMINISTRATIVE ROLES BEGINS                    */
/* -------------------------------------------------------------------------- */

function fetchAllroles(){

    var settings = querySetting("api/role/fetchAllroles", "GET", localStorage.getItem('access'));

    $.ajax(settings).done(function (data) {
    //   console.log(data);
      //   let response = JSON.parse(data);
      let response = data;
      console.log(response);
      if(response.error==true){
        console.log(response.message);
        $('#tbdata').html("<tr>"+response.message+"</tr>");
      }else{
        var rowContent;
        let thedata = (response.data).reverse();
        $.each(thedata, (index, row) => {
            
            index= index+1;
            rowContent 
            += `<tr class="align-items-center">
                <td style="min-width: 20px;">${index}</td>
                <td style="min-width: 120px;">${row.roleName}</td>
                <td style="min-width: 120px;">${row.roleDescription}</td>
                <td style="min-width: 120px;">${row.dateCreated}</td>
                <td style="min-width: 50px;">
                    <button class="btn btn-sm btn-primary rounded-6 text-end" onclick="editRole('${row.id}', '${row.roleName}', '${row.roleDescription}')">Edit</button>
                </td>
                <td style="min-width: 50px;">
                    <button class="btn btn-sm btn-danger rounded-6" onclick="deleteadminRole('${row.id}')">Delete</button>
                </td>	
               </tr>`;
        });
       }
        $('#tbdata').html(rowContent);
    });
  }
  
//   ------------------- FILLING ADMINISTRATIVE ROLE TABLE ENDS---------------------------//



// --------------------------------------- ADDING NEW DATA TO ADMINISTRATIVE ROLE TABLE BEGINS ---------------------------//

const addRole =()=>{
    console.log(localStorage.getItem('access'));
    // selecting the input element and get its value
    let roleName = document.getElementById("role_name");
    let roleDescription = document.getElementById("role_description");

    // Displaying the value 
    // swal("", roleName), ""
    if(!roleName.value){
        swal("Enter role!");
        roleName.focus();
        return false;
    }else if(!roleDescription.value){
        swal("Enter description!");
        roleDescription.focus();
        return false;
    }else{

        const adminRole = JSON.stringify({
            "roleName": roleName.value,
            "roleDescription": roleDescription.value
        });

        var settings = querySetting("api/role/createRoles", "POST", localStorage.getItem('access'), adminRole);
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            if(response.error==true){
                console.log(response.message);
                swal("FAILED", response.message, "error");
              }else{
                console.log(response.message);
                swal("SUCCESS", response.message, "success");
                roleName.value="";
                roleDescription.value="";
                fetchAllroles();
              }
          });
    }
};

// ------------------------- ADDING ADMISTRATIVE ROLE ENDS------------------------------//



// -----------------------DELETING ADMINISTRATIVE ROLE BEGINS----------------------------// 


const deleteadminRole =(n)=>{
    // swal("", n), ""

    var settings = {
        "url": "https://zowaseladmin.loclx.io/api/role/deleteRolebyid/"+n,
        "method": "DELETE",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem('access')
        }
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        if(response.error==true){
            console.log(response.message);
            swal("FAILED", response.message, "error");
          }else{
            console.log(response.message);
            swal("SUCCESS", response.message, "success");
            fetchAllroles();
          }
        
      });
      
}

/* -------------------- DELETING ADMINISTRATIVE ROLE ENDS ------------------- */

/* ------------------------------- EDITING ADMINISTRATIVE ROLE BEGINS ------------------------------- */

const editRole = (id, name, description) => {
  sessionStorage.setItem('roleID', id);
  window.location.href = "#?roleID="+id;
  const URL = window.location.href;
  const confirmEdit = URL.split("?");
  
  if(confirmEdit[1] !== undefined){
    $('#role_name').val(name);
    $('#role_description').val(description);

    window.location.href = "#role-section";

    if((window.location.href).split('#')[1] == 'role-section'){
      document.querySelector('#editBtn').classList.remove('d-none');
      document.querySelector('#addBtn').classList.add('d-none');
      document.querySelector('#cancelBtn').classList.remove('d-none');

    }
  }
}


/* --------------------------- cancel edit request -------------------------- */
const cancelRequest = () => {
  sessionStorage.removeItem('roleID');
  window.location.href = "#";

  // clears the inputs
  $('#role_name').val("");
  $('#role_description').val("");

  // hides the update and cancel btn while displaying the add role btn
  if((window.location.href).split('#')[1] !== 'role-section'){
    document.querySelector('#editBtn').classList.toggle('d-none');
      document.querySelector('#addBtn').classList.toggle('d-none');
      document.querySelector('#cancelBtn').classList.toggle('d-none');
  }
}



const updateAdminRole =()=>{
  let adminRoleid = sessionStorage.getItem('roleID');
  // console.log(localStorage.getItem('access'));
  // selecting the input element and get its value
  let roleName = document.getElementById("role_name");
  let roleDescription = document.getElementById("role_description");

  // Displaying the value 
  // swal("", roleName), ""
  if(!roleName.value){
      swal("Enter role!");
      roleName.focus();
      return false;
  }else if(!roleDescription.value){
      swal("Enter description!");
      roleDescription.focus();
      return false;
  }else{

      const adminRole = JSON.stringify({
          "id": adminRoleid,
          "roleName": roleName.value,
          "roleDescription": roleDescription.value
      });

      var settings = querySetting("api/role/updateRolebyid", "POST", localStorage.getItem('access'), adminRole);
        
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED", response.message, "error");
            }else{
              console.log(response.message);
              swal("SUCCESS", response.message, "success");
              cancelRequest();
              fetchAllroles();
            }
        });
  }
};

/* ------------------- END OF EDITING ADMINISTRATIVE ROLE ------------------- */

/* -------------------------------------------------------------------------- */
/*                END OF ADMINISTRATIVE ROLE TABLE ADD AND EDIT               */
/* -------------------------------------------------------------------------- */









/* -------------------------------------------------------------------------- */
/*                         ADMINISTRATORS BEGINS HERE                         */
/* -------------------------------------------------------------------------- */

/* ----------------------- FETCHING ALL ADMINISTRATORS BEGINS HERE ---------------------- */

function fetchAlladmin(){
  var settings = {
    "url": "https://zowaseladmin.loclx.io/api/admin/fetchallAdmin",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };

      $.ajax(settings).done(function (data) {
        //   console.log(data);
          //   let response = JSON.parse(data);
          let response = data;
          // console.log(response);
          if(response.error==true){
            // console.log(response.message);
            $('#admindata').html("<tr>"+response.message+"</tr>");
          }else{
            let thedata = (response.data).reverse();
            let rowContent;
            $.each(thedata, (index, row) => {  

              let status;
               if(row.status==0){
                status = `
                <span class="badge badge-dot mr-4">
                  <i class="bg-warning"></i> Inactive
                </span>
                `;
               }else{
                status = `
                <span class="badge badge-dot mr-4">
                  <i class="bg-success"></i> Active
                </span>
                `;
               }
                
                
                index= index+1;
                rowContent 
                += `<tr class="align-items-center text-center">
                    <td style="min-width: 50px;">${index}</td>
                    <td style="min-width: 120px;">${row.firstName}</td>
                    <td style="min-width: 120px;">${row.lastName}</td>
                    <td style="min-width: 130px;">${row.email}</td>
                    <td style="min-width: 130px;">${row.mobile}</td>
                    <td style="min-width: 130px;">${row.role}</td> 
                    <td style="min-width: 150px; ">
                    <button type="button" class="btn btn-sm btn-primary rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                        VIEW
                    </button>
                    
                    <!-- Modal -->
                    <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Error Description</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            ${row.recoveryPhrase}
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </td>
                    <td style="min-width: 150px;">${row.dateCreated}</td>
                    <td style="min-width: 120px;">${status}</td>
                    <td class="text-end" style="min-width: 50px;">
                        <div class="dropdown shadow-dot text-center">
                            <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                                <a class="dropdown-item" href="javascript:void(0)" onclick="executeUpdate('${row.id}', '${row.firstName}', '${row.lastName}', '${row.mobile}', '${row.role}')">Edit</a>
                                <a class="dropdown-item" onclick="deleteAdministrator('${row.id}')" href="javascript:void(0)">Delete</a>
                            </div>
                        </div>
                    </td>		
                   </tr>`;
                $('#admindata').html(rowContent);
              });
          }
        });
}


/* ----------------------- FETCHING ALL ADMINISTRATORS ENDS HERE ---------------------- */


/* ----------------- DELETING AN ADMINISTRATOR STARTS HERE ----------------- */

const deleteAdministrator = (id) => {
  var settings = {
    "url": `https://zowaseladmin.loclx.io/api/admin/deleteAdminbyid/${id}`,
    "method": "DELETE",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    }
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    if(response.error==true){
        swal("FAILED", response.message, "error");
      }else{
        swal("SUCCESS", response.message, "success");
        fetchAlladmin();
      }
    
  });
}

/* ------------------- DELETING AN ADMINISTRATOR ENDS HERE  ------------------ */


/* --------------------------- MAKING UPDATE TO AN ADMINISTRATOR STARTS HERE-------------------------- */
const executeUpdate = (id, fn, ln, mb, role) => {
  let updateData = JSON.stringify({"id": id, "firstname": fn, "lastname": ln, "mobile": mb, "role": role});
  localStorage.setItem('singleadmindata', updateData);
  window.location.href = "update-administrator.html";
}


/* --------------------------- MAKING THE UPDATES --------------------------- */
const makeUpdate = () => {
  // selecting the input element and get its value
  let adminID = JSON.parse(localStorage.getItem('singleadmindata')).id;
  let firstName = document.getElementById("first_name");
  let lastName = document.getElementById("last_name");
  let adminMobile = document.getElementById("mobile_no");
  let adminRole = document.getElementById("role");


  // Displaying the value 
  if(!firstName.value){
      swal("Enter first name!");
      firstName.focus();
      return false;
  }else if(!lastName.value){
      swal("Enter last name!");
      lastName.focus();
      return false;
  }else if(!adminMobile.value){
      swal("Enter mobile number!");
      adminMobile.focus();
      return false;
  }else if(!adminRole.value){
      swal("Enter admin role!");
      adminRole.focus();
      return false;
  }else{

      var settings = {
          "url": "https://zowaseladmin.loclx.io/api/admin/updateAdminbyid",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Authorization": localStorage.getItem('access'),
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "id": adminID,
            "firstName": firstName.value,
            "lastName": lastName.value,
            "mobile": adminMobile.value,
            "role": adminRole.value,
          }),
        };
        
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED", response.message, "error");
          }else{
              console.log(response.message);
              swal("SUCCESS",response.message,"success");
              sessionStorage.removeItem('singleadminid')
              firstName.value="";
              lastName.value="";
              adminMobile.value="";
              adminRole.value="";

              setTimeout(() => {
                window.location.href = 'alladministrators.html';
              }, 1300)
          }
        });
  }
};


/* -------------- put in the previous data into the form inputs ------------- */
const adminInformation = () => {
let adminData = JSON.parse(localStorage.getItem('singleadmindata'));

$('#first_name').val(adminData.firstname);
$('#last_name').val(adminData.lastname);
$('#mobile_no').val(adminData.mobile);
setTimeout(() => {
  $('#role option[value="'+adminData.role+'"]').attr("selected", "selected");
}, 2000);
}


const removeSession = () => {
localStorage.removeItem('singleadmindata');
window.location.href = "alladministrators.html";
}

/* ------------------- UPDATING AN ADMINISTRATOR ENDS HERE ------------------ */


/* ------------------- ADDING AN ADMINISTRATOR STARTS HERE ------------------ */

const addAdmin =()=>{
  // console.log(localStorage.getItem('access'));
  // selecting the input element and get its value
  let firstName = document.getElementById("first_name");
  let lastName = document.getElementById("last_name");
  let adminMail = document.getElementById("email");
  let adminPassword = document.getElementById("password");
  let adminMobile = document.getElementById("mobile_no");
  let adminRole = document.getElementById("role");
  let adminRecovery = document.getElementById("recovery_phase");



  // Displaying the value 
  if(!firstName.value){
      swal("Enter first name!");
      firstName.focus();
      return false;
  }else if(!lastName.value){
      swal("Enter last name!");
      lastName.focus();
      return false;
  }else if(!adminMail.value){
      swal("Enter mail!");
      adminMail.focus();
      return false;
  }else if(!adminPassword.value){
      swal("Enter password!");
      adminPassword.focus();
      return false;
  }else if(!adminMobile.value){
      swal("Enter mobile number!");
      adminMobile.focus();
      return false;
  }else if(!adminRole.value){
      swal("Enter admin role!");
      adminRole.focus();
      return false;
  }else if(!adminRecovery.value){
      swal("Enter recovery phase!");
      adminRecovery.focus();
      return false;
  }else{

      var settings = {
          "url": "https://zowaseladmin.loclx.io/api/admin/createAdmin",
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Authorization": localStorage.getItem('access'),
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "firstName": firstName.value,
            "lastName": lastName.value,
            "email": adminMail.value,
            "password": adminPassword.value,
            "mobile": adminMobile.value,
            "role": adminRole.value,
            "recoveryPhrase": adminRecovery.value,
            "status": "1"
          }),
        };
        
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED",response.message,"error");
            }else{
              // console.log(response.message);
              swal("SUCCESS",response.message,"success");
              firstName.value="";
              lastName.value="";
              adminMail.value="";
              adminPassword.value="";
              adminMobile.value="";
              adminRole.value="";
              adminRecovery.value="";
              // fetchAllroles();
          }
        });
  }
};


// get all admin roles
const allRoles = () => {
  var settings = {
    "url": "https://zowaseladmin.loclx.io/api/role/fetchAllroles",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };
  
  $.ajax(settings).done(function (data) {
    let response = data.data;
      for(let i = 0; i < response.length; i++){
        $('#role').append(`<option value='${response[i].roleName}'>${response[i].roleName}</option>`);
      }
  });
}

allRoles();

/* --------------------- ADDING ADMINISTRATOR ENDS HERE --------------------- */


/* -------------------------------------------------------------------------- */
/*                          ADMINISTRATORS ENDS HERE                          */
/* -------------------------------------------------------------------------- */








/* -------------------------------------------------------------------------- */
/*                           ACCESS LOG STARTS HERE                           */
/* -------------------------------------------------------------------------- */

function fetcthAllaccess(){
  var settings = {
      "url": "https://zowaseladmin.loclx.io/api/access/fetchallAccess",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": localStorage.getItem('access')
      },
    };
    
    $.ajax(settings).done(function (response) {
      console.log(response);
    });

    $.ajax(settings).done(function (data) {
      //   console.log(data);
        //   let response = JSON.parse(data);
        let response = data;
        console.log(response);
        if(response.error==true){
          console.log(response.message);
          $('#accessdata').html("<tr>"+response.message+"</tr>");
        }else{
          let thedata = (response.data).reverse;
          let rowContent;
          $.each(thedata, (index, row) => {
              
              index= index+1;
              rowContent 
              += `<tr class="align-items-center">
                  <td style="min-width: 20px;">${index}</td>
                  <td style="min-width: 120px;">${row.sections}</td>
                  <td style="min-width: 120px;">${row.role}</td>
                  <td style="min-width: 120px;">${row.dateCreated}</td>
                 
                 </tr>`;
              });
                $('#accessdata').html(rowContent);
        }
      });

}

{/* <td style="min-width: 50px;">
<button class="btn btn-sm btn-primary rounded-6 text-end">Edit</button>
</td>
<td style="min-width: 50px;">
<button class="btn btn-sm btn-danger rounded-6">Delete</button>
</td>	 */}

/* -------------------------------------------------------------------------- */
/*                            ACCESS LOG ENDS HERE                            */
/* -------------------------------------------------------------------------- */






/* -------------------------------------------------------------------------- */
/*                            ERROR LOG STARTS HERE                           */
/* -------------------------------------------------------------------------- */

function fetchAllErrorlog (){
  var settings = {
      "url": "https://zowaseladmin.loclx.io/api/errorlog/fetchallErrorlog",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjpbeyJpZCI6MjEsImFkbWluSWQiOiJaV1NMQURNMzQzLXlGWm9YLWhocE9MIiwiZmlyc3ROYW1lIjoiSXJvYWJ1Y2hpIiwibGFzdE5hbWUiOiJSdXRoIiwiZW1haWwiOiJkZXZydXRoYW5pQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiRUF4UGhSclYxbzhSSjdKSW9jbFFqUT09IiwibW9iaWxlIjoiMDcwMzAyNjIxNTciLCJyb2xlIjoiQWRtaW4iLCJyZWNvdmVyeVBocmFzZSI6IkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEiLCJkYXRlQ3JlYXRlZCI6IjIwMjItMTEtMDQiLCJzdGF0dXMiOjF9XSwiaWF0IjoxNjY4MDA1NTU4fQ._bmDYoaxUgEXlI73E1xIYPcJvgVjEYmKanc7BBpDCfk"
      },
    };

    $.ajax(settings).done(function (data) {
      //   console.log(data);
        //   let response = JSON.parse(data);
        let response = data;
        if(response.error==true){
          $('#errordata').html("<tr>"+response.message+"</tr>");
        }else{
          let thedata = (response.data).reverse();
          let rowContent;
          $.each(thedata, (index, row) => {
              
              index= index+1;
              rowContent 
              += `<tr class="align-items-center">
                  <td style="min-width: 50px;">${index}</td>
                  <td style="min-width: 170px;">${row.errorName}</td>
                  <td style="min-width: 150px;">
                  <button type="button" class="btn btn-sm btn-primary rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                      VIEW
                  </button>
                  
                  <!-- Modal -->
                  <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                      <div class="modal-dialog">
                      <div class="modal-content">
                          <div class="modal-header">
                          <h5 class="modal-title" id="staticBackdropLabel">Error Description</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                          ${row.errorDescription}
                          </div>
                          <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          </div>
                      </div>
                      </div>
                  </div>
                  </td>
                  <td style="min-width: 120px;">${row.timeOccured}</td>
                  <td style="min-width: 120px;">${row.dateOccured}</td>
                  <td style="min-width: 150px;">${row.route}</td>
                  <td style="min-width: 120px;">${row.errorCode}</td>
                  <!-- <td style="min-width: 50px;">
                      <button class="btn btn-sm btn-primary rounded-6 text-end">Edit</button>
                  </td>-->
                  <td style="min-width: 50px;">
                      <button class="btn btn-sm btn-danger rounded-6" type="button" onclick="deleteErrorLog('${row.id}')">Delete</button>
                  </td>	
                 </tr>`;
              $('#errordata').html(rowContent);
            });
        }
      });

}


/* -------------------------- delete the error log -------------------------- */

const deleteErrorLog = (id) => {
var settings = {
  "url": `https://zowaseladmin.loclx.io/api/errorlog/deleteErrorlogbyid/${id}`,
  "method": "DELETE",
  "timeout": 0,
  "headers": {
    "Authorization": localStorage.getItem('access')
  }
};

$.ajax(settings).done(function (response) {
  console.log(response);
  if(response.error==true){
      swal("FAILED", response.message, "error");
    }else{
      alert("SUCCESS", response.message, "success");
      fetchAllErrorlog();
    }
  
});
}

/* ------------------------ end of error log deletion ----------------------- */

/* -------------------------------------------------------------------------- */
/*                            ERROR LOGS ENDS HERE                            */
/* -------------------------------------------------------------------------- */







/* -------------------------------------------------------------------------- */
/*                                   SUPPORT TICKETS STARTS HERE                                 */
/* -------------------------------------------------------------------------- */
function fetchAlltickets (){
  var settings = {
      "url": "https://zowaseladmin.loclx.io/api/tickets/fetchallTicket",
      "method": "GET",
      "timeout": 0,
      "headers": {
      "Authorization": localStorage.getItem('access')
      },
    };
    
    

    $.ajax(settings).done(function (data) {
      //   console.log(data);
        //   let response = JSON.parse(data);
        let response = data;
        console.log(response);
        if(response.error==true){
          console.log(response.message);
          $('#ticketdata').html("<tr>"+response.message+"</tr>");
        }else{
          let thedata = (response.data).reverse();
          let rowContent
          $.each(thedata, (index, row) => {

            let ticketStatus;
             if(row.ticketStatus==0){
              ticketStatus = `
              <span class="badge badge-dot mr-4">
                <i class="bg-warning"></i> Inactive
              </span>
              `;
             }else{
              ticketStatus = `
              <span class="badge badge-dot mr-4">
                <i class="bg-success"></i> Active
              </span>
              `;
             }
              
              index= index+1;
              rowContent 
              += `<tr class="align-items-center">
                  <td style="min-width: 50px;">${index}</td>
                  <td style="min-width: 170px;">${row.ticketId}</td>
                  <td style="min-width: 170px;">${row.userId}</td>
                  <td style="min-width: 170px;">${row.subject}</td>
                  <td style="min-width: 150px;">
                  <button type="button" class="btn btn-sm success text-white rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                      VIEW
                  </button>
                  
                  <!-- Modal -->
                  <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                      <div class="modal-dialog">
                      <div class="modal-content">
                          <div class="modal-header">
                          <h5 class="modal-title" id="staticBackdropLabel">Error Description</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                          ${row.description}
                          </div>
                          <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          </div>
                      </div>
                      </div>
                  </div>
                  </td>
                  <td style="min-width: 120px;">${row.priority}</td>
                  <td style="min-width: 120px;">${row.dateAdded}</td>
                  <td style="min-width: 120px;">${row.timeAdded}</td>
                  <td style="min-width: 120px; text-align:center;">${ticketStatus}</td>
                  <td class="text-end" style="min-width: 50px;">
                      <div class="dropdown shadow-dot text-center">
                          <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i class="fas fa-ellipsis-v"></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                              <a class="dropdown-item" href="">Edit</a>
                              <a class="dropdown-item" onclick="deleteSupportTicket('${row.id}')" href="javascript:void(0)">Delete</a>
                          </div>
                      </div>
                  </td>

                 </tr>`;
              $('#ticketdata').html(rowContent);
            });
        }
      });

}

/* --------------------- Deleting support tickets starts -------------------- */

const deleteSupportTicket = (id) => {
var settings = {
  "url": `https://zowaseladmin.loclx.io/api/tickets/deleteTicketbyid/${id}`,
  "method": "DELETE",
  "timeout": 0,
  "headers": {
    "Authorization": localStorage.getItem('access')
  }
};

$.ajax(settings).done(function (response) {
  console.log(response);
  if(response.error==true){
      swal("FAILED", response.message, "error");
    }else{
      swal("SUCCESS", response.message, "success");
      fetchAlltickets();
    }
  
});
}

/* ---------------------- Deleting support tickets end ---------------------- */


/* ------------------------- adding support tickets ------------------------- */

const addSupportTickets =()=>{
console.log(localStorage.getItem('access'));
// selecting the input element and get its value
let ticketSubject = document.getElementById("subject");
let ticketPriority = document.getElementById("priority");
let description = document.getElementById("description");

// Displaying the value 
// alert(roleName)
if(!ticketSubject.value){
    swal("Enter ticket subject!");
    ticketSubject.focus();
    return false;
}else if(!ticketPriority.value){
    swal("Select Priority!");
    ticketPriority.focus();
    return false;
}else if(!description.value){
    swal("Enter description!");
    description.focus();
    return false;
}else{

    const ticketData = JSON.stringify({
      subject: ticketSubject.value,
      description: description.value,
      priority: ticketPriority.value,
      "userId": "unknown"
    });

    var settings = {
      "url": "https://zowaseladmin.loclx.io/api/tickets/createTicket",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Authorization": localStorage.getItem('access'),
        "Content-Type": "application/json"
      },
      "data": ticketData
    };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        if(response.error==true){
          //   console.log(response.message);
            swal("FAILED", response.message, "error");
          }else{
          //   console.log(response.message);
            swal("SUCCESS", response.message, "success");
            ticketSubject.value="";
            ticketPriority.value="";
            description.value="";
          }
      });
}
};

/* -------------------------- trigger create ticket ------------------------- */
$('#createTicket').click(addSupportTickets)

/* -------------------------------------------------------------------------- */
/*                               END OF SUPPORT    TICKET                          */
/* -------------------------------------------------------------------------- */