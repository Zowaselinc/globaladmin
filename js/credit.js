


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
  sessionStorage.setItem('farmerID', farmerid)
  // sessionStorage.setItem('farmerID', JSON.stringify({ farmerid: farmerid}));
  // let farmerDetails = sessionStorage.getItem('farmerID');
  // console.log(farmerDetails, "amen");
  window.location.href="farmer-details.html"
}

const farmerDetails =()=>{

  var settings = baseURL("api:rwfMbhtF/farmerfull/" + sessionStorage.getItem('farmerID'), "GET",);

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
      let bank = response.farmerbank
      $('#bank').text(bank.bankname);
      $('#acctName').text(bank.bankaccountname);
      $('#acctNumber').text(bank.bankaccountnumber);

      // Farmer KYF 
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

      // 

      // $('#farmLocation').text(farmInfo.farmlocation);
      // $('#farmSize').text(farmInfo.farmsizesqm);
      // $('#farmPractice').text(farmInfo.farmingtype);
      // $('#cropPlanted').text(farmInfo.croptypes);
      // $('#livestockR').text(farmInfo.animaltypes);
      // $('#liveStockNo').text(farmInfo.numberofanimals);
      // $('#incomePer').text(farmInfo.estimatedtotalincomeperyear);
      // $('#farmOwner').html(landOwner);
      // $('#nameOwner').text(farmInfo.nameofowner);
      // $('#OwnerMobile').text(farmInfo.farmownermobile);
      // $('#leaseOut').text(farmInfo.numberofyearsleased);

      // Farm Practice 
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
      
      // Loan History of Farmer 
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


      // Farm Mechanization 
      let machinedata = response.farmmechanization;

      thedata = machinedata
      if (thedata.length > 0) {
        let rowContent
        $.each(thedata, (index, row) => {

          // let landOwner;
          // if (row.farmownership == 1){
          //   landOwner =  `<strong class="text-primary fs-6">Yes</strong>`
          // } else{
          //   landOwner =  `<strong class="text-danger fs-6">No</strong>`
          // }
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




//   ------------------- ALL FARMERS END HERE---------------------------//

