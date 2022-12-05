
//------------- pie  chart  scripts starts here---------------------  //

const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    
    type: 'pie',
    data: {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    },

    options: {
      responsive: true,
     
    },

  });
  //------------- pie  chart  scripts ends here---------------------  //

  
  
  let BASEURL = "https://zowaseladmin.loclx.io";
  
$.get(`${BASEURL}/api/users`, {}, function(data){
  let response = JSON.stringify(data);
  // alert(response)
  console.log(response);
})


let userlastname = document.querySelector("#lastname").value;

$.post(URL, { //PARAMETERS
  "firstname": userfirstname,
  "lastname": userlastname,
  "email": useremail
}, function(data){
  // do something with returned data
})


