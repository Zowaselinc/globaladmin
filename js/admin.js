
/* -------------------------------------------------------------------------- */
/*                          load profile image begins                         */
/* -------------------------------------------------------------------------- */
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
      $('#imagePreview').hide();
      $('#imagePreview').fadeIn(650);
    }
    reader.readAsDataURL(input.files[0]);
  }
}
$("#imageUpload").change(function () {
  readURL(this);
});
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

  return date + "<br/>" + time;
}

/* ---------------------------- Spliting end here --------------------------- */




/* ----------------------------- activate loader ---------------------------- */
const loader = (contentArea = "", colspan = "") => {
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
    "url": `https://adminapi.growsel.com/${URL}`,
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


// for landing
const urlSetup = (URL, METHOD, DATA = {}) => {
  const settings = {
    "url": `https://api.studioxcreative.ng/api/${URL}`,
    "method": METHOD,
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer 30fb714e913879f2f6b0f3d7b3be13aa64366669ad8b1e20937b49a28619e0db097017fe01280c9489e02cfe493687e6646e3bd013adeadb8390adaff6630a590e90e2225eb6b067cb0a7ead4c84d328b24f8303b9c809d9f6af3dd359d4065b2872f4dc9a710d473c8dd7d3868117533051212c69805b76212856c8e8c57ee6",
      "Content-Type": "application/json"
    },
    data: DATA
  }

  return settings;
}

// for data image
const dataImage = (DATA = {}) => {
  const settings = {
    "url": `https://filesapi.growsel.com/upload.php`,
    "method": "POST",
    "timeout": 0,
    "headers": {
      "processData": false,
      "contentType": false,
    },
    data: DATA
  }

  return settings;
}

/* -------------------------------------------------------------------------- */
/*                     EDITITNG THE LANDING PAGE VIA ADMIN STARTS                   */
/* -------------------------------------------------------------------------- */


const landingPage =()=>{
  loader('#homeLanding', 7);
  var settings = {
    "url": "http://192.168.1.111:1337/api/pages",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer a9a5d26cc0936b2a477a80f27fcb060c9ea04d9e4729b82bdcbae1e9846906964157c1162f61ae869a0e669ec2901bcecd02eb2121d05e13f9158b45e7f7443fa4ba8cd1ed81d53c87b4500fdf40be7871a3436fe2846b7ae60487b929adf8cd98676722d8a325a0461763132f4c2a026af0ef1d89702e05d9db7a8a826f67ed"
    },
  };
  
  $.ajax(settings).done(function (response) {
    // console.log(response.data, "dadad");
    console.log(JSON.parse(JSON.stringify(response.data)), "wwwww");
    // console.log(JSON.parse(response.data.attributes), "attrtr")
    // $("#homeLanding").append(response.data.attributes.pagecontent)
    if (response.error == true) {
    } else {
      let thedata = JSON.parse(JSON.stringify(response.data));
      console.log(thedata , "ddddddd")
      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {

          index = index + 1;
          rowContent += `<tr class="align-items-middle">
                      <td style="min-width: 50px;"><span class="align-items-center">${index}</span></td>
                      <td style="min-width: 100px;"><strong class="text-uppercase welcome fw-bold">${row.attributes.pagetitle}</strong></td>
                      <td style="min-width: 100px;"><a href="javascript:void(0)" onclick="editPageContent('${row.id}')" class="btn btn-lg th-btn text-white" style="border-radius:3px !important;">EDIT</a></td>
                  </tr>`;
          $('#homeLanding').html(rowContent);

          $(document).ready(function () {
            $('#allTable').DataTable({
              scrollY: 300,
              scrollX: true,
              scrollCollapse: true,
              retrieve: true,
              paging: true,
              "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
              fixedHeader: {
                header: true,
                footer: true
              }
            });
          });
        });
      } else {
        $('#homeLanding').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No users registered yet</h3></td></tr>");
      }
    }
  });
}
const editPageContent=(id)=>{
  // alert(id)
  sessionStorage.setItem('pageID', JSON.stringify({ id: id}));
  // localStorage.setItem('singleAdminData', id);
  // window.location.href = "viewadmin.html";
}
/* -------------------------------------------------------------------------- */
/*                     EDITITNG THE LANDING PAGE VIA ADMIN ENDS                   */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                         FETCHING USER STATS BEGINS                         */
/* -------------------------------------------------------------------------- */

function getUsersStats() {
  adminName();
  // alert(localStorage.getItem('access'));
  var settings = querySetting("api/admin/users/getstats", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    // console.log(data);
    let response = data;
    // console.log(response);
    if (response.error == true) {
      // console.log(response.message);
    } else {
      let count = response.data[0];
      // Total users 
      $('#totalusers').text(count.Totalusers);
      $('#verifieduser').text(count.VerifiedUsers);
      $('#activeuser').text(count.ActiveUsers);
      // Total Merchants 
      $('#totalmerchant').text(count.TotalMerchant);
      $('#verifiedmerchant').text(count.VerifiedMerchants);
      $('#activemerchant').text(count.ActiveMerchants);
      // Total Corporates 
      $('#totalcorporates').text(count.TotalCorporate);
      $('#verifiedcorporate').text(count.VerifiedCorporate);
      $('#activecorporate').text(count.ActiveCorporate);
      // Total Agents 
      $('#toatalagent').text(count.TotalAgent);
      $('#verifiedagent').text(count.VerifiedAgent);
      $('#activeagent').text(count.ActiveAgent);
      // Total Partners 
      $('#toatlpartners').text(count.TotalPartners);
      $('#verifiedpartners').text(count.VerifiedPartner);
      $('#activepartners').text(count.ActivePartner);
    }
  });
}

const adminName = () => {
  let admin = JSON.parse(localStorage.getItem('admin'));
  $('#admin_name').text(admin.first_name + " " + admin.last_name);
  // console.log(admin.first_name+" "+admin.last_name);
  // console.log(admin);
}



/* -------------------------------------------------------------------------- */
/*                          FETCHING USER STATS ENDS                          */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                    FETCHING ADMINISTRATIVE ROLES BEGINS                    */
/* -------------------------------------------------------------------------- */
const toggleSpinner = () => {
  document.querySelector('#spinner').classList.toggle('d-none');
}

function fetchAllroles() {
  loader('#tbdata', 7);


  var settings = querySetting("api/admin/roles/getall", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    //   console.log(data);
    //   let response = JSON.parse(data);
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
      $('#tbdata').html("<tr>" + response.message + "</tr>");
    } else {

      var rowContent;
      let thedata = (response.data).reverse();
      $.each(thedata, (index, row) => {

        index = index + 1;
        rowContent
          += `<tr class="align-items-center">
                <td style="min-width: 10px !important;"><span>${index}</span></td>
                <td style="min-width: 100px !important;"><span>${row.role_name}</span></td>
                <td style="min-width: 130px !important;"><span>${row.role_description}</span></td>
                <td style="min-width: 100px !important;"><span>${splittingDate(row.created_at)}</span></td>
                <td style="min-width: 100px;"><span>${splittingDate(row.updated_at)}</span></td>
                <td class="text-center" style="min-width: 140px;">
                <button class="btn btn-sm th-btn fs-9 text-white rounded-6 text-end me-3" onclick="editRole('${row.id}', '${row.role_name}', '${row.role_description}', '${row.section}')">Update</button>
                <button class="btn btn-sm btn-danger fs-9 rounded-6" onclick="deleteadminRole('${row.id}')">Delete</button>
                </td>
              </tr>`;
      });
      // alert(response.data.length);
      $('#tbdata').html(rowContent);
      $(document).ready(function () {
        $('#allTable').DataTable({
          scrollY: 300,
          scrollX: true,
          scrollCollapse: true,
          retrieve: true,
          paging: true,
          "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
          fixedHeader: {
            header: true,
            footer: true
          }
        });
      });


    }
  });
};

//   ------------------- FILLING ADMINISTRATIVE ROLE TABLE ENDS---------------------------//

// --------------------------------------- ADDING NEW DATA TO ADMINISTRATIVE ROLE TABLE BEGINS ---------------------------//

const addRole = () => {
  // toggleSpinner();

  // console.log(localStorage.getItem('access'));
  // selecting the input element and get its value
  let roleName = document.getElementById("role_name");
  let roleDescription = document.getElementById("role_description");
  let roleSections = $('#choices-multiple-remove-button');

  // Displaying the value 

  if (!roleName.value) {
    swal("Enter role!");
    roleName.focus();
    return false;
  } else if (!roleDescription.value) {
    swal("Enter description!");
    roleDescription.focus();
    return false;
  } else if (roleSections.val() == "") {
    swal("Select Section to Grant Access");
    roleSections.focus();
    return false;
  } else {

    const adminRole = JSON.stringify({
      "role_name": roleName.value,
      "role_description": roleDescription.value,
      "section": (roleSections.val()).toString(),
    });


    var settings = querySetting("api/admin/roles/add", "POST", localStorage.getItem('access'), adminRole);

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        // console.log(response.message);
        // toggleSpinner();
        swal("FAILED", response.message, "error");
      } else {
        // console.log(response.message);
        // toggleSpinner();
        swal("SUCCESS", response.message, "success");
        // roleName.value="";
        // roleDescription.value="";
        // roleSections.value="";
        window.location.href = "admin-role.html";
        setTimeout(() => {
          cancelRequest();
        }, 2000)
        fetchAllroles();
      }
    });
  }
};

//----------------------------- Getting all section-------------------------------//
const allSections = () => {
  var settings = querySetting("api/admin/section/getall", "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    let response = data.data;
    for (let i = 0; i < response.length; i++) {
      $('.choices').append(`<option value='${response[i].section_name}'> ${response[i].section_name} </option>`);
      if (i == response.length - 1) {
        $(document).ready(function () {
          var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
            removeItemButton: true,
            maxItemCount: 12,
            searchResultLimit: 11,
            renderChoiceLimit: 11
          });
          console.log(multipleCancelButton)
        });

      }
    }
  });
}
// ------------------------- ADDING ADMISTRATIVE ROLE ENDS------------------------------//



// -----------------------DELETING ADMINISTRATIVE ROLE BEGINS----------------------------// 

const deleteadminRole = (n) => {
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
          "url": "https://adminapi.growsel.com/api/admin/roles/delete/" + n,
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Authorization": localStorage.getItem('access')
          },
          "Content-Type": "application/json",
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
          if (response.error == true) {
            console.log(response.message);
            swal("FAILED", response.message, "error");
          } else {
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
  sessionStorage.setItem('roleData', JSON.stringify({ id: id, name: name, description: description }));
  window.location.href = "update-role.html";
  // console.log(roleData)
}

const checkr = () => {

  let data = JSON.parse(sessionStorage.getItem('roleData'));
  if (data !== undefined || data !== null || data !== '') {
    $('#role_name').val(data.name);
    $('#role_description').val(data.description);
    // $('#choices-multiple-remove-button').val(data.section);
  }
  // console.log($('#choices'))
  // console.log(data.section)
}

/* --------------------------- cancel edit request -------------------------- */
const cancelRequest = () => {
  sessionStorage.removeItem('roleID');
  window.location.href = "admin-role.html ";

  // clears the inputs
  $('#role_name').val("");
  $('#role_description').val("");

  // hides the update and cancel btn while displaying the add role btn
  if ((window.location.href).split('#')[1] !== 'role-section') {
    document.querySelector('#editBtn').classList.toggle('d-none');
    // document.querySelector('#addBtn').classList.toggle('d-none');
    document.querySelector('#cancelBtn').classList.toggle('d-none');
  }
}



const updateAdminRole = () => {


  let adminRoleid = JSON.parse(sessionStorage.getItem('roleData')).id;
  // console.log(localStorage.getItem(roleData));
  // selecting the input element and get its value
  let roleName = document.getElementById("role_name");
  let roleDescription = document.getElementById("role_description");
  // let roleSections = $('#choices-multiple-remove-button');

  // Displaying the value 
  // swal("", roleName), ""
  if (!roleName.value) {
    swal("Enter role!");
    roleName.focus();
    return false;
  } else if (!roleDescription.value) {
    swal("Enter description!");
    roleDescription.focus();
    return false;
  } else {

    const adminRole = JSON.stringify({
      "id": adminRoleid,
      "role_name": roleName.value,
      "role_description": roleDescription.value,
      "choices-multiple-remove-button": roleSections.value
    });

    var settings = querySetting("api/admin/roles/edit", "POST", localStorage.getItem('access'), adminRole);

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {

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

function fetchAlladmin() {
  loader('#admindata', 14)

  var settings = querySetting("api/admin/getall", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (response) {
    console.log(response);
  });

  $.ajax(settings).done(function (data) {
    //   console.log(data);
    //   let response = JSON.parse(data);
    let response = data;
    // console.log(response);
    if (response.error == true) {
      // console.log(response.message);
      $('#admindata').html("<tr>" + response.message + "</tr>");
    } else {
      let thedata = (response.data).reverse();
      let rowContent;
      $.each(thedata, (index, row) => {

        let status;
        if (row.status == 0) {
          status = `
                  <div class="py-1 pe-3 ps-2 text-center rounded-pill past-due">
                    <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                    <strong class="text-past fs-9">IN ACTIVE</strong>
                  </div>
                `;
        } else {
          status = `
                <div class="py-1 pe-3 ps-2 text-center rounded-pill successalert">
												<span class="rounded-circle p-1 dot d-inline-block me-1"></span>
												<strong class="text-success fs-9">ACTIVE</strong>
									</div>
                `;
        }


        index = index + 1;
        rowContent
          += `<tr class="align-items-center">
                    <td><span>${index}</span></td>
                    <td><strong class="welcome">${row.first_name}</strong></td>
                    <td><strong class="welcome">${row.last_name}</strong></td>
                    <td class="text-primary"><span>${row.email}</span></td>
                    <td><span class="welcome">${row.phone}</span></td>
                    <td>
                      <a href="javascript:void(0)" onclick="viewAdministrator('${row.id}','${row.name}')">
                        <span class="text-primary">
                          <i class="fa fa-eye"></i> View
                        </span>
                      </a>
                    </td> 
                   <!-- <td style="min-width: 150px; "><span>
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
                    </td> -->
                    
                    <td>${status}</td>
                    <td><span>${splittingDate(row.created_at)}</span></td>
                    <td><span>${splittingDate(row.updated_at)}</span></td>
                    <td class="text-end"><span>
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

      $(document).ready(function () {
        $('#allTable').DataTable({
          scrollY: 300,
          scrollX: true,
          scrollCollapse: true,
          retrieve: true,
          paging: true,
          "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
          fixedHeader: {
            header: true,
            footer: true
          }
        });
      });

    }
  });
}

// ---------------------------View single admin 
const viewAdministrator = (id) => {
  // alert(id);
  localStorage.setItem('singleAdminData', id);
  window.location.href = "viewadmin.html";
}

const ViewAdministrator = () => {


  var settings = querySetting("api/admin/getbyid/" + localStorage.getItem('singleAdminData'), "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    // console.log(data);
    let response = data;
    // console.log(response);
    if (response.error == true) {
      console.log(response.message);
    } else {

      console.log(response.data)

      $('#firstName').text(response.data.first_name);
      $('#lastName').text(response.data.last_name);
      $('#roleName').text(response.data.role.role_name);
      $('#email').text(response.data.email);
      $('#mobile').text(response.data.phone);
      $('#description').text(response.data.role.role_description);
      $('#recovery').text(response.data.recovery_phrase);
      $('#section').text(response.data.role.section);
      $('#section').text(response.data.section);
      $('#datecreated').text(response.data.created_at);
      $('#dateupdated').text(response.data.updated_at);

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
          "url": `https://adminapi.growsel.com/api/admin/deletebyadminid/${id}`,
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Authorization": localStorage.getItem('access')
          },
        };

        $.ajax(settings).done(function (response) {
          console.log(response);
          if (response.error == true) {
            swal("FAILED", response.message, "error");
          } else {
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
  let updateData = JSON.stringify({ "id": id, "adminid": adm_id, "firstname": fn, "lastname": ln, "mobile": mb, "role": role });
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
  if (!firstName.value) {
    swal("Enter first name!");
    firstName.focus();
    return false;
  } else if (!lastName.value) {
    swal("Enter last name!");
    lastName.focus();
    return false;
  } else if (!adminMobile.value) {
    swal("Enter mobile number!");
    adminMobile.focus();
    return false;
  } else if (!adminRole.value) {
    swal("Enter admin role!");
    adminRole.focus();
    return false;
  } else {
    let roleid =  adminRole.value.split(",")[0];
    console.log(roleid);
    var settings = {
      "url": "https://adminapi.growsel.com/api/admin/editbyadminid",
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
        "role_id": ""+roleid,
        "role_name": adminRole.value.split(",")[1],
      }),
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {
        console.log(response.message);
        swal("SUCCESS", response.message, "success");
        sessionStorage.removeItem('singleadminid')
        first_name.value = "";
        last_name.value = "";
        adminMobile.value = "";
        role.value = "";
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
    $('#role option[value="' + adminData.role + '"]').attr("selected", "selected");
  }, 2000);
}


const removeSession = () => {
  localStorage.removeItem('singleadmindata');
  window.location.href = "alladministrators.html";
}

/* ------------------- UPDATING AN ADMINISTRATOR ENDS HERE ------------------ */


/* ------------------- ADDING AN ADMINISTRATOR STARTS HERE ------------------ */

const addAdmin = () => {
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
  if (!firstName.value) {
    swal("Enter first name!");
    firstName.focus();
    return false;
  } else if (!lastName.value) {
    swal("Enter last name!");
    lastName.focus();
    return false;
  } else if (!adminMail.value) {
    swal("Enter mail!");
    adminMail.focus();
    return false;
  } else if (!adminPassword.value) {
    swal("Enter password!");
    adminPassword.focus();
    return false;
  } else if (!adminMobile.value) {
    swal("Enter mobile number!");
    adminMobile.focus();
    return false;
  } else if (!adminRole.value) {
    swal("Enter admin role!");
    adminRole.focus();
    return false;
    // }else if(!adminRecovery.value){
    //     swal("Enter recovery phase!");
    //     adminRecovery.focus();
    //     return false;
  } else {

    var settings = {
      "url": "https://adminapi.growsel.com/api/admin/add",
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
        "role_id": adminRole.value.split(",")[0],
        "role_name": adminRole.value.split(",")[1],
      }),
    };
    // console.log(settings.data)

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {
        console.log(response.message);
        swal("SUCCESS", response.message, "success");
        firstName.value = "";
        lastName.value = "";
        adminMail.value = "";
        adminPassword.value = "";
        adminMobile.value = "";
        adminRole.value = "";
        fetchAllroles();
      }
    });
  }
};


// get all admin roles
const allRoles = () => {

  var settings = querySetting("api/admin/roles/getall", "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    let response = data.data;
    for (let i = 0; i < response.length; i++) {
      $('#role').append(`<option value='${response[i].role_id},${response[i].role_name}'>${response[i].role_name}</option>`);
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

function fetchAllusers() {
  loader('#allusers', 8)

  var settings = querySetting("api/admin/users/getall", "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      console.log(response.message);
    } else {
      let thedata = response.data;
      if (thedata.length > 0) {
        let rowContent
        let user;
        $.each(thedata, (index, row) => {
          console.log(thedata);

          if(!row.user){
            // user=`<td>in complete data</td>`
          }else{
           user = row.user
          }

          let userStatus, verificationStatus;
          if (user.status == 1) {
            userStatus = `<span class="text-success">Active</span>`;
          } else {
            userStatus = `<span class="text-danger">Inactive</span>`;
          }

          if (user.is_verified == 0) {
            verificationStatus = `<span class="text-danger">Not Verified</span>`;
          } else {
            verificationStatus = `<span class="text-success">Verified</span>`;
          }

          index = index + 1;
          rowContent += `<tr class="align-items-center">
                      <td style="min-width: 50px;"><span>${index}</span></td>
                      <td style="min-width: 170px;">
                          <strong class="text-secondary">${user.first_name} ${user.last_name}</strong><br/>
                          <small class="text-primary fw-bold text-uppercase">${user.type}</small>
                      </td>
                      <td style="min-width: 150px;" class="text-primary">${user.email}</td>
                      <td style="min-width: 120px;">${user.phone}</td>
                      <td style="min-width: 170px;">${verificationStatus}</td>
                      <td style="min-width: 80px;">${userStatus}</td>
                      <td style="min-width: 120px;">${(row.created_at).split("T")[0]}</td>
                      <td style="min-width: 120px;">${(row.updated_at).split("T")[0]}</td>
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
                      </td> 

                  </tr>`;
          $('#allusers').html(rowContent);

          $(document).ready(function () {
            $('#allTable').DataTable({
              scrollY: 300,
              scrollX: true,
              scrollCollapse: true,
              retrieve: true,
              paging: true,
              "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
              fixedHeader: {
                header: true,
                footer: true
              }
            });
          });
        });
      } else {
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
let offset = 0;
let limit = 50;
function fetchAllactivity(offset,limit) {

  loader('#activitylog', 14)
  let url = `api/admin/activitylog/getallparams/${offset}/${limit}`;
  console.log(url)
  var settings = querySetting(url, "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    console.log(data);

    let response = data;
    // console.log(response);
    if (response.error == true) {
      console.log(response.message);
      $('#activitylog').html("<tr>" + response.message + "</tr>");
    } else {
      let thedata = (response.data).reverse();
      let rowContent;
      $.each(thedata, (index, row) => {
        index = index + 1;

        let theadmin;
        if (!row.theadmin) {
          theadmin = `<p>Null</p>`;
        } else {
          theadmin = row.theadmin
        }

        // let theadmindata = JSON.stringify(row.theadmin);
        // console.log(JSON.stringify(row.theadmin))
        rowContent
          += `<tr class="align-items-center">
              <td style="min-width: 10px;">${index}</td>
              $.<td style="max-width: 120px;">${row.page_route}</td>
                  <td style="max-width: 170px;">${row.admin_id}</td>
                  <td style="min-width: 200px;">${row.section_accessed}</td>
                  <td style="min-width: 120px;">${row.action}</td>
                  <td style="min-width: 120px;">${theadmin.role_name}</td>
                  <td style="min-width: 120px;">${theadmin.first_name} <br> ${theadmin.last_name}</td>
                  <td style="min-width: 120px;">${(row.created_at).split("T")[0]}</td>
                 
                 </tr>`;
      });

      $('#activitylog').html(rowContent);
      // Calling the pagination function declared
      $(document).ready(function () {
        $('#allTable').DataTable({
          scrollY: 300,
          scrollX: true,
          scrollCollapse: true,
          retrieve: true,
          paging: true,
          "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
          fixedHeader: {
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

$('#mpaginate').on('click',function(){

      /* ----------- Auto increment offset by 50 everytime it is clicked ---------- */
      offset+=50;
      limit+=50;

    //  alert(offset);
      /* ------------------- call fetch function to show result ------------------- */
      fetchAllactivity(offset,limit);



})

/* -------------------------------------------------------------------------- */
/*                            ACTIVITY LOG ENDS HERE                            */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                            ERROR LOG STARTS HERE                           */
/* -------------------------------------------------------------------------- */

function fetchAllErrorlog() {

  loader('#errordata', 14)

  var settings = {
    "url": "https://adminapi.growsel.com/api/admin/errolog/getall",
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
    if (response.error == true) {
      $('#errordata').html("<tr>" + response.message + "</tr>");
    } else {
      let thedata = (response.data).reverse();
      let rowContent;
      $.each(thedata, (index, row) => {

        index = index + 1;
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

      $(document).ready(function () {
        $('#allTable').DataTable({
          scrollY: 300,
          scrollX: true,
          scrollCollapse: true,
          retrieve: true,
          paging: true,
          "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
          fixedHeader: {
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
    if (response.error == true) {
      swal("FAILED", response.message, "error");
    } else {
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
function fetchAlltickets() {

  loader('#ticketdata', 14)

  var settings = querySetting("api/admin/ticket/getall", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      console.log(response.message);
    } else {
      let thedata = response.data;
      let rowContent = "";
      let index;
      console.log(thedata, "erfrefre");
      if (thedata.length > 0) {
        for (let i = 0; i < thedata.length; i++) {
          // console.log('Hello World', + i);
          let ticket_status;
          let row = thedata[i];
          // console.log(row, "rowwwww");
          if (row.ticket_status == 1) {
            ticket_status =
              `<div class="py-1 pe-3 ps-2 text-center successalert">
                  <span class="rounded-circle p-1 dot d-inline-block me-1"></span>
                  <strong class="text-success" style="font-size: 12px;">OPEN</strong>
                  </div>`;
          } else {
            ticket_status =
              `<div class="py-1 pe-3 ps-2 text-center past-due">
                    <span class="rounded-circle p-1 past d-inline-block me-1"></span>
                    <strong class="text-past" style="font-size: 12px;">CLOSED</strong>
                  </div>`;
          }

          let priority;
          if (row.priority == 1) {
            priority = `
									  	<div class=" bg-light px-2 py-1 fw-bold welcome text-center" style="font-size: 12px !important;">High</div>
               `;
          }
          else {
            priority = `
									  	<div class="bg-light px-2 py-1 fw-bold welcome text-center" style="font-size: 12px !important;">Low</div>
               `;
          }

          index = i + 1;
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



      } else {
        $('#ticketdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Ticket registered yet</h3></td></tr>");
      }

      $(document).ready(function () {
        $('#allTable').DataTable({
          scrollY: 300,
          scrollX: true,
          scrollCollapse: true,
          paging: true,
          "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
          fixedHeader: {
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
    if (response.error == true) {
      swal("FAILED", response.message, "error");
    } else {
      swal("SUCCESS", response.message, "success");
      fetchAlltickets();
    }

  });
}

/* ---------------------- Deleting support tickets end ---------------------- */


/* ------------------------- adding support tickets ------------------------- */

const addSupportTickets = () => {
  console.log(localStorage.getItem('access'));
  // selecting the input element and get its value
  let ticketUser = document.getElementById("users")
  let ticketSubject = document.getElementById("subject");
  let ticketPriority = document.getElementById("priority");
  let description = document.getElementById("description");

  // Displaying the value 
  // alert(roleName)
  if (!ticketUser.value) {
    swal("Select User!");
    ticketUser.focus();
    return false;
  } else if (!ticketSubject.value) {
    swal("Enter ticket subject!");
    ticketSubject.focus();
    return false;
  } else if (!ticketPriority.value) {
    swal("Select Priority!");
    ticketPriority.focus();
    return false;
  } else if (!description.value) {
    swal("Enter description!");
    description.focus();
    return false;
  } else {

    const ticketData = JSON.stringify({
      users: ticketUser.value,
      subject: ticketSubject.value,
      description: description.value,
      priority: ticketPriority.value,

      "userId": "unknown",

    });

    var settings = {
      "url": "https://adminapi.growsel.com/api/admin/ticket/add",
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
      if (response.error == true) {
        //   console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {
        //   console.log(response.message);
        swal("SUCCESS", response.message, "success");
        ticketUser.value = "";
        ticketSubject.value = "";
        ticketPriority.value = "";
        description.value = "";
      }
    });
  }
};

/* -------------------------- trigger create ticket ------------------------- */
$('#createTicket').click(addSupportTickets)


const allUsers = () => {
  var settings = {
    "url": "https://adminapi.growsel.com/api/admin/users/getall",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": localStorage.getItem('access')
    },
  };

  $.ajax(settings).done(function (data) {
    let response = data.data;
    for (let i = 0; i < response.length; i++) {
      $('#users').append(`<option value='${response[i].user.first_name} ${response[i].user.last_name}'>${response[i].user.first_name} ${response[i].user.last_name}</option>`);
    }
  });
}

// allUsers();
/* -------------------------------------------------------------------------- */
/*                               END OF SUPPORT    TICKET                          */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                           ORDERS STARTS HERE                             */
/* -------------------------------------------------------------------------- */

function fetchAllorders() {

  var settings = querySetting("api/admin/order/getall", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      console.log(response.message);
    } else {
      console.log(response.data)
      let thedata = response.data;
      // thedata = thedata.rows 

      if (thedata.length > 0) {
        console.log(length);


        let rowContent
        $.each(thedata, (index, row) => {
          let products = JSON.parse(row.products)
          console.log(products, "balaala")
          index = index + 1;
          rowContent += `<tr class="align-items-center">
              <td style="min-width: 50px;">${index}</td>
              <td style="min-width: 170px;" class="welcome"><strong class="welcome">${row.order_hash}</strong></td>
              <td style="min-width: 150px;"><strong class="welcome">${row.buyer.first_name}, ${row.buyer.last_name}</strong> 
                <br/>
                <h5 class="text-primary text-capitalize">${row.buyer.type}</h5>
              </td>
              <td style="min-width: 150px;"><strong class="welcome">${row.seller.first_name}, ${row.seller.last_name}</strong> 
                <br/>
                <h5 class="text-primary text-capitalize">${row.seller.type}</h5>
              </td>
              <td style="min-width: 100px;"><strong>${products[0].category.name}</strong> <br/> 
                 <h5 class="text-primary">${products[0].subcategory.name}</h5>
              </td>
              <td style="min-width: 100px;"><strong class="welcome text-primary text-uppercase">${products[0].type}</strong></td>
              <td style="min-width: 120px;"><strong class="welcome">NGN ${row.total}</strong></td>
              <td style="min-width: 120px;"><strong class="welcome">${row.payment_status}</strong></td>
              <td style="min-width: 100px;"><strong><a href="javascript:void(0)"  class="text-primary border border-success btn btn-md"  onclick="viewSingleOrder('${row.order_hash}')">VIEW</a></strong></td>
              
              <td style="min-width: 110px;">${(row.created_at).split("T")[0]}</td>
              <td style="min-width: 110px;">${(row.updated_at).split("T")[0]}</td>
             </tr>`;
          $('#ordersdata').html(rowContent);
          $(document).ready(function () {
            $('#allTable').DataTable({
              scrollY: 300,
              scrollX: true,
              scrollCollapse: true,
              retrieve: true,
              paging: true,
              "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
              fixedHeader: {
                header: true,
                footer: true
              }
            });
          });
        });
      } else {
        $('#ordersdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Order registered yet</h3></td></tr>");
      }
    }
  });

}

const viewSingleOrder = (orderid) => {
  // alert(orderid, "ffffffff");
  localStorage.setItem('singleOrderdata', orderid);
  window.location.href = "view-single-order.html";
}
const ViewOrder = () => {


  var settings = querySetting("api/admin/order/" + localStorage.getItem('singleOrderdata'), "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    // console.log(response);
    if (response.error == true) {
      // console.log(response.message);
    } else {
      console.log(response.data, "ooooo")
      let deliverywindow;
            if(!response.crop_request){
              deliverywindow = 
                ``;
            }else{
              deliverywindow =  response.crop_request
            }
            
      // console.log(response.data[0].category);

      let products = JSON.parse(response.data.products)
      console.log(products, "products");
      let waybill = JSON.parse(response.data.waybill_details)
      console.log(waybill, "waybill")
      let tracking = JSON.parse(response.data.tracking_details)
      console.log(tracking, "tracking")

  
      // let inputcategory = response.data[0].category;
      // let inputsubtegory = response.data[0].subcategory;
      $('#oredrid').text(response.data.order_hash);
      $('#BfirstName').text(response.data.buyer.first_name);
      $('#BlastName').html(response.data.buyer.last_name);
      $('#SfirstName').text(response.data.seller.first_name);
      $('#SlastName').text(response.data.seller.last_name);
      $('#amount').text(response.data.total);
      $('#amountdue').text(response.data.amount_due);
      $('#amountpaid').text(response.data.amount_paid);
      $('#paystatus').text(response.data.payment_status);

      $('#dwindow').text(deliverywindow.delivery_window);

      $('#categorysub').html(products[0].subcategory.name);
      $('#offertype').html(products[0].type);
      $('#cropqty').text(products[0].specification.qty);
      $('#warehouse').text(products[0].warehouse_address);
      $('#price').text(products[0].specification.price);
      $('#quantity').text(products[0].specification.qty);
      $('#grainSize').text(products[0].specification.grain_size);
      $('#hardness').text(products[0].specification.hardness);
      $('#acidash').text(products[0].specification.acid_ash);
      $('#color').text(products[0].specification.color);
      $('#curcumin_content').text(products[0].specification.curcumin_content);
      $('#rotten_shriveled').text(products[0].specification.rotten_shriveled);
      $('#infestation').text(products[0].specification.infestation);
      $('#splits').text(products[0].specification.splits);
      $('#insect').text(products[0].specification.dead_insect);
      $('#mammalian').text(products[0].specification.mammalian);
      $('#testweight').text(products[0].specification.test_weight);
      $('#modeltype').text(products[0].specification.model_type);
      $('#defects').text(products[0].specification.total_defects);
      $('#dk').text(products[0].specification.dk);
      $('#moist').text(products[0].specification.moisture);
      $('#dock').text(products[0].specification.dockage);
      $('#mold').text(products[0].specification.mold);
      $('#drying').text(products[0].specification.drying_process);
      $('#oil').text(products[0].specification.oil_content);
      $('#extranous').text(products[0].specification.extraneous);
      $('#Volatile').text(products[0].specification.volatile);
      $('#weevil').text(products[0].specification.weevil);
      $('#package').text(products[0].specification.mammalian);
      $('#broken').text(products[0].specification.broken_grains);
      $('#grainsize').text(products[0].specification.grain_size);
      $('#volatile').text(products[0].specification.volatile);
      $('#hecto').text(products[0].specification.hectoliter);
      $('#vidfed').text(products[0].video);


      $('#pickuplocation').text(tracking.pickup_location);
      $('#deliverylocation').text(tracking.delivery_location);
      $('#trackstatus').text(tracking.transit[0].status);
      $('#arrivdate').text(tracking.transit[0].date);

      
      
      $('#wdescription').html(waybill.dispatch_section.description);
      $('#wconsigne').text(waybill.dispatch_section.cosignee);
      $('#wdate').text(waybill.dispatch_section.date);
      $('#driver_name').text(waybill.dispatch_section.drivers_data.drivers_name);
      $('#driver_lincense').text(waybill.dispatch_section.drivers_data.driving_license);
      $('#tnumber').text(waybill.dispatch_section.truck_number);
    }
  });
}
/* -------------------------------------------------------------------------- */
/*                            ORDERS DATA ENDS HERE                           */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                            FETCH ALL NEGOTIATION                           */
/* -------------------------------------------------------------------------- */
function fetchAllnegotiation() {
  allAdmin()

  loader('#negotiationdata', 10)

  var settings = querySetting("api/admin/crop/conversation/getall", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      console.log(response.message);

    } else {
      // console.log(response.data)

      let thedata = response.data;
      // console.log(response.data)

      if (thedata.length > 0) {

        let thedata = (response.data).reverse();
        let rowContent;
        $.each(thedata, (index, row) => {

          // Show the crop category if available
          let cropCategory;
          if (!row.crop) {
            cropCategory = `<p>Null</p>`;
          } else {
            cropCategory = row.crop.category
          }
          // Show the crop subcategory if available
          let cropSubCategory;
          if (!row.crop) {
            cropSubCategory = `<span>Null</span>`;
          } else {
            cropSubCategory = row.crop.subcategory
          }
          // Show the crop type if available
          let cropType;
          if (!row.crop) {
            cropType = `<span>Null</span>`;
          } else {
            cropType = row.crop
          }
          // Show the created at date if available
          let cropCreateDate;
          if (!row.crop) {
            cropCreateDate = `<span>Null</span>`;
          } else {
            cropCreateDate = `${splittingDate(row.crop.created_at)}`
          }
          // Shw the updated date if available
          let cropUpdateDate;
          if (!row.crop) {
            cropUpdateDate = `<span>Null</span>`;
          } else {
            cropUpdateDate = `${splittingDate(row.crop.updated_at)}`
          }
          // Show user one if available
          let UserOne;
          if (!row.userone) {
            UserOne = `<p>Null</p>`;
          } else {
            UserOne = row.userone

          }


          // console.log(row.crop.type)
          console.log(index, "----", row);

          index = index + 1;
          rowContent += `<tr class="">
                <td style="min-width: 50px;">${index}</td>
                <td style="min-width: 100px;"><strong class="welcome">${UserOne.first_name}, ${UserOne.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${UserOne.type}</small> 
                </td>
                <td style="min-width: 100px;"><strong class="welcome">${row.usertwo.first_name}, ${row.usertwo.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.usertwo.type}</small> 
                </td>
                <td style="min-width: 50px;"> <strong class="text-uppercase text-primary">${cropType.type}</strong></td>
                <td style="min-width: 100px;"><strong class="welcome">${cropCategory.name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${cropSubCategory.name}</small> 
                </td>
                <td style="min-width: 100px;">${cropCreateDate}</td>
                <td style="min-width: 120px;">${cropUpdateDate}</td>
                <td style="min-width: 80px;">
                  <a href="javascript:void(0)" onclick="viewSingleConversation(${cropType.id},${cropType.user_id},${row.conversationid})">
                      <span class="text-primary">
                        <i class="fa fa-eye"></i> View
                      </span>
                  </a>
                </td>
             
             
                <!--  <td style="min-width: 100px;">
                  <button onclick="converSation('${row.conversationid}')" type="button" class="btn btn-sm th-btn text-white fs-9 rounded-6 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                      Assign Admin
                  </button> -->
                 <!-- Modal part in HTML -->
                 <!-- </td>  -->
            
             </tr>`;
        });
        $('#negotiationdata').html(rowContent);
        $(document).ready(function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader: {
              header: true,
              footer: true
            }
          });
        });
      } else {
        $('#negotiationdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Negotiation</h3></td></tr>");
      }
    }
  });

}
//----------------------- Filling the conversation  table End ------------------------//

// ------------------------- View individual crop conversation  ------------------------//
const viewSingleConversation = (cropid, userid, converid) => {
  // alert(converid);

  localStorage.setItem('negotiation_cropid', cropid);
  localStorage.setItem('negotiation_userid', userid);
  localStorage.setItem('conversation_id', converid);
  // console.log(converid, "bbdbsbdbbdbdbbbdbddb")
  // let cropId = JSON.stringify({"id": id});
  // localStorage.setItem('singlecropdata', conversationid);
  window.location.href = "negotiation-message.html";
}

const singleConversationMessage = () => {


  var settings = querySetting("api/admin/crop/" + localStorage.getItem('negotiation_cropid') + "/negotiation/getbyuserid/" + localStorage.getItem('negotiation_userid'), "GET", localStorage.getItem('access'));



  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
      // responsemodal("erroricon.png", "Error", response.message);

    } else {
      // alert(response.message);
      let thedatafetched = response.data.negotiations;
      // console.log(thedatafetched, "The negotiation message data");

      // Now the data coming from response is not arranged.
      // The Object.values method returns an array of object's values (which are your messages) 
      // and then you sort them by message id in ascending order using sort function.
      let thedata = Object.entries(thedatafetched)
        .map(([key, val]) => ({ id: key, ...val }))
        .sort((a, b) => a.id - b.id);

      // console.log(thedata, "the data");

      let finalObj = {}
      thedata.forEach((theresult) => {
        // alert(theresult);

        // console.log(finalObj, "hdfdf")
        // console.log(thedata)
        const date = theresult.created_at.split(" ")[0];
        if (finalObj[date]) {
          finalObj[date].push(theresult);
        } else {
          finalObj[date] = [theresult];
        }
      })
      // console.log(finalObj, "final Obj")

      let finalObjcount = Object.keys(finalObj).length;
      // console.log(finalObjcount);


      let rowContent = "";
      let index;

      if (finalObjcount > 0) {
        $('.chat-image').hide();
        $('.thechatside').show();


        for (let i = 0; i < finalObjcount; i++) {
          // console.log('Hello World', + i);
          let grouped_date = Object.keys(finalObj)[i];
          let therow = finalObj[Object.keys(finalObj)[i]];
          console.log(therow.length);

          // The row is coming out as an array with many objects. Loop through the array

          let row = therow;
          // console.log(row, "The row rf");

          let themessageandType;
          let chatGroupContent;
          for (let x = 0; x < row.length; x++) {
            

            let time = row[x].created_at;
            // console.log(row[x].created_at);
                let t = time.split("T")[1]
                let times = t.split("000Z")[0]
                // console.log(times, "bbbbbbnd")
            let myTime = times.split("000Z")[0];
                // console.log(myTime, "bbbbbbnd")

            let myDate = time.split("T")[1];

            var hour = parseInt(myTime.split(":")[0]) % 12;
            // console.log(hour, "The hour");
            var timeInAmPm = (hour == 0 ? "12" : hour) + ":" + myTime.split(":")[1] + " " + (parseInt(parseInt(myTime.split(":")[0]) / 12) < 1 ? "AM" : "PM");
            // console.log(timeInAmPm, "timeInAmPm");

            let themessagetype = row[x].messagetype;
            if (themessagetype == "offer") {
              // Hide Send offer button if an offer has been sent already
              $('.open_offer_form').hide();
              // Hide Send offer button if an offer has been sent already
            }
            // let themessageandType;
            if (themessagetype == "text") {
              themessageandType = `
                      <div class="w-100 d-flex chat-${row[x].type}">
                        <div class="chat-content-${row[x].type}">
                            <h5 class="text-primary fw-bold text-capitalize">${row[x].type}</h5>
                          <div class="message-item">
                            <div class="bubble">${row[x].message}</div> 
                            <div class="message-time text-end">${timeInAmPm}</div>   
                          </div>
                        </div>
                      </div>
                      `;
            } else if (themessagetype == "offer") {
              let offerbox = JSON.parse(row[x].message);
              themessageandType = `
                          <div class="offer-right mb-2 mt-1">
                              <div class="offered">
                                  <!---->
                                  <div class="colored">
                                        <h5 class="text-primary fw-bold text-capitalize">${row[x].type}</h5>

                                      <h3>Offer</h3>
                                     
                                      <div class="white-line"></div>
                                      <div class="each-item">
                                          <p>Required Item</p>
                                          <h4>${offerbox.qty}${offerbox.test_weight}</h4>
                                      </div>
                                      <div class="each-item">
                                          <p>Offer Price</p>
                                          <h4>₦${offerbox.price}</h4>
                                      </div>
                                      <div class="each-item">
                                          <p>Oil content</p>
                                          <h4>${offerbox.oil_content}%</h4>
                                      </div>
                                      <div class="each-item">
                                          <p>Foreign matter</p>
                                          <h4>${offerbox.foreign_matter}%</h4>
                                      </div>
                                      <div class="each-item">
                                          <p>Infestation</p>
                                          <h4>${offerbox.infestation}%</h4>
                                      </div>
                                      <div class="each-item">
                                          <p>Moisture</p>
                                          <h4>${offerbox.moisture}%</h4>
                                      </div>
                                      <div class="each-item">
                                          <p>Weevil</p>
                                          <h4>${offerbox.weevil}%</h4>
                                      </div>
                                      <div class="each-item">
                                          <p>Splits</p>
                                          <h4>${offerbox.splits}%</h4>
                                      </div>
                                      <button>View Full Specification</button>
                                  </div>
                                  <!---->
                                 
                              </div>
                          </div> 
                                    <div class="message-time">${timeInAmPm}</div>
                      `;
            } else if (themessagetype == "admin") {
                      let adminbox = JSON.parse(row[x].message);
                      themessageandType = `
                        <div class="w-100 d-flex chat-${row[x].type}">
                          <div class="admin-message-${row[x].type}">
                            <div class="message-item">
                              <div class="bubble">${adminbox.message}</div>    
                              <div class="message-time">${timeInAmPm}</div>   
                              <div class="message-date d-none">${myDate}</div>  
                            </div>
                            </div>
                          </div>`;
            }else {
              themessageandType = `
                      <div class="w-100 d-flex chat-${row[x].type}">
                        <div class="chat-content-${row[x].type}">
                                  <h5 class="text-primary fw-bold text-capitalize">${row[x].type}</h5>
                                <div class="message-item">
                                  <div class="bubble">${row[x].message}</div> 
                                  <div class="message-time text-end">${timeInAmPm}</div>   
                                </div>
                        </div>
                    </div>
                      `;
            }


            chatGroupContent += `
                      ${themessageandType}
                  `;


          }

          let refactoredChatGroupContent = JSON.stringify(chatGroupContent);
          refactoredChatGroupContent = refactoredChatGroupContent.replace(undefined, '');
          refactoredChatGroupContent = JSON.parse(refactoredChatGroupContent);


          // console.log(refactoredChatGroupContent, " chatGroupContent bbbbbbbbbbbbbbbbbbbb");
          var date = new Date();
          var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
          let themomentcode = moment(grouped_date, "YYYY-MM-DD").isSame(dateString, "YYYY-MM-DD");
          let themoment;
          if (themomentcode === true) {
            themoment = "Today";
          } else if (moment(grouped_date, "YYYY-MM-DD").calendar().split("T")[0].toLowerCase() == "yesterday") {
            themoment = "Yesterday";
          } else {
            themoment = moment(grouped_date, "YYYY-MM-DD").fromNow();
          }

          // console.log(timeSplit, "jjjjjjjjjjjjj")
          let splitTime = grouped_date.split("T")[0]
          let timeSplit = splitTime.split("T")[0]
          // console.log(timeSplit, "jjjjjjjjjjjjj")

          let thegroupeddate = `
                  <div class="thegroupeddate text-center my-4" style="text-transform:uppercase;">  <span class="nego-top  py-2 px-2 text-white rounded-2">${themoment} - ${timeSplit}</span></div>
              `;

          let groupDateANDthemesssageType = thegroupeddate + refactoredChatGroupContent;




          // let groupDateANDthemesssageType = refactoredChatGroupContent;


          rowContent += `
                  ${groupDateANDthemesssageType}
              `;



        }
        $('#thechatside').html(rowContent);
        // console.log(rowContent, " rowContent");
        // console.log(thedata, "the data");

        setTimeout(() => {
          var ChatDiv = $('#thechatside');
          var height = ChatDiv[0].scrollHeight;
          ChatDiv.scrollTop(height);
          console.log(height, "Chartbox Height");
        }, 500)

        // $('[data-toggle="tooltip"]').tooltip('toggle');
        // setTimeout(()=>{
        //     $('[data-toggle="tooltip"]').tooltip('hide');
        // },10000)  

      } else {
        $('#thechatside').html("No conversation yet");
      }

    }
    // loader('#tbdata')

  });
}
const viewConversationSpecification = () => {

  var settings = querySetting("api/admin/crop/" + localStorage.getItem('negotiation_cropid') + "/negotiation/getbyuserid/" + localStorage.getItem('negotiation_userid'), "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
    } else {
      let negotiate;
      if (response.data.is_negotiable == 1) {
        negotiate =
          `YES`;
      } else {
        negotiate =
          `NO`;
      }
      // console.log(response.data.crop_request[0]);
      let count = response.data.crop;
      console.log(count, "rrrr")
      $('#firstName').text(count.user.first_name);
      $('#lastName').text(count.user.last_name);
      $('#Type').text(count.user.type);
      $('#subCategory').text(count.subcategory.name);
      $('#Color').text(count.specification.color);
      $('#type').text(count.type);
      $('#price').text(count.specification.price);

      // specification
      $('#category').text(count.category.name);
      $('#testweight').text(count.specification.test_weight);
      $('#color').text(count.specification.color);
      $('#hardness').text(count.specification.hardness);
      $('#moist').text(count.specification.moisture);
      $('#splits').text(count.specification.splits);
      $('#fm').text(count.specification.foreign_matter);
      $('#oil').text(count.specification.oil_content);
      $('#brokengrains').text(count.specification.broken_grains);
      $('#infestation').text(count.specification.infestation);
      $('#liters').text(count.specification.hectoliter);
      $('#weevil').text(count.specification.weevil);
      $('#grainsize').text(count.specification.grain_size);
      $('#rotten').text(count.specification.rotten_shriveled);
      $('#damages').text(count.specification.total_defects);

    }

  });
}
// super admin to view all negotiations alone 
const ViewAllNegotiation =()=>{
  let adminRoles = JSON.parse(localStorage.getItem('admin')).role_name;
  // alert(adminRoles)
  if(adminRoles =="Super Admin"){
    // $('#assigned').show();
    window.location.href = "negotiation.html";
  }else{
    // alert(hide())
    // $('#assigned').hide();
    swal("NO ACCESS GRANTED", "", "error")
  }
}
const hidebutton =()=>{
  let adminRoles = JSON.parse(localStorage.getItem('admin')).role_name;
  if(adminRoles =="Super Admin"){
    $('#assigned').show();
   }else{
    $('#assigned').hide();
  }
}
const fetchAllAssignenegotiation =()=> {
  loader('#AllassignedData', 10)

  var settings = querySetting("api/admin/assignnegotiation/getall", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {

      console.log(response.message);

    } else {
      // console.log(response.data)

      let thedata = response.data;
      console.log(response.data)

      if (thedata.length > 0) {
        
        
        let thedata = (response.data).reverse();
        let rowContent;
        $.each(thedata, (index, row) => {

            // console.log("ytyty")
              index = index + 1;
              rowContent += `<tr class="align-items-center">
                <td style="min-width: 50px;">${index}</td>
                <td style="min-width: 120px;"><strong class="welcome">${row.administrator[0].first_name}, ${row.administrator[0].last_name}</strong><br/></td>
                <td style="min-width: 100px;"><strong class="welcome">${row.conversation[0].userone.first_name}, ${row.conversation[0].userone.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.conversation[0].userone.type}</small> 
                </td>
                <td style="min-width: 100px;"><strong class="welcome">${row.conversation[0].usertwo.first_name}, ${row.conversation[0].usertwo.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.conversation[0].usertwo.type}</small> 
                </td>
                <td style="min-width: 100px;"><strong class="welcome text-uppercase text-primary">${row.conversation[0].crop.type}</strong></td>
                <td style="min-width: 100px;"><strong class="welcome">${row.conversation[0].crop.category.name} </strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.conversation[0].crop.subcategory.name}</small> 
                </td>
                <td style="min-width: 100px;">${splittingDate(row.created_at)}</td>
                <td style="min-width: 110px;">${splittingDate(row.updated_at)}</td>
                <td class="text-end" style="min-width: 20px;">
                    <div class="dropdown shadow-dot text-center">
                        <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                            <a href="javascript:void(0)" class="dropdown-item" href="">Re-Assign</a>
                            <a href="javascript:void(0)" class="dropdown-item" onclick="deleteAdminAssigne('${row.id}')">Delete</a>
                        </div>
                    </div>
                </td>
    
              </tr>`;
              $('#AllassignedData').html(rowContent);
              $(document).ready(function () {
                $('#allTable').DataTable({
                  scrollY: 300,
                  scrollX: true,
                  scrollCollapse: true,
                  retrieve: true,
                  paging: true,
                  "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                  fixedHeader: {
                    header: true,
                    footer: true
                  }
                });
              });
        });
        // console.log(index, "----", row);
      }
    }
  });
}
// ------------------------Admin Sending Message to Negotiation Chat ---------------------------//


Assignme = () => {
  allAdmin();
  // alert("balala")
  let converData = localStorage.getItem('conversation_id');
  // alert(converData)

}

/* ------------------------------- NEGOTIATION ------------------------------ */

const allAdmin = () => {
  var settings = querySetting("api/admin/getall", "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    let response = data.data;
    for (let i = 0; i < response.length; i++) {
      $('#Alladmin').append(`<option value=${response[i].admin_id}> ${response[i].first_name} ${response[i].last_name}</option>`);
    }
  });
}

// ------------------------Getting the conversation id--------------------// 
// const converSation = (conversationid) => {
//   // alert(conversationid);
//   localStorage.setItem('singleConversation', JSON.stringify({"conversationid":conversationid}));

//   // window.location.href = "sub-category.html";
// }

//-------------------------- Assigning Admin -------------------------------//


const assignAdmin = () => {
  let converData = JSON.stringify(JSON.parse(localStorage.getItem('conversation_id')));
  // alert(converData)
  // selecting the input element and get its value
  let converID = converData;
  // alert("balablu")
  // console.log(converData, "djdjdjdjdjdjdj");

  // selecting the input element and get its  value
  // console.log(converID)

  let negotiationID = converID;
  let adminSelected = document.getElementById("Alladmin");
  // adminSelectedvalue = adminSelected.value;
  console.log(Alladmin)
  // Displaying the value 
  if (!adminSelected.value) {
    swal("Select and Admin to Assign!");
    adminSelected.focus();
    return false;
  } else {

    const assignSingleAdmin = JSON.stringify({
      "conversation_id": negotiationID,
      "adminassigned": adminSelected.value,
    });


    var settings = querySetting("api/admin/assignnegotiation/add", "POST", localStorage.getItem('access'), assignSingleAdmin);

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", "This negotiation has already been assigned to an admin", "error");
      } else {
        console.log(response.message);
        swal("SUCCESS", response.message, "success");

        // categoryType.value=""
        // categoryName.value="";

        window.location.href = "negotiation.html";
        setTimeout(() => {
          cancelRequest();
        }, 2000)
        fetchAllnegotiation();
      }
    });
  }
};

//----------------------------------- All Assigned Negotiation to Individual Admin --------------------------//
function fetchAllAssigned() {

  loader('#assignedData', 10)
  let adminID = JSON.parse(localStorage.getItem('admin')).admin_id;
  let AdminId = adminID
  // alert(AdminId)
  var settings = querySetting("api/admin/assignnegotiation/getbyadminassigned/" +AdminId, "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {

      console.log(response.message);

    } else {
      // console.log(response.data)

      let thedata = response.data;
      console.log(response.data)

      if (thedata.length > 0) {
        
        
        let thedata = (response.data).reverse();
        let rowContent;
        $.each(thedata, (index, row) => {

            // console.log("ytyty")
              index = index + 1;
              rowContent += `<tr class="align-items-center">
                <td style="min-width: 50px;">${index}</td>
                <td style="min-width: 120px;"><strong class="welcome">${row.admindetails[0].first_name}, ${row.admindetails[0].last_name}</strong><br/></td>
                <td style="min-width: 100px;"><strong class="welcome">${row.conversation[0].userone.first_name}, ${row.conversation[0].userone.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.conversation[0].userone.type}</small> 
                </td>
                <td style="min-width: 100px;"><strong class="welcome">${row.conversation[0].usertwo.first_name}, ${row.conversation[0].usertwo.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.conversation[0].usertwo.type}</small> 
                </td>
                <td style="min-width: 100px;"><strong class="welcome text-uppercase text-primary">${row.conversation[0].crop.type}</strong></td>
                <td style="min-width: 100px;"><strong class="welcome">${row.conversation[0].crop.category.name} </strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.conversation[0].crop.subcategory.name}</small> 
                </td>
                <td style="min-width: 100px;">${splittingDate(row.created_at)}</td>
                <td style="min-width: 110px;">${splittingDate(row.updated_at)}</td>
                <td style="min-width: 50px;"> <a href="javascript:void(0)" onclick="JoinConversation(${row.conversation[0].crop.id},${row.conversation[0].crop.user_id})"class="text-white btn btn-sm th-btn" style="border-radius:4px !important;"> Join </a> </td>
              <!-- <td class="text-end" style="min-width: 20px;">
                    <div class="dropdown shadow-dot text-center">
                        <a class="btn btn-sm a-class text-secondary" href="" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                            <a href="javascript:void(0)" class="dropdown-item" href="">Re-Assign</a>
                            <a href="javascript:void(0)" class="dropdown-item" onclick="deleteAdminAssigne('${row.id}')">Delete</a>
                        </div>
                    </div>
                </td> -->
    
              </tr>`;
              $('#assignedData').html(rowContent);
              $(document).ready(function () {
                $('#allTable').DataTable({
                  scrollY: 300,
                  scrollX: true,
                  scrollCollapse: true,
                  retrieve: true,
                  paging: true,
                  "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                  fixedHeader: {
                    header: true,
                    footer: true
                  }
                });
              });
          
        });
        // console.log(index, "----", row);
      }
    }
  });

}

// ----------------------------------------- Delete assigned Admin --------------------//
const deleteAdminAssigne = (n) => {
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

        var settings = querySetting("api/admin/assignnegotiation/delete/" + n, "POST", localStorage.getItem('access'));


        $.ajax(settings).done(function (response) {
          console.log(response);
          if (response.error == true) {
            console.log(response.message);
            swal("FAILED", response.message, "error");
          } else {
            console.log(response.message);
            swal("SUCCESS", response.message, "success");
            window.location.href = "assigned-negotiation.html";
            setTimeout(() => {
              cancelRequest();
            }, 2000)
            fetchAllAssigned();
          }

        });
      }
    });
}

//----------------------------------------- Single Admin Assigned to Join Chat 
const JoinConversation = (CropId, CropUser) => {
  // alert(CropUser)
  localStorage.setItem('message_cropid', CropId);
  localStorage.setItem('message_userid', CropUser);
  window.location.href = "negotiation-admin-message.html";
}
const adminConversationMessage = () => {


  var settings = querySetting("api/admin/crop/" + localStorage.getItem('message_cropid') + "/negotiation/getbyuserid/" + localStorage.getItem('message_userid'), "GET", localStorage.getItem('access'));



  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
      // responsemodal("erroricon.png", "Error", response.message);

    } else {
      // alert(response.message);
      let thedatafetched = response.data.negotiations;
      // console.log(thedatafetched, "The negotiation message data");

      // Now the data coming from response is not arranged.
      // The Object.values method returns an array of object's values (which are your messages) 
      // and then you sort them by message id in ascending order using sort function.
      let thedata = Object.entries(thedatafetched)
        .map(([key, val]) => ({ id: key, ...val }))
        .sort((a, b) => a.id - b.id);

      // console.log(thedata, "the data");

      let finalObj = {}
      thedata.forEach((theresult) => {
        // alert(theresult);

        // console.log(finalObj, "hdfdf")
        // console.log(thedata)
        const date = theresult.created_at.split(" ")[0];
        if (finalObj[date]) {
          finalObj[date].push(theresult);
        } else {
          finalObj[date] = [theresult];
        }
      })
      // console.log(finalObj, "final Obj")

      let finalObjcount = Object.keys(finalObj).length;
      // console.log(finalObjcount);


      let rowContent = "";
      // let index;

      if (finalObjcount > 0) {
        $('.chat-image').hide();
        $('.thechatside').show();


        for (let i = 0; i < finalObjcount; i++) {
          // console.log('Hello World', + i);
          let grouped_date = Object.keys(finalObj)[i];
          let therow = finalObj[Object.keys(finalObj)[i]];
          console.log(therow.length);

          // The row is coming out as an array with many objects. Loop through the array

          let row = therow;
          // console.log(row, "The row rf");

          let themessageandType;
          let chatGroupContent;
          for (let x = 0; x < row.length; x++) {
            let negotiationpage_type = localStorage.getItem('negotiationpage_type');
            // console.log(negotiationpage_type, "bambam")
                let chatboxClass, accept_decline_checkbox;
                
                    if(row[x].type == "corporate"){
                        chatboxClass = `user`;
                    }else{
                        chatboxClass = ``;
                    }

                    if(negotiationpage_type=="cropwanted"){
                        accept_decline_checkbox = `
                            <div class="d-flex justify-conntent-between">
                                <span class="text-success">Accept <input type="checkbox" /> </span>
                                <span class="tetx-danger">Decline <input type="checkbox" /> </span>
                            </div>
                        `;
                    }


            let time = row[x].created_at;
            // console.log(row[x].created_at);
                let t = time.split("T")[1]
                let times = t.split("000Z")[0]
                // console.log(times, "bbbbbbnd")
            let myTime = times.split("000Z")[0];
                // console.log(myTime, "bbbbbbnd")

            let myDate = time.split("T")[1];
            // console.log(time.split("T")[0])
            var hour = parseInt(myTime.split(":")[0]) % 12;
            // console.log(hour, "The hour");
            var timeInAmPm = (hour == 0 ? "12" : hour) + ":" + myTime.split(":")[1] + " " + (parseInt(parseInt(myTime.split(":")[0]) / 12) < 1 ? "AM" : "PM");
            // console.log(timeInAmPm, "timeInAmPm");

            let themessagetype = row[x].messagetype;
            if (themessagetype == "offer") {
              // Hide Send offer button if an offer has been sent already
              $('.open_offer_form').hide();
              // Hide Send offer button if an offer has been sent already
            }
            // let themessageandType;
            if (themessagetype == "text") {
              themessageandType = `
                      <div class="w-100 d-flex chat-${row[x].type}">
                        <div class="chat-content-${row[x].type}">
                            <h5 class="text-primary fw-bold text-capitalize">${row[x].type}</h5>
                          <div class="message-item">
                            <div class="bubble">${row[x].message}</div> 
                            <div class="message-time text-end">${timeInAmPm}</div>   
                          </div>
                        </div>
                      </div>
                      `;
                  } else if (themessagetype == "offer") {
                    let offerbox = JSON.parse(row[x].message);
                    themessageandType = `
                                <div class="offer-right mb-2 mt-1">
                                    <div class="offered">
                                        <!---->
                                        <div class="colored">
                                              <h5 class="text-primary fw-bold text-capitalize">${row[x].type}</h5>

                                            <h3>Offer</h3>
                                          
                                            <div class="white-line"></div>
                                            <div class="each-item">
                                                <p>Required Item</p>
                                                <h4>${offerbox.qty}${offerbox.test_weight}</h4>
                                            </div>
                                            <div class="each-item">
                                                <p>Offer Price</p>
                                                <h4>₦${offerbox.price}</h4>
                                            </div>
                                            <div class="each-item">
                                                <p>Oil content</p>
                                                <h4>${offerbox.oil_content}%</h4>
                                            </div>
                                            <div class="each-item">
                                                <p>Foreign matter</p>
                                                <h4>${offerbox.foreign_matter}%</h4>
                                            </div>
                                            <div class="each-item">
                                                <p>Infestation</p>
                                                <h4>${offerbox.infestation}%</h4>
                                            </div>
                                            <div class="each-item">
                                                <p>Moisture</p>
                                                <h4>${offerbox.moisture}%</h4>
                                            </div>
                                            <div class="each-item">
                                                <p>Weevil</p>
                                                <h4>${offerbox.weevil}%</h4>
                                            </div>
                                            <div class="each-item">
                                                <p>Splits</p>
                                                <h4>${offerbox.splits}%</h4>
                                            </div>
                                            <button>View Full Specification</button>
                                        </div>
                                        <!---->
                                        <div class="accept_decline_checkbox">${accept_decline_checkbox}</div> 
                                      
                                    </div>
                                </div> 
                                          <div class="message-time">${timeInAmPm}</div>
                            `;
                  } else if (themessagetype == "admin") {
                    let adminbox = JSON.parse(row[x].message);
                    themessageandType = `
                            <div class="w-100 d-flex chat-${row[x].type}">
                              <div class="admin-message-${row[x].type}">
                                <div class="message-item">
                                  <div class="bubble">${adminbox.message}</div>    
                                  <div class="message-time">${timeInAmPm}</div>   
                                  <div class="message-date d-none">${myDate}</div>  
                                </div>
                              </div>
                            </div>`;
                  } else {
                      `<div class="w-100 d-flex chat-${row[x].type}">
                      <div class="chat-content-${row[x].type}">
                          <h5 class="text-primary fw-bold text-capitalize">${row[x].type}</h5>
                        <div class="message-item">
                          <div class="bubble">${row[x].message}</div> 
                          <div class="message-time text-end">${timeInAmPm}</div>   
                        </div>
                      </div>
                    </div>`
                  }

            chatGroupContent += `
                      ${themessageandType}
                  `;


          }

          let refactoredChatGroupContent = JSON.stringify(chatGroupContent);
          refactoredChatGroupContent = refactoredChatGroupContent.replace(undefined, "");
          refactoredChatGroupContent = JSON.parse(refactoredChatGroupContent);


          // console.log(refactoredChatGroupContent, " chatGroupContent bbbbbbbbbbbbbbbbbbbb");
          // var datetime = moment.tz('America/Los_Angeles').format('DD-MM-YYYY HH:MM:SS').split(' ');
          // $('#myDateDiv').text(datetime[0]);
          // $('#myTimeDiv').text(datetime[1]);


          var date = new Date();
          var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("")[1];
          let themomentcode = moment(grouped_date, "YYYY-MM-DD").isSame(dateString, "YYYY-MM-DD");
          let themoment;
          if(themomentcode === true){
              themoment = "Today";
          }else if(moment(grouped_date, "YYYY-MM-DD").calendar().split("")[0].toLowerCase() == "yesterday"){
              themoment = "Yesterday";
          }else{
              themoment = moment(grouped_date, "YYYY-MM-DD").fromNow();
          }
          // console.log(timeSplit, "jjjjjjjjjjjjj")
          let splitTime = grouped_date.split("T")[0]
          let timeSplit = splitTime.split("T")[0]
          // console.log(timeSplit, "jjjjjjjjjjjjj")
        
          let thegroupeddate = `
                  <div class="thegroupeddate text-center my-4" style="text-transform:uppercase;">  <span class="nego-top  py-2 px-2 text-white rounded-2">${themoment} - ${timeSplit}</span></div>
              `;

          let groupDateANDthemesssageType = thegroupeddate+refactoredChatGroupContent;




          // let groupDateANDthemesssageType = refactoredChatGroupContent;


          rowContent += `
                  ${groupDateANDthemesssageType}
              `;



        }
        $('#thechatside').html(rowContent);
        // console.log(rowContent, " rowContent");
        // console.log(thedata, "the data");

        

        // $('[data-toggle="tooltip"]').tooltip('toggle');
        // setTimeout(()=>{
        //     $('[data-toggle="tooltip"]').tooltip('hide');
        // },10000)  

      } else {
        $('#thechatside').html("No conversation yet");
      }

    }

  });
}
const adminConversationMessageSpecification = () => {

  var settings = querySetting("api/admin/crop/" + localStorage.getItem('message_cropid') + "/negotiation/getbyuserid/" + localStorage.getItem('message_userid'), "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
    } else {

      console.log(response.data.crop.user.type, "negotiation");
      localStorage.setItem('negotiationpage_type', response.data.crop.user.type);
      localStorage.setItem('negotiationMessageId', response.data.negotiations[0].conversation_id);

      let count = response.data.crop;
      console.log(count, "rrrr")
      $('#firstName').text(count.user.first_name); type
      $('#lastName').text(count.user.last_name);
      $('#Type').text(count.user.type);
      $('#subCategory').text(count.subcategory.name);
      $('#Color').text(count.specification.color);
      $('#type').text(count.type);
      $('#price').text(count.specification.price);

      // specification
      $('#category').text(count.category.name);
      $('#testweight').text(count.specification.test_weight);
      $('#color').text(count.specification.color);
      $('#hardness').text(count.specification.hardness);
      $('#moist').text(count.specification.moisture);
      $('#splits').text(count.specification.splits);
      $('#fm').text(count.specification.foreign_matter);
      $('#oil').text(count.specification.oil_content);
      $('#brokengrains').text(count.specification.broken_grains);
      $('#infestation').text(count.specification.infestation);
      $('#liters').text(count.specification.hectoliter);
      $('#weevil').text(count.specification.weevil);
      $('#grainsize').text(count.specification.grain_size);
      $('#rotten').text(count.specification.rotten_shriveled);
      $('#damages').text(count.specification.total_defects);

    }

  });
}
const sendMessage = () => {
  let adminCropId = JSON.parse(localStorage.getItem('admin')).admin_id;
  let negotiationMessageid = localStorage.getItem('negotiationMessageId');

  // alert(negotiationMessageid)
  let Negotiation_id = negotiationMessageid;
  let Message = document.getElementById("negotiationtextmessage")
  let AdminCropid = adminCropId;

  const adminMessage = JSON.stringify({
    "conversation_id": Negotiation_id,
    "type": "admin",
    "message": Message.value,
    "messagetype": "text",
    "admin_id": AdminCropid,

  });


  var settings = querySetting("api/admin/crop/negotiation/sendmessage", "POST", localStorage.getItem('access'), adminMessage);

  $.ajax(settings).done(function (response) {
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
      swal("FAILED", response.message, "error");
    } else {
      // console.log(response.message);
      // swal("SUCCESS", response.message, "success");
      Message.value = "";
      // roleDescription.value="";
      // roleSections.value="";
      // window.location.href = "admin-role.html";
      // setTimeout(() => {
      //   cancelRequest();
      // }, 2000)
      // fetchAllroles();
    }
  });

}


/* -------------------------------------------------------------------------- */
/*                            NEGOTIATION ENDS HERE                           */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                          COMPANY DATA STARTS HERE                          */
/* -------------------------------------------------------------------------- */

function fetchAllcompany() {

  var settings = {
    "url": "https://adminapi.growsel.com/api/admin/company/getall",
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
    if (response.error == true) {
      $('#companydata').html("<tr>" + response.message + "</tr>");
    } else {
      let thedata = (response.data).reverse();
      let rowContent;
      $.each(thedata, (index, row) => {
        console.log(response.data)
        index = index + 1;
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
function fetchAllCategory() {

  loader('#categorydata', 10)

  var settings = querySetting("api/admin/category/crop/getall", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      console.log(response.message);

    } else {
      console.log(response.data)

      let thedata = response.data;

      console.log(thedata)

      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {


          // console.log(row.category.type)
          index = index + 1;
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
        $(document).ready(function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader: {
              header: true,
              footer: true
            }
          });
        });
      } else {
        $('#categorydata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Category Added Yet</h3></td></tr>");
      }
    }
  });

};


// -------------------------------Fetch all Input Categories ---------------------------//
function fetchAllInputCategory() {

  loader('#categorydata', 10)

  var settings = querySetting("api/admin/category/input/getall", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      console.log(response.message);

    } else {
      console.log(response.data)

      let thedata = response.data;

      console.log(thedata)

      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {


          // console.log(row.category.type)
          index = index + 1;
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
        $(document).ready(function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader: {
              header: true,
              footer: true
            }
          });
        });
      } else {
        $('#categorydata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Category Added Yet</h3></td></tr>");
      }
    }
  });

};
// --------------------------------Adding   Category starts---------------------//
const addcategory = () => {
  // alert("balablu")
  // console.log(localStorage.getItem('access'));
  // selecting the input element and get its value
  let categoryType = document.getElementById("category_type");
  let categoryName = document.getElementById("category_name");


  // Displaying the value 
  if (!categoryType.value) {
    swal("Enter Category Type!");
    categoryType.focus();
    return false;
  } else if (!categoryName.value) {
    swal("Enter Category Name!");
    categoryName.focus();
    return false;
  } else {

    const catAdd = JSON.stringify({
      "type": categoryType.value,
      "name": categoryName.value
    });

    var settings = querySetting("api/admin/category/add", "POST", localStorage.getItem('access'), catAdd);

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {
        console.log(response.message);
        swal("SUCCESS", response.message, "success");

        categoryType.value = ""
        categoryName.value = "";

        window.location.href = "category.html";
        setTimeout(() => {
          cancelRequest();
        }, 2000)
        fetchAllcolors();
      }
    });
  }
};


// ------------------------------Deleting  category ----------------------------------//
const deleteCategory = (n) => {
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

        var settings = querySetting("api/admin/category/delete/" + n, "POST", localStorage.getItem('access'));


        $.ajax(settings).done(function (response) {
          console.log(response);
          if (response.error == true) {
            console.log(response.message);
            swal("FAILED", response.message, "error");
          } else {
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
  sessionStorage.setItem('categoryData', JSON.stringify({ id: id, name: name }));
  window.location.href = "#?categoryID=" + id;
  const URL = window.location.href;
  const confirmEdit = URL.split("?");

  if (confirmEdit[1] !== undefined) {
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
  if ((window.location.href).split('#')[1] !== 'color-section') {
    document.querySelector('#editBtn').classList.toggle('d-none');
    document.querySelector('#addBtn').classList.toggle('d-none');
    document.querySelector('#cancelBtn').classList.toggle('d-none');
  }
}

const updateCategory = () => {
  let categoryID = JSON.parse(sessionStorage.getItem('categoryData')).id;
  // console.log(localStorage.getItem('access'));

  // selecting the input element and get its value
  let categoryName = document.getElementById("category_name");
  // let roleDescription = document.getElementById("role_description");

  // Displaying the value 
  // swal("", roleName), ""
  if (!categoryName.value) {
    swal("Enter Category Name!");
    categoryName.focus();
    return false;
  } else {

    const categoryEdit = JSON.stringify({
      "id": categoryID,
      "name": categoryName.value,

    });

    var settings = querySetting("api/admin/category/edit", "POST", localStorage.getItem('access'), categoryEdit);

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {

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

// ----------------------------EDITING AND MAKING UPDATE TO CATEGORY ENDS ------------------------//





/* -------------------------------------------------------------------------- */
/*                  Viewing individual crop category subcategories                 */
/* -------------------------------------------------------------------------- */
const viewSubCategory = (id, name) => {
  // alert(id);
  // let cropId = JSON.stringify({"id": id});
  localStorage.setItem('singlecategoryid', JSON.stringify({ "id": id, "name": name }));
  window.location.href = "sub-category.html";
}


const fetchAllSubCategories = () => {
  loader('#subcategorydata', 10)
  let catData = JSON.parse(localStorage.getItem('singlecategoryid'));
  let catid = catData.id;

  let catname = catData.name;

  $('#subName').text(catname);
  $('#Subname').text(catname);
  var settings = querySetting("api/admin/subcategory/getbycategory/" + catid, "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
      $('#subcategorydata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Sub-Category Added Yet</h3></td></tr>");
      // swal("FAILED", response.message, "error");
    } else {
      console.log(response.data)
      // swal("SUCCESS", response.message, "success");
      let thedata = response.data;

      console.log(thedata)

      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {
          index = index + 1;
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
        $(document).ready(function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader: {
              header: true,
              footer: true
            }
          });
        });
      } else {
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

  if (!subCategoryName.value) {
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
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {
        subCategoryId.value = "";
        subCategoryName.value = "";
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
const deleteSubCategory = (n) => {
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

        var settings = querySetting("api/admin/subcategory/delete/" + n, "POST", localStorage.getItem('access'));


        $.ajax(settings).done(function (response) {
          console.log(response);
          if (response.error == true) {
            console.log(response.message);
            swal("FAILED", response.message, "error");
          } else {
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
  sessionStorage.setItem('subcategoryData', JSON.stringify({ id: id, name: name }));
  window.location.href = "#?subcategoryID=" + id;
  const URL = window.location.href;
  const confirmEdit = URL.split("?");

  if (confirmEdit[1] !== undefined) {
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
  if ((window.location.href).split('#')[1] !== 'color-section') {
    document.querySelector('#editBtn').classList.toggle('d-none');
    document.querySelector('#addBtn').classList.toggle('d-none');
    document.querySelector('#cancelBtn').classList.toggle('d-none');
  }
}



const updateSubCategory = () => {
  let subcategoryID = JSON.parse(sessionStorage.getItem('subcategoryData')).id;
  // console.log(localStorage.getItem('access'));

  // selecting the input element and get its value
  let subCategoryName = document.getElementById("subCategory_name");
  // let roleDescription = document.getElementById("role_description");

  // Displaying the value 
  // swal("", roleName), ""
  if (!subCategoryName.value) {
    swal("Enter Sub Category Name!");
    subCategoryName.focus();
    return false;
  } else {
    // alert(subcategoryID)

    const subCategoryEdit = JSON.stringify({
      "id": subcategoryID,
      "subcategory_name": subCategoryName.value,

    });

    var settings = querySetting("api/admin/subcategory/edit", "POST", localStorage.getItem('access'), subCategoryEdit);

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {

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
function fetchAllcolors() {

  loader('#colordata', 10)

  var settings = querySetting("api/admin/colour/getall", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      console.log(response.message);

    } else {
      console.log(response.data)
      let thedata = response.data;

      console.log(thedata)

      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {



          index = index + 1;
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
        $(document).ready(function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader: {
              header: true,
              footer: true
            }
          });
        });
      } else {
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

  if (!colorName.value) {
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
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {
        console.log(response.message);
        swal("SUCCESS", response.message, "success");

        // colorID.value="";
        colorName.value = "";

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


const deleteColor = (n) => {
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

        var settings = querySetting("api/admin/colour/delete/" + n, "POST", localStorage.getItem('access'));


        $.ajax(settings).done(function (response) {
          console.log(response);
          if (response.error == true) {
            console.log(response.message);
            swal("FAILED", response.message, "error");
          } else {
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
  sessionStorage.setItem('colorData', JSON.stringify({ id: id, name: name }));
  window.location.href = "#?colorID=" + id;
  const URL = window.location.href;
  const confirmEdit = URL.split("?");

  if (confirmEdit[1] !== undefined) {
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
  if ((window.location.href).split('#')[1] !== 'color-section') {
    document.querySelector('#editBtn').classList.toggle('d-none');
    document.querySelector('#addBtn').classList.toggle('d-none');
    document.querySelector('#cancelBtn').classList.toggle('d-none');
  }
}



const updatecolor = () => {
  let colorID = JSON.parse(sessionStorage.getItem('colorData')).id;
  // console.log(localStorage.getItem('access'));

  // selecting the input element and get its value
  let colorName = document.getElementById("color_name");
  // let roleDescription = document.getElementById("role_description");

  // Displaying the value 
  // swal("", roleName), ""
  if (!colorName.value) {
    swal("Enter Color Name!");
    colorName.focus();
    return false;
  } else {

    const colorEdit = JSON.stringify({
      "id": colorID,
      "colour_name": colorName.value,

    });

    var settings = querySetting("api/admin/colour/edit", "POST", localStorage.getItem('access'), colorEdit);

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {

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

function fetchAllinput() {

  loader('#inputdata', 14)

  var settings = querySetting("api/admin/input/getall", "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
      $('#inputdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Inputs added yet</h3></td></tr>");
    } else {
      response.data 
      // console.log(response.data)
      let thedata = response.data;
      // console.log(thedata)
      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {


          index = index + 1;
          rowContent += `<tr class="align-items-center">
              <td>${index}</td>
              <td> <strong class="welcome" >${row.user.first_name} ${row.user.last_name}</strong>
              <br> <small class="text-primary text-capitalize">${row.user.type}</small></td>
              <td class="text-primary">${row.user.email}</td>
              <td>${row.category.name} <br> <small class="text-primary">${row.subcategory.name} </small>  </td>
              <td style="cursor:pointer;"><a href="javascript:void(0)" class="success-color" onclick=viewMoreInput('${row.id}')> <i class="fa fa-eye"></i> View </a></td>
              

             </tr>`;
        });
        $('#inputdata').html(rowContent);
        $(document).ready(function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader: {
              header: true,
              footer: true
            }
          });
        });
      } else {
        $('#inputdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Inputs added yet</h3></td></tr>");
      }
    }
  });

}

const viewMoreInput = (id) => {
  // alert(id);
  localStorage.setItem('singleInputData', id);
  window.location.href = "view-more.html";
}

const viewInput = () => {


  var settings = querySetting("api/admin/input/getbyid/" + localStorage.getItem('singleInputData'), "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    // console.log(response);
    if (response.error == true) {
      // console.log(response.message);
    } else {
      // console.log(data)
      // let negotiate;
      //       if(response.data.is_negotiable == 1){
      //         negotiate = 
      //           `YES`;
      //       }else{
      //         negotiate = 
      //           `NO`;
      //       }
      console.log(response.data[0].images);
      

      let users = response.data[0].user;
      let inputcategory = response.data[0].category;
      let inputsubtegory = response.data[0].subcategory;
      $('#firstName').text(users.first_name);
      $('#lastName').text(users.last_name);
      $('#description').html(response.data[0].description);
      $('#instruction').html(response.data[0].usage_instruction);
      $('#category').text(inputcategory.name);
      $('#catname').text(inputcategory.name);
      $('#subcategory').text(inputsubtegory.name);
      $('#subcat').text(inputsubtegory.name);
      $('#packaging').html(response.data[0].packaging);
      $('#currency').text(response.data[0].currency);
      $('#price').text(response.data[0].price);
      $('#manufacuturer').text(response.data[0].manufacture_name);
      $('#manufacturdate').text(response.data[0].manufacture_date);
      $('#weight').text(response.data[0].kilograms);
      $('#litres').text(response.data[0].liters);
      $('#expirydate').text(response.data[0].expiry_date);
      $('#deliverymethod').text(response.data[0].delivery_method);
      $('#mfmstate').text(response.data[0].state);
      $('#mfmcounntry').text(response.data[0].manufacture_country);
      
      // let dataURL = response.data[0].images
      const canvas = document.getElementById('my-canvas');

      // Convert canvas to dataURL and log to console
      const dataURL = canvas.toDataURL();
      console.log(dataURL);
      // Logs data:image/png;base64,wL2dvYWwgbW9yZ...

      // Convert to Base64 string
      // const base64 = getBase64StringFromDataURL(dataURL);
      // console.log(base64);
      // Logs wL2dvYWwgbW9yZ...


    }
  });
}

/* -------------------------------------------------------------------------- */
/*                            INPUT DATA ENDS HERE                            */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                           CROPS DATA STARTS HERE                           */
/* -------------------------------------------------------------------------- */

function cropsWanted() {

  loader('#cropdata', 10)

  var settings = querySetting("api/admin/crop/getbycropwanted", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      $('#cropofferdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Crop Wanted Availble Yet</h3></td></tr>");
      console.log(response.message);

    } else {
      console.log(response.data)
      let thedata = response.data;
      thedata = thedata.rows

      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {

          let crop_status;
          if (row.user.status == 1) {
            crop_status =
              `<div class="py-1 text-center rounded-pill successalert">
                    <span class="rounded-circle p-1 dot d-inline-block"></span>
                    <strong class="text-success" style="font-size:12px;">ACTIVE</strong>
                  </div>`;
          } else {
            crop_status =
              `<div class="py-1 text-center rounded-pill past-due">
                    <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                    <strong class="text-past"  style="font-size:12px;">IN ACTIVE</strong>
                  </div>`;
          }
          // console.log(row.category.type)
          index = index + 1;
          rowContent += `
              <tr class="">
              <td>${index}</td>
              <td><strong class="text-secondary">${row.user.first_name} ${row.user.last_name}</strong><br/>
                <small class="text-primary fw-bold text-uppercase">${row.user.type}</small>
              </td>
              <td class="text-primary">${row.user.email}</td>
              <td><strong class="text-capitalize">${row.category.name}</strong> <br> <small class="text-primary fw-bold text-uppercase">${row.subcategory.name}</small> </td>
              <td>${crop_status}</td>
              <td style="cursor:pointer;" class="text-center">
                <a href="javascript:void(0)" class="success-color" onclick="viewMoreCrop('${row.id}')"> <i class="fa fa-eye"></i> View</a>
              </td>
              

            </tr>
              `;
        });
        $('#cropdata').html(rowContent);
        $(document).ready(function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader: {
              header: true,
              footer: true
            }
          });
        });
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


const viewMore = () => {


  var settings = querySetting("api/admin/crop/getbyid/" + localStorage.getItem('singlecropdata'), "GET", localStorage.getItem('access'));


  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
    } else {
      let negotiate;
      if (response.data.is_negotiable == 1) {
        negotiate =
          `YES`;
      } else {
        negotiate =
          `NO`;
      }
      // console.log(response.data.crop_request[0]);
      
      $('#croptype').text(response.data.type);
      $('#user_id').text(response.data.user_id);
      $('#application').html(response.data.application);
      // user info
      if(!response.data.user){
        $( 'names').hide();
      } else{
        $('#firstName').text(response.data.user.first_name);
        $('#lastName').text(response.data.user.last_name);
      }
 

      $('#description').html(response.data.description);
      $('#category_name').text(response.data.category.name);
      $('#Subcategory_name').text(response.data.subcategory.name);
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
      if (!response.data.crop_request[0]){
          $("#cropRequest").hide();
          $("#requestAvail").show();
      }else {

    
      let count = response.data.crop_request[0];
      $('#country').text(count.country);
      $('#address').text(count.address);
      $('#zipCode').text(count.zip);
      $('#cropId').text(count.crop_id);
      $('#lastUpdate').text(count.updated_at);
      $('#state').text(count.state);
      $('#deliveryMethod').text(count.delivery_method);
      $('#deliveryWindow').text(count.delivery_window)
      }
      // let deliverywindow = JSON.parse(count.delivery_window)
      // $('#from').html(deliverywindow.from);
      // $('#to').html(deliverywindow.to);
      // // console.log(JSON.parse(count.delivery_window))
      // $('#deliveryDate').text(count.delivery_date);
      // // crop request end

      var photo = JSON.parse(response.data.images);
        console.log(photo, "ssss")
        // $("#images").append('<img src='+photo+' />');
      // $('#images').append(JSON.parse(response.data.images))
      console.log(JSON.parse(response.data.images),"bambam")

     
    
     }
    
    // loader('#tbdata')
    // $('#tbdata').html(rowContent);
  });
}
const watchVideo = () => {

  var settings = querySetting("api/admin/crop/getbyid/" + localStorage.getItem('singlecropdata'), "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    console.log(response);
    if (response.error == true) {
      alert(response.error);
      
    } else{
      let video = response.data.video;
      let videos =video.replace('watch?v=','embed/');
      // alert(videos)
      $("#vidFeed").attr("src",videos);
      
      // window.open(video);
      // return false;
    
     } 
  
  });
  

}
// video modal iframe 
$(document).ready(function() { 
  // Watch More Link click handlers
      const $popup = $('.video-popup');
      const $videoModal = $('#videoModal');
      const $closeIcon = $('.close');
      const $watchMoreLink = $('.watch-more');
  
      $watchMoreLink.click(function(e) {
          $popup.fadeIn(200);
          $videoModal.fadeIn(200);
          e.preventDefault();
      });
      $closeIcon.click(function () {
          $popup.fadeOut(200);
          $videoModal.fadeOut(200);
      });
      // for escape key
      $(document).on('keyup',function(e) {
          if (e.key === "Escape") {
             $popup.fadeOut(200);
             $videoModal.fadeOut(200);
          }
      });
      // click outside of the popup, close it
      $videoModal.on('click', function(e){
          $popup.fadeOut(200);
          $videoModal.fadeOut(200);
      });
  });


/* -------------------------------------------------------------------------- */
/*                             Crop offered begins                            */
/* -------------------------------------------------------------------------- */
function cropsOffered() {

  loader('#cropofferdata', 10)

  var settings = querySetting("api/admin/crop/getbycropoffer", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      console.log(response.message);

    } else {
      console.log(response.data)

      let thedata = response.data;

      thedata = thedata
      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {

          let user;
          if(!row.user){
          //  user = 'Null'
          }else{
           user = row.user
          }

          let crop_status;
          if (user.status == 1) {
            crop_status =
              `<div class="py-1 text-center rounded-pill successalert">
                      <span class="rounded-circle p-1 dot d-inline-block"></span>
                      <strong class="text-success" style="font-size:12px;">ACTIVE</strong>
                    </div>`;
          } else {
            crop_status =
              `<div class="py-1 text-center rounded-pill past-due">
                      <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                      <strong class="text-past"  style="font-size:12px;">IN ACTIVE</strong>
                    </div>`;
          }
          
       

          index = index + 1;
          rowContent +=
            `<tr class=" align-items-center">
                <td>${index}</td>
                <td><strong class="text-secondary">${user.first_name} ${user.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${user.type}</small>
                </td>
                <td class="text-primary">${user.email}</td>
                <td><strong class="text-capitalize">${row.category.name}</strong> <br> <small class="text-primary fw-bold text-uppercase">${row.subcategory.name}</small> </td>
                <td>${crop_status}</td>
                <td style="cursor:pointer;" class="text-center">
                  <a href="javascript:void(0)" class="success-color" onclick="viewMoreCrop('${row.id}')"> <i class="fa fa-eye"></i> View</a>
                </td>
                
  
              </tr>`;
        });
     
        $('#cropofferdata').html(rowContent);
        $(document).ready(function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader: {
              header: true,
              footer: true
            }
          });
        });
      } else {
        $('#cropofferdata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Crop For Sale yet</h3></td></tr>");
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
function cropsAuctioned() {

  loader('#cropauctiondata', 10)

  var settings = querySetting("api/admin/crop/getbycropauction", "GET", localStorage.getItem('access'));

  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    if (response.error == true) {
      console.log(response.message);

    } else {
      console.log(response.data)
      let thedata = response.data;
      thedata = thedata.rows
      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {

          let crop_status;
          if (row.user.status == 1) {
            crop_status =
              `<div class="py-1 text-center rounded-pill successalert">
                      <span class="rounded-circle p-1 dot d-inline-block"></span>
                      <strong class="text-success" style="font-size:12px;">ACTIVE</strong>
                    </div>`;
          } else {
            crop_status =
              `<div class="py-1 text-center rounded-pill past-due">
                      <span class="rounded-circle p-1 past  d-inline-block me-1"></span>
                      <strong class="text-past"  style="font-size:12px;">IN ACTIVE</strong>
                    </div>`;
          }

          index = index + 1;
          rowContent += `
                <tr class="">
                <td>${index}</td>
                <td><strong class="text-secondary">${row.user.first_name} ${row.user.last_name}</strong><br/>
                  <small class="text-primary fw-bold text-uppercase">${row.user.type}</small>
                </td>
                <td class="text-primary">${row.user.email}</td>
                <td><strong class="text-capitalize">${row.category.name}</strong> <br> <small class="text-primary fw-bold text-uppercase">${row.subcategory.name}</small> </td>
                <td>${crop_status}</td>
                <td style="cursor:pointer;" class="text-center">
                  <a href="javascript:void(0)" class="success-color" onclick="viewMoreCrop('${row.id}')"> <i class="fa fa-eye"></i> View</a>
                </td>
                
  
              </tr>
                `;
        });
        $('#cropauctiondata').html(rowContent);
        $(document).ready(function () {
          $('#allTable').DataTable({
            scrollY: 300,
            scrollX: true,
            scrollCollapse: true,
            retrieve: true,
            paging: true,
            "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
            fixedHeader: {
              header: true,
              footer: true
            }
          });
        });
      } else {
        $('#cropauctiondata').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Crop For Auction yet</h3></td></tr>");
      }
    }
  });

};

/* -------------------------------------------------------------------------- */
/*                             CROP DATA ENDS HERE                            */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                               LANDING SECTION                              */
/* -------------------------------------------------------------------------- */

/* ---------------------------- Edit page section --------------------------- */
const pageSection = () => {
  let btnTxt = $('#btntext').val();
  let btnLink = $('#btnlink').val();
  let desc = $('#ctadesc').val();

  if(btnTxt !== "" || btnLink !== ""){
    let createPageSection = {
      "buttontext":btnTxt,
      "buttonlink":btnLink,
      "description":desc,
    };

    var stn = urlSetup("components/1", "GET");

      $.ajax(stn).done(function (data) {



        let response = data;

        let mycalltoaction= JSON.parse(response.data.attributes.componentcontent).calltoaction;
        // console.log(mycalltoaction)
     
        let mybuttons= mycalltoaction;
        
        mybuttons.push(createPageSection);
        // console.log(mybuttons)
        let companyLogoURL = JSON.parse(response.data.attributes.componentcontent).logourl;
        let companyLogoID = JSON.parse(response.data.attributes.componentcontent).logoid;
        
        const settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://api.studioxcreative.ng/api/components/1",
          "method": "PUT",
          "headers": {
            "accept": "application/json",
            "Authorization": "Bearer 30fb714e913879f2f6b0f3d7b3be13aa64366669ad8b1e20937b49a28619e0db097017fe01280c9489e02cfe493687e6646e3bd013adeadb8390adaff6630a590e90e2225eb6b067cb0a7ead4c84d328b24f8303b9c809d9f6af3dd359d4065b2872f4dc9a710d473c8dd7d3868117533051212c69805b76212856c8e8c57ee6",
            "Content-Type": "application/json"
          },
          "processData": false,
          "data": JSON.stringify({
            "data": {
              "title": "navbar",
              "componentcontent": JSON.stringify({
                  "logourl": companyLogoURL,
                  "logoid": companyLogoID,
                  "calltoaction": mybuttons
              }),
              "componentjs": ""
            }
          })
        };
  
        $.ajax(settings).done(function (response) {
          listNavBarSections();
        });
      });
  }else{
    swal("ERROR", "Button text and button link required", "error");
  }
}
/* ------------------------------ button click ------------------------------ */
$('#addPage').click(pageSection);



// componentcontent: '{\n"logourl":"",\n"logoid":"",\n"calltoaction":[\n{"buttontext":"",\n "buttonlink":"",\n "description":"",\n}\n\n]\n\n\n\n\n\n}'

// list the navbar contents
const listNavBarSections = () => {
  var settings = urlSetup("components/1", "GET");
  
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);
    
    document.querySelector('#output').setAttribute('src', JSON.parse(response.data.attributes.componentcontent).logourl);
    
    let mycalltoaction= JSON.parse(response.data.attributes.componentcontent).calltoaction;
    console.log(mycalltoaction)
    let rowContent;
    if(mycalltoaction.length > 0){
      $.each(mycalltoaction, (index, row) => {
        index = index + 1;
        rowContent += `
          <tr class="align-items-middle">
            <td style="min-width: 50px">
              <span class="align-items-center">${index}</span>
            </td>
            <td style="min-width: 100px">
              <strong class="welcome"
                >${row.buttontext}</strong
              >
            </td>
            <td style="min-width: 100px">
              <strong class="welcome"
                >${row.buttonlink}</strong
              >
            </td>
            <td style="min-width: 100px">
              <a href="javascript:void" onclick="swal('${row.description}')" class="welcome text-warning">View Text</a>
            </td>
          </tr>`;
      });
    }else{
      rowContent = `<tr class="align-items-middle">
        <td colspan="5" class="text-center"><h3 class="py-4">No CALLS TO ACTION</h3></td>
      </tr>`
    }
    $('#homeLanding').html(rowContent);
  });
}

/* ---------------------------- show Zowasel Logo --------------------------- */
var loadFile = function (event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("output");
    output.src = reader.result;

  };
  reader.readAsDataURL(event.target.files[0]);

  let blob = event.target.files[0];
  let fd = new FormData();
  fd.append("image", blob);

  // 
  fetch('https://filesapi.growsel.com/upload.php', {
    method: 'POST',
    body: fd
  })
  .then(response => response.json())
  .then(data => {
    if(data.error == false){
      let companyLogoURL = data.data.imageLink;
      let companyLogoID = data.data.documentid;
      var stn = urlSetup("components/1", "GET");

      $.ajax(stn).done(function (data) {
        let response = data;
        // console.log(response);
        let landingCTAs = JSON.parse(response.data.attributes.componentcontent).calltoaction;
        // console.log(JSON.parse(landingCTAs))
        const settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://api.studioxcreative.ng/api/components/1",
          "method": "PUT",
          "headers": {
            "accept": "application/json",
            "Authorization": "Bearer 30fb714e913879f2f6b0f3d7b3be13aa64366669ad8b1e20937b49a28619e0db097017fe01280c9489e02cfe493687e6646e3bd013adeadb8390adaff6630a590e90e2225eb6b067cb0a7ead4c84d328b24f8303b9c809d9f6af3dd359d4065b2872f4dc9a710d473c8dd7d3868117533051212c69805b76212856c8e8c57ee6",
            "Content-Type": "application/json"
          },
          "processData": false,
          "data": JSON.stringify({
            "data": {
              "title": "navbar",
              "componentcontent": JSON.stringify({
                  "logourl": companyLogoURL,
                  "logoid": companyLogoID,
                  "calltoaction": landingCTAs
              }),
              "componentjs": ""
            }
          })
        };
  
        $.ajax(settings).done(function (response) {
          // console.log(response);
          listNavBarSections()
        });

      });

    }else{
      swal("ERROR",data.message,"ERROR")
    }
  })
  .catch((e) => console.log(e))
  
};




/* ------------------------------ page sections ----------------------------- */
const AddPageSection = () => {
  let pn = $('#pagename').val();
  let pd = $('#pagedesc').val();
  let hl = $('#route').val();

  if(pn !== "" || hl !== ""){
    let createPageSection = JSON.stringify({
      data: {
        "pagename":pn,
        "pagedescription":pd,
        "hashroute":hl,
      }
    });

    console.log(createPageSection)
        
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.studioxcreative.ng/api/pages",
      "method": "POST",
      "headers": {
        "accept": "application/json",
        "Authorization": "Bearer 30fb714e913879f2f6b0f3d7b3be13aa64366669ad8b1e20937b49a28619e0db097017fe01280c9489e02cfe493687e6646e3bd013adeadb8390adaff6630a590e90e2225eb6b067cb0a7ead4c84d328b24f8303b9c809d9f6af3dd359d4065b2872f4dc9a710d473c8dd7d3868117533051212c69805b76212856c8e8c57ee6",
        "Content-Type": "application/json"
      },
      "processData": false,
      "data": createPageSection
    };

    $.ajax(settings).done(function (response) {
      allPageSections();
      swal("SUCCESS", "Page Route Added Successfully", "success");
    });
    
  }else{
    swal("ERROR", "Page text and page route required", "error");
  }
}
/* ------------------------------ button click ------------------------------ */
$('#addPageSections').click(AddPageSection);


const allPageSections = () => {
  var settings = urlSetup("pages", "GET");
  
  $.ajax(settings).done(function (data) {
    let response = data;
    let allps = response.data;
    
    let rowContent;
    if(allps.length > 0){

        $.each(allps, (index, row) => {
          index = index + 1;
          rowContent += `
            <tr class="align-items-middle">
              <td style="min-width: 50px">
                <span class="align-items-center">${index}</span>
              </td>
              <td style="min-width: 100px">
                <strong class="welcome"
                  >${row.attributes.pagename}</strong
                >
              </td>
              <td style="min-width: 100px">
                <strong class="welcome"
                  >${row.attributes.hashroute}</strong
                >
              </td>
              <td style="min-width: 100px">
                <a href="javascript:void(0)" onclick="swal('${row.attributes.pagedescription}')" class="welcome text-warning">View Text</a>
              </td>
              <td style="min-width: 100px">
                <a href="javascript:void(0)" class="welcome text-info">
                  <small class="fa fa-pencil"></small>
                </a>
              </td>
              <td style="min-width: 100px">
                <a href="javascript:void(0)" onclick="delPageSections('${row.id}')" class="welcome text-danger">
                  <small class="fa fa-trash"></small>
                </a>
              </td>
            </tr>`;
        });
    }else{
      rowContent = `<tr class="align-items-middle">
        <td colspan="6" class="text-center"><h3 class="py-4">No PAGES CREATED YET</h3></td>
      </tr>`;
    }

    $('#homeLanding').html(rowContent);
  });
}

/* --------------------------- delete page section -------------------------- */
const delPageSections = (id) => {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": `https://api.studioxcreative.ng/api/pages/${id}`,
    "method": "DELETE",
    "headers": {
      "accept": "application/json",
      "Authorization": "Bearer 30fb714e913879f2f6b0f3d7b3be13aa64366669ad8b1e20937b49a28619e0db097017fe01280c9489e02cfe493687e6646e3bd013adeadb8390adaff6630a590e90e2225eb6b067cb0a7ead4c84d328b24f8303b9c809d9f6af3dd359d4065b2872f4dc9a710d473c8dd7d3868117533051212c69805b76212856c8e8c57ee6",
      "Content-Type": "application/json"
    },
    "processData": false
  };

  $.ajax(settings).done(function (response) {
    allPageSections();
    swal("SUCCESS", "Page Route Deleted Successfully", "success");
  });
}



/* ----------------------------- footer section ----------------------------- */
  /* ---------------------------- show Zowasel Logo --------------------------- */
var loadFooterLogo = function (event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("output");
    output.src = reader.result;

  };
  reader.readAsDataURL(event.target.files[0]);

  let blob = event.target.files[0];
  let fd = new FormData();
  fd.append("image", blob);

  // 
  fetch('https://filesapi.growsel.com/upload.php', {
    method: 'POST',
    body: fd
  })
  .then(response => response.json())
  .then(data => {
    if(data.error == false){
      let companyLogoURL = data.data.imageLink;
      let companyLogoID = data.data.documentid;
      var stn = urlSetup("components/2", "GET");

      $.ajax(stn).done(function (data) {
        let response = data;
        // console.log(response);
        let footerLinks = JSON.parse(response.data.attributes.componentcontent);
        console.log(footerLinks)
        formInfo = JSON.stringify({
          "logourl":companyLogoURL,
          "logoid":companyLogoID,
          "companyaddress": footerLinks.companyaddress,
          "companyemail": footerLinks.companyemail,
          "companymobile": footerLinks.companymobile,
          "googleplaylink": footerLinks.googleplaylink,
          "appstorelink": footerLinks.appstorelink,
          "copyrighttext":footerLinks.copyrighttext,
          "facebookpagelink":footerLinks.facebookpagelink,
          "instagrampagelink":footerLinks.instagrampagelink,
          "linkedinpagelink":footerLinks.linkedinpagelink,
          "twitterpagelink":footerLinks.twitterpagelink
        })
        const settings = {
          "async": true,
          "crossDomain": true,
          "url": "https://api.studioxcreative.ng/api/components/2",
          "method": "PUT",
          "headers": {
            "accept": "application/json",
            "Authorization": "Bearer 30fb714e913879f2f6b0f3d7b3be13aa64366669ad8b1e20937b49a28619e0db097017fe01280c9489e02cfe493687e6646e3bd013adeadb8390adaff6630a590e90e2225eb6b067cb0a7ead4c84d328b24f8303b9c809d9f6af3dd359d4065b2872f4dc9a710d473c8dd7d3868117533051212c69805b76212856c8e8c57ee6",
            "Content-Type": "application/json"
          },
          "processData": false,
          "data": JSON.stringify({
            "data": {
              "title": "footer",
              "componentcontent": formInfo,
              "componentjs": ""
            }
          })
        };
  
        $.ajax(settings).done(function (response) {
          // console.log(response);
          listFooterSections()
        });

      });

    }else{
      swal("ERROR",data.message,"error")
    }
  })
  .catch((e) => console.log(e))
  
};

const listFooterSections = () => {
  var settings = urlSetup("components/2", "GET");
  
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    let footerLinks = JSON.parse(response.data.attributes.componentcontent);
    document.querySelector('#output').setAttribute('src', footerLinks.logourl);
    // console.log(footerLinks.logoid);
    
    let rowContent;
    if(footerLinks){
      rowContent += `
        <tr class="align-items-middle">
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.companyaddress}</strong
            >
          </td>
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.companyemail}</strong
            >
          </td>
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.companymobile}</strong
            >
          </td>
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.googleplaylink}</strong
            >
          </td>
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.appstorelink}</strong
            >
          </td>
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.copyrighttext}</strong
            >
          </td>
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.facebookpagelink}</strong
            >
          </td>
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.instagrampagelink}</strong
            >
          </td>
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.linkedinpagelink}</strong
            >
          </td>
          <td style="min-width: 100px">
            <strong class="welcome"
              >${footerLinks.twitterpagelink}</strong
            >
          </td>
        </tr>`;
    }else{
      rowContent = `<tr class="align-items-middle">
        <td colspan="5" class="text-center"><h3 class="py-4">No CALLS TO ACTION</h3></td>
      </tr>`
    }
    $('#homeLanding').html(rowContent);
  });
}

const createFooterLinks = () => {

  let compaddr = $('#companyaddr').val();
  let compmail = $('#companymail').val();
  let compfone = $('#companyfone').val();
  let gplay = $('#gplay').val();
  let apple = $('#applelink').val();
  let cright = $('#copyrighttext').val();
  let fb = $('#fblink').val();
  let insta = $('#instalink').val();
  let linked = $('#linkedinlink').val();
  let tweet = $('#twitlink').val();

  var settings = urlSetup("components/2", "GET");
  
  $.ajax(settings).done(function (data) {
    let response = data;
    console.log(response);

    let footerLinks = JSON.parse(response.data.attributes.componentcontent);
    
    
    if(compaddr !== "" || compmail !== "" || compfone !== "" || gplay !== "" || apple !== "" || cright !== "" || fb !== "" || insta !== "" || linked !== "" || tweet !== ""){
      // let createPageSection = JSON.stringify({
        // data: {
        //   "pagename":pn,
        //   "pagedescription":pd,
        //   "hashroute":hl,
        // }
      formInfo = JSON.stringify({
        "logourl": footerLinks.logourl,
        "logoid": footerLinks.logoid,
        "companyaddress": compaddr,
        "companyemail": compmail,
        "companymobile": compfone,
        "googleplaylink": gplay,
        "appstorelink": apple,
        "copyrighttext":cright,
        "facebookpagelink":fb,
        "instagrampagelink":insta,
        "linkedinpagelink":linked,
        "twitterpagelink":tweet
      })
  
      const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.studioxcreative.ng/api/components/2",
        "method": "PUT",
        "headers": {
          "accept": "application/json",
          "Authorization": "Bearer 30fb714e913879f2f6b0f3d7b3be13aa64366669ad8b1e20937b49a28619e0db097017fe01280c9489e02cfe493687e6646e3bd013adeadb8390adaff6630a590e90e2225eb6b067cb0a7ead4c84d328b24f8303b9c809d9f6af3dd359d4065b2872f4dc9a710d473c8dd7d3868117533051212c69805b76212856c8e8c57ee6",
          "Content-Type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify({
          "data": {
            "title": "footer",
            "componentcontent": formInfo,
            "componentjs": ""
          }
        })
      };
  
      $.ajax(settings).done(function (response) {
        // console.log(response);
        swal("SUCCESS", "Footer links added successfully", "success");
        listFooterSections()
      });
      
    } else {
      swal("ERROR", "All footer links required" ,"error")
    }
  });

}

/* ------------------------------ button click ------------------------------ */
$('#addFooter').click(createFooterLinks);
/* -------------------------------------------------------------------------- */
/*                           END OF LANDING SECTION                           */
/* -------------------------------------------------------------------------- */





/* -------------------------------------------------------------------------- */
/*                                USERS SECTION                               */
/* -------------------------------------------------------------------------- */
/* ----------------------------- form controller ---------------------------- */

const checkEmptyField = (formdata) => {
  let fields = [];
  for(let i = 0; i < formdata.length; i++){
    if(formdata[i] == ""){
      fields.push(true);
    }else{
      fields.push(false);
    }
  }

  return fields;
}

const swapLocation = (loc = "") => {
  $('.regForms').addClass('d-none');

  if(loc != ""){
    // $('.regForms').addClass('d-none');
    /* -------------------------- show the kyc section -------------------------- */
    if(loc == "kyc"){

      $('#kycDoc').removeClass('d-none');
      
    } else if (loc == "individual") {

      $('#individual').removeClass('d-none');
    
    } else if (loc == "stageOne") {

      $('#stageOne').removeClass('d-none');

    } else if (loc == "company") {
      
      $('#company').removeClass('d-none');

    } else if (loc == "kyb") {
      
      $('#kybDocs').removeClass('d-none');

    }
  }
}

// validate password
function checkPassword(str){
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
}


function swapFormInd(loc = ""){
  var accountType = $("#accountype").val();
  var usertype = $("#usertype").val();

  // if(userAccess == 'ind'){
  if(!accountType || !usertype){
    swal("All fields required!");
  }

  if(accountType == "individual"){
    if(loc == ""){
      swapLocation("individual");
    }else{
      swapLocation(loc);
    }

    if(loc == "kyc"){
      /* -------------- get all variables filled within this section -------------- */
      let fn = $('#firstname').val();
      let ln = $('#lastname').val();
      let em = $('#email').val();
      let pn = $('#mobilenumber').val();
      let pw = $('#password').val();
      let cp = $('#confirmpassword').val();

      if(jQuery.inArray(true, (checkEmptyField([fn, ln, em, pn, pw, cp]))) > -1){
        swapLocation('individual');
        swal("All fields required");
      } else {

        if(checkPassword(pw)){
          if(pw == cp){
            swapLocation(loc);
          }else{
            swapLocation('individual');
            swal("ERROR", "Passwords do not match", "error")
          }
        }else{
          swapLocation('individual');
          swal("ERROR", "Passwords must contain a uppercase, a lowercase, a number, a special character and at least 8 characters long", "warning")
        }
      }

    }


  }else if (accountType == 'company'){
    window.location.assign('add-company.html');
  }
}


function swapFormComp(loc = ""){
  if(loc == "kyc"){ 
    /* -------------- get all variables filled within this section -------------- */
    let fn = $('#firstname').val();
    let ln = $('#lastname').val();
    let em = $('#email').val();
    let pn = $('#mobilenumber').val();
    let pw = $('#password').val();
    let cps = $('#confirmpassword').val();
    let cn = $('#companyname').val();
    let cc = $('#companycountry').val();
    let cs = $('#companystate').val();
    let ca = $('#companyaddress').val();
    let conp = $('#contactperson').val();
    let rcn = $('#rcnumber').val();
    let cw = $('#companywebsite').val();
    let ce = $('#companyemail').val();
    let cp = $('#companyphone').val();
    let at = $('#accountype').val();


    if(fn == '' || ln == '' || em == '' || pn == '' || pw == '' || cps == '' || cc == '' || ca == '' || cs == '' || cn == '' || conp == '' || rcn == '' || cw == '' || ce == '' || cp == '' || at == ''){
      loc = 'company';
      swapLocation(loc);
      swal("All fields required");
    } else {

      if(checkPassword(pw)){
        if(pw == cps){
          swapLocation(loc)
        }else{
          loc = 'company';
          swapLocation(loc);
          swal("ERROR", "Passwords do not match", "error")
        }
      }else{
        loc = 'company';
        swapLocation(loc);
        swal("ERROR", "Passwords must contain a uppercase, a lowercase, a number, a special character and at least 8 characters long", "warning")
      }
    }

    if(loc == "kyb"){
      let id = $('#idtype').val();
      let idno = $('#idnumber').val();
      let bvn = $('#bvn').val();

      let blob = document.querySelector('#frontImg').files[0];
      let blo = document.querySelector('#backImg').files[0];
      if(blob && blo){
        if(id == "" || idno == "" || bvn == ""){
          swal("ERROR", "All fields required", "warning");
        }else{
          swal("success")
        }
      }else{
        swal("ERROR", "ID front and back image required", "warning");
      }
    } else{
      swapLocation(loc);
    }

  }else{
    swapLocation(loc)
  }
  // if(accountType == "company"){


  // }else if (accountType == 'comp'){
  //   window.location.assign('add-company.html');
  // }
}

function checkKYCDocForBusinessOwner(loc = ""){
  if(loc == "kyb"){
    let id = $('#idtype').val();
    let idno = $('#idnumber').val();
    let bvn = $('#bvn').val();

    let blob = document.querySelector('#frontImg').files[0];
    let blo = document.querySelector('#backImg').files[0];
    if(blob && blo){
      if(jQuery.inArray(true, (checkEmptyField([id, idno, bvn]))) > -1){
        swal("ERROR", "All fields required", "warning");
      }else{
        swapLocation(loc);
      }
    }else{
      swal("ERROR", "ID front and back image required", "warning");
    }
  } else{
    swapLocation(loc);
  }
}

$(".file-upload-field").on("change", function(){ 
  $(this).parent(".file-upload-wrapper").attr("data-text",$(this).val().replace(/.*(\/|\\)/, '') );
});
/* -------------------------------- add users ------------------------------- */

// define a variable for holding the data collected
var showUploadedImage = function (event, id) {

  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById(id);
    output.src = reader.result;

  };
  reader.readAsDataURL(event.target.files[0]);
  // let fd = new FormData();
  // fd.append("image", blob);
}


const createNewUserWithBusiness = () => {
  let mou = document.querySelector('#mou').files[0];
  let cac = document.querySelector('#cac').files[0];
  let fis = document.querySelector('#finStat').files[0];
  if(mou && cac && fis){

    let img3, img4, img5;
    let fd = new FormData();
    // img1
    fd.append("image", blob);
    fetch('https://filesapi.growsel.com/upload.php', {
      method: 'POST',
      body: fd
    })
    .then(response => response.json())
    .then(data => {
      if(data.error == false){
        img1 = data.data.imageLink
        
        fd = new FormData();
        fd.append("image", blo);
        // img 2
        fetch('https://filesapi.growsel.com/upload.php', {
          method: 'POST',
          body: fd
        })
        .then(response => response.json())
        .then(data => {
          if(data.error == false){
            img2 = data.data.imageLink;
            // img3
            fd = new FormData();
            fd.append("image", mou);
            fetch('https://filesapi.growsel.com/upload.php', {
              method: 'POST',
              body: fd
            })
            .then(response => response.json())
            .then(data => {
              if(data.error == false){
                img3 = data.data.imageLink
                // img4
                fd = new FormData();
                fd.append("image", cac);
                fetch('https://filesapi.growsel.com/upload.php', {
                  method: 'POST',
                  body: fd
                })
                .then(response => response.json())
                .then(data => {
                  if(data.error == false){
                    img4 = data.data.imageLink
                    // img5
                    fd = new FormData();
                    fd.append("image", fis);
                    fetch('https://filesapi.growsel.com/upload.php', {
                      method: 'POST',
                      body: fd
                    })
                    .then(response => response.json())
                    .then(data => {
                      if(data.error == false){
                        img5 = data.data.imageLink

                        /* ---------------------- execute the createkyb command --------------------- */
                        if(img2 !== "" && img1 !== "" && img3 !== "" && img4 !== "" && img5 !== ""){
                          let usrdata = JSON.stringify({
                          "first_name": fn,
                          "last_name": ln,
                          "email": em,
                          "phone": pn,
                          "password": pw,
                          "user_type": at,
                          "id_type":id,
                          "id_front":img1,
                          "id_back":img2,
                          "id_number":idno,
                          "bvn":bvn,
                          "has_company": "true",
                          "company_name": cn,
                          "company_address": ca,
                          "company_state": cs,
                          "company_country": cc,
                          "contact_person": conp,
                          "rc_number": rcn,
                          "company_website": cw,
                          "company_email": ce,
                          "company_phone": cp,
                          "tax_id":"ry6734oo",
                          "cac":"https://files.jotform.com/jotformapps/employee-of-the-month-certificate-template-f457f340a8dd4b2abf46f97264584df7.png?v=1679988231",
                          "financial_statement":"https://files.jotform.com/jotformapps/employee-of-the-month-certificate-template-f457f340a8dd4b2abf46f97264584df7.png?v=1679988231",
                          "mou":"https://files.jotform.com/jotformapps/employee-of-the-month-certificate-template-f457f340a8dd4b2abf46f97264584df7.png?v=1679988231"
                        });
            //   const settings = {
            //     "url": `https://adminapi.growsel.com/api/admin/users/register`,
            //     "method": "POST",
            //     "timeout": 0,
            //     "headers": {
            //       "Authorization": localStorage.getItem('access'),
            //       "Content-Type": "application/json"
            //     },
            //     data: usrdata
            //   };
            //   $.ajax(settings).done(function (response) {
            //     console.log(response);
            //     if (response.error == true) {
            //       swal("SUCCESS", "User registered successfully", "success");
            //       setInterval(() => {
            //         window.location.reload();
            //       }, 2000);
            //     } else {
            //       swal("ERROR", response.message, "error");
            //     }

            //   });
            // }else{
            //   swal("ERROR", "Request failed, please try again", "error");
            }
                      }
                    })
                    .catch((e) => console.log(e))
                  }
                })
                .catch((e) => console.log(e))
            
            
              }
            })
            .catch((e) => console.log(e))

          }
        })
        .catch((e) => console.log(e))
      }
    })
    .catch((e) => console.log(e))
  }else{
    swal("ERROR", "ID front and back image required", "warning");
  }
}


const createNewUser = () => {
  var atype = $("#accountype").val();
  var utype = $("#usertype").val();
  let firstn = $('#firstname').val();
  let lastn = $('#lastname').val();
  let email = $('#email').val();
  let pno = $('#mobilenumber').val();
  let pass = $('#password').val();
  let cpass = $('#confirmpassword').val();
  let id = $('#idtype').val();
  let idno = $('#idnumber').val();
  let bvn = $('#bvn').val();

  if(jQuery.inArray(true, (checkEmptyField([atype, utype, firstn, lastn, email, pno, pass, cpass, id, idno, bvn]))) == -1){

    // let blob = event.target.files[0];

    let blob = document.querySelector('#frontImg').files[0];
    let blo = document.querySelector('#backImg').files[0];
    if(blob && blo){

      let img1, img2;
      bvn
      let fd = new FormData();
      fd.append("image", blob);
      fetch('https://filesapi.growsel.com/upload.php', {
        method: 'POST',
        body: fd
      })
      .then(response => response.json())
      .then(data => {
        if(data.error == false){
          img1 = data.data.imageLink
          
          fd = new FormData();
          fd.append("image", blo);

          fetch('https://filesapi.growsel.com/upload.php', {
            method: 'POST',
            body: fd
          })
          .then(response => response.json())
          .then(data => {
            if(data.error == false){
              img2 = data.data.imageLink;
              if(img2 !== "" || img1 !== ""){
                let usrdata = JSON.stringify({
                  "first_name": firstn,
                  "last_name": lastn,
                  "email": email,
                  "phone": pno,
                  "password": pass,
                  "user_type": utype,
                  "id_type": id,
                  "id_front": img1,
                  "id_back": img2,
                  "id_number":idno,
                  "bvn":bvn
                });
                const settings = {
                  "url": `https://adminapi.growsel.com/api/admin/users/register`,
                  "method": "POST",
                  "timeout": 0,
                  "headers": {
                    "Authorization": localStorage.getItem('access'),
                    "Content-Type": "application/json"
                  },
                  data: usrdata
                };
                $.ajax(settings).done(function (response) {
                  console.log(response);
                  if (response.error == true) {
                    swal("SUCCESS", "User registered successfully", "success");
                    setInterval(() => {
                      window.location.reload();
                    }, 2000);
                  } else {
                    swal("ERROR", response.message, "error");
                  }
  
                });
              }else{
                swal("ERROR", "Request failed, please try again", "error");
              }

            }
          })
          .catch((e) => console.log(e))
        }
      })
      .catch((e) => console.log(e))
    }else{
      swal("ERROR", "ID front and back image required", "warning");
    }
    // let fd = new FormData();
    // fd.append("image", blob);
  }else{
    swal("ERROR", "Unable to complete the request at the moment", "error");
  }
}
/* -------------------------------------------------------------------------- */
/*                            END OF USERS SECTION                            */
/* -------------------------------------------------------------------------- */

