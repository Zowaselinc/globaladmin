
/* -------------------------------------------------------------------------- */
/*                          load profile image begins                         */
/* -------------------------------------------------------------------------- */
var loadFile = function (event) {
  var image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
};
  /* -------------------------------------------------------------------------- */
  /*                           load profile image ends                          */
  /* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                               spliting begins                              */
/* -------------------------------------------------------------------------- */
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
/*                         FETCHING USER STATS BEGINS                         */
/* -------------------------------------------------------------------------- */

function getUsersStats(){
// alert(localStorage.getItem('access'));
  var settings = querySetting("api/admin/users/getstats", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    // console.log(data);
      let response = data;
    console.log(response);
    if(response.error==true){
      console.log(response.message);
    }else{
      let count = response.data[0];
        $('#totalusers').text(count.Totalusers);
        $('#verifieduser').text(count.VerifiedUsers);
        $('#activeuser').text(count.ActiveUsers);
        $('#totalmerchant').text(count.TotalMerchant);
        $('#verifiedmerchant').text(count.VerifiedMerchants);
        $('#activemerchant').text(count.ActiveMerchants);
        $('#totalcorporates').text(count.TotalCorporate);
        $('#verifiedcorporate').text(count.VerifiedCorporate);
        $('#activecorporate').text(count.ActiveCorporate);
     }
      // loader('#tbdata')
      // $('#tbdata').html(rowContent);
  });
}




/* -------------------------------------------------------------------------- */
/*                          FETCHING USER STATS ENDS                          */
/* -------------------------------------------------------------------------- */



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
          <td style="min-width: 10px !important;"><span>${index}</span></td>
          <td style="min-width: 100px !important;"><span>${row.role_name}</span></td>
          <td style="min-width: 130px !important;"><span>${row.role_description}</span></td>
          <td style="min-width: 100px !important;"><span>${splittingDate(row.created_at)}</span></td>
          <td style="min-width: 100px;"><span>${splittingDate(row.updated_at)}</span></td>
          <td style="min-width: 50px;">
          <button class="cursor-pointer btn btn-sm th-btn fs-9 text-white rounded-6 text-end" onclick="editRole('${row.id}', '${row.role_name}', '${row.role_description}')">Update</button>
          
          </td>
          <td style="min-width: 50px;"><span>
          <button class="btn btn-sm btn-danger fs-9 rounded-6" onclick="deleteadminRole('${row.id}')">Delete</button>
          </span>
          </td>	
              </tr>`;
        });
        // alert(response.data.length);
        $('#tbdata').html(rowContent);
        // Calling the pagination function declared
        // let totalfetchedrow = thedata.length;
        // pagination(totalfetchedrow);
        $(document).ready( function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader:{
                header: true,
                footer: true
            }
          });
        });
        

       }
        // loader('#tbdata')
        // $('#tbdata').html(rowContent);
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
                window.location.href = "admin-role.html";
                setTimeout(() => {
                  cancelRequest();
                }, 2000)
                fetchAllroles();
              }
          });
    }
};

// ------------------------- ADDING ADMISTRATIVE ROLE ENDS------------------------------//



// -----------------------DELETING ADMINISTRATIVE ROLE BEGINS----------------------------// 


const deleteadminRole =(n)=>{
    // swal("", n), ""
    swal({
      title: "Are you sure you want to delete this role?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {

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
  });
}

/* -------------------- DELETING ADMINISTRATIVE ROLE ENDS ------------------- */

/* ------------------------------- EDITING ADMINISTRATIVE ROLE BEGINS ------------------------------- */

const editRole = (id, name, description) => {
  sessionStorage.setItem('roleData', JSON.stringify({id:id, name:name, description:description}));
  // window.location.href = "#?roleID="+id;
  // const URL = window.location.href;
  // const confirmEdit = URL.split("?");

  

  // // console.log(confirmEdit);
  
  // if(confirmEdit[1] !== undefined){
  //   $('#role_name').val(name);
  //   $('#role_description').val(description);

    window.location.href = "update-role.html";

  //   if((window.location.href).split('#')[1] == 'role-section'){
  //     document.querySelector('#editBtn').classList.remove('d-none');
  //     document.querySelector('#addBtn').classList.add('d-none');
  //     document.querySelector('#cancelBtn').classList.remove('d-none');

  //   }
  // }
}

const checkr = () => {
  
  let data = JSON.parse(sessionStorage.getItem('roleData'));
   if(data !== undefined || data !== null || data !== ''){
    $('#role_name').val(data.name);
    $('#role_description').val(data.description);
  }
}

/* --------------------------- cancel edit request -------------------------- */
const cancelRequest = () => {
  sessionStorage.removeItem('roleID');
  window.location.href = "admin-role.html ";

  // clears the inputs
  $('#role_name').val("");
  $('#role_description').val("");

  // hides the update and cancel btn while displaying the add role btn
  if((window.location.href).split('#')[1] !== 'role-section'){
    document.querySelector('#editBtn').classList.toggle('d-none');
      // document.querySelector('#addBtn').classList.toggle('d-none');
      document.querySelector('#cancelBtn').classList.toggle('d-none');
  }
}



const updateAdminRole =()=>{
  let adminRoleid = JSON.parse(sessionStorage.getItem('roleData')).id;
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
              setTimeout(() => {
                cancelRequest();
              }, 2000)
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
/*                         FETCHING ADMINISTRATORS BEGINS HERE                         */
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
                    <td  style="min-width: 80px;"><span>${index}</span></td>
                    <td style="min-width: 120px;"><span>${row.first_name}</span></td>
                    <td style="min-width: 120px;"><span>${row.last_name}</span></td>
                    <td style="min-width: 130px;" class="success-color"><span>${row.email}</span></td>
                    <td style="min-width: 130px;"><span>${row.phone}</span></td>
                    <td style="min-width: 130px;"><span>${row.role}</span></td> 
                    <td style="min-width: 150px; "><span>
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
                    </div></span>
                    </td>
                    
                    <td style="min-width: 120px;">${status}</td>
                    <td style="min-width: 160px;"><span>${splittingDate(row.created_at)}</span></td>
                    <td style="min-width: 160px;"><span>${splittingDate(row.updated_at)}</span></td>
                    <td class="text-end" style="min-width: 50px;"><span>
                        <div class="dropdown shadow-dot text-center">
                            <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-center dropdown-menu-arrow">
                                <a class="dropdown-item" href="javascript:void(0)" onclick="executeUpdate('${row.id}', '${row.admin_id}', '${row.first_name}', '${row.last_name}', '${row.phone}', '${row.role}')">Update</a>
                                <a class="dropdown-item" onclick="deleteAdministrator('${row.admin_id}')" href="javascript:void(0)">Delete</a>
                            </div>
                        </div></span>
                    </td>		
                   </tr>`;
                  });
                  // alert(response.data.length);

                  $('#admindata').html(rowContent);

                  $(document).ready( function () {
                    $('#allTable').DataTable({
                      scrollY: 300,
                      scrollX: true,
                      scrollCollapse: true,
                      retrieve: true,
                      paging: true,
                      "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                      fixedHeader:{
                          header: true,
                          footer: true
                      }
                    });
                  });
                  
                   // Calling the pagination function declared
                  // let totalfetchedrow = thedata.length;
                  // pagination(totalfetchedrow);
                  
          }
        });
}


/* ----------------------- FETCHING ALL ADMINISTRATORS ENDS HERE ---------------------- */


/* ----------------- DELETING AN ADMINISTRATOR STARTS HERE ----------------- */

const deleteAdministrator = (id) => {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this file!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
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
        "first_name": firstName.value.trim(),
        "last_name": lastName.value.trim(),
        "email": adminMail.value.trim(),
        "password": adminPassword.value.trim(),
        "phone": adminMobile.value.trim(),
        "role": adminRole.value.trim(),
      }),
    };
    // console.log(settings.data)
        
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
/*                       FETCHING ALL USERS BEGINS HERE                       */
/* -------------------------------------------------------------------------- */

function fetchAllusers (){
  loader('#allusers', 8)

  var settings = querySetting("api/admin/users/getall", "GET", localStorage.getItem('access'));
    
   
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

                  let userStatus, verificationStatus;
                  if(row.user.status == 1){
                      userStatus = `<span class="text-success">Active</span>`;
                  }else{
                      userStatus = `<span class="text-danger">Inactive</span>`;
                  }

                  if(row.user.is_verified == 0){
                      verificationStatus = `<span class="text-danger">Not Verified</span>`;
                  }else{
                      verificationStatus = `<span class="text-success">Verified</span>`;
                  }

                  index= index+1;
                  rowContent += `<tr class="align-items-center">
                      <td style="min-width: 50px;"><span>${index}</span></td>
                      <td style="min-width: 170px;">
                          <strong class="text-secondary">${row.user.first_name} ${row.user.last_name}</strong><br/>
                          <small class="text-primary fw-bold text-uppercase">${row.user.type}</small>
                      </td>
                      <td style="min-width: 150px;" class="text-primary">${row.user.email}</td>
                      <td style="min-width: 120px;">${row.user.phone}</td>
                      <td style="min-width: 170px;">${verificationStatus}</td>
                      <td style="min-width: 80px;">${userStatus}</td>
                      <td style="min-width: 120px;">${(row.created_at).split("T")[0]}</td>
                      <td style="min-width: 120px;">${(row.updated_at).split("T")[0]}</td>
                      <!--
                      <td class="text-end" style="min-width: 50px;">
                          <div class="dropdown shadow-dot text-center">
                              <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i class="fas fa-ellipsis-v"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                                  <a class="dropdown-item" href="">Edit</a>
                                  <a class="dropdown-item" onclick="n ('${row.id}')" href="javascript:void(0)">Delete</a>
                              </div>
                          </div>
                      </td> -->

                  </tr>`;
                  $('#allusers').html(rowContent);

                  $(document).ready( function () {
                    $('#allTable').DataTable({
                      scrollY: 300,
                      scrollX: true,
                      scrollCollapse: true,
                      retrieve: true,
                      paging: true,
                      "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                      fixedHeader:{
                          header: true,
                          footer: true
                      }
                    });
                  });
              });
          }else{
              $('#allusers').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No users registered yet</h3></td></tr>");
          }
      }
      });

}


/* -------------------------------------------------------------------------- */
/*                        FETCHING ALL USERS ENDS HERE                        */
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
        // console.log(response);
        if(response.error==true){
          console.log(response.message);
          $('#activitylog').html("<tr>"+response.message+"</tr>");
        }else{
          let thedata = (response.data).reverse();
          let rowContent;
          $.each(thedata, (index, row) => {
            index= index+1;
            
            // let theadmindata = JSON.stringify(row.theadmin);
            // console.log(JSON.stringify(row.theadmin))
            rowContent 
              += `<tr class="align-items-center">
              <td style="min-width: 10px;">${index}</td>
              $.<td style="max-width: 120px;">${row.page_route}</td>
                  <td style="max-width: 170px;">${row.admin_id}</td>
                  <td style="min-width: 200px;">${row.section_accessed}</td>
                  <td style="min-width: 120px;">${row.action}</td>
                  <td style="min-width: 120px;">${row.theadmin.role}</td>
                  <td style="min-width: 120px;">${row.theadmin.first_name} <br> ${row.theadmin.last_name}</td>
                  <td style="min-width: 120px;">${(row.created_at).split("T")[0]}</td>
                 
                 </tr>`;
              });
              
                $('#activitylog').html(rowContent);
                // Calling the pagination function declared
                $(document).ready( function () {
                  $('#allTable').DataTable({
                    scrollY: 300,
                    scrollX: true,
                    scrollCollapse: true,
                    retrieve: true,
                      paging: true,
                      "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                      fixedHeader:{
                          header: true,
                          footer: true
                      }
                  });
                });
                // let totalfetchedrow = thedata.length;
                // pagination(totalfetchedrow);
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
                 
                 </tr>`;
                });
                $('#errordata').html(rowContent);
                // Calling the pagination function declared
             
                // let totalfetchedrow = thedata.length;
                // var data = (totalfetchedrow);

                $(document).ready( function () {
                  $('#allTable').DataTable({
                    scrollY: 300,
                      scrollX: true,
                      scrollCollapse: true,
                      retrieve: true,
                      paging: true,
                      "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                      fixedHeader:{
                          header: true,
                          footer: true
                      }
                  });
                });
                // pagination(totalfetchedrow);
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

  loader('#ticketdata', 14 )
  
  var settings = querySetting("api/admin/ticket/getall", "GET", localStorage.getItem('access'));
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
  }else{
      let thedata = response.data;
      let rowContent = "";
      let index;
      console.log(thedata, "erfrefre");
      if(thedata.length > 0){
          for (let i = 0; i < thedata.length; i++) {
            // console.log('Hello World', + i);
            let ticket_status;
            let row = thedata[i];
            // console.log(row, "rowwwww");
              if(row.ticket_status == 1){
                ticket_status = 
                  `<div class="py-1 pe-3 ps-2 text-center successalert">
                  <span class="rounded-circle p-1 dot d-inline-block me-1"></span>
                  <strong class="text-success" style="font-size: 12px;">OPEN</strong>
                  </div>`;
              }else{
                ticket_status = 
                  `<div class="py-1 pe-3 ps-2 text-center past-due">
                    <span class="rounded-circle p-1 past d-inline-block me-1"></span>
                    <strong class="text-past" style="font-size: 12px;">CLOSED</strong>
                  </div>`;
              }

              let priority;
              if(row.priority == 1){
                priority = `
									  	<div class=" bg-light px-2 py-1 fw-bold welcome text-center" style="font-size: 12px !important;">High</div>
               `;
              }
              else{
                priority = `
									  	<div class="bg-light px-2 py-1 fw-bold welcome text-center" style="font-size: 12px !important;">Low</div>
               `;
              }

              index= i+1;
              rowContent += `
              <tr class="align-items-center" >
									  	<td class="" style="min-width: 20px; font-size: 12px !important;" data-label="Id"><span>${index}</span></td>
									  	<td class="" style="max-width:150px !important; font-size: 12px !important;" data-label="Ticket Id">${row.ticket_id}</td>
									  	<td class="" style="min-width: 120px; font-size: 12px !important;" data-label="Subject">${row.subject}</td>
										  <td class="" style="min-width: 80px; font-size: 12px !important;" data-label="Status">${ticket_status}</td> 
									  	<td class="" style="min-width: 70px; font-size: 12px !important;" data-label="Status"data-label="Priority">${priority}</td>
									  	<td class="" style="min-width: 80px;font-size: 12px !important;" data-label="Assignee">${row.admin_assigned}</td>
									 	  <td class="" style="min-width: 80px;" font-size: 12px !important;" data-label="Date Created">${(row.created_at).split("T")[0]}</td>
									  	<td class="" style="min-width: 20px;">
                      <div class="dropdown shadow-dot text-center" style="font-size: 12px !important;" data-label="">
												<a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													<i class="fas fa-ellipsis-v"></i>
												</a>
												<div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
													<a class="dropdown-item" href="../dashboards/respond-ticket.html">Respond to</a>
													<a class="dropdown-item" onclick="deleteSupportTicket('${row.id}')" href="javascript:void(0)">Close</a>
												</div>
                        </div>
										</td>
									</tr>
              `;   
          
        }
        
        $('#ticketdata').html(rowContent);
        
        
          
      }else{
          $('#ticketdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Ticket registered yet</h3></td></tr>");
      }

      $(document).ready( function () {
        $('#allTable').DataTable({
          scrollY: 300,
          scrollX: true,
          scrollCollapse: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader:{
                header: true,
                footer: true
            }
        });
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
let ticketUser = document.getElementById("users")
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
}else if(!users.value){
  swal("Select User!");
  description.focus();
  return false;}
  else{

    const ticketData = JSON.stringify({
      users: ticketUser.value,
      subject: ticketSubject.value,
      description: description.value,
      priority: ticketPriority.value,
     
      "userId": "unknown",
      
    });

    var settings = {
      "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/ticket/add",
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
            ticketUser.value="";
            ticketSubject.value="";
            ticketPriority.value="";
            description.value="";
          }
      });
}
};

/* -------------------------- trigger create ticket ------------------------- */
$('#createTicket').click(addSupportTickets)


const allUsers = () => {
  var settings = {
    "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/users/getall",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };
  
  $.ajax(settings).done(function (data) {
    let response = data.data;
      for(let i = 0; i < response.length; i++){
        $('#users').append(`<option value='${response[i].user.first_name} ${response[i].user.last_name}'>${response[i].user.first_name} ${response[i].user.last_name}</option>`);
      }
  });
}

// allUsers();
/* -------------------------------------------------------------------------- */
/*                               END OF SUPPORT    TICKET                          */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                           Crop  ORDERS STARTS HERE                             */
/* -------------------------------------------------------------------------- */

function fetchAllorders (){

  var settings = querySetting("api/admin/order/ORDA2B44991D42DB8E8", "GET", localStorage.getItem('access'));
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
  }else{
        console.log(response.data)
        let thedata = response.data;
        thedata = thedata.rows

        if(thedata.length > 0){
          console.log(length);
         

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
/*                            FETCH ALL NEGOTIATION                           */
/* -------------------------------------------------------------------------- */
function fetchAllnegotiation (){

  loader('#negotiationdata', 10)

  var settings = querySetting("api/admin/crop/negotiation/getallNegotiations", "GET", localStorage.getItem('access'));
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
     
  }else{
      console.log(response.data)

      let thedata = response.data;
     
      console.log(thedata)

      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {

              index= index+1;
              rowContent += `<tr class="align-items-center">
              <td style="min-width: 50px;">${index}</td>
              <td style="min-width: 100px;"> <strong class="welcome">${row.sender_id}</strong><br/>
                <small class="text-primary fw-bold text-uppercase">${row.type}</small> 
              </td>
              <td style="min-width: 100px;">${row.receiver_id}</td>
              <td style="min-width: 120px;">${splittingDate(row.created_at)}</td>
              <td style="min-width: 120px;">${splittingDate(row.updated_at)}</td>
             
              <td style="min-width: 50px;">
              <button onclick="allAdmin()" type="button" class="btn btn-sm th-btn text-white fs-9 rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                  Asign Admin
              </button>
              
              <!-- Modal -->
              <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                      <div class="modal-header border-0">
                      <h3 class="modal-title" id="staticBackdropLabel">Select Admin to Negotiate</h3>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                          <form>
                            <label class="pt-1 pb-1 welcome text-secondary">Select Admin</label>
                            <select class="form-control form-control-lg form-select rounded-2 shadow-form" type="text"  id="Alladmin">
                              <option value="" disabled selected>Select Admin</option>
                              
                            </select>
                            <br>
                            <div class="text-end">
                              <a href="javascript:void(0)" class="btn  th-btn fs-9 text-white rounded-6" onclick="asignAdmin()"> Asign Admin</a>
                           
                            </div>
                          </form>
                      </div>
                     <!-- <div class="modal-footer border-0">
                      <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                      </div> -->
                  </div>
                  </div>
              </div>
              </td>
             <!-- <td class="text-end" style="min-width: 50px;">
                  <div class="dropdown shadow-dot text-center">
                      <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                          <a href="javascript:void(0)" class="dropdown-item" href="">Asign Admin</a>
                          <a href="javascript:void(0)" class="dropdown-item" onclick="deleteSupportTicket('${row.id}')">View</a>
                      </div>
                  </div>
              </td> -->

             </tr>`;
            });
            $('#negotiationdata').html(rowContent);
            $(document).ready( function () {
              $('#allTable').DataTable({
                scrollY: 300,
                scrollX: true,
                scrollCollapse: true,
                retrieve: true,
                paging: true,
                "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                fixedHeader:{
                    header: true,
                    footer: true
                }
              });
            });
      }else{
          $('#negotiationdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Negotiation</h3></td></tr>");
      }
  }
  });

}

// -------------- Collecting the Admin ------------------------//
const allAdmin = () => {
  var settings = querySetting("api/admin/getall", "GET", localStorage.getItem('access'));
    
  
  $.ajax(settings).done(function (data) {
    let response = data.data;
      for(let i = 0; i < response.length; i++){
        $('#Alladmin').append(`<option value='${response[i].first_name} ${response[i].last_name}'> ${response[i].first_name} ${response[i].last_name}</option>`);
      }
  });
}



/* -------------------------------------------------------------------------- */
/*                            NEGOTIATION ENDS HERE                           */
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
              console.log(response.data)
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
/*                     Fetching all crop categories data start                     */
/* -------------------------------------------------------------------------- */
function fetchAllCategory (){
  
  loader('#categorydata', 10)

  var settings = querySetting("api/admin/category/crop/getall", "GET", localStorage.getItem('access'));
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
     
  }else{
      console.log(response.data)

      let thedata = response.data;
     
      console.log(thedata)

      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {
          
             
              // console.log(row.category.type)
              index= index+1;
              rowContent += `
                <tr class="align-middle text-start">
                    <td style="min-width: 50px;">${index}</td>
                    <td style="min-width: 100px;" class="text-capitalize">${row.type}</td>
                    <td style="min-width: 100px;">${row.name}</td>
                    <td style="min-width: 50px;">
                      <a href="javascript:void(0)" onclick="viewSubCategory('${row.id}','${row.name}')">
                        <span class="text-primary">
                          <i class="fa fa-eye"></i> View
                        </span>
                      </a>
                    </td>
                    <td style="min-width: 120px;">${splittingDate(row.created_at)}</td>
                    <td style="min-width: 120px;">${splittingDate(row.updated_at)}</td>
                   
                    <td class="" style="max-width: 100px;">
                      <span>
                        <a class="py-1 px-2 th-btn rounded me-3" href="javascript:void(0)" onclick="editCategory('${row.id}','${row.name}')"><i class="text-white fa fa-pencil"></i></a>
                        <a class="py-1 px-2 btn-danger rounded ms-3" href="javascript:void(0)" onclick="deleteCategory('${row.id}')"><i class="text-white fa fa-trash"></i></a>
                      </span>
                    </td>
                    
								</tr>
              `;
            });
            $('#categorydata').html(rowContent);
            $(document).ready( function () {
              $('#allTable').DataTable({
                scrollY: 300,
                scrollX: true,
                scrollCollapse: true,
                retrieve: true,
                paging: true,
                "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                fixedHeader:{
                    header: true,
                    footer: true
                }
              });
            });
      }else{
          $('#categorydata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Category Added Yet</h3></td></tr>");
      }
  }
  });

};


// -------------------------------Fetch all Input Categories ---------------------------//
function fetchAllInputCategory (){
  
  loader('#categorydata', 10)

  var settings = querySetting("api/admin/category/input/getall", "GET", localStorage.getItem('access'));
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
     
  }else{
      console.log(response.data)

      let thedata = response.data;
     
      console.log(thedata)

      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {
          
             
              // console.log(row.category.type)
              index= index+1;
              rowContent += `
                <tr class="align-middle text-start">
                    <td style="min-width: 50px;">${index}</td>
                    <td style="min-width: 100px;" class="text-capitalize">${row.type}</td>
                    <td style="min-width: 100px;">${row.name}</td>
                    <td style="min-width: 50px;">
                      <a href="javascript:void(0)" onclick="viewSubCategory('${row.id}','${row.name}')">
                        <span class="text-primary">
                          <i class="fa fa-eye"></i> View
                        </span>
                      </a>
                    </td>
                    <td style="min-width: 120px;">${splittingDate(row.created_at)}</td>
                    <td style="min-width: 120px;">${splittingDate(row.updated_at)}</td>
                   
                    <td class="" style="max-width: 100px;">
                      <span>
                        <a class="py-1 px-2 th-btn rounded me-3" href="javascript:void(0)" onclick="editCategory('${row.id}','${row.name}')"><i class="text-white fa fa-pencil"></i></a>
                        <a class="py-1 px-2 btn-danger rounded ms-3" href="javascript:void(0)" onclick="deleteCategory('${row.id}')"><i class="text-white fa fa-trash"></i></a>
                      </span>
                    </td>
                    
								</tr>
              `;
            });
            $('#categorydata').html(rowContent);
            $(document).ready( function () {
              $('#allTable').DataTable({
                scrollY: 300,
                scrollX: true,
                scrollCollapse: true,
                retrieve: true,
                paging: true,
                "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                fixedHeader:{
                    header: true,
                    footer: true
                }
              });
            });
      }else{
          $('#categorydata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Category Added Yet</h3></td></tr>");
      }
  }
  });

}; 
// --------------------------------Adding a Crop  Category starts---------------------//
const addcategory = () => {
  // alert("balablu")
  // console.log(localStorage.getItem('access'));
  // selecting the input element and get its value
  let categoryType = document.getElementById("category_type");
  let categoryName = document.getElementById("category_name");


  // Displaying the value 
    if(!categoryType.value){
      swal("Enter Category Type!");
      categoryType.focus();
      return false;
    } else if(!categoryName.value){
      swal("Enter Category Name!");
      categoryName.focus();
      return false;
  } else {

      const catAdd = JSON.stringify({
          "type":categoryType.value,
          "name": categoryName.value
      });

      var settings = querySetting("api/admin/category/add", "POST", localStorage.getItem('access'), catAdd);
      
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED", response.message, "error");
            }else{
              console.log(response.message);
              swal("SUCCESS", response.message, "success");
            
              categoryType.value=""
              categoryName.value="";
              
              window.location.href = "category.html";
              setTimeout(() => {
                cancelRequest();
              }, 2000)
              fetchAllcolors();
            }
        });
  }
}; 


// ------------------------------Deleting crop category ----------------------------------//
const deleteCategory =(n)=>{
  // swal("", n);
  swal({
    title: "Are you sure you want to delete this category?",
    text: "Once deleted, you will not be able to recover this category!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {

    var settings = querySetting("api/admin/category/delete/"+n, "POST", localStorage.getItem('access'));
    
  
    $.ajax(settings).done(function (response) {
      console.log(response);
      if(response.error==true){
          console.log(response.message);
          swal("FAILED", response.message, "error");
        }else{
          console.log(response.message);
          swal("SUCCESS", response.message, "success");
          window.location.href = "category.html";
              setTimeout(() => {
                cancelRequest();
              }, 2000)
              fetchAllCategory();
        }
      
    });
  }
});
}

//-------------------Editing Category begins ------------------------------/
const editCategory = (id, name) => {
  // alert("clickme")
  sessionStorage.setItem('categoryData', JSON.stringify({id:id, name:name}));
  window.location.href = "#?categoryID="+id;
  const URL = window.location.href;
  const confirmEdit = URL.split("?");
  
  if(confirmEdit[1] !== undefined){
    $('#category_name').val(name);
    // $('#role_description').val(description);

    // window.location.href = "update-role.html";

    document.querySelector('#editBtn').classList.remove('d-none');
    document.querySelector('#addBtn').classList.add('d-none');
    document.querySelector('#cancelBtn').classList.remove('d-none');

    window.location.href = `#category-section`;

  }
}

/* --------------------------- cancel edit request -------------------------- */
const cancelCategory = () => {
  sessionStorage.removeItem('colorID');
  window.location.href = "category.html";

  // clears the inputs
  $('#category_name').val("");
  // $('#role_description').val("");

  // hides the update and cancel btn while displaying the add role btn
  if((window.location.href).split('#')[1] !== 'color-section'){
      document.querySelector('#editBtn').classList.toggle('d-none');
      document.querySelector('#addBtn').classList.toggle('d-none');
      document.querySelector('#cancelBtn').classList.toggle('d-none');
  }
}

const updateCategory =()=>{
  let categoryID= JSON.parse(sessionStorage.getItem('categoryData')).id;
  // console.log(localStorage.getItem('access'));

  // selecting the input element and get its value
  let categoryName = document.getElementById("category_name");
  // let roleDescription = document.getElementById("role_description");

  // Displaying the value 
  // swal("", roleName), ""
  if(!categoryName.value){
      swal("Enter Category Name!");
      categoryName.focus();
      return false;
  }else{

      const categoryEdit = JSON.stringify({
          "id": categoryID,
          "name": categoryName.value,
         
      });

      var settings = querySetting("api/admin/category/edit", "POST", localStorage.getItem('access'), categoryEdit);
        
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED", response.message, "error");
            }else{

              console.log(response.message);
              swal("SUCCESS", response.message, "success");
              
              setTimeout(() => {
                cancelRequest();
              }, 2000)
              window.location.href = "category.html";
              fetchAllcolors();
            }
        });
  }
};

// ----------------------------EDITING AND MAKING UPDATE ENDS ------------------------//





/* -------------------------------------------------------------------------- */
/*                  Viewing individual crop category subcategories                 */
/* -------------------------------------------------------------------------- */
const viewSubCategory = (id, name) => {
  // alert(id);
  // let cropId = JSON.stringify({"id": id});
  localStorage.setItem('singlecategoryid', JSON.stringify({"id":id,"name":name}));
  window.location.href = "sub-category.html";
}


const fetchAllSubCategories  =() => {
  loader('#subcategorydata', 10)
  let catData = JSON.parse(localStorage.getItem('singlecategoryid'));
  let catid = catData.id;

  let catname = catData.name;

  $('#subName').text(catname);
  $('#Subname').text(catname);
  var settings = querySetting("api/admin/subcategory/getbycategory/"+catid, "GET", localStorage.getItem('access'));
  

  $.ajax(settings).done(function (data) {
    console.log(data);
      let response = data;
    console.log(response);
    if(response.error==true){
      console.log(response.message);
      $('#subcategorydata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Sub-Category Added Yet</h3></td></tr>");
      // swal("FAILED", response.message, "error");
    }else{
      console.log(response.data)
      // swal("SUCCESS", response.message, "success");
      let thedata = response.data;
     
      console.log(thedata)

      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {
              index= index+1;
              rowContent += 
              // console.log(row.category_id);
              // let count = response.data.crop_request[0];
              // $('#subName').text(row.category_id);
              `
                <tr class="align-middle">
                    <td style="min-width: 50px;">${index}</td>
                    <td style="min-width: 100px;">${row.name}</td>
                    <td style="min-width: 100px;">${splittingDate(row.created_at)}</td>
                    <td style="min-width: 100px;">${splittingDate(row.updated_at)}</td>
                    <td class="" style="max-width: 100px;">
                      <span>
                        <a class="py-1 px-2 th-btn rounded me-3" href="javascript:void(0)" onclick="editSubCategory('${row.id}','${row.name}')"><i class="text-white fa fa-pencil"></i></a>
                        <a class="py-1 px-2 btn-danger rounded ms-3" href="javascript:void(0)" onclick="deleteSubCategory('${row.id}')"><i class="text-white fa fa-trash"></i></a>
                      </span>
                    </td>
								</tr>
              `;
            });
            $('#subcategorydata').html(rowContent);
            $(document).ready( function () {
              $('#allTable').DataTable({
                scrollY: 300,
                scrollX: true,
                scrollCollapse: true,
                retrieve: true,
                paging: true,
                "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                fixedHeader:{
                    header: true,
                    footer: true
                }
              });
            });
      }else{
          $('#subcategorydata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Sub-Category Added Yet</h3></td></tr>");
      }
  }
      // loader('#tbdata')
      // $('#tbdata').html(rowContent);
  });
}

// -------------------------------- Add Crop Subcategory Data ------------//
const addSubCategory = () => {
  let catData = JSON.parse(localStorage.getItem('singlecategoryid'));
  // let catid = catData.id;

  let catname = catData.name;
  $('#Subname').text(catname);
  // alert("balablu")
  // console.log(localStorage.getItem('access'));
  // selecting the input element and get its  value
  
  // let subCategoryId = document.getElementById("Subname");
  let subCategoryId = catData.id;
  let subCategoryName = document.getElementById("subCategory_name");

 
  // Displaying the value 

   if(!subCategoryName.value){
    swal("Enter Sub-Category Name!");
    subCategoryName.focus();
    return false;
  } else {

      const subAdd = JSON.stringify({
          "category_id": subCategoryId,
          "subcategory_name": subCategoryName.value
      });

      var settings = querySetting("api/admin/subcategory/add", "POST", localStorage.getItem('access'), subAdd);
      
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED", response.message, "error");
            }else{
              subCategoryId.value="";
              subCategoryName.value="";
              console.log(response.message);
              swal("SUCCESS", response.message, "success");
              setTimeout(() => {
                cancelRequest();
              }, 2000)
              fetchAllSubCategories();
              window.location.href = "sub-category.html";
            }
        });
  }
}; 

// ------------------------------Add crop category Ends here ---------------------//


//----------------------------------Deleting Crop subcategory --------------------------//
const deleteSubCategory =(n)=>{
  // swal("", n);
  swal({
    title: "Are you sure you want to delete this Sub category?",
    text: "Once deleted, you will not be able to recover this Sub category!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {

    var settings = querySetting("api/admin/subcategory/delete/"+n, "POST", localStorage.getItem('access'));
    
  
    $.ajax(settings).done(function (response) {
      console.log(response);
      if(response.error==true){
          console.log(response.message);
          swal("FAILED", response.message, "error");
        }else{
          console.log(response.message);
          swal("SUCCESS", response.message, "success");
          window.location.href = "sub-category.html";
              setTimeout(() => {
                cancelRequest();
              }, 2000)
              fetchAllCategory();
        }
      
    });
  }
});
}

// ----------------------------Making Updates to crop Subcategory -------------------------//
const editSubCategory = (id, name) => {
  // alert("clickme")
  sessionStorage.setItem('subcategoryData', JSON.stringify({id:id, name:name}));
  window.location.href = "#?subcategoryID="+id;
  const URL = window.location.href;
  const confirmEdit = URL.split("?");
  
  if(confirmEdit[1] !== undefined){
    $('#subCategory_name').val(name);
    // $('#role_description').val(description);

    // window.location.href = "update-role.html";

    document.querySelector('#editBtn').classList.remove('d-none');
    document.querySelector('#addBtn').classList.add('d-none');
    document.querySelector('#cancelBtn').classList.remove('d-none');

    window.location.href = `#Subcategory-section`;

  }
}



/* --------------------------- cancel edit request -------------------------- */
const cancelSubCategory = () => {
  sessionStorage.removeItem('subcategoryID');
  window.location.href = "sub-category.html";

  // clears the inputs
  $('#subCategory_name').val("");
  // $('#role_description').val("");

  // hides the update and cancel btn while displaying the add role btn
  if((window.location.href).split('#')[1] !== 'color-section'){
      document.querySelector('#editBtn').classList.toggle('d-none');
      document.querySelector('#addBtn').classList.toggle('d-none');
      document.querySelector('#cancelBtn').classList.toggle('d-none');
  }
}



const updateSubCategory =()=>{
  let subcategoryID= JSON.parse(sessionStorage.getItem('subcategoryData')).id;
  // console.log(localStorage.getItem('access'));

  // selecting the input element and get its value
  let subCategoryName = document.getElementById("subCategory_name");
  // let roleDescription = document.getElementById("role_description");

  // Displaying the value 
  // swal("", roleName), ""
  if(!subCategoryName.value){
      swal("Enter Sub Category Name!");
      subCategoryName.focus();
      return false;
  }else{
    // alert(subcategoryID)

      const subCategoryEdit = JSON.stringify({
          "id": subcategoryID,
          "subcategory_name": subCategoryName.value,
         
      });

      var settings = querySetting("api/admin/subcategory/edit", "POST", localStorage.getItem('access'), subCategoryEdit);
        
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED", response.message, "error");
            }else{

              console.log(response.message);
              swal("SUCCESS", response.message, "success");
              
              setTimeout(() => {
                cancelRequest();
              }, 2000)
              window.location.href = "sub-category.html";
              fetchAllSubCategories();
            }
        });
  }
}; 
/* -------------------------------------------------------------------------- */
/*                    Fetching All Categories ends here                   */
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
/*                             Fetching all Colors  start                           */
/* -------------------------------------------------------------------------- */
function fetchAllcolors (){
  
  loader('#colordata', 10)

  var settings = querySetting("api/admin/colour/getall", "GET", localStorage.getItem('access'));
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
     
  }else{
      console.log(response.data)
      let thedata = response.data;
     
      console.log(thedata)

      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {
          
             
              
              index= index+1;
              rowContent += `
                <tr class="align-middle text-start">
                    <td style="min-width: 50px;">${index}</td>
                    <td style="min-width: 100px;">${row.name}</td>
                    <td style="min-width: 120px;">${splittingDate(row.created_at)}</td>
                    <td style="min-width: 120px;">${splittingDate(row.updated_at)}</td>
                   
                    <td style="max-width: 50px;">
                      <span>
                        <!-- <button class="btn btn-sm th-btn text-white fs-9 rounded-6" onclick="editcategory('')">Edit</button> -->
                        <a class="py-1 px-2 th-btn rounded me-3" href="javascript:void(0)" onclick="editColor('${row.id}','${row.name}')"><i class="text-white fa fa-pencil"></i></a>
                        <a class="py-1 px-2 btn-danger rounded ms-3" href="javascript:void(0)" onclick="deleteColor('${row.id}')"><i class="text-white fa fa-trash"></i></a>
                      </span>
                    </td>
                    
								</tr>
              `;
            });
            $('#colordata').html(rowContent);
            $(document).ready( function () {
              $('#allTable').DataTable({
                scrollY: 300,
                scrollX: true,
                scrollCollapse: true,
                retrieve: true,
                paging: true,
                "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                fixedHeader:{
                    header: true,
                    footer: true
                }
              });
            });
      }else{
          $('#colordata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Color Added Yet</h3></td></tr>");
      }
  }
  });

};

//----------------------------------- Adding color start--------------------------------//
const addColor = () => {
  // console.log(localStorage.getItem('access'));
  // selecting the input element and get its value
  let colorName = document.getElementById("color_name");
  // let colorID = document.getElementById("color_id")


  // Displaying the value 

   if(!colorName.value){
    swal("Enter Color Name!");
    colorName.focus();
    return false;
  } else {

      const colorAdd = JSON.stringify({
          // "colour_id": colorID.value,
          "colour_name": colorName.value
      });

      var settings = querySetting("api/admin/colour/add", "POST", localStorage.getItem('access'), colorAdd);
      
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED", response.message, "error");
            }else{
              console.log(response.message);
              swal("SUCCESS", response.message, "success");
            
              // colorID.value="";
              colorName.value="";
              
              window.location.href = "color-setup.html";
              setTimeout(() => {
                cancelRequest();
              }, 2000)
              fetchAllcolors();
            }
        });
  }
};

//--------------------------------------- Adding Color end here ------------------------//

// -----------------------DELETING COLORS BEGINS----------------------------// 


const deleteColor =(n)=>{
  // swal("", n);
  swal({
    title: "Are you sure you want to delete this role?",
    text: "Once deleted, you will not be able to recover this file!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {

    var settings = querySetting("api/admin/colour/delete/"+n, "POST", localStorage.getItem('access'));
    
  
    $.ajax(settings).done(function (response) {
      console.log(response);
      if(response.error==true){
          console.log(response.message);
          swal("FAILED", response.message, "error");
        }else{
          console.log(response.message);
          swal("SUCCESS", response.message, "success");
          window.location.href = "color-setup.html";
              setTimeout(() => {
                cancelRequest();
              }, 2000)
          fetchAllcolors();
        }
      
    });
  }
});
}

/* -------------------- DELETING COLORS ENDS ------------------- */


// ------------------------------EDITING COLORS STARTS ----------------------//
const editColor = (id, name) => {
  // alert("clickme")
  sessionStorage.setItem('colorData', JSON.stringify({id:id, name:name}));
  window.location.href = "#?colorID="+id;
  const URL = window.location.href;
  const confirmEdit = URL.split("?");
  
  if(confirmEdit[1] !== undefined){
    $('#color_name').val(name);
    // $('#role_description').val(description);

    // window.location.href = "update-role.html";

    document.querySelector('#editBtn').classList.remove('d-none');
    document.querySelector('#addBtn').classList.add('d-none');
    document.querySelector('#cancelBtn').classList.remove('d-none');

    window.location.href = `#color-section`;

  }
}



/* --------------------------- cancel edit request -------------------------- */
const cancelColor = () => {
  sessionStorage.removeItem('colorID');
  window.location.href = "color-setup.html ";

  // clears the inputs
  $('#color_name').val("");
  // $('#role_description').val("");

  // hides the update and cancel btn while displaying the add role btn
  if((window.location.href).split('#')[1] !== 'color-section'){
      document.querySelector('#editBtn').classList.toggle('d-none');
      document.querySelector('#addBtn').classList.toggle('d-none');
      document.querySelector('#cancelBtn').classList.toggle('d-none');
  }
}



const updatecolor =()=>{
  let colorID = JSON.parse(sessionStorage.getItem('colorData')).id;
  // console.log(localStorage.getItem('access'));

  // selecting the input element and get its value
  let colorName = document.getElementById("color_name");
  // let roleDescription = document.getElementById("role_description");

  // Displaying the value 
  // swal("", roleName), ""
  if(!colorName.value){
      swal("Enter Color Name!");
      colorName.focus();
      return false;
  }else{

      const colorEdit = JSON.stringify({
          "id": colorID,
          "colour_name": colorName.value ,
         
      });

      var settings = querySetting("api/admin/colour/edit", "POST", localStorage.getItem('access'), colorEdit);
        
        $.ajax(settings).done(function (response) {
          console.log(response);
          if(response.error==true){
              console.log(response.message);
              swal("FAILED", response.message, "error");
            }else{

              console.log(response.message);
              swal("SUCCESS", response.message, "success");
              
              setTimeout(() => {
                cancelRequest();
              }, 2000)
              window.location.href = "color-setup.html";
              fetchAllcolors();
            }
        });
  }
};

// EDITING AND MAKING UPDATE ENDS 


/* -------------------------------------------------------------------------- */
/*                           Fetching all color end                           */
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
              <td style="min-width: 170px;">${row.user_id}</td>
              <td style="min-width: 170px;">${row.category_id}</td>
              <td style="min-width: 170px;">${row.subcategory_id}</td>
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

function cropsWanted (){
  
  loader('#cropdata', 10)

  var settings = querySetting("api/admin/crop/getbycropwanted", "GET", localStorage.getItem('access'));
    
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

  if(response.error==true){
      console.log(response.message);
     
  }else{
      console.log(response.data)
      let thedata = response.data;
      thedata = thedata.rows

      if(thedata.length > 0){
          let rowContent
          $.each(thedata, (index, row) => {
          
              let crop_status;
              if(row.user.status == 1){
                crop_status = 
                  `<div class="py-1 text-center rounded-pill successalert">
                    <span class="rounded-circle p-1 dot d-inline-block"></span>
                    <strong class="text-success" style="font-size:12px;">ACTIVE</strong>
                  </div>`;
              }else{
                crop_status = 
                  `<div class="py-1 text-center rounded-pill past-due">
                    <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                    <strong class="text-past"  style="font-size:12px;">IN ACTIVE</strong>
                  </div>`;
              }
              // console.log(row.category.type)
              index= index+1;
              rowContent += `
              <tr class="align-items-center">
              <td style="min-width: 50px;">${index}</td>
              <td style="min-width: 100px;"><strong class="text-secondary">${row.user.first_name} ${row.user.last_name}</strong><br/>
                <small class="text-primary fw-bold text-uppercase">${row.user.type}</small>
              </td>
              <td style="min-width: 70px;" class="text-primary">${row.user.email}</td>
              <td style="min-width: 100px;"><strong class="text-capitalize">${row.category.type}</strong> <br> <small class="text-primary fw-bold text-uppercase">${row.title}</small> </td>
              <td style="min-width: 100px; text-align:center;">${crop_status}</td>
              <td style="min-width: 200px;">${row.description}</td>
              <td style="min-width: 50px;">
              <button type="button" class="btn btn-sm th-btn text-white fs-9 rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                  VIEW
              </button>
              
              <!-- Modal -->
              <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                      <div class="modal-header border-0">
                      <h3 class="modal-title">Crop Specification</h3>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">

                      <div class="">
                                    <div class="">
                                        <!---->
                                        <div class="">
                                            <h3>Wanted</h3>
                                            <hr/>

                                            <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                              <div class="col-4">
                                                  <h3>Acid Ash</h3>
                                                  <h6>${row.specification.acid_ash}</h6>
                                              </div>
                                              <div class="col-4">
                                                  <h3>Broken Grains</h3>
                                                  <h6>${row.specification.broken_grains}</h6>
                                              </div>
                                              <div class="col-4">
                                                <h3>Color</h3>
                                                <h6>${row.specification.color}</h6>
                                              </div>
                                            </div>

                                            <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                              <div class="col-4">
                                                  <h3>Curcumin Content</h3>
                                                  <h6>${row.specification.curcumin_content}</h6>
                                              </div>
                                              <div class="col-4">
                                                  <h3>Dead Insect</h3>
                                                  <h6>${row.specification.dead_insect}</h6>
                                              </div>
                                              <div class="col-4">
                                                <h3>DK</h3>
                                                <h6>${row.specification.dk}</h6>
                                              </div>
                                            </div>

                                            <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                              <div class="col-4">
                                                  <h3>Drying Process</h3>
                                                  <h6>${row.specification.drying_process}</h6>
                                              </div>
                                              <div class="col-4">
                                                  <h3>Extraneous</h3>
                                                  <h6>${row.specification.extraneous}</h6>
                                              </div>
                                              <div class="col-4">
                                                <h3>Foreign Matter</h3>
                                                <h6>${row.specification.foreign_matter}</h6>
                                              </div>
                                            </div>

                                            <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                              <div class="col-4">
                                                  <h3>Grain Size</h3>
                                                  <h6>${row.specification.grain_size}</h6>
                                              </div>
                                              <div class="col-4">
                                                  <h3>Hardness</h3>
                                                  <h6>${row.specification.hardness}</h6>
                                              </div>
                                              <div class="col-4">
                                                <h3>Hectoliter</h3>
                                                <h6>${row.specification.hectoliter}</h6>
                                              </div>
                                            </div>

                                            <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                              <div class="col-4">
                                                  <h3>Infestation</h3>
                                                  <h6>${row.specification.infestation}</h6>
                                              </div>
                                              <div class="col-4">
                                                  <h3>Mammalian</h3>
                                                  <h6>${row.specification.mammalian}</h6>
                                              </div>
                                              <div class="col-4">
                                                <h3>Model Type</h3>
                                                <h6>${row.specification.model_type}</h6>
                                              </div>
                                            </div>

                                            <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                              <div class="col-4">
                                                  <h3>Moisture</h3>
                                                  <h6>${row.specification.moisture}</h6>
                                              </div>
                                              <div class="col-4">
                                                  <h3>Mold</h3>
                                                  <h6>${row.specification.mold}</h6>
                                              </div>
                                              <div class="col-4">
                                                <h3>OIl Content</h3>
                                                <h6>${row.specification.oil_content}</h6>
                                              </div>
                                            </div>

                                            <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                              <div class="col-4">
                                                  <h3>Price</h3>
                                                  <h6>${row.specification.price}</h6>
                                              </div>
                                              <div class="col-4">
                                                  <h3>Quantity</h3>
                                                  <h6>${row.specification.qty}</h6>
                                              </div>
                                              <div class="col-4">
                                                <h3>Rotten Shriveled</h3>
                                                <h6>${row.specification.rotten_shriveled}</h6>
                                              </div>
                                            </div>

                                            <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                              <div class="col-4">
                                                  <h3>Splits</h3>
                                                  <h6>${row.specification.splits}</h6>
                                              </div>
                                              <div class="col-4">
                                                  <h3>Test Weight</h3>
                                                  <h6>${row.specification.test_weight}</h6>
                                              </div>
                                              <div class="col-4">
                                                <h3>Total Defects</h3>
                                                <h6>${row.specification.total_defects}</h6>
                                              </div>
                                            </div>

                                            <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                              <div class="col-4">
                                                  <h3>Unit</h3>
                                                  <h6>${row.specification.unit}</h6>
                                              </div>
                                              <div class="col-4">
                                                  <h3>Volatile</h3>
                                                  <h6>${row.specification.volatile}</h6>
                                              </div>
                                              <div class="col-4">
                                                <h3>Weevil</h3>
                                                <h6>${row.specification.weevil}</h6>
                                              </div>
                                            </div>

                                            
                                            
                                        </div>
                                        <!---->
                                    </div>
                                </div>

                      
                      </div>
                      <div class="modal-footer border-0">
                      <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                      </div>
                  </div>
                  </div>
              </div>
              </td>
            
            
              <td style="min-width: 50px; cursor:pointer;">
                <a href="javascript:void(0)" class="success-color" onclick="viewMoreCrop('${row.id}')">View More</a>
              </td>
              

            </tr>
              `;
            });
            $('#cropdata').html(rowContent);
            $(document).ready( function () {
              $('#allTable').DataTable({
                scrollY: 300,
                scrollX: true,
                scrollCollapse: true,
                retrieve: true,
                paging: true,
                "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                fixedHeader:{
                    header: true,
                    footer: true
                }
              });
            });
      }else{
          $('#cropdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Crop registered yet</h3></td></tr>");
      }
  }
  });

};


/* -------------------------------------------------------------------------- */
/*                          view more details begins                          */
/* -------------------------------------------------------------------------- */

const viewMoreCrop = (id) => {
  // alert(id);
  // let cropId = JSON.stringify({"id": id});
  localStorage.setItem('singlecropdata', id);
  window.location.href = "view-more-crop.html";
}


const viewMore  =() => {
  
  
    var settings = querySetting("api/admin/crop/getbyid/"+localStorage.getItem('singlecropdata'), "GET", localStorage.getItem('access'));
    
  
    $.ajax(settings).done(function (data) {
      console.log(data);
        let response = data;
      console.log(response);
      if(response.error==true){
        console.log(response.message);
      }else{
        let negotiate;
              if(response.data.is_negotiable == 1){
                negotiate = 
                  `YES`;
              }else{
                negotiate = 
                  `NO`;
              }
        console.log(response.data.crop_request[0]);
        let count = response.data.crop_request[0];
          $('#croptype').text(response.data.type);
          $('#user_id').text(response.data.user_id);
          $('#application').text(response.data.application);
          $('#firstName').text(response.data.user.first_name);
          $('#lastName').text(response.data.user.last_name);
          $('#lastName').text(response.data.user.last_name);
          $('#description').text(response.data.description);
          $('#cropTitle').text(response.data.title);
          $('#vidfed').text(response.data.video);
          $('#package').text(response.data.packaging);
          $('#currency').text(response.data.currency);
          $('#negotiate').text(negotiate);
          
          // specification
          $('#price').text(response.data.specification.price);
          $('#quantity').text(response.data.specification.qty);
          $('#grainSize').text(response.data.specification.grain_size);
          $('#hardness').text(response.data.specification.hardness);
          $('#acid').text(response.data.specification.acid_ash);
          $('#color').text(response.data.specification.color);
          $('#curcumin_content').text(response.data.specification.curcumin_content);
          $('#rotten_shriveled').text(response.data.specification.rotten_shriveled);
          $('#infestation').text(response.data.specification.infestation);
          $('#splits').text(response.data.specification.splits);
          $('#insect').text(response.data.specification.dead_insect);
          $('#mammalian').text(response.data.specification.mammalian);
          $('#testweight').text(response.data.specification.test_weight);
          $('#modeltype').text(response.data.specification.model_type);
          $('#defects').text(response.data.specification.total_defects);
          $('#dk').text(response.data.specification.dk);
          $('#moist').text(response.data.specification.moisture);
          $('#dock').text(response.data.specification.dockage);
          $('#mold').text(response.data.specification.mold);
          $('#unit').text(response.data.specification.unit);
          $('#drying').text(response.data.specification.drying_process);
          $('#oil').text(response.data.specification.oil_content);
          $('#extranous').text(response.data.specification.extraneous);
          $('#Volatile').text(response.data.specification.volatile);
          $('#weevil').text(response.data.specification.weevil);
          $('#drying').text(response.data.specification.drying_process);
          // crop request 
          $('#country').text(count.country);
          $('#address').text(count.address);
          $('#zipCode').text(count.zip);
          $('#cropId').text(count.crop_id);
          $('#lastUpdate').text(count.updated_at);
          $('#state').text(count.state);
          $('#deliveryMethod').text(count.delivery_method);
          $('#deliveryWindow').text(count.delivery_window);
          $('#deliveryDate').text(count.delivery_date);
          // crop request end

          
       }
        // loader('#tbdata')
        // $('#tbdata').html(rowContent);
    });
  }






  /* -------------------------------------------------------------------------- */
  /*                             Crop offered begins                            */
  /* -------------------------------------------------------------------------- */
  function cropsOffered (){
  
    loader('#cropofferdata', 10)
  
    var settings = querySetting("api/admin/crop/getbycropoffer", "GET", localStorage.getItem('access'));
      
    $.ajax(settings).done(function (data) {
      let response = data;
      console.log(response);
  
    if(response.error==true){
        console.log(response.message);
       
    }else{
        console.log(response.data)
        let thedata = response.data;
        thedata = thedata.rows
        if(thedata.length > 0){
            let rowContent
            $.each(thedata, (index, row) => {
            
                let crop_status;
                if(row.user.status == 1){
                  crop_status = 
                    `<div class="py-1 text-center rounded-pill successalert">
                      <span class="rounded-circle p-1 dot d-inline-block"></span>
                      <strong class="text-success" style="font-size:12px;">ACTIVE</strong>
                    </div>`;
                }else{
                  crop_status = 
                    `<div class="py-1 text-center rounded-pill past-due">
                      <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                      <strong class="text-past"  style="font-size:12px;">IN ACTIVE</strong>
                    </div>`;
                }
                
                index= index+1;
                rowContent += `
                <tr class="align-items-center">
                <td style="min-width: 50px;">${index}</td>
                <td style="min-width: 120px;"><strong class="text-secondary">${row.user.first_name} ${row.user.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.user.type}</small>
                </td>
                <td style="min-width: 100px;" class="text-primary">${row.user.email}</td>
                <td style="min-width: 100px;"><strong class="text-capitalize">${row.category.type}</strong> <br> <small class="text-primary fw-bold text-uppercase">${row.title}</small> </td>
                <td style="min-width: 100px; text-align:center;">${crop_status}</td>
                <td style="min-width: 200px;">${row.description}</td>
                <td style="min-width: 50px;">
                <button type="button" class="btn btn-sm th-btn text-white fs-9 rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                    VIEW
                </button>
                
                <!-- Modal -->
                <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                        <h3 class="modal-title">Crop Specification</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
  
                        <div class="">
                                      <div class="">
                                          <!---->
                                          <div class="">
                                              <h3>Wanted</h3>
                                              <hr/>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Acid Ash</h3>
                                                    <h6>${row.specification.acid_ash}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Broken Grains</h3>
                                                    <h6>${row.specification.broken_grains}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Color</h3>
                                                  <h6>${row.specification.color}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Curcumin Content</h3>
                                                    <h6>${row.specification.curcumin_content}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Dead Insect</h3>
                                                    <h6>${row.specification.dead_insect}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>DK</h3>
                                                  <h6>${row.specification.dk}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Drying Process</h3>
                                                    <h6>${row.specification.drying_process}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Extraneous</h3>
                                                    <h6>${row.specification.extraneous}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Foreign Matter</h3>
                                                  <h6>${row.specification.foreign_matter}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Grain Size</h3>
                                                    <h6>${row.specification.grain_size}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Hardness</h3>
                                                    <h6>${row.specification.hardness}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Hectoliter</h3>
                                                  <h6>${row.specification.hectoliter}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Infestation</h3>
                                                    <h6>${row.specification.infestation}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Mammalian</h3>
                                                    <h6>${row.specification.mammalian}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Model Type</h3>
                                                  <h6>${row.specification.model_type}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Moisture</h3>
                                                    <h6>${row.specification.moisture}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Mold</h3>
                                                    <h6>${row.specification.mold}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>OIl Content</h3>
                                                  <h6>${row.specification.oil_content}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Price</h3>
                                                    <h6>${row.specification.price}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Quantity</h3>
                                                    <h6>${row.specification.qty}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Rotten Shriveled</h3>
                                                  <h6>${row.specification.rotten_shriveled}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Splits</h3>
                                                    <h6>${row.specification.splits}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Test Weight</h3>
                                                    <h6>${row.specification.test_weight}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Total Defects</h3>
                                                  <h6>${row.specification.total_defects}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Unit</h3>
                                                    <h6>${row.specification.unit}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Volatile</h3>
                                                    <h6>${row.specification.volatile}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Weevil</h3>
                                                  <h6>${row.specification.weevil}</h6>
                                                </div>
                                              </div>
  
                                              
                                              
                                          </div>
                                          <!---->
                                      </div>
                                  </div>
  
                        
                        </div>
                        <div class="modal-footer border-0">
                        <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                    </div>
                </div>
                </td>
              
              
                <td style="min-width: 50px; cursor:pointer;">
                  <a href="javascript:void(0)" class="success-color" onclick="viewMoreCrop('${row.id}')">View More</a>
                </td>
                
  
              </tr>
                `;
              });
              $('#cropofferdata').html(rowContent);
              $(document).ready( function () {
                $('#allTable').DataTable({
                  scrollY: 300,
                  scrollX: true,
                  scrollCollapse: true,
                  retrieve: true,
                  paging: true,
                  "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                  fixedHeader:{
                      header: true,
                      footer: true
                  }
                });
              });
        }else{
            $('#cropofferdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Crop registered yet</h3></td></tr>");
        }
    }
    });
  
  };

  /* -------------------------------------------------------------------------- */
  /*                               Crop Offers end                              */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                             Crop Auction begins                            */
  /* -------------------------------------------------------------------------- */
function cropsAuctioned (){
  
    loader('#cropauctiondata', 10)
  
    var settings = querySetting("api/admin/crop/getbycropauction", "GET", localStorage.getItem('access'));
      
    $.ajax(settings).done(function (data) {
      let response = data;
      console.log(response);
  
    if(response.error==true){
        console.log(response.message);
       
    }else{
        console.log(response.data)
        let thedata = response.data;
        thedata = thedata.rows
        if(thedata.length > 0){
            let rowContent
            $.each(thedata, (index, row) => {
            
                let crop_status;
                if(row.user.status == 1){
                  crop_status = 
                    `<div class="py-1 text-center rounded-pill successalert">
                      <span class="rounded-circle p-1 dot d-inline-block"></span>
                      <strong class="text-success" style="font-size:12px;">ACTIVE</strong>
                    </div>`;
                }else{
                  crop_status = 
                    `<div class="py-1 text-center rounded-pill past-due">
                      <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                      <strong class="text-past"  style="font-size:12px;">IN ACTIVE</strong>
                    </div>`;
                }
                
                index= index+1;
                rowContent += `
                <tr class="align-items-center">
                <td style="min-width: 50px;">${index}</td>
                <td style="min-width: 120px;"><strong class="text-secondary">${row.user.first_name} ${row.user.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.user.type}</small>
                </td>
                <td style="min-width: 100px;" class="text-primary">${row.user.email}</td>
                <td style="min-width: 100px;"><strong class="text-capitalize">${row.category.type}</strong> <br> <small class="text-primary fw-bold text-uppercase">${row.title}</small> </td>
                <td style="min-width: 100px; text-align:center;">${crop_status}</td>
                <td style="min-width: 200px;">${row.description}</td>
                <td style="min-width: 50px;">
                <button type="button" class="btn btn-sm th-btn text-white fs-9 rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                    VIEW
                </button>
                
                <!-- Modal -->
                <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0">
                        <h3 class="modal-title">Crop Specification</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
  
                        <div class="">
                                      <div class="">
                                          <!---->
                                          <div class="">
                                              <h3>Wanted</h3>
                                              <hr/>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Acid Ash</h3>
                                                    <h6>${row.specification.acid_ash}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Broken Grains</h3>
                                                    <h6>${row.specification.broken_grains}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Color</h3>
                                                  <h6>${row.specification.color}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Curcumin Content</h3>
                                                    <h6>${row.specification.curcumin_content}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Dead Insect</h3>
                                                    <h6>${row.specification.dead_insect}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>DK</h3>
                                                  <h6>${row.specification.dk}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Drying Process</h3>
                                                    <h6>${row.specification.drying_process}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Extraneous</h3>
                                                    <h6>${row.specification.extraneous}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Foreign Matter</h3>
                                                  <h6>${row.specification.foreign_matter}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Grain Size</h3>
                                                    <h6>${row.specification.grain_size}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Hardness</h3>
                                                    <h6>${row.specification.hardness}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Hectoliter</h3>
                                                  <h6>${row.specification.hectoliter}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Infestation</h3>
                                                    <h6>${row.specification.infestation}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Mammalian</h3>
                                                    <h6>${row.specification.mammalian}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Model Type</h3>
                                                  <h6>${row.specification.model_type}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Moisture</h3>
                                                    <h6>${row.specification.moisture}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Mold</h3>
                                                    <h6>${row.specification.mold}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>OIl Content</h3>
                                                  <h6>${row.specification.oil_content}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Price</h3>
                                                    <h6>${row.specification.price}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Quantity</h3>
                                                    <h6>${row.specification.qty}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Rotten Shriveled</h3>
                                                  <h6>${row.specification.rotten_shriveled}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Splits</h3>
                                                    <h6>${row.specification.splits}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Test Weight</h3>
                                                    <h6>${row.specification.test_weight}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Total Defects</h3>
                                                  <h6>${row.specification.total_defects}</h6>
                                                </div>
                                              </div>
  
                                              <div class="d-block d-md-flex justify-content-around align-items-center pe-1 ps-1 mb-3">
                                                <div class="col-4">
                                                    <h3>Unit</h3>
                                                    <h6>${row.specification.unit}</h6>
                                                </div>
                                                <div class="col-4">
                                                    <h3>Volatile</h3>
                                                    <h6>${row.specification.volatile}</h6>
                                                </div>
                                                <div class="col-4">
                                                  <h3>Weevil</h3>
                                                  <h6>${row.specification.weevil}</h6>
                                                </div>
                                              </div>
  
                                              
                                              
                                          </div>
                                          <!---->
                                      </div>
                                  </div>
  
                        
                        </div>
                        <div class="modal-footer border-0">
                        <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                    </div>
                </div>
                </td>
              
              
                <td style="min-width: 50px; cursor:pointer;">
                  <a href="javascript:void(0)" class="success-color" onclick="viewMoreCrop('${row.id}')">View More</a>
                </td>
                
  
              </tr>
                `;
              });
              $('#cropauctiondata').html(rowContent);
              $(document).ready( function () {
                $('#allTable').DataTable({
                  scrollY: 300,
                  scrollX: true,
                  scrollCollapse: true,
                  retrieve: true,
                  paging: true,
                  "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                  fixedHeader:{
                      header: true,
                      footer: true
                  }
                });
              });
        }else{
            $('#cropauctiondata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Crop registered yet</h3></td></tr>");
        }
    }
    });
  
  };

/* -------------------------------------------------------------------------- */
/*                             CROP DATA ENDS HERE                            */
/* -------------------------------------------------------------------------- */