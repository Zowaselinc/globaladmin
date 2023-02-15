function pagination(totalfetchedrow){
    getPagination("#theTable");
    $("#maxRowss").trigger("change");
    function getPagination(table) {
        // console.log(table, "refrefr");
        $("#maxRowss").on("change", function () {
            $(".pagination").html(""); // reset pagination div
            var trnum = 0; // reset tr counter
            var maxRowss = parseInt($(this).val()); // get Max Rows from select option

            // var totalRows = $(table + "tbody tr").length; // numbers of rows
            var totalRows = totalfetchedrow // numbers of rows
        //    alert(totalRows);
           $(table + " tr:gt(0)").each(function () {
                // each TR in  table and not the header
                trnum++; // Start Counter
                if (trnum > maxRowss) {
                    // if tr number gt maxRowss

                    $(this).hide(); // fade it out
                }
                if (trnum <= maxRowss) {
                    $(this).show();
                } // else fade in Important in case if it ..
            }); //  was fade out to fade it in
            if (totalRows > maxRowss) {
                // if tr total rows gt max rows option
                var pagenum = Math.ceil(totalRows / maxRowss); // ceil total(rows/maxrowss) to get ..
                //	numbers of pages
                for (var i = 1; i <= pagenum; ) {
                    // for each page append pagination li
                    $(".pagination")
                        .append('<li  class="page-item" data-page="' + i + '">\
                              <span >' + i++ + '<span class="sr-only">(current)</span></span>\
                            </li>')
                        .show();    
                } // end for i
            } // end if row count > max rows
            $(".pagination li:first-child").addClass("active"); // add active class to the first li

            //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
            showig_rows_count(maxRowss, 1, totalRows);
            //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT

            $(".pagination li").on("click", function (e) {
                // on click each page
                e.preventDefault();
                var pageNum = $(this).attr("data-page"); // get it's number
                var trIndex = 0; // reset tr counter
                $(".pagination li").removeClass("active"); // remove active class from all li
                $(this).addClass("active"); // add active class to the clicked

                //SHOWING ROWS NUMBER OUT OF TOTAL
                showig_rows_count(maxRowss, pageNum, totalRows);
                //SHOWING ROWS NUMBER OUT OF TOTAL

                $(table + " tr:gt(0)").each(function () {
                    // each tr in table not the header
                    trIndex++; // tr index counter
                    // if tr index gt maxRowss*pageNum or lt maxRowss*pageNum-maxRowss fade if out
                    if (trIndex > maxRowss * pageNum || trIndex <= maxRowss * pageNum - maxRowss) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    } //else fade in
                }); // end of for each tr in table
            }); // end of on click pagination list
        });
        // end of on select change

        // END OF PAGINATION
    };

    // SI SETTING
    $(function () {
        // Just to append id number for each row
        // default_index();
    });

    //ROWS SHOWING FUNCTION
    function showig_rows_count(maxRowss, pageNum, totalRows) {
        //Default rows showing
        var end_index = maxRowss * pageNum;
        var start_index = maxRowss * pageNum - maxRowss + parseFloat(1);
        var string = "Showing " + start_index + " to " + end_index + " of " + totalRows + " entries";
        $(".rows_count").html(string);
    }

    // CREATING INDEX
    function default_index() {
        $("table tr:eq(0)").prepend("<th> ID </th>");

        var id = 0;

        $("table tr:gt(0)").each(function () {
            id++;
            $(this).prepend("<td>" + id + "</td>");
        });
    }

    
}

// All Table search script
function FilterkeyWord_all_table() {
    // Count td if you want to search on all table instead of specific column

    var count = $(".table").children("tbody").children("tr:first-child").children("td").length;

    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("search_input_all");
    var input_value = document.getElementById("search_input_all").value;
    filter = input.value.toLowerCase();
    if (input_value != "") {
        table = document.getElementById("theTable");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 1; i < tr.length; i++) {
            var flag = 0;

            for (j = 0; j < count; j++) {
                td = tr[i].getElementsByTagName("td")[j];
                if (td) {
                    var td_text = td.innerHTML;
                    if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
                        //var td_text = td.innerHTML;
                        //td.innerHTML = 'shaban';
                        flag = 1;
                    } else {
                        //DO NOTHING
                    }
                }
            }
            if (flag == 1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    } else {
        //RESET TABLE
        $("#maxRowss").trigger("change");
    }
}


function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("theTable");
    switching = true;
    dir = "asc";
    // alert(n);
    
    /* Make a loop that will continue until no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        
        /* Loop through all table rows (except the first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc") {
                // Check if the two rows should switch place:
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
};


/* -------------------------------------------------------------------------- */
/*                               New Pagination                               */
/* -------------------------------------------------------------------------- */

// let x = 1;
// let y = 2;
// let z = 3;
// let prev = document.getElementById('btnP');
// let btn1 = document.getElementById('btn1');
// let btn2 = document.getElementById('btn2');
// let btn3 = document.getElementById('btn3');
// let next = document.getElementById('btnN');

// function condition(){
//     btn1.innerHTML = (`<button id="btn-${x}">${x}</button>`);
//     let red1 = document.getElementById(`btn-${x}`);
//     if(x%3==0){
//         red1.style.background = "red";
//     }
//     btn2.innerHTML = (`<button id="btn-${y}">${y}</button>`);
//     let red2 = document.getElementById(`btn-${y}`);
//     if(y%3==0){
//         red2.style.background = "red";
//     }
//     btn3.innerHTML = (`<button id="btn-${z}">${z}</button>`);
//     let red3 = document.getElementById(`btn-${z}`);
//     if(z%3==0){
//         red3.style.background = "red";
//     }
// }
// next.addEventListener("click", function(){
//     x++;
//     y++;
//     z++;
//     condition();
// })
// prev.addEventListener("click", function(){
//     if(x>1 || y>2 || z>3){
//     x--;
//     y--;
//     z--;
//     condition();
//     }
// })
// btn2.addEventListener("click", function(){
//     x++;
//     y++;
//     z++;
//     condition();
// })
// btn3.addEventListener("click", function(){
//     x+=2;
//     y+=2;
//     z+=2;
//     condition();
// })




/* -------------------------------------------------------------------------- */
/*                             Another pagination                             */
/* -------------------------------------------------------------------------- */

// function getPageList(totalPages, page, maxLength){
//     function range(start, end){
//         return Array.from(Array(end - start + 1), (_, i) => i + start);
//     }

//     var sideWidth = maxLength < 9 ? 1 : 2;
//     var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
//     var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

//     if(totalPages <= maxLength){
//         return range(1, totalPages);
//     }

//     if(page <= maxLength - sideWidth - 1 - rightWidth){
//         return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
//     }

//     if(page >= totalPages - sideWidth - 1 - rightWidth){
//         return range(1, sideWidth).concat(0, range(totalPages- sideWidth - 1 - rightWidth - leftWidth, totalPages));
//     }

//     return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, ))
// }

// $(function(){
//     // $("#maxRowss")
//     var numberOfItems = $("rowContent").value;
//     var limitPerPage = 3; //How many content per page 
//     var totalPages = Math.ceil(numberOfItems / limitPerPage);
//     var paginationSize = 7; //How many page element visible in the  pagination
//     var currentPage;

//     function showPage(whichPage){
//         if(whichPage < 1 || whichPage > totalPages) return false;

//         currentPage = whichPage

//         $(".pg-table").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

//         $(".pagination li").slice(1, -1).remove();

//         getPageList(totalPages, currentPage, paginationSize).forEach(item => {
//             $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots")
//             .toggleClass("active", item === currentPage).append($("<a>").addClass("page-link")
//             .attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".next-page");
//         });

//         $(".previous-page").toggleClass("disable", currentPage === 1);
//         $(".next-page").toggleClass("disable", currentPage === 1);
//         return true;
//     }

//     $(".pagination").append(
//         $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Prev")),
//         $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Next"))
//     );

//     $(".maxRowss").show();
//     showPage(1);

//     $(document).on("click", ".pagination li.current-page:not(.active)", function(){
//         return showPage(+$(this).text());
//     });

//     $(".next-page").on("click", function(){
//         return showPage(currentPage + 1);
//     });

//     $(".previous-page").on("click", function(){
//         return showPage(currentPage - 1);
//     });
// });
 



/* ------------------------------- NEGOTIATION ------------------------------ */
const populateUserandFarmOwnerNegotiationMessages =()=>{

    let singleproductID = localStorage.getItem('singleproductID');

    let user = localStorage.getItem('zowaselUser');
    user = JSON.parse(user);
    let userid = user.user.id;
    let usertype = user.user.type;

    console.log(singleproductID, "singleproductID");
    console.log(userid, "userid");
    console.log(liveMobileUrl, "liveMobileUrl");

    startPageLoader();
    $.ajax({
        url: `${liveMobileUrl}/crop/`+singleproductID+`/negotiation/getbyuserid/`+userid,
        type: "GET",
        "timeout": 25000,
        "headers": {
            "Content-Type": "application/json",
            // "authorization": localStorage.getItem('authToken')
        },
        success: function(response) { 
            // alert("efe");
            setTimeout(()=>{
                EndPageLoader();
            },1500)
            
            // $('.loader').hide();
            // console.log(response, "The negotiation response");
            if(response.error == true){
                console.log(response.message);
                // responsemodal("erroricon.png", "Error", response.message);
            }else{
                // alert(response.message);
                let thedatafetched = response.data;
                // console.log(thedatafetched, "The negotiation message data");

                // Now the data coming from response is not arranged.
                // The Object.values method returns an array of object's values (which are your messages) 
                // and then you sort them by message id in ascending order using sort function.
                let thedata = Object.entries(thedatafetched)
                .map(([key, val]) => ({id: key, ...val}))
                .sort((a, b) => a.id - b.id);

                // console.log(thedata, "the data");

                let finalObj = {}
                thedata.forEach((theresult) => {

                    const date = theresult.created_at.split(" ")[0];
                    if (finalObj[date]) {
                        finalObj[date].push(theresult);
                    } else {
                        finalObj[date] = [theresult];
                    }
                })
                console.log(finalObj, "final Obj")

                let finalObjcount = Object.keys(finalObj).length;
                // console.log(finalObjcount);


                let rowContent = "";
                let index;

                if(finalObjcount > 0){
                    $('.chat-image').hide();
                    $('.thechatside').show();


                    for (let i = 0; i < finalObjcount; i++) {
                      console.log('Hello World', + i);
                        let grouped_date = Object.keys(finalObj)[i];
                        let therow = finalObj[Object.keys(finalObj)[i]];
                        console.log(therow.length);
                        
                        // The row is coming out as an array with many objects. Loop through the array
                    
                        let row = therow;
                        console.log(row, "The row rf");

                        let themessageandType;
                        let chatGroupContent;
                        for (let x = 0; x < row.length; x++) {
                            // index= x+1;

                            let negotiationpage_type = localStorage.getItem('negotiationpage_type');
                            let chatboxClass, accept_decline_checkbox;
                            if(usertype == "merchant"){
                                if(row[x].type == "merchant"){
                                    chatboxClass = `user`;
                                }else{
                                    chatboxClass = ``;
                                }

                                accept_decline_checkbox = `We will let you know when corporate accepts/declines offer.`;

                            }else if(usertype == "corporate"){
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
                            }

                            let time = row[x].created_at;
                            // console.log(time);
                            
                            let myTime = time.split(" ")[1];
                            let myDate = time.split(" ")[0];
                            var hour = parseInt(myTime.split(":")[0]) % 12;
                            // console.log(hour, "The hour");
                            var timeInAmPm = (hour == 0 ? "12": hour ) + ":" + myTime.split(":")[1] + " " + (parseInt(parseInt(myTime.split(":")[0]) / 12) < 1 ? "AM" : "PM");
                            // console.log(timeInAmPm, "timeInAmPm");

                            let themessagetype = row[x].messagetype;
                            if(themessagetype == "offer"){
                                // Hide Send offer button if an offer has been sent already
                                $('.open_offer_form').hide();
                                // Hide Send offer button if an offer has been sent already
                            }
                            // let themessageandType;
                            if(themessagetype == "text"){
                                themessageandType = `
                                    <div class="chat-content ${chatboxClass}">
                                        <div class="message-item">
                                            <div class="bubble">${row[x].message}</div>    
                                            <div class="message-time">${timeInAmPm}</div>   
                                        </div>
                                    </div>
                                `;
                            }else if(themessagetype == "offer"){
                                let offerbox = JSON.parse(row[x].message);
                                themessageandType = `
                                    <div class="offer-right mb-2 mt-1">
                                        <div class="offered">
                                            <!---->
                                            <div class="colored">
                                                <h3>Offer</h3>
                                                <hr />
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
                                            <div class="message-item">
                                                <div class="accept_decline_checkbox">${accept_decline_checkbox}</div> 
                                                <div class="message-time">${timeInAmPm}</div>  
                                            </div>
                                        </div>
                                    </div> 
                                `;
                            }else{
                                themessageandType = `
                                    <div class="chat-content ${chatboxClass}">
                                        <div class="message-item">
                                            <div class="bubble">${row[x].message}</div>    
                                            <div class="message-time">${timeInAmPm}</div>   
                                            <div class="message-date d-none">${myDate}</div>  
                                        </div>
                                    </div>
                                `;
                            }

                            
                            chatGroupContent += `
                                ${themessageandType}
                            `;


                        }
                        
                        let refactoredChatGroupContent = JSON.stringify(chatGroupContent);
                        refactoredChatGroupContent = refactoredChatGroupContent.replace(undefined,'<hr/>');
                        refactoredChatGroupContent = JSON.parse(refactoredChatGroupContent);


                        // console.log(refactoredChatGroupContent, " chatGroupContent bbbbbbbbbbbbbbbbbbbb");
                        var date = new Date();
                        var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
                        let themomentcode = moment(grouped_date, "YYYY-MM-DD").isSame(dateString, "YYYY-MM-DD");
                        let themoment;
                        if(themomentcode === true){
                            themoment = "Today";
                        }else if(moment(grouped_date, "YYYY-MM-DD").calendar().split(" ")[0].toLowerCase() == "yesterday"){
                            themoment = "Yesterday";
                        }else{
                            themoment = moment(grouped_date, "YYYY-MM-DD").fromNow();
                        }



                        let thegroupeddate = `
                            <div class="thegroupeddate text-center mt-4" style="text-transform:uppercase;"><span>${themoment} - ${grouped_date}</span></div>
                        `;

                        let groupDateANDthemesssageType = thegroupeddate+refactoredChatGroupContent;


                        rowContent += `
                            ${groupDateANDthemesssageType}
                        `;

                        
                        
                    }
                    $('#thechatside').html(rowContent);
                    // console.log(rowContent, " rowContent");
                    // console.log(thedata, "the data");
                  
                    setTimeout(()=>{
                        var ChatDiv = $('#thechatside');
                        var height = ChatDiv[0].scrollHeight;
                        ChatDiv.scrollTop(height);
                        console.log(height, "Chartbox Height");
                    },500)
                    
                    $('[data-toggle="tooltip"]').tooltip('toggle');
                    setTimeout(()=>{
                        $('[data-toggle="tooltip"]').tooltip('hide');
                    },10000)  
                    
                }else{
                    $('#thechatside').html("No conversation yet");
                }
                    
            }
        },
        error: function(xmlhttprequest, textstatus, message) {
            EndPageLoader();
            if(textstatus==="timeout") {
                basicmodal("", "Service timed out \nCheck your internet connection");
            } else {
                // alert(textstatus);
                basicmodal("", textstatus+"<br/>This session has ended, Login again");
                setTimeout(()=>{
                    logout();
                },3000)
            }
        }
    });
}

