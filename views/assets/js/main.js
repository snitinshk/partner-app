
$( document ).ready(function() {

 
 
  $('#withdrawamount').keyup(function(){  
   if(parseFloat($('#revenue').val())>=$('#withdrawamount').val()){ 
     $("#withdrawbutton").prop( "disabled", false );
   }
   else{  
     $("#withdrawbutton").prop( "disabled", true );
   }
  });
  $('#datepicker').click(()=>{
    var $input = $( '#datepicker' ).pickatime({
    })
    var picker = $input.pickatime('picker')
    //picker.open()
    
  })
  $('#datepicker2').click(()=>{
    var $input2 = $( '#datepicker2' ).pickadate({
      min: 0,
    })
  
    var picker2 = $input2.pickadate('picker2')
  })

  $('#filterdate1').click((event)=>{
    var $input2 = $( '#filterdate1' ).pickadate({
      min:0,
      clear: 'Clear selection',
      close: 'Cancel'
    })
    var picker2 = $input2.pickadate('picker2')
  
  })
  var filterpicker2;
  $('#filterdate2').click(()=>{
    var $input2 = $( '#filterdate2' ).pickadate({
      min: new Date($('#filterdate1').val()),
      clear: 'Clear selection',
      close: 'Cancel',
    })
    filterpicker2 = $input2.pickadate('picker2')
  })

  function changeTimeZoneNumber(timezone){
    return parseInt(timezone) * (-1)
  }

  const timezone = moment.tz.guess();
  const timezoneShort = moment().tz(moment.tz.guess()).format('z');

  console.log("User Timezone: " + moment.tz.guess())
  var newtimezone = moment.tz.guess();


  // var offset = new Date().getTimezoneOffset();
  // console.log(offset)
  // console.log(timezone)
  // const off = new Date().toString().match(/([-\+][0-9]+)\s/)[1]
  // console.log(off)
  // console.log(changeTimeZoneNumber(offset))
  // console.log(timezoneShort)

  console.log(moment.tz(moment.tz.guess()).format('DD MMM YYYY'))
  console.log(moment.tz(moment.tz.guess()).format('hh:mm A'))

  let add = ""
  if(userrating!=null&&userrating.length != 0){
    console.log(userrating)
    const num = userrating
    for(let i = 0;i<num;i++){
      console.log(i)
      add = add + `<span class="fa fa-star checked"></span>`
    }
    let d = 5 - num
    console.log(d)
    for(let i = 1;i<=d;i++){
      add = add + `<span class="fa fa-star"></span>`

    }
    console.log(add)
   
  }else{
    add = "<p>New User</p>"
  }
  $('.rating').append(add)

  let add2 = ""
  if(profilerating!=null&&profilerating.length != 0 ){
    const num = profilerating
    for(let i = 0;i<num;i++){
      console.log(i)
      add2 = add2 + `<span class="fa fa-star checked"></span>`
    }
    let d = 5 - num
    console.log(d)
    for(let i = 1;i<=d;i++){
      add2 = add2 + `<span class="fa fa-star"></span>`

    }
   
  }else{
    add2 = "<p>New User</p>"
  }
  console.log(add2)
  $('.profilerating').append(add2)


  //<input id = "datepicker" name='time'  class="form-control" required> 
  
  $('.sendtimezone').append(`
    <input name='timezone' style = "display:none" value = ${newtimezone} required> 
  `)

  $('.placeholdertextone').append(`
     <p><b>Feature Update:</b> Timezone is in your local time now: <b>`+timezone+`</b></p>
  `)

  $('.placeholdertexttwo').append(`
     <p><b>Feature Update:</b> Timezone is in your local time now: <b>`+timezone+`</b></p>
  `)

  $('.placeholdertextthree').append(`
     <p><b>Feature Update:</b>  Timezone is in your local time now: <b>`+timezone+`</b></p>
  `)
   let info = ""
  const gigsfun = (gigs, moment)=>{
    for(i in gigs){
{/* <h4 class="card-title textt">${moment(gigs[i].newVideoDateObject).utcOffset(changeTimeZoneNumber(offset)).format('DD MMM YYYY')}</h4>
          <p class="card-description textt">${moment(gigs[i].newVideoDateObject).utcOffset(changeTimeZoneNumber(offset)).format('hh:mm A')} ${timezoneShort}</p> */}
       if(gigs[i].userWhoMadeVideo === userdata._id){
         $('#cards').append(`
      <div class="col-md-4 grid-margin stretch-card">
      <div class="card">
       
        <div class="card-body text-center">
          <div class="nav-profile-text">
            <p class="mb-1 text-gray">You listed this session</p>
          </div>
          <h4 class="card-title textt">${moment(gigs[i].newVideoDateObject).tz(moment.tz.guess()).format('DD MMM YYYY')}</h4>
          <p class="card-description textt">${moment(gigs[i].newVideoDateObject).tz(moment.tz.guess()).format('hh:mm A')} ${timezoneShort}</p>
          <div style = "">
          <button onclick="deleteGig(${i})" style="padding:8px; width:100%;color:white;" type="button" class="card-title btn btn-lg btn-gradient-primary">Delete</button>
          </div>
        </div>
        </div>
      </div>
    </div>  
      `)
       }else{
         let add = ""
        if(quality[gigs[i].userWhoMadeVideo]!=null&&quality[gigs[i].userWhoMadeVideo].length != 0){
          console.log(quality[gigs[i].userWhoMadeVideo])
          const num = quality[gigs[i].userWhoMadeVideo]
          for(let i = 0;i<num;i++){
            console.log(i)
            add = add + `<span class="fa fa-star checked"></span>`
          }
          let d = 5 - num
          console.log(d)
          for(let i = 1;i<=d;i++){
            add = add + `<span class="fa fa-star"></span>`

          }
          console.log(add)
          info= "Calculated based on the likelihood of this user showing up at a session"
         
        }else{
          add = "New User"
          info ="This a new user"
        }
        $('#cards').append(`
        <div class="col-md-4 grid-margin stretch-card">
        <div class="card">
         
          <div class="card-body text-center">
            <div class="nav-profile-text">
              <p class="mb-1 text-black">${gigs[i].firstname} ${gigs[i].lastname}</p>
            </div> 
            <div class="tooltip">
            <div>
           `+add+`
           <i class = "mdi mdi-information-outline"></i>
           </div>
           <span class="tooltiptext">${info}</span>
           </div>
            <h4 class="card-title textt">${moment(gigs[i].newVideoDateObject).tz(moment.tz.guess()).format('DD MMM YYYY')}</h4>
            <p class="card-description textt">${moment(gigs[i].newVideoDateObject).tz(moment.tz.guess()).format('hh:mm A')} ${timezoneShort}</p>     
            <div style = "">
            <button onclick="window.location = '/viewprofile/${gigs[i].userWhoMadeVideo}';" style="padding:8px; width:100%; color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">View Profile</button>
            <button onclick="areYouSureBookSession(${i})" style="padding:8px; width:100%;color:white" type="button" class="card-title btn btn-lg btn-gradient-primary" >Book</button>
            </div>
          </div>
          </div>
        </div>
      </div>  
        `)
       }
    }
  }
  gigsfun(slots, moment)
 

  const sessionfun = (sessions, moment)=>{

    for(i in sessions){

      if (userdata._id == sessions[i].userWhoJoinVideo){
      $('#cardsSession').append(`
          <div class="col-md-4 grid-margin stretch-card">
            <div class="card">
              <div class="card-body text-center">
                <div class="nav-profile-text">
                  <p class="mb-1 text-black">${sessions[i].userWhoMadeVideoFirstName} ${sessions[i].userWhoMadeVideoLastName}</p>
                </div>        
                <h4 class="card-title textt">${moment(sessions[i].newVideoDateObject).tz(moment.tz.guess()).format('DD MMM YYYY')}</h4>
                <p class="card-description textt">${moment(sessions[i].newVideoDateObject).tz(moment.tz.guess()).format('hh:mm A')} ${timezoneShort}</p>
                <div style = "">
                <button onclick="window.location = '/viewprofile/${sessions[i].userWhoMadeVideo}';" style="padding:8px; width:100%; color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">View Profile</button>
                <button onclick="window.location = '/session/${sessions[i]._id}/${userdata._id}';"  style="padding:8px; width:100%;color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">Start Session</button>
              </div>
            </div>
          </div>
              `)
       }else if (userdata._id == sessions[i].userWhoMadeVideo){
        $('#cardsSession').append(`
          <div class="col-md-4 grid-margin stretch-card">
              <div class="card">
                <div class="card-body text-center">
                    <div class="nav-profile-text">
                      <p class="mb-1 text-black">${sessions[i].userWhoJoinVideoFirstName} ${sessions[i].userWhoJoinVideoLastName}</p>
                    </div>
                    <h4 class="card-title textt">${moment(sessions[i].newVideoDateObject).tz(moment.tz.guess()).format('DD MMM YYYY')}</h4>
                    <p class="card-description textt">${moment(sessions[i].newVideoDateObject).tz(moment.tz.guess()).format('hh:mm A')} ${timezoneShort}</p>
                    <div style = "">
                    <button onclick="window.location = '/viewprofile/${sessions[i].userWhoJoinVideo}';" style="padding:8px; width:100%; color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">View Profile</button>
                    <button onclick="window.location = '/session/${sessions[i]._id}/${userdata._id}';"  style="padding:8px; width:100%;color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">Start Session</button>
                  </div>
                </div>
             </div>
        </div> 
      `)
    }
  }
}
  sessionfun(sessions, moment)
///////////////////////////////////////////////

const pendingsessionfun = (pendingSessions, moment)=>{
  for(i in pendingSessions){
    console.log((pendingSessions[i].listSessionId))
    if (i>0){
      if ((pendingSessions[i].listSessionId) != (pendingSessions[i-1].listSessionId)){
        $('#pendingCardsSession').append(`
            <div style="width:100%"><h4>Date: ${moment(pendingSessions[i].newVideoDateObject).tz(moment.tz.guess()).format('DD MMM YYYY')}, Time: ${moment(pendingSessions[i].newVideoDateObject).tz(moment.tz.guess()).format('hh:mm A')} ${timezoneShort}</h4></div>
            <div class = "row" id="newdatedivblock_${pendingSessions[i].listSessionId}">
        `)
      }
    }else{
      $('#pendingCardsSession').append(`
      <div style="width:100%"><h4>Date: ${moment(pendingSessions[i].newVideoDateObject).tz(moment.tz.guess()).format('DD MMM YYYY')}, Time: ${moment(pendingSessions[i].newVideoDateObject).tz(moment.tz.guess()).format('hh:mm A')} ${timezoneShort}</h4></div>
      <div class = "row" id="newdatedivblock_${pendingSessions[i].listSessionId}">
      `)
    }

    if (pendingSessions[i].videoStatus == "pending"){
        if (userdata._id == pendingSessions[i].userWhoJoinVideo){
        $('#newdatedivblock_'+ pendingSessions[i].listSessionId).append(`
            <div class="col-md-4 grid-margin stretch-card">
              <div class="card">
                <div class="card-body text-center">
                  <div class="nav-profile-text">
                    <p class="mb-1 text-black">${pendingSessions[i].userWhoMadeVideoFirstName} ${pendingSessions[i].userWhoMadeVideoLastName}</p>
                  </div>        
                  <div style = "">
                  <button onclick="window.location = '/viewprofile/${pendingSessions[i].userWhoMadeVideo}';" style="padding:8px; width:100%; color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">View Profile</button>
                  <p>Booking Request is </p> <label class="badge badge-gradient-warning">PENDING</label>
                  </div>
                </div>
              </div>
                `)
        }else if (userdata._id == pendingSessions[i].userWhoMadeVideo){
        $('#newdatedivblock_'+ pendingSessions[i].listSessionId).append(`
          <div class="col-md-4 grid-margin stretch-card">
              <div class="card">
                <div class="card-body text-center">
                    <div class="nav-profile-text">
                      <p class="mb-1 text-black">${pendingSessions[i].userWhoJoinVideoFirstName} ${pendingSessions[i].userWhoJoinVideoLastName}</p>
                    </div>
                    <div style = "">
                    <button onclick="window.location = '/viewprofile/${pendingSessions[i].userWhoJoinVideo}';" style="padding:8px; width:100%; color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">View Profile</button>
                    <button onclick="areYouSureAccept(${i})" style="padding:8px; width:100%; color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">Accept</button>
                    <button onclick="areYouSureReject(${i})" style="padding:8px; width:100%; color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">Reject</button>
                </div>
              </div>
            </div>
        </div> 
      `)
      }
    }
    else if (pendingSessions[i].videoStatus == "rejected"){
      if (userdata._id == pendingSessions[i].userWhoJoinVideo){
      $('#newdatedivblock_'+ pendingSessions[i].listSessionId).append(`
          <div class="col-md-4 grid-margin stretch-card">
            <div class="card">
              <div class="card-body text-center">
                <div class="nav-profile-text">
                  <p class="mb-1 text-black">${pendingSessions[i].userWhoMadeVideoFirstName} ${pendingSessions[i].userWhoMadeVideoLastName}</p>
                </div>        
                <h4 class="card-title textt">${moment(pendingSessions[i].newVideoDateObject).tz(moment.tz.guess()).format('DD MMM YYYY')}</h4>
                <p class="card-description textt">${moment(pendingSessions[i].newVideoDateObject).tz(moment.tz.guess()).format('hh:mm A')} ${timezoneShort}</p>
                <div style = "">
                <button onclick="window.location = '/viewprofile/${pendingSessions[i].userWhoMadeVideo}';" style="padding:8px; width:100%; color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">View Profile</button>
                  <p>Booking Request Has Been</p><label style = "display:inline-block;" class="badge badge-gradient-danger">REJECTED</label>
                </div>
              </div>
            </div>
              `)
      }else if (userdata._id == pendingSessions[i].userWhoMadeVideo){
        $('#newdatedivblock_'+ pendingSessions[i].listSessionId).append(`
        <div class="col-md-4 grid-margin stretch-card">
            <div class="card">
              <div class="card-body text-center">
                  <div class="nav-profile-text">
                    <p class="mb-1 text-black">${pendingSessions[i].userWhoJoinVideoFirstName} ${pendingSessions[i].userWhoJoinVideoLastName}</p>
                  </div>
                  <h4 class="card-title textt">${moment(pendingSessions[i].newVideoDateObject).tz(moment.tz.guess()).format('DD MMM YYYY')}</h4>
                  <p class="card-description textt">${moment(pendingSessions[i].newVideoDateObject).tz(moment.tz.guess()).format('hh:mm A')} ${timezoneShort}</p>
                  <div style = "">
                  <button onclick="window.location = '/viewprofile/${pendingSessions[i].userWhoJoinVideo}';" style="padding:8px; width:100%; color:white" type="button" class="card-title btn btn-lg btn-gradient-primary">View Profile</button>
                <p>You <label class="badge badge-gradient-danger">REJECTED</label> This Booking Request</p>
              </div>
            </div>
          </div>
      </div> 
    `)
    }
  }
  }
}
pendingsessionfun(pendingSessions, moment)

/////////////////////////////////////////////////////////////////////////////////////

  $("#filter").click(function(event){
    event.preventDefault();
    var startdate = new Date($('#filterdate1').val());
    var enddate = new Date($('#filterdate2').val());
    console.log(startdate)
    if(!isNaN(startdate)&&!isNaN(enddate)){
      var filterslots = slots.filter(function(e) {
        return new Date(e.videoDate)>= startdate && new Date(e.videoDate)<= enddate;
      });
      $('#cards').empty();
      console.log(filterslots)
      gigsfun(filterslots, moment)
    }else{
      $('#cards').empty();
      gigsfun(slots, moment)
    }
  });
 
 
  optionValue = $("#orderDropdown").val()
  if(optionValue==="new"){
        document.getElementById("newtable").style.display="table";
        document.getElementById("completedtable").style.display="none";
        document.getElementById("inprogresstable").style.display="none";
        document.getElementById("rejectedtable").style.display="none";
  }else if(optionValue==="inprogress"){
        document.getElementById("newtable").style.display="none";
        document.getElementById("completedtable").style.display="none";
        document.getElementById("inprogresstable").style.display="table";
        document.getElementById("rejectedtable").style.display="none";
  }else if(optionValue==="completed"){
        document.getElementById("newtable").style.display="none";
        document.getElementById("completedtable").style.display="table";
        document.getElementById("inprogresstable").style.display="none";
        document.getElementById("rejectedtable").style.display="none";
}else if(optionValue==="rejected"){
        document.getElementById("newtable").style.display="none";
        document.getElementById("completedtable").style.display="none";
        document.getElementById("inprogresstable").style.display="none";
        document.getElementById("rejectedtable").style.display="table";
      }


});

function orderFunction() {
  var optionValue = document.getElementById("orderDropdown").value;
  if(optionValue==="new"){
    document.getElementById("newtable").style.display="table";
    document.getElementById("completedtable").style.display="none";
    document.getElementById("inprogresstable").style.display="none";
    document.getElementById("rejectedtable").style.display="none";
  }else if(optionValue==="inprogress"){
    document.getElementById("newtable").style.display="none";
    document.getElementById("completedtable").style.display="none";
    document.getElementById("inprogresstable").style.display="table";
    document.getElementById("rejectedtable").style.display="none";
  }else if(optionValue==="completed"){
    document.getElementById("newtable").style.display="none";
    document.getElementById("completedtable").style.display="table";
    document.getElementById("inprogresstable").style.display="none";
    document.getElementById("rejectedtable").style.display="none";
  }else if(optionValue==="rejected"){
    document.getElementById("newtable").style.display="none";
    document.getElementById("completedtable").style.display="none";
    document.getElementById("inprogresstable").style.display="none";
    document.getElementById("rejectedtable").style.display="table";
  }
}
function PreviewImage() {
  var oFReader = new FileReader();
  oFReader.readAsDataURL(document.getElementById("uploadImage").files[0]);


  oFReader.onload = function (oFREvent) {
      document.getElementById("uploadPreview").src = oFREvent.target.result;
      document.getElementById("imageform").submit();
  };
}

$("#formbutton").click(function(){
  console.log("click")
  $("#uploadImage").click()
});

var check = function() {
  if (document.getElementById('newpassword').value ==
    document.getElementById('confirmpassword').value && document.getElementById('newpassword').value!="") {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'Password Matching';
    document.getElementById('reset').disabled = false;
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'Password not matching';
    document.getElementById('reset').disabled = true;
  }
}
// function copy() {
//   var copyText = document.getElementById("myInput");
//   copyText.select();
//   copyText.setSelectionRange(0, 99999)
//   document.execCommand("copy");
//   alert("Copied the text: " + copyText.value);
// }

function deleteGig(i){
  gigid = slots[i]._id
  console.log(gigid)
  swal({
    title: "Are you sure you want to delete this session?",
    icon: "warning",
    buttons: true,
    closeModal: false,
}).then((value) => {
  if(value){
    var spinne = document.getElementsByClassName("loading");
    var spinner = spinne[0];
    spinner.style.visibility = "visible";
    // var parseOrder = JSON.parse(order);
    axios.post('/gig/delete/' + gigid).then(function(response) {
    if (response.status === 200) {
        window.location.href = '/gigs';
      }
      spinner.style.visibility = "hidden";
      });
    }else{
       //write what you want to do
      }
 })
}

function makeInactive(gigid, status){
  if (status == "active"){
      swal({
        title: "Are you sure you want to make this inactive?",
        icon: "warning",
        buttons: true,
        closeModal: false,
    }).then((value) => {
      if(value){
        var spinne = document.getElementsByClassName("loading");
        var spinner = spinne[0];
        spinner.style.visibility = "visible";
        // var parseOrder = JSON.parse(order);
            axios.post('/gig/inactive/' + gigid).then(function(response) {
            if (response.status === 200) {
                window.location.href = '/gigs';
              }
              spinner.style.visibility = "hidden";
              });
            }
    })
  }else if(status == "inactive"){
    swal({
      title: "Are you sure you want to make this active?",
      icon: "warning",
      buttons: true,
      closeModal: false,
  }).then((value) => {
    if(value){
      var spinne = document.getElementsByClassName("loading");
      var spinner = spinne[0];
      spinner.style.visibility = "visible";
      // var parseOrder = JSON.parse(order);
          axios.post('/gig/active/' + gigid).then(function(response) {
          if (response.status === 200) {
              window.location.href = '/gigs';
            }
            spinner.style.visibility = "hidden";
            });
          }
  })
  }
}

function areYouSureAccept(i) {
  order = JSON.stringify(pendingSessions[i])
  swal({
      title: "Are you sure you want to accept this session request?",
      icon: "warning",
      buttons: true,
      closeModal: false,
  }).then((value) => {
    if(value){
      var spinne = document.getElementsByClassName("loading");
      var spinner = spinne[0];
      spinner.style.visibility = "visible";
      var parseOrder = JSON.parse(order.replace(/[\r]?[\n]/g, '\\n'))
      axios.post('/acceptbooking/' + parseOrder._id).then(function(response) {
      if (response.status === 200) {
          window.location.href = '/pendingsessions';
        }
        spinner.style.visibility = "hidden";
        });
      }else{
         //write what you want to do
        }
   })
  };
  
  function areYouSureReject(i) {
    order = JSON.stringify(pendingSessions[i])
    swal({
      title: "Are you sure you want to reject this session request?",
      icon: "warning",
      buttons: true,
      closeModal: false,
  }).then((value) => {
    if(value){
      var spinne = document.getElementsByClassName("loading");
      var spinner = spinne[0];
      spinner.style.visibility = "visible";
      var parseOrder = JSON.parse(order.replace(/[\r]?[\n]/g, '\\n'));
      axios.post('/rejectbooking/' + parseOrder._id).then(function(response) {
      if (response.status === 200) {
          window.location.href = '/pendingsessions';
        }
        spinner.style.visibility = "hidden";
        });
       }else{
         //write what you want to do
        }
   })};


function areYouSureSubmit(order, completeorder) {
    var spinne = document.getElementsByClassName("loading");
    var spinner = spinne[0];
    spinner.style.visibility = "visible";
    var parseOrder = JSON.parse(order.replace(/[\r]?[\n]/g, '\\n'));
    axios.post('/uploadorder/' + parseOrder._id, {completeorderstring: completeorder}).then(function(response) {
      if (response.status === 200) {
         window.location.href = '/orderinfo/' + parseOrder._id;
        }
        spinner.style.visibility = "hidden";
        });
  }
  

function areYouSureAcceptinDetailPage(order) {
  swal({
      title: "Are you sure you want to accept this order?",
      icon: "warning",
      buttons: true,
      closeModal: false,
  }).then((value) => {
    if(value){
      var spinne = document.getElementsByClassName("loading");
      var spinner = spinne[0];
      spinner.style.visibility = "visible";
      var parseOrder = JSON.parse(order.replace(/[\r]?[\n]/g, '\\n'));
      axios.post('/accept/' + parseOrder._id).then(function(response) {
      if (response.status === 200) {
          window.location.href = '/pendingsessions';
        }
        spinner.style.visibility = "hidden";
        });
      }else{
         //write what you want to do
        }
   })};


function areYouSureRejectinDetailPage(order) {
  swal({
      title: "Are you sure you want to reject this order?",
      icon: "warning",
      buttons: true,
      closeModal: false,
  }).then((value) => {
    if(value){
      var spinne = document.getElementsByClassName("loading");
      var spinner = spinne[0];
      spinner.style.visibility = "visible";
      var parseOrder = JSON.parse(order.replace(/[\r]?[\n]/g, '\\n'));
      axios.post('/reject' + parseOrder._id).then(function(response) {
      if (response.status === 200) {
          window.location.href = '/pendingsessions';
        }
        spinner.style.visibility = "hidden";
        });
      }else{
         console.log("Error Rejecting Record")
        }
   })};

   function areYouSureBookSession(i) {
    order = JSON.stringify(slots[i])
    swal({
        title: "Are you sure you want to book this session?",
        icon: "warning",
        buttons: true,
        closeModal: false,
    }).then((value) => {
      if(value){
        var spinne = document.getElementsByClassName("loading");
        var spinner = spinne[0];
        spinner.style.visibility = "visible";
        var parseOrder = JSON.parse(order.replace(/[\r]?[\n]/g, '\\n'));
        console.log(parseOrder)
        axios.post('/pendingbooking/' + parseOrder._id, parseOrder).then(function(response) {
        if (response.status === 200) {
            window.location.href = '/pendingsessions';
          }
          spinner.style.visibility = "hidden";
          });
        }else{
           //write what you want to do
          }
     })};
     if(page === 'partials/_viewprofile'){
      let lang = profile.languages
          for(i in lang){
            console.log(lang[i])
            $('#slim-select option[value='+lang[i] + ']').prop('selected',true) 
          }
          new SlimSelect({
            select: '#slim-select',
            placeholder: 'No skills chosen',
          });
      
     }else if(page === 'partials/_profile'){
      let lang = userdata.languages
          for(i in lang){
            console.log(lang[i])
            $('#slim-select option[value='+lang[i] + ']').prop('selected',true) 
          }
          new SlimSelect({
            select: '#slim-select',
            placeholder: 'Choose your languages and frameworks',
          });
      
     }

/**
 * Function to create time ago
 * @param {*} reportDate 
 * @returns 
 */
function timeAgo(reportDate) {
  if (reportDate) {
      const date = (new Date(reportDate).getTime()) / 1000
      var seconds = Math.floor(((new Date().getTime() / 1000) - date))

      var interval = seconds / 31536000;

      if (interval > 1) {
          var timeframe = (Math.floor(Math.abs(interval)) > 1) ? ' years' : ' year';
          return Math.floor(Math.abs(interval)) + timeframe + " ago";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
          var timeframe = (Math.floor(Math.abs(interval)) > 1) ? ' months' : ' month';
          return Math.floor(Math.abs(interval)) + timeframe + " ago";
      }
      interval = seconds / 86400;
      if (interval > 1) {
          var timeframe = (Math.floor(Math.abs(interval)) > 1) ? ' days' : ' day';
          return Math.floor(Math.abs(interval)) + timeframe + " ago";
      }
      interval = seconds / 3600;
      if (interval > 1) {
          var timeframe = (Math.floor(Math.abs(interval)) > 1) ? ' hours' : ' hour';
          return Math.floor(Math.abs(interval)) + timeframe + " ago";
      }
      interval = seconds / 60;
      if (interval > 1) {
          var timeframe = (Math.floor(Math.abs(interval)) > 1) ? ' minutes' : ' minute';
          return Math.floor(Math.abs(interval)) + timeframe + " ago";
      }
      return 'Just Now';
  }
}
   
   
   