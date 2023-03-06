
$(document).ready(function(){
    let currentPage = window.location.pathname;
    // alert(currentPage);
    if(currentPage.includes("/edit")){
        localStorage.setItem('currentImgType', "existingImage");
    }else{

    }
})


$("#uploaded_view").css("display", "none");
var btnUpload = $("#upload_file"),
btnOuter = $(".button_outer");
btnUpload.on("change", function(e){
    var ext = btnUpload.val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
        $(".error_msg").text("Not an Image...");
    } else {
        $(".error_msg").text("");
        btnOuter.addClass("file_uploading");
        setTimeout(function(){
            btnOuter.addClass("file_uploaded");
        },3000);
        var uploadedFile = URL.createObjectURL(e.target.files[0]);

        
        setTimeout(function(){
            // $("#uploaded_view").append('<img src="'+uploadedFile+'" />').addClass("show");
        },3500);


        var fileReader = new FileReader();
        var image = $('#upload_file').prop('files')[0];

        fileReader.onload = function(fileLoadedEvent){
            var srcData = fileLoadedEvent.target.result; // <- base 64 data
            // console.log(srcData);

            // Existing DB image is coming from edit HTML //
            let currentPage = window.location.pathname;
            // alert(currentPage);
            if(currentPage.includes("/edit")){
                $('.existingDatabaseImage').hide();
                $('#uploaded_view').show();
                localStorage.setItem('currentImgType', "newImage");
            }
            // Existing DB image is coming from edit HTML //

            $("#uploaded_view").css("display", "block");
            $("#uploaded_view").append('<img src="'+srcData+'" id="agentimg" />').addClass("show");
            $(".upload-image").remove();
        }
        fileReader.readAsDataURL(image);




    }
});
$(".file_remove").on("click", function(e){
    $("#uploaded_view").removeClass("show");
    $("#uploaded_view").find("img").remove();
    btnOuter.removeClass("file_uploading");
    btnOuter.removeClass("file_uploaded");

    let currentPage = window.location.pathname;
    // alert(currentPage);
    if(currentPage.includes("/edit")){
        $('.existingDatabaseImage').show();
        $('#uploaded_view').hide();
        localStorage.setItem('currentImgType', "existingImage");
    }else{

    }
});
