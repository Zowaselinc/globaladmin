// this holds the request headers and bodies
// allows u to make a request
const querySetting = (URL, METHOD, DATA = {}) => {
    const settings = {
        "url": `https://zowaseluser.loclx.io/${URL}`,
        "method": METHOD,
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        data: DATA
    }

    return settings;
}

// end //

/* -------------------------- GET ALL USERS BEGINS -------------------------- */

function fetchAllusers (){
    var settings = querySetting("api/user", "GET");
      
     
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
                        <td style="min-width: 50px;">${index}</td>
                        <td style="min-width: 170px;">
                            <strong class="text-secondary">${row.user.first_name} ${row.user.last_name}</strong><br/>
                            <small class="text-info text-capitalize">${row.user_type}</small>
                        </td>
                        <td style="min-width: 150px;">${row.user.email}</td>
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
                                    <a class="dropdown-item" onclick="deleteSupportTicket('${row.id}')" href="javascript:void(0)">Delete</a>
                                </div>
                            </div>
                        </td> -->

                    </tr>`;
                    $('#allusers').html(rowContent);
                });
            }else{
                $('#allusers').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No users registered yet</h3></td></tr>");
            }
        }
        });

}

/* -------------------------- end of get all users -------------------------- */



/* ----------------------------- create new user ---------------------------- */


const createUser = () => {
    
}


/* -------------------------- end of user creation -------------------------- */



