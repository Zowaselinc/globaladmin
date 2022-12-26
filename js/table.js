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
 

