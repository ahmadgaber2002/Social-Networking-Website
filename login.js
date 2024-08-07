/*
    File Name:  login.js
    Purpose:    Automating the page login.html and
                managing user login by calling
                the login API.

    Authors:    Ahmad Gaber and Victor
    Class:      CSC 337
 */




/*
    This function called from the login.html page.
    Validates the user name & password
    by the login API in the server
    then alert the user in case of invalid
    email or password
*/
  function login() {
    $.ajax({
      url: '/login',
      method: 'POST',
      data : {
        email: $('#email').val() ,
        password: $('#password').val()
      },
      success: (data) => {
        if (data == "LOGIN_OK") { 
          window.location.href="/post.html";
        }else{
          alert('Invalid email or password.');
        }
      }
    }); 
  }