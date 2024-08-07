/*
    File Name:  profile.js
    Purpose:    Automating the page profile.html and
                display user profile information
                in query mode by calling the get user API.

    Authors:    Ahmad Gaber and Victor
    Class:      CSC 337
 */



/*
    This function called on loading of the profile.html
    page which opens whenever the use clicks the user's
    avatar or the user name.
    Calling the get user API and sending the user's
    email to the API and receive & display the user
    profile information
*/
function showprofile(){
    let emailVar = decodeURIComponent(document.cookie.split('=')[1]);
    $.ajax({
        url: `/user/${emailVar}`,
        method: 'GET',
        data: {},
        success: (data) => {
            $('.profile-img').attr("src","./imageAPI/" + data[0].avatar);
            $('#profileLink').attr("href","./profile.html?email=" + data[0].email);
            
        }
    }); 

    const urlParams = new URLSearchParams(window.location.search);
    const profileEmail = urlParams.get('email');
    console.log("profileEmail=" + profileEmail);

    $.ajax({
        url: `/user/${profileEmail}`,
        method: 'GET',
        data: {},
        success: (data) => {
            $('.profileAvatar').attr("src","./imageAPI/" + data[0].avatar);
            $('#name').val( data[0].name);
            $('#email').val( data[0].email);
            $('#company').val( data[0].company);
            $('#website').val( data[0].website);
            $('#bio').val( data[0].bio);
        
        }
    });
}