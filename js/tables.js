$(document).ready(function() {
    $('').DataTable( {
        scrollY:        300,
        scrollX:        true,
        scrollCollapse: true,
        paging:         true,
        fixedHeader:           {
            header: true,
            footer: true
        }
    } );
} );