/*
    File Name:  register.js
    Purpose:    Automating the page register.html and
                managing user profile registration
                by calling the user post API.

    Authors:    Ahmad Gaber and Victor
    Class:      CSC 337
 */



/*
    This function called on loading of register.html page.
    Registers/creates new account for the new user
    by the user post API in the server,
    then alert the user in case of unmatch password fields
    or if the email is already defined.
    Also alerts the user i case of successful registration.
*/
function register(event)
{   
    event.preventDefault();

    console.log("Form Submit");

    if(  $('#password').val() == $('#password2').val() ) {
        $.ajax({
            url: '/user',
            method: 'POST',
            data: {  
                "name":$('#name').val(),
                "email":$('#email').val(),
                "password":$('#password').val(),
                "avatar":document.getElementById("AvatarElmnt").files[0].name,
                "company":$('#company').val(),
                "website":$('#website').val(),
                "bio":$('#bio').val()
            },
            success: (data) => {
                if (data == 'DUPLICATE_EMAIL') {
                    alert('This email is already registred.');
                } else {
                var formData = new FormData();
                formData.append( 'image', document.getElementById("AvatarElmnt").files[0] );
                $.ajax({
                    url: `/imageAPI`,
                    method: 'POST',
                    processData: false,
                    contentType: false,
                    data: formData,
                    success: (data) => {
                        alert('You have been registered successfully.');
                        window.location.href="/login.html";
                    }
                });
               
            }
        }
    });
    }
    else{
        alert('password fields must match.');
        }
}
