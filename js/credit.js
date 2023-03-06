


/* -------------------------------------------------------------------------- */
/*                               spliting begins                              */
/* -------------------------------------------------------------------------- */
// const splittingDate = (data) => {
//   let date = data.split("T")[0];
//   let t = data.split("T")[1];

//   // removing unnessary data from time
//   let time = t.split(".000Z")[0];

//   return date + "<br/>" + time;
// }

/* ---------------------------- Spliting end here --------------------------- */





/* ----------------------------- activate loader ---------------------------- */
// const loader = (contentArea = "", colspan = "") => {
//   document.querySelector(contentArea).innerHTML = `<tr>
//   <td colspan="${colspan}" class="text-center">
//     <img src="../assets/loader.gif" alt=""/>
//   </td>
//   </tr>`
// }
/* ---------------------------- loader ends here ---------------------------- */








// this holds the request headers and bodies
// allows u to make a request
const baseURL = (URL, METHOD, DATA = {}) => {
  const settings = {
    "url": `https://x8ki-letl-twmt.n7.xano.io/${URL}`,
    "method": METHOD,
    "timeout": 0,
    "headers": {
      // "Authorization": AUTHKEY,
      "Content-Type": "application/json"
    },
    data: DATA
  }

  return settings;
}

// end //


/* -------------------------------------------------------------------------- */
/*                     EDITITNG THE LANDING PAGE VIA ADMIN STARTS                   */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                    FETCHING ALL FARMERS BEGINS                    */
/* -------------------------------------------------------------------------- */


function fetchAllFarmers() {
  // loader('#tbdata', 7);


  var settings = baseURL("api:rwfMbhtF/farmer", "GET");

  $.ajax(settings).done(function (data) {
 
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
      $('#farmersData').html("<tr>" + response.message + "</tr>");
    } else {

      var rowContent;
      let thedata = (response.data).reverse();
      $.each(thedata, (index, row) => {
        // console.log(thedata,);

        index = index + 1;
        rowContent
          += `
          <tr>
          <td>${index}</td>
          <td><strong class="welcome">${row.firstname}</strong>, <strong class="welcome">${row.lastname}</strong>
          <br/><small class="text-primary">${row.email}</small></td>
          <td><strong class="text-primary">${row.mobile}</strong></td>
          <td><strong class="welcome text-uppercase">${row.gender}</strong></td>
          <td><a href="javascript:void(0)" class="text-white btn-md py-2 px-4 th-btn rounded-pill" onclick="viewFarmer('${row.farmerid}')">VIEW</a></td>
          </tr>`;
      });
      // alert(response.data.length);
      $('#farmersData').html(rowContent);
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

const viewFarmer = (farmerid)=>{
  // alert(farmerid)
  localStorage.setItem('farmerID', farmerid)

  window.location.href="farmer-details.html"
}

const farmerDetails =()=>{

  var settings = baseURL("api:rwfMbhtF/farmerfull/" + localStorage.getItem('farmerID'), "GET",);

  $.ajax(settings).done(function (data) {
    console.log(data);
    let response = data;
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
    } else {

      let details = response.farmer
      $('#first_name').text(details.firstname);
      $('#last_name').text(details.lastname);
      $('#middle_name').text(details.middlename);
      $('#email').text(details.email);
      $('#mobile').text(details.mobile);
      $('#gender').text(details.gender);
      $('#marital_status').text(details.maritalstatus);
      $('#language').text(details.languagesspoken);
      $('#dob').text(details.dateofbirth);
      $('#country').text(details.country);
      $('#state').text(details.state);
      $('#city').text(details.city);
      $('#address').text(details.address);
      $('#landmark').text(details.landmark);

      // Farmer Bank Information 
      if(!response.farmerbank){
        $('#addBank').show();
        $('#editBank').hide();
      }else{
        $('#addBank').hide();
        $('#editBank').show();
     
      let bank = response.farmerbank
      $('#bank').text(bank.bankname);
      $('#acctName').text(bank.bankaccountname);
      $('#acctNumber').text(bank.bankaccountnumber);
    }
      // Farmer KYF 
      if (!response.farmerkyf){
        $('#farmerKYF').show()
        $('#editFarmerKYF').hide()
      }else{ 
        $('#farmerKYF').hide()
        $('#editFarmerKYF').show()
        response.farmerkyf
        
      let kyf = response.farmerkyf

      let corporativeStatus;
      if (kyf.corporativemembershipstatus == 1) {
        corporativeStatus =
          `<span class="text-primary fs-6">Active</span>`;
      } else {
        corporativeStatus =
          `<span class="text-danger fs-6">In Active</span>`;
      }

      let farmTraining;
      if (kyf.professionalfarmingtraining == 1){
        farmTraining =  `<span class="text-primary fs-6">Yes</span>`
      } else{
        farmTraining =  `<span class="text-danger fs-6">No</span>`
      }

      $('#corName').text(kyf.corporatename);
      $('#corStatus').html(corporativeStatus);
      $('#eduStatus').text(kyf.levelofeducation);
      $('#idCard').text(kyf.meansofidentification);
      $('#idNumber').text(kyf.identificationno);
      $('#training').html(farmTraining);
      $('#experience').text(kyf.yearsoffarmingexperience);
   
      // Farmer Next of Kin 
      let nok = response.farmerkyf.nextofkin 
      $('#nokName').text(nok.fullname);
      $('#nokOccupation').text(nok.occupationnok);
      $('#nokMobile').text(nok.telephonenok);
      $('#nokRelationship').text(nok.relationshipnok);

      // farmer photo 
      if (!kyf.photos){
        $('#imagePics').show()
      }else{
        $('#imagePics').hide()
        var photo = (kyf.photos);
        // console.log(photo, "ssss")
        $("#images").append('<img src='+photo+' />');
      }
    

    }

      // Farmer Farm Information 
      // let farmInfo = response.farminformation
      let thedata = response.farminformation;

      thedata = thedata
      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {
          let landOwner;
      if (row.farmownership == 1){
        landOwner =  `<strong class="text-primary fs-6">Yes</strong>`
      } else{
        landOwner =  `<strong class="text-danger fs-6">No</strong>`
      }
      index = index + 1;
          rowContent += 
          `
          <tr>
              <td >${index}</td>
              <td >
                <strong>${row.farmlocation}</strong> <br>
                <strong>${row.farmsizesqm}SQM</strong>
              </td>

              <td >
                <stong class="text-capitalize fw-bold">${row.farmingtype}</stong>
              </td>
              <td>
                <strong>NGN ${row.estimatedtotalincomeperyear}</strong>
              </td>
              <td>${landOwner}</td>
              <td >
                <button type="button" class="btn btn-sm th-btn text-white rounded-6 fs-9 text-end" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}">
                  VIEW
                </button>
          
                <!-- Modal -->
                <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border">
                            <h4 class="modal-title" id="staticBackdropLabel">Farm Details</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Farm Location:</span>
                              <span class="text-secondary text-capitalize fs-6">${row.farmlocation}</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Farm Size:</span>
                              <span class="text-secondary text-capitalize fs-6">${row.farmsizesqm} SQM</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Farm Practice:</span>
                              <span class="text-secondary text-capitalize fs-6">${row.farmingtype}</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Crop Cultivated:</span>
                              <span class="text-secondary text-capitalize fs-6">${row.croptypes}</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Livestock Reared:</span>
                              <span class="text-secondary text-capitalize fs-6">${row.animaltypes}</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Livestock Number:</span>
                              <span class="text-secondary text-capitalize fs-6">${row.numberofanimals}</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Estd Income Per Year:</span>
                              <span class="text-secondary text-capitalize fs-6">NGN ${row.estimatedtotalincomeperyear}</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Farm Ownership:</span>
                              <span class="text-secondary text-capitalize fs-6">${landOwner}</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Owner Name:</span>
                              <span class="text-secondary text-capitalize fs-6">${row.nameofowner}</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Owner Mobile No.:</span>
                              <span class="text-secondary text-capitalize fs-6">${row.farmownermobile}</span>
                            </div>
                            <div class="d-flex justify-content-between pb-4">
                              <span class="welcome fw-bold fs-6">Lease Year:</span>
                              <span class="text-secondary text-capitalize fs-6">${row.numberofyearsleased} Years</span>
                            </div>
                        </div>

                        <div class="modal-footer border-0">
                            <button type="button" class="btn th-btn text-white" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                    </div>
                </div>
              </td>
          </tr>
          `
        })
        $('#farmData').html(rowContent);
      }

    

      // Farm Practice 
      if(!response.farmpractices){
        $('#farmPractice').show()
        $('#editFarmPractice').hide()
      }else{
        $('#farmPractice').hide()
        $('#editFarmPractice').show()
        response.farmpractices
   
      let practice = response.farmpractices

      let cropRotation;
      if (practice.croprotationpractice == 1){
        cropRotation =  `<span class="text-primary fs-6">Yes</span>`
      } else{
        cropRotation =  `<span class="text-danger fs-6">No</span>`
      }

      $('#fertilizerName').text(practice.listfertilizersused);
      $('#fungiName').text(practice.listoffungicidesused);
      $('#sqmCultivated').text(practice.numberofsqmyoucancultivate);
      $('#viableCrop').text(practice.yourmostviablecrop);
      $('#intendedCrop').text(practice.intendedcrop);
      $('#perCropApply').text(practice.fertilizerappliedpercropcycle);
      $('#perCropSeason').text(practice.totalfertilizerusedperseason);
      $('#cropControlPractice').html(cropRotation);
      $('#controlPractice').text(practice.weedcontrolpractices);
      $('#averageIncome').text(practice.totalaverageincomeperharvest);
    }
      // Loan History of Farmer 
      if(!response.loanhistory){
        $('#loanHistory').show();
        $('#editloanHistory').hide();
      }else{
        $('#loanHistory').hide();
        $('#editloanHistory').show();
        response.loanhistory
     
      let history = response.loanhistory

      let takenLoan;
      if (history.iftakenaloanbefore == 1){
        takenLoan =  `<span class="text-primary fs-6">Yes</span>`
      } else{
        takenLoan =  `<span class="text-danger fs-6">No</span>`
      }

      let repaid;
      if (history.hasitbeenrepaid == 1){
        repaid =  `<span class="text-primary fs-6">Paid</span>`
      } else{
        repaid =  `<span class="text-danger fs-6">Unpaid</span>`
      }

      let difficulty;
      if (history.haddifficultypaying == 1){
        difficulty =  `<span class="text-primary fs-6">Yes</span>`
      } else{
        difficulty =  `<span class="text-danger fs-6">No</span>`
      }

      $('#lonee').html(takenLoan);
      $('#loanAmount').text(history.pastloantakenamountnaira);
      $('#loanSeason').text(history.loantakenseason);
      $('#repayment').html(repaid);
      $('#repayDifficult').html(difficulty);
      $('#modeOfPayment').text(history.howdidyourepay);
      $('#costCultivation').text(history.whatiscostofcultivation);
      $('#costPerseason').text(history.costofcultivationperplantseason);
    }

      // Farm Mechanization 
      let machinedata = response.farmmechanization;

      thedata = machinedata
      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {

          
      index = index + 1;
          rowContent += 
          `
          <tr>
              <td>${index}</td>
              <td><strong>${row.typeofmachine}</strong></td>
              <td><stong class="text-capitalize fw-bold">${row.noofthismachinepossessed}</stong></td>
              <td><strong>NGN ${row.averagecostofmaintenanceinnaira}</strong></td>
              <td><strong>${row.averagenoofyearsused} Years</strong></td>
              <td><strong>${row.noofactiveunits}</strong></td>
              <td><strong>${row.noofdefectiveunits}</strong></td>
              
          </tr>
          `
        })
        $('#farMMechanization').html(rowContent);
      }

    }

  });

}


/* -------------------------------------------------------------------------- */
/*               Adding Famer with their KYF INFORMATION ADDRESS              */
/* -------------------------------------------------------------------------- */


// $("#addFarmer").click(function()
const addFarmer = () => {
  // alert("praise God")
  // Selecting the Element and getting it value 
  var uniq = 'ZOWAFARMER-' + (new Date()).getTime();
 
  
  let uniqID = uniq
  let FirstName = document.getElementById("firstName");
  let surName = document.getElementById("surName")
  let middleName = document.getElementById("middleName")
  let dateBirth = document.getElementById("DOB")
  let mobile = document.getElementById("telePhone")
  let email = document.getElementById("email")
  let gender = document.getElementById("gender")
  let maritalStats = document.getElementById("marriage")
  let languageSpoken = document.getElementById("lanGuages")
  let address = document.getElementById("address")
  let landMark = document.getElementById("landmark")
  let country = document.getElementById("country")
  let state = document.getElementById("state")
  let homeTown = document.getElementById("writew")
// console.log(country.value)

var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

  if (!FirstName.value) {
    swal("Enter first name!", {
      button: false,
    });
    FirstName.focus();
        return false;
  }else if (!surName.value){
    swal("Enter surname!", {
      button:false,
    });
    surName.focus();
    return false;
  }else if (!middleName.value){
    swal("Enter middle name!", {
      button: false,
    });
    middleName.focus();
    return false;
  }else if(!dateBirth.value){
    swal("Enter date of birth!", {
      button: false,
    });
    dateBirth.focus();
    return false;
  }else if(!mobile.value){
    swal("Enter your phone number!", {
      button: false,
    });
    mobile.focus();
    return false;
  }else if(!email.value.match(mailformat)){
    swal("Enter email address or invalid email!", {
      button: false,
    });
    email.focus();
    return false;
  }else if(!gender.value){
    swal("Select your gender!", {
      button: false,
    });
    gender.focus();
    return false;
  }else if(!maritalStats.value){
    swal("Select your marital status!", {
      button: false,
    });
    maritalStats.focus();
    return false;
  }else if(!languageSpoken.value){
    swal("Enter languages you can speak!", {
      button: false,
    });
    languageSpoken.focus();
    return false;
  }else if(!address.value){
    swal("Enter your address!", {
      button: false,
    });
    address.focus();
    return false;
  }else if(!landMark.value){
    swal("Enter a landmark close to your address!", {
      button: false,
    });
    landMark.focus();
    return false;
  }else if(!country.value){
    swal("Select country!", {
      button: false,
    });
    country.focus();
    return false;
  }else if(!state.value){
    swal("Select state!", {
      button: false,
    });
    state.focus();
    return false;
  }else if(!homeTown.value){
    swal("Enter hometown or city!", {
      button: false,
    });
    homeTown.focus();
    return false;
  }
  
  const farmerInfo = JSON.stringify({
    "farmerid":uniqID,
    "email": email.value,
    "firstname": FirstName.value,
    "middlename": middleName.value,
    "lastname": surName.value,
    "mobile": mobile.value,
    "gender": gender.value,
    "languagesspoken": languageSpoken.value,
    "dateofbirth": dateBirth.value,
    "maritalstatus": maritalStats.value,
    "country": country.value,
    "state": state.value,
    "city": homeTown.value,
    "address": address.value,
    "landmark": landMark.value
        });

    var settings = baseURL("api:rwfMbhtF/farmer", "POST", farmerInfo);

    $.ajax(settings).done(function (response) {
      console.log(response);
      if (response.error == true) {
        // console.log(response.message);
        swal("FAILED", response.message, "error");
      } else {
        // console.log(response.message);
        swal("SUCCESS", response.message, "success");
          email.value="",
          FirstName.value="",
          middleName.value="",
          surName.value="",
          mobile.value="",
          gender.value="",
          languageSpoken.value="",
          dateBirth.value="",
          maritalStats.value="",
          country.value="",
          state.value="", 
          homeTown.value="",
          address.value="",
          landMark.value=""
        window.location.href = "farmers.html";
        setTimeout(() => {
          cancelRequest();
        }, 2000)
        fetchAllFarmers();
      }
    });

}

const addBankInfo =()=>{
  // alert("God is Great")
  let farmersID = localStorage.getItem('farmerID');
  let SFarmerID = farmersID
  // alert(SFarmerID)
  let BankName = document.getElementById("bankName")
  let AccountName = document.getElementById("accountName")
  let AccountNumber = document.getElementById("accountNumber")

  if (!BankName.value) {
    swal("Enter bank name!", {
      button: false,
    });
    BankName.focus();
        return false;
  }else if (!AccountName.value) {
    swal("Enter account name", {
      button:false
    })
    AccountName.focus();
      return false;
  }else if (!AccountNumber.value) {
    swal("Enter account number", {
      button:false
    })
    AccountNumber.focus();
      return false;
  }

  const  bankInfo = JSON.stringify({
    "farmerid": SFarmerID,
    "bankname": BankName.value,
    "bankaccountnumber":AccountNumber.value ,
    "bankaccountname": AccountName.value,
  })

  var settings = baseURL("api:rwfMbhtF/farmerbank", "POST", bankInfo);

  $.ajax(settings).done(function (response) {
    console.log(response);
    if (response.error == true) {
      // console.log(response.message);
      swal("FAILED", response.message, "error");
    } else {
      // console.log(response.message);
      swal("SUCCESS", response.message, "success");
        bankname.value="",
        bankaccountnumber.value="",
        bankaccountname.value="",
       
        window.location.reload();
      setTimeout(() => {
        cancelRequest();
      }, 2000)
      // fetchAllFarmers();
    }
  });
}

const addLoanHist=()=>{
  window.location.href="loan-history.html"
}
const addLoanHistory=()=>{
  let farmersID = localStorage.getItem('farmerID');
  let farmerid = farmersID
  // alert(farmerid)
  let takenLoan = document.getElementById("loanBefore")
  let loanAmount = document.getElementById("loanAmount")
  let seasonLoan = document.getElementById("loanSeason")
  let repayMent = document.getElementById("paidLoan")
  let paymentMethod = document.getElementById("paymenttype")
  let difficultPay = document.getElementById("difficultLoan")
  let costCultivate = document.getElementById("cultivationCost")
  let costPerPlantSeason = document.getElementById("costPerPlantSeason")

  if(!takenLoan.value){
    swal("Select option!", {
      button: false,
    });
    takenLoan.focus();
    return false;
  } else if(!loanAmount.value){
    swal("Enter your answer!", {
      button: false,
    });
    loanAmount.focus();
    return false;
  } else if(!seasonLoan.value){
    swal("Enter season period!", {
      button: false,
    });
    seasonLoan.focus();
    return false;
  } else if(!repayMent.value){
    swal("Select option!", {
      button: false,
    });
    repayMent.focus();
    return false;
  } else if(!paymentMethod.value){
    swal("Select option!", {
      button: false,
    });
    paymentMethod.focus();
    return false;
  } else if(!difficultPay.value){
    swal("Select option!", {
      button: false,
    });
    difficultPay.focus();
    return false;
  } else if(!costCultivate.value){
    swal("Enter amount spent!", {
      button: false,
    });
    costCultivate.focus();
    return false;
  } else if(!costPerPlantSeason.value){
    swal("Enter cost per planting season!", {
      button: false,
    });
    costPerPlantSeason.focus();
    return false;
  }

  const LoanHistory = JSON.stringify({
    "farmerid": farmerid,
    "iftakenaloanbefore": takenLoan.value,
    "pastloantakenamountnaira": loanAmount.value,
    "loantakenseason": seasonLoan.value,
    "hasitbeenrepaid": repayMent.value,
    "howdidyourepay": paymentMethod.value,
    "whatiscostofcultivation": costCultivate.value,
    "haddifficultypaying": difficultPay.value,
    "costofcultivationperplantseason": costPerPlantSeason.value
  })

  var settings = baseURL("api:rwfMbhtF/loanhistory", "POST", LoanHistory);

  $.ajax(settings).done(function (response) {
    console.log(response);
    if (response.error == true) {
      // console.log(response.message);
      swal("FAILED", response.message, "error");
    } else {
      // console.log(response.message);
      swal("SUCCESS", response.message, "success");
      takenLoan.value="",
      loanAmount.value="",
      seasonLoan.value="",
      repayMent.value="",
      paymentMethod.value="",
      costCultivate.value="",
      difficultPay.value="",
      costPerPlantSeason.value="",
       
      window.location.href = "farmer-details.html";
      setTimeout(() => {
        cancelRequest();
      }, 2000)
      // fetchAllFarmers();
    }
  });
}


$("#farmerKYF").click(function(){ window.location.href="farmerKYF.html"})


const addKYF=()=>{
  let farmersID = localStorage.getItem('farmerID');
  let farmerid = farmersID
  // alert(farmerid)
  let imageUploaded = document.getElementById("agentimg")
  // console.log(imageUploaded)
  let farmGroup = document.getElementById("coorpName")
  let groupStatus = document.getElementById("coorpStatus")
  let farmerBvn = document.getElementById("bvn")
  let identityMeans = document.getElementById("Identification")
  let identityNumber = document.getElementById("iDNumber")
  let dateIssued = document.getElementById("issueDate")
  let dateExpired = document.getElementById("expiryDate")
  let profFarm = document.getElementById("profesionalTraining")
  let yearFarming = document.getElementById("farmingYears")
  let eduLevel = document.getElementById("educationLevel")
  let KYFstatus = document.getElementById("kyfStatus")
  let NokFullname = document.getElementById("nokFullName")
  let NokMobile = document.getElementById("nokMobile")
  let NokOccupation = document.getElementById("nokOccupation")
  let NokRelationship = document.getElementById("nokRelationship")

  if(!farmGroup.value){
    swal("Enter farm group/coorporative name!", {
      button: false,
    });
    farmGroup.focus();
    return false;
  } else if(!groupStatus.value){
    swal("Select option!", {
      button: false,
    });
    groupStatus.focus();
    return false;
  } else if(!farmerBvn.value){
    swal("Enter BVN!", {
      button: false,
    });
    farmerBvn.focus();
    return false;
  } else if(!identityMeans.value){
    swal("Select a means of identification!", {
      button: false,
    });
    identityMeans.focus();
    return false;
  } else if(!identityNumber.value){
    swal("Enter identification number!", {
      button: false,
    });
    identityNumber.focus();
    return false;
  } else if(!dateIssued.value){
    swal("Enter Date issued for id!", {
      button: false,
    });
    dateIssued.focus();
    return false;
  } else if(!dateExpired.value){
    swal("Enter id expiry date!", {
      button: false,
    });
    dateExpired.focus();
    return false;
  } else if(!profFarm.value){
    swal("Select option!", {
      button: false,
    });
    profFarm.focus();
    return false;
  } else if(!yearFarming.value){
    swal("Enter farming years!", {
      button: false,
    });
    yearFarming.focus();
    return false;
  } else if(!eduLevel.value){
    swal("Select an option!", {
      button: false,
    });
    eduLevel.focus();
    return false;
  } else if(!KYFstatus.value){
    swal("Select an option!", {
      button: false,
    });
    KYFstatus.focus();
    return false;
  } else if(!NokFullname.value){
    swal("Enter NOK full name!", {
      button: false,
    });
    NokFullname.focus();
    return false;
  } else if(!NokMobile.value){
    swal("Enter NOK mobile number!", {
      button: false,
    });
    NokMobile.focus();
    return false;
  } else if(!NokOccupation.value){
    swal("Enter NOK Occupation!", {
      button: false,
    });
    NokOccupation.focus();
    return false;
  } else if(!NokRelationship.value){
    swal("Enter relationship with NOK!", {
      button: false,
    });
    NokRelationship.focus();
    return false;
  } 

const KYFINFO = JSON.stringify({
  "farmerid":farmerid,
  "corporativemembershipstatus":groupStatus.value ,
  "corporatename": farmGroup.value,
  "bvn": farmerBvn.value,
  "meansofidentification": identityMeans.value,
  "identificationno": identityNumber.value,
  "issuedate": dateIssued.value,
  "expirydate": dateExpired.value,
  "nextofkin": {
    "fullname": NokFullname.value,
    "telephonenok": NokMobile.value,
    "occupationnok": NokOccupation.value,
    "relationshipnok":NokRelationship.value
  },
  "yearsoffarmingexperience": yearFarming.value,
  "professionalfarmingtraining": profFarm.value,
  "levelofeducation": eduLevel.value,
  "photos": imageUploaded.src
})
console.log(KYFINFO)
var settings = baseURL("api:rwfMbhtF/farmerkyf", "POST", KYFINFO);

  $.ajax(settings).done(function (response) {
    console.log(response);
    if (response.error == true) {
      // console.log(response.message);
      swal("FAILED", response.message, "error");
    } else {
      console.log(response.message);
      swal("SUCCESS", response.message, "success");
      // takenLoan.value="",
      // loanAmount.value="",
      // seasonLoan.value="",
      // repayMent.value="",
      // paymentMethod.value="",
      // costCultivate.value="",
      // difficultPay.value="",
      // costPerPlantSeason.value="",
       
      window.location.href = "farmer-details.html";
      setTimeout(() => {
        cancelRequest();
      }, 2000)
      // fetchAllFarmers();
    }
  });
  

}

$("#farmPractice").click(function(){ window.location.href="farmpractice.html"})



const addFarmPractice =()=> {
  // alert("woth")

  let farmersID = localStorage.getItem('farmerID');
  let farmerid = farmersID
  // alert(farmerid)
  let sizeOfFarm = document.getElementById("farmSize")
  let rotationPractice = document.getElementById("cropRotation")
  let fertilizerUsed = document.getElementById("fertiliZerUsed")
  let cropIntended = document.getElementById("cropName")
  let weedControl = document.getElementById("weedControl")
  let fungiCide = document.getElementById("fungiCide")
  let fertiliZerperCrop = document.getElementById("fertiliZerperCrop")
  let fertiliZerperSeason = document.getElementById("fertiliZerperSeason")
  let viableCrop = document.getElementById("viableCrop")
  let incomePerCrop = document.getElementById("incomePerCrop")

  if(!sizeOfFarm.value){
    swal("Enter your answer!", {
      button: false,
    });
    sizeOfFarm.focus();
    return false;
  } else if(!rotationPractice.value){
    swal("Select option!", {
      button: false,
    });
    rotationPractice.focus();
    return false;
  } else if(!fertilizerUsed.value){
    swal("Enter your answer!", {
      button: false,
    });
    fertilizerUsed.focus();
    return false;
  } else if(!cropIntended.value){
    swal("Enter your answer!", {
      button: false,
    });
    cropIntended.focus();
    return false;
  } else if(!weedControl.value){
    swal("Select option!", {
      button: false,
    });
    weedControl.focus();
    return false;
  } else if(!fungiCide.value){
    swal("Enter your answer!", {
      button: false,
    });
    fungiCide.focus();
    return false;
  } else if(!fertiliZerperCrop.value){
    swal("Enter your answe!", {
      button: false,
    });
    fertiliZerperCrop.focus();
    return false;
  } else if(!fertiliZerperSeason.value){
    swal("Enter your answer!", {
      button: false,
    });
    fertiliZerperSeason.focus();
    return false;
  } else if(!viableCrop.value){
    swal("Enter your answer!", {
      button: false,
    });
    viableCrop.focus();
    return false;
  } else if(!incomePerCrop){
    swal("Enter your answer!", {
      button: false,
    });
    incomePerCrop.focus();
    return false;
  }

  const farmPractices = JSON.stringify({
    "farmerid": farmerid,
    "croprotationpractice": rotationPractice.value,
    "numberofsqmyoucancultivate": sizeOfFarm.value,
    "fertilizerappliedpercropcycle": fertiliZerperCrop.value,
    "totalfertilizerusedperseason":fertiliZerperSeason.value ,
    "yourmostviablecrop": viableCrop.value,
    "totalaverageincomeperharvest": incomePerCrop.value,
    "listoffungicidesused": fungiCide.value,
    "weedcontrolpractices": weedControl.value,
    "listfertilizersused": fertilizerUsed.value,
    "intendedcrop": cropIntended.value
  })

  var settings = baseURL("api:rwfMbhtF/farmpractices", "POST", farmPractices);

  $.ajax(settings).done(function (response) {
    console.log(response);
    if (response.error == true) {
      // console.log(response.message);
      swal("FAILED", response.message, "error");
    } else {
      // console.log(response.message);
      swal("SUCCESS", response.message, "success");
      rotationPractice.value="",
      sizeOfFarm.value="",
      fertiliZerperCrop.value="",
      fertiliZerperSeason.value="",
      viableCrop.value="",
      incomePerCrop.value="",
      fungiCide.value="",
      weedControl.value="",
      fertilizerUsed.value="",
      cropIntended.value=""

      window.location.href = "farmer-details.html";
      setTimeout(() => {
        cancelRequest();
      }, 2000)
    }
  });
}
$("#addFarms").click(function(){ window.location.href="farminformation.html"})

// RANDOM ID  for Farm
function farmRandomID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
// RANDOM ID


const addFarmInformation =()=> {
  // alert(farmRandomID())

  let farmersID = localStorage.getItem('farmerID');
  let farmerid = farmersID
  // alert(farmerid)
  let farmLocation = document.getElementById("farmLocation")
  let farmPractices = document.getElementById("farmPractices")
  let farmSize = document.getElementById("farmSize")
  let farmLog = document.getElementById("farmLog")
  let farmLat = document.getElementById("farmLat")
  let farmOwnership = document.getElementById("farmOwnership")
  let leaseYear = document.getElementById("leaseYear")
  let farmOwnerName = document.getElementById("farmOwnerName")
  let farmOwnerNumber = document.getElementById("farmOwnerNumber")
  let cropCultivated = document.getElementById("cropCultivated")
  let animalRared = document.getElementById("animalRared")
  let numLivestock = document.getElementById("numLivestock")
  let incomePerYear = document.getElementById("incomePerYear")

  if(!farmLocation.value){
    swal("Enter your answer!", {
      button: false,
    });
    farmLocation.focus();
    return false;
  } else if(!farmPractices.value){
    swal("Select option!", {
      button: false,
    });
    farmPractices.focus();
    return false;
  } else if(!farmSize.value){
    swal("Enter your answer!", {
      button: false,
    });
    farmSize.focus();
    return false;
  } else if(!farmLog.value){
    swal("Enter your answer!", {
      button: false,
    });
    farmLog.focus();
    return false;
  } else if(!farmLat.value){
    swal("Select option!", {
      button: false,
    });
    farmLat.focus();
    return false;
  } else if(!farmOwnership.value){
    swal("Enter your answer!", {
      button: false,
    });
    farmOwnership.focus();
    return false;
  } else if(!leaseYear.value){
    swal("Enter your answe!", {
      button: false,
    });
    leaseYear.focus();
    return false;
  } else if(!farmOwnerName.value){
    swal("Enter your answer!", {
      button: false,
    });
    farmOwnerName.focus();
    return false;
  } else if(!farmOwnerNumber.value){
    swal("Enter your answer!", {
      button: false,
    });
    farmOwnerNumber.focus();
    return false;
  } else if(!cropCultivated.value){
    swal("Enter your answer!", {
      button: false,
    });
    cropCultivated.focus();
    return false;
  } else if(!animalRared.value){
    swal("Enter your answer!", {
      button: false,
    });
    animalRared.focus();
    return false;
  } else if(!numLivestock.value){
    swal("Enter your answer!", {
      button: false,
    });
    numLivestock.focus();
    return false;
  } else if(!incomePerYear.value){
    swal("Enter your answer!", {
      button: false,
    });
    incomePerYear.focus();
    return false;
  }

  const farmData = JSON.stringify({
    "farmerid": farmerid,
  "farmid": "USERFARM"+ farmRandomID(),
  "farmlocation": farmLocation.value,
  "farmingtype": farmPractices.value,
  "farmsizesqm": farmSize.value,
  "farmlocationcoordinates": {
    "latitude": farmLat.value,
    "longitude": farmLog.value
  },
  "farmownership": farmOwnership.value,
  "nameofowner": farmOwnerName.value,
  "farmownermobile": farmOwnerNumber.value,
  "numberofyearsleased": leaseYear.value,
  "croptypes": cropCultivated.value,
  "animaltypes": animalRared.value,
  "numberofanimals": numLivestock.value,
  "estimatedtotalincomeperyear": incomePerYear.value
  })

  var settings = baseURL("api:rwfMbhtF/farminformation", "POST", farmData);

  $.ajax(settings).done(function (response) {
    console.log(response);
    if (response.error == true) {
      // console.log(response.message);
      swal("FAILED", response.message, "error");
    } else {
      // console.log(response.message);
      swal("SUCCESS", response.message, "success");
      // rotationPractice.value="",
      // sizeOfFarm.value="",
      // fertiliZerperCrop.value="",
      // fertiliZerperSeason.value="",
      // viableCrop.value="",
      // incomePerCrop.value="",
      // fungiCide.value="",
      // weedControl.value="",
      // fertilizerUsed.value="",
      // cropIntended.value=""

      window.location.href = "farmer-details.html";
      setTimeout(() => {
        cancelRequest();
      }, 2000)
    }
  });
}

$("#addFarmsMachine").click(function(){ window.location.href="farmmachine.html"})

// RANDOM ID 
function farmMachineID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
// RANDOM ID

const addFarmMachine =()=> {
  // alert("FARMMACHINE-"+ farmMachineID())

  let farmersID = localStorage.getItem('farmerID');
  let farmerid = farmersID
  // alert(farmerid)
  let farMMachine = document.getElementById("farMMachine")
  let machineNumber = document.getElementById("machineNumber")
  let activeUnits = document.getElementById("activeUnits")
  let defectiveUnits = document.getElementById("defectiveUnits")
  let machineAvgUse = document.getElementById("machineAvgUse")
  let costOfMachine = document.getElementById("costOfMachine")

  if(!farMMachine.value){
    swal("Select option!", {
      button: false,
    });
    farMMachine.focus();
    return false;
  } else if(!machineNumber.value){
    swal("Enter your answer!", {
      button: false,
    });
    machineNumber.focus();
    return false;
  } else if(!activeUnits.value){
    swal("Enter your answer!", {
      button: false,
    });
    activeUnits.focus();
    return false;
  } else if(!defectiveUnits.value){
    swal("Enter your answer!", {
      button: false,
    });
    defectiveUnits.focus();
    return false;
  } else if(!machineAvgUse.value){
    swal("Select option!", {
      button: false,
    });
    machineAvgUse.focus();
    return false;
  } else if(!costOfMachine.value){
    swal("Enter your answer!", {
      button: false,
    });
    costOfMachine.focus();
    return false;
  } 

  const farMachine = JSON.stringify({
    "farmerid": farmerid,
    "farmmachineid": "FARMMACHINE-"+farmMachineID(),
    "typeofmachine": farMMachine.value,
    "noofthismachinepossessed": machineNumber.value,
    "noofactiveunits": activeUnits.value,
    "noofdefectiveunits": defectiveUnits.value,
    "averagenoofyearsused": machineAvgUse.value,
    "averagecostofmaintenanceinnaira": costOfMachine.value
  })

  var settings = baseURL("api:rwfMbhtF/farmmechanization", "POST", farMachine);

  $.ajax(settings).done(function (response) {
    console.log(response);
    if (response.error == true) {
      console.log(response.message);
      swal("FAILED", response.message, "error");
    } else {
      console.log(response.message);
      swal("SUCCESS", response.message, "success");
      farMMachine.value="",
      machineNumber.value="",
      activeUnits.value="",
      defectiveUnits.value="",
      machineAvgUse.value="",
      costOfMachine.value="",
     
      window.location.href = "farmer-details.html";
      setTimeout(() => {
        cancelRequest();
      }, 2000)
    }
  });
}