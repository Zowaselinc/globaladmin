const splittingDate = (data) => {
  let date = data.split("T")[0];
  let t = data.split("T")[1];

  // removing unnessary data from time
  let time = t.split(".000Z")[0];

  return date+"<br/>"+time;
}

/* ---------------------------- Spliting end here --------------------------- */





/* ----------------------------- activate loader ---------------------------- */
const loader = (contentArea = "", colspan="") => {
  document.querySelector(contentArea).innerHTML = `<tr>
  <td colspan="${colspan}" class="text-center">
    <img src="../assets/loader.gif" alt=""/>
  </td>
  </tr>`
}
/* ---------------------------- loader ends here ---------------------------- */





// this holds the request headers and bodies
// allows u to make a request
const querySetting = (URL, METHOD, AUTHKEY, DATA = {}) => {
    const settings = {
        "url": `https://vgsvbgpmm2.us-east-1.awsapprunner.com/${URL}`,
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
    loader('#tbdata', 7)
    var settings = querySetting("api/admin/roles/getall", "GET", localStorage.getItem('access'));

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
          <td style="min-width: 120px;">${row.role_name}</td>
          <td style="min-width: 120px;">${row.role_description}</td>
          <td style="min-width: 120px;">${row.created_at}</td>
          <td style="min-width: 120px;">${row.updated_at}</td>
          <td style="min-width: 50px;">
          <button class="btn btn-sm th-btn fs-9 text-white rounded-6 text-end" onclick="editRole('${row.id}', '${row.role_name}', '${row.role_description}')">Update</button>
          </td>
          <td style="min-width: 50px;">
          <button class="btn btn-sm btn-danger fs-9 rounded-6" onclick="deleteadminRole('${row.id}')">Delete</button>
          </td>	
               </tr>`;
        });
       }
        // loader('#tbdata')
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
            "role_name": roleName.value,
            "role_description": roleDescription.value
        });

        var settings = querySetting("api/admin/roles/add", "POST", localStorage.getItem('access'), adminRole);
          
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
        "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/roles/delete/"+n,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Authorization": localStorage.getItem('access')
        },
        "Content-Type": "application/json",
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

  // console.log(confirmEdit);
  
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
          "role_name": roleName.value,
          "role_description": roleDescription.value
      });

      var settings = querySetting("api/admin/roles/edit", "POST", localStorage.getItem('access'), adminRole);
        
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
  loader('#admindata', 14)
  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/getall",
    "method": "GET",
    "timeout": 0,
    "headers": {
     "Authorization": localStorage.getItem('access')},
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });

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
                  <div class="py-1 pe-3 ps-2 text-center rounded-pill past-due">
                    <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                    <strong class="text-past fs-9">IN ACTIVE</strong>
                  </div>
                `;
               }else{
                status = `
                <div class="py-1 pe-3 ps-2 text-center rounded-pill successalert">
												<span class="rounded-circle p-1 dot d-inline-block me-1"></span>
												<strong class="text-success fs-9">ACTIVE</strong>
									</div>
                `;
               }
                
                
                index= index+1;
                rowContent 
                += `<tr class="align-items-center">
                    <td style="min-width: 50px;">${index}</td>
                    <td style="min-width: 120px;">${row.first_name}</td>
                    <td style="min-width: 120px;">${row.last_name}</td>
                    <td style="min-width: 130px;" class="success-color">${row.email}</td>
                    <td style="min-width: 130px;">${row.phone}</td>
                    <td style="min-width: 130px;">${row.role}</td> 
                    <td style="min-width: 150px; ">
                    <button type="button" class="btn-sm text-white th-btn fs-9 rounded-6" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                        VIEW
                    </button>
                    
                    <!-- Modal -->
                    <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header border-0">
                            <h3 class="modal-title fw-bold" id="staticBackdropLabel">Recovery Prase</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            ${row.recovery_phrase}
                            </div>
                            <div class="modal-footer border-0">
                            <button type="button" class="btn-sm bg-primary text-white" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </td>
                    
                    <td style="min-width: 120px;">${status}</td>
                    <td style="min-width: 160px;">${splittingDate(row.created_at)}</td>
                    <td style="min-width: 160px;">${splittingDate(row.updated_at)}</td>
                    <td class="text-end" style="min-width: 50px;">
                        <div class="dropdown shadow-dot text-center">
                            <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-center dropdown-menu-arrow">
                                <a class="dropdown-item " href="javascript:void(0)" onclick="executeUpdate('${row.id}', '${row.admin_id}', '${row.first_name}', '${row.last_name}', '${row.phone}', '${row.role}')">Update</a>
                                <a class="dropdown-item" onclick="deleteAdministrator('${row.admin_id}')" href="javascript:void(0)">Delete</a>
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
    "url": `https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/deletebyadminid/${id}`,
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')},
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
const executeUpdate = (id, adm_id, fn, ln, mb, role) => {
  let updateData = JSON.stringify({"id": id, "adminid":adm_id, "firstname": fn, "lastname": ln, "mobile": mb, "role": role});
  localStorage.setItem('singleadmindata', updateData);
  window.location.href = "update-administrator.html";
}


/* --------------------------- MAKING THE UPDATES --------------------------- */
const makeUpdate = () => {
  // selecting the input element and get its value
  let adminID = JSON.parse(localStorage.getItem('singleadmindata')).adminid;
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
      "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/editbyadminid",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Authorization": localStorage.getItem('access'),
        "Content-Type": "application/json"
      },

      "data": JSON.stringify({
        "admin_id": adminID,
        "first_name": firstName.value,
        "last_name": lastName.value,
        "phone": adminMobile.value,
        "role": role.value
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
              first_name.value="";
              last_name.value="";
              adminMobile.value="";
              role.value="";
              adminInformation();

              setTimeout(() => {
                window.location.href = 'alladministrators.html';
                // alert("ewe");
              }, 3300)
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
  // let adminRecovery = document.getElementById("recovery_phase");



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
  // }else if(!adminRecovery.value){
  //     swal("Enter recovery phase!");
  //     adminRecovery.focus();
  //     return false;
  }else{

    var settings = {
      "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/add",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Authorization": localStorage.getItem('access'),
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "first_name": firstName.value,
        "last_name": lastName.value,
        "email": adminMail.value,
        "password": adminPassword.value,
        "phone": adminMobile.value,
        "role": adminRole.value,
        // "recoveryPhrase": adminRecovery.value,
        "status": "1"
      }),
    };
    
        
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED",response.message,"error");
            }else{
              console.log(response.message);
              swal("SUCCESS",response.message,"success");
              firstName.value="";
              lastName.value="";
              adminMail.value="";
              adminPassword.value="";
              adminMobile.value="";
              adminRole.value="";
              // adminRecovery.value="";
              fetchAllroles();
          }
        });
  }
};


// get all admin roles
const allRoles = () => {
  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/roles/getall",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };
  
  $.ajax(settings).done(function (data) {
    let response = data.data;
      for(let i = 0; i < response.length; i++){
        $('#role').append(`<option value='${response[i].role_name}'>${response[i].role_name}</option>`);
      }
  });
}

allRoles();

/* --------------------- ADDING ADMINISTRATOR ENDS HERE --------------------- */


/* -------------------------------------------------------------------------- */
/*                          ADMINISTRATORS ENDS HERE                          */
/* -------------------------------------------------------------------------- */








/* -------------------------------------------------------------------------- */
/*                           ACTIVITY LOG STARTS HERE                           */
/* -------------------------------------------------------------------------- */

function fetchAllactivity (){

  loader('#activitylog', 14)

  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/activitylog/getall",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')},

    }
    

    $.ajax(settings).done(function (data) {
      console.log(data);

        let response = data;
        console.log(response);
        if(response.error==true){
          console.log(response.message);
          $('#activitylog').html("<tr>"+response.message+"</tr>");
        }else{
          let thedata = (response.data).reverse();
          let rowContent;
          $.each(thedata, (index, row) => {
              
              index= index+1;
              rowContent 
              += `<tr class="align-items-center">
                  <td style="min-width: 10px;">${index}</td>
                  <td style="max-width: 170px;">${row.admin_id}</td>
                  <td style="min-width: 200px;">${row.section_accessed}</td>
                  <td style="max-width: 120px;">${row.page_route}</td>
                  <td style="min-width: 120px;">${row.action}</td>
                  <td style="min-width: 120px;">${row.theadmin.role}</td>
                  <td style="min-width: 120px;">${row.theadmin.first_name} <br> ${row.theadmin.last_name}</td>
                  <td style="min-width: 120px;">${(row.created_at).split("T")[0]}</td>
                 
                 </tr>`;
              });
                $('#activitylog').html(rowContent);
        }
      });
    }




/* -------------------------------------------------------------------------- */
/*                            ACTIVITY LOG ENDS HERE                            */
/* -------------------------------------------------------------------------- */






/* -------------------------------------------------------------------------- */
/*                            ERROR LOG STARTS HERE                           */
/* -------------------------------------------------------------------------- */

function fetchAllErrorlog (){

  loader('#errordata', 14)

  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/errolog/getall",
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
                  <td style="min-width: 170px;">${row.error_name}</td>
                  <td style="min-width: 150px;">
                  <button type="button" class="btn btn-sm th-btn text-white rounded-6 fs-9 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                      VIEW
                  </button>
                  
                  <!-- Modal -->
                  <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content">
                          <div class="modal-header border-0">
                          <h5 class="modal-title" id="staticBackdropLabel">Error Description</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                          ${row.error_description}
                          </div>
                          <div class="modal-footer border-0">
                          <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                          </div>
                      </div>
                      </div>
                  </div>
                  </td>
                  <td style="min-width: 120px;">${((row.created_at).split("T")[1]).split(".000Z")[0]}</td>
                  <td style="min-width: 120px;">${(row.created_at).split("T")[0]}</td>
                  <td style="max-width: 200px !important;">${row.route}</td>
                  <td style="min-width: 120px;">${row.error_code}</td>
                  <!-- <td style="min-width: 50px;">
                      <button class="btn btn-sm btn-primary rounded-6 text-end">Edit</button>
                  </td>-->
                 <!-- <td style="min-width: 50px;">
                      <button class="btn btn-sm btn-danger rounded-6" type="button" onclick="deleteErrorLog('${row.id}')">Delete</button>
                  </td>	-->
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

  loader('#ticketdata', 14)
  
  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/ticket/getall",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
  }else{
      let thedata = response.data;
      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {

              let ticket_status;
              if(row.ticket_status == 1){
                ticket_status = 
                  `<div class="py-1 pe-3 ps-2 text-center rounded-pill successalert">
                    <span class="rounded-circle p-1 dot d-inline-block me-1"></span>
                    <strong class="text-success fs-10">OPEN</strong>
                  </div>`;
              }else{
                ticket_status = 
                  `<div class="py-1 pe-3 ps-2 text-center rounded-pill past-due">
                    <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                    <strong class="text-past fs-10">CLOSE</strong>
                  </div>`;
              }

              index= index+1;
              rowContent += `<tr class="align-items-center">
              <td style="min-width: 50px;">${index}</td>
              <td style="min-width: 170px;">${row.ticket_id}</td>
              <td style="min-width: 170px;">${row.user_id}</td>
              <td style="min-width: 170px;">${row.subject}</td>
              <td style="min-width: 150px;">
              <button type="button" class="btn btn-sm th-btn text-white fs-9 rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                  VIEW
              </button>
              
              <!-- Modal -->
              <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                      <div class="modal-header border-0">
                      <h3 class="modal-title" id="staticBackdropLabel">Ticket Description</h3>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                      ${row.description}
                      </div>
                      <div class="modal-footer border-0">
                      <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                      </div>
                  </div>
                  </div>
              </div>
              </td>
              <td style="min-width: 120px;">${row.priority}</td>
              <td style="min-width: 150px;">${row.admin_assigned}</td>
              <td style="min-width: 140px; text-align:center;">${ticket_status}</td>
              <td style="min-width: 140px;">${(row.created_at).split("T")[0]}</td>
              <td style="min-width: 140px;">${(row.updated_at).split("T")[0]}</td>
              <td class="text-end" style="min-width: 50px;">
                  <div class="dropdown shadow-dot text-center">
                      <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                          <a class="dropdown-item" href="">Respond to</a>
                          <a class="dropdown-item" onclick="deleteSupportTicket('${row.id}')" href="javascript:void(0)">Close</a>
                      </div>
                  </div>
              </td>

             </tr>`;
          $('#ticketdata').html(rowContent);
          });
      }else{
          $('#ticketdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Ticket registered yet</h3></td></tr>");
      }
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




/* -------------------------------------------------------------------------- */
/*                             ORDERS STARTS HERE                             */
/* -------------------------------------------------------------------------- */

function fetchAllorders (){
  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/crop/order/getbyorderid/ZWLORDab9bd6618edb18ba50d593fde8a1c75a",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
  }else{
      let thedata = response.data;
      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {

              index= index+1;
              rowContent += `<tr class="align-items-center">
              <td style="min-width: 50px;">${index}</td>
              <td style="min-width: 170px;">${row.ticket_id}</td>
              <td style="min-width: 170px;">${row.user_id}</td>
              <td style="min-width: 170px;">${row.subject}</td>
              <td style="min-width: 150px;">
              <button type="button" class="btn btn-sm th-btn text-white fs-9 rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                  VIEW
              </button>
              
              <!-- Modal -->
              <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                      <div class="modal-header border-0">
                      <h3 class="modal-title" id="staticBackdropLabel">Ticket Description</h3>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                      ${row.description}
                      </div>
                      <div class="modal-footer border-0">
                      <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                      </div>
                  </div>
                  </div>
              </div>
              </td>
              <td style="min-width: 120px;">${row.priority}</td>
              <td style="min-width: 150px;">${row.admin_assigned}</td>
              <td style="min-width: 140px; text-align:center;">${ticket_status}</td>
              <td style="min-width: 140px;">${(row.created_at).split("T")[0]}</td>
              <td style="min-width: 140px;">${(row.updated_at).split("T")[0]}</td>
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
          $('#ordersdata').html(rowContent);
          });
      }else{
          $('#ordersdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Order registered yet</h3></td></tr>");
      }
  }
  });

}


/* -------------------------------------------------------------------------- */
/*                            ORDERS DATA ENDS HERE                           */
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
/*                          COMPANY DATA STARTS HERE                          */
/* -------------------------------------------------------------------------- */

function fetchAllcompany (){

  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/company/getall",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };

    $.ajax(settings).done(function (data) {
        console.log(data);
        //   let response = JSON.parse(data);
        let response = data;
        if(response.error==true){
          $('#companydata').html("<tr>"+response.message+"</tr>");
        }else{
          let thedata = (response.data).reverse();
          let rowContent;
          $.each(thedata, (index, row) => {
              
              index= index+1;
              rowContent 
              += `<tr class="align-items-center">
                  <td style="min-width: 50px;">${index}</td>
                  <td style="min-width: 170px;">${row.user_id}</td>
                  <td style="min-width: 150px;">${row.company_name}</td>
                  <td style="min-width: 150px;">${row.company_address}</td>
                  <td style="min-width: 150px;">${row.company_phone}</td>
                  <td style="min-width: 120px;">${row.state}</td>
                  <td style="min-width: 120px;">${row.rc_number}</td>
                  <td style="min-width: 120px;">${(row.created_at).split("T")[0]}</td>
                  <td style="min-width: 120px;">${(row.updated_at).split("T")[0]}</td>
                  
                  <!-- <td style="min-width: 50px;">
                      <button class="btn btn-sm btn-primary rounded-6 text-end">Edit</button>
                  </td>-->
                  <!-- <td style="min-width: 50px;">
                      <button class="btn btn-sm btn-danger rounded-6" type="button" onclick="deleteErrorLog('${row.id}')">Delete</button>
                  </td> -->	
                 </tr>`;
              $('#companydata').html(rowContent);
            });
        }
      });

}

/* -------------------------------------------------------------------------- */
/*                           Company Data Ends Here                           */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                           INPUT DATA STARTS HERE                           */
/* -------------------------------------------------------------------------- */

function fetchAllinput (){

  loader('#inputdata', 14)

  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/input/getall",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
  }else{
      let thedata = response.data;
      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {

              let ticket_status;
              if(row.ticket_status == 1){
                ticket_status = 
                  `<div class="py-1 pe-3 ps-2 text-center rounded-pill successalert">
                    <span class="rounded-circle p-1 dot d-inline-block me-1"></span>
                    <strong class="text-success fs-10">ACTIVE</strong>
                  </div>`;
              }else{
                ticket_status = 
                  `<div class="py-1 pe-3 ps-2 text-center rounded-pill past-due">
                    <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                    <strong class="text-past fs-10">IN ACTIVE</strong>
                  </div>`;
              }

              index= index+1;
              rowContent += `<tr class="align-items-center">
              <td style="min-width: 50px;">${index}</td>
              <td style="min-width: 170px;">John Doe</td>
              <td style="min-width: 170px;">${row.category}</td>
              <td style="min-width: 170px;">${row.sub_category}</td>
              <td style="min-width: 120px;">${row.packaging}</td>
              <td style="min-width: 150px;">
              <button type="button" class="btn btn-sm th-btn text-white fs-9 rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                  VIEW
              </button>
              
              <!-- Modal -->
              <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                      <div class="modal-header border-0">
                      <h3 class="modal-title" id="staticBackdropLabel">Input Description</h3>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                      ${row.description}
                      </div>
                      <div class="modal-footer border-0">
                      <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                      </div>
                  </div>
                  </div>
              </div>
              </td>
            
              <!-- <td style="min-width: 150px;">${row.description}</td>
              <td style="min-width: 140px; text-align:center;">${ticket_status}</td>
              <td style="min-width: 140px;">${(row.created_at).split("T")[0]}</td>
              <td style="min-width: 140px;">${(row.updated_at).split("T")[0]}</td>
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
              </td> -->
              <td style="min-width: 50px; cursor:pointer;"  ><a href="../dashboards/view-more.html" class="success-color">View More</a></td>
              

             </tr>`;
          $('#inputdata').html(rowContent);
          });
      }else{
          $('#inputdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Inputs registered yet</h3></td></tr>");
      }
  }
  });

}

/* -------------------------------------------------------------------------- */
/*                            INPUT DATA ENDS HERE                            */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                           CROPS DATA STARTS HERE                           */
/* -------------------------------------------------------------------------- */

function fetchAllcrops (){
  
  loader('#cropdata', 10)

  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/crop/getall",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
  }else{
      let thedata = response.data;
      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {

              let ticket_status;
              if(row.ticket_status == 1){
                ticket_status = 
                  `<div class="py-1 pe-3 ps-2 text-center rounded-pill successalert">
                    <span class="rounded-circle p-1 dot d-inline-block me-1"></span>
                    <strong class="text-success fs-10">ACTIVE</strong>
                  </div>`;
              }else{
                ticket_status = 
                  `<div class="py-1 pe-3 ps-2 text-center rounded-pill past-due">
                    <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                    <strong class="text-past fs-10">IN ACTIVE</strong>
                  </div>`;
              }

              index= index+1;
              rowContent += `<tr class="align-items-center">
              <td style="min-width: 50px;">${index}</td>
              <td style="min-width: 170px;">John Doe</td>
              <td style="min-width: 170px;">${row.category}</td>
              <td style="min-width: 170px;">${row.sub_category}</td>
              <td style="min-width: 120px;">${row.packaging}</td>
              <td style="min-width: 150px;">
              <button type="button" class="btn btn-sm th-btn text-white fs-9 rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                  VIEW
              </button>
              
              <!-- Modal -->
              <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                      <div class="modal-header border-0">
                      <h3 class="modal-title" id="staticBackdropLabel">Input Description</h3>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                      ${row.description}
                      </div>
                      <div class="modal-footer border-0">
                      <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                      </div>
                  </div>
                  </div>
              </div>
              </td>
            
              <!-- <td style="min-width: 150px;">${row.description}</td>
              <td style="min-width: 140px; text-align:center;">${ticket_status}</td>
              <td style="min-width: 140px;">${(row.created_at).split("T")[0]}</td>
              <td style="min-width: 140px;">${(row.updated_at).split("T")[0]}</td>
              <!-- <td class="text-end" style="min-width: 50px;">
                  <div class="dropdown shadow-dot text-center">
                      <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                          <a class="dropdown-item" href="">Edit</a>
                          <a class="dropdown-item" onclick="deleteSupportTicket('${row.id}')" href="javascript:void(0)">Delete</a>
                      </div>
                  </div>
              </td> -->
              <td style="min-width: 50px; cursor:pointer;"  ><a href="../dashboards/view-more.html" class="success-color">View More</a></td>
              

             </tr>`;
          $('#cropdata').html(rowContent);
          });
      }else{
          $('#cropdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Crop registered yet</h3></td></tr>");
      }
  }
  });

}

/* -------------------------------------------------------------------------- */
/*                             CROP DATA ENDS HERE                            */
/* -------------------------------------------------------------------------- */