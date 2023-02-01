/* -------------------------------------------------------------------------- */
/*                           Hide and show password                         */
/* -------------------------------------------------------------------------- */
let state = false;

function myFunction(show) {
  // show.classList.toggle('fa-eye');
  let eyes = document.getElementById("eyetoggle");
  eyes.classList.toggle("fa-eye-slash");
  eyes.classList.toggle("fa-eye");
}

function toggle() {
  if (state) {
    password.setAttribute("type", "password");
    state = false;
  } else {
    password.setAttribute("type", "type");
    state = true;
  }
}
/* -------------------------------------------------------------------------- */
/*                         Hide and show password End                       */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                Login Loader Begins                         */
/* -------------------------------------------------------------------------- */

const toggleSpinner = () => {
  document.querySelector('#spinner').classList.toggle('d-none');
}

/* -------------------------------------------------------------------------- */
/*                            LoginLoader ends her                            */
/* -------------------------------------------------------------------------- */

function yourButton(){
  toggleSpinner();
    // selecting the input element and get its value 
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    
    var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

    if(!email.value){
        swal("Enter an email address!");
        email.focus();
        return false;
    }else if(!password.value){
        swal("Enter your password!");
        email.focus();
        return false;
    }else if(!(email.value.match(mailformat))){
        swal("You have entered an invalid email address!");
        email.focus();
        return false;
    }else {
      var settings = {
        "url": "https://vgsvbgpmm2.us-east-1.awsapprunner.com/api/admin/auth/login",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "email": email.value,
          "password": password.value
        }),
        // look here
        // this is where the error is displayed.
        error: function(e) {
          toggleSpinner();
          swal("FAILED", e.responseJSON.message, "error");
        }
      };
      

    //  ------- if login is successfull go to admin page -----------//

    $.ajax(settings).done(function (response) {
      if(response.error){
        toggleSpinner();
        swal("FAILED", response.message, "error");
        return false;
      }else{
        toggleSpinner();
        swal("SUCCESS", response.message, "success");
          localStorage.setItem('access',"Bearer "+response.token);
          localStorage.setItem('adminkey',response.keyid);
          localStorage.setItem('admin', JSON.stringify(response.data));
          setTimeout(()=>{
              location.href="../dashboards/user-stats.html";
          },3000)
      }
    });
  }
   
    
};

// -------------------------  log in Ends Here ----------------------//