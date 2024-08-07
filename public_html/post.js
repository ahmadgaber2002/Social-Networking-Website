/*
    File Name:  post.js
    Purpose:    Automate and manage the most
                important page in the project.
                Main functions are:
                -   calling a lot of API's.
                -   receives, process and organize the received
                    information from the server
                -   manage and automate the two pages:
                    post.html and postcomment.html.
                -   manage and automate the post creation,
                    modification and deletion
                -   manage and automate the post's comments
                    and like
                -   manage and automate the image processing of
                    users and posts.

    Authors:    Ahmad Gaber and Victor
    Class:      CSC 337
 */



// Global Variables
userIdGlobal = '';
avatarGlobal ='';

/*
    This function is helper function.
    It is populating the user information by
    calling the get user API.
*/
function populateUserData(){
    userIdGlobal = '';
    let emailVar = decodeURIComponent(document.cookie.split('=')[1]);
    $.ajax({ 
        url: `/user/${emailVar}`,
        method: 'GET',
        data: {},
        success: (data) => {
            $('.profile-img').attr("src","./imageAPI/" + data[0].avatar);
            $('#profileLink').attr("href","./profile.html?email=" + data[0].email);
            userIdGlobal = data[0]._id;
            avatarGlobal = data[0].avatar;
        }
    });
}

/*
    This function called on loading of the post.html page.
    It shows all the existing posts.
    It calls two helper functions:
    - populateUserData() which populates user's information.
    - populatePosts() which populates all posts' information.
*/
function showPosts(){   
    populateUserData ();
    $.ajax({
        url: `/post`,
        method: 'GET',
        data: {},
        success: (data) => {
            populatePosts(data,'POSTS');
        }
    });
}

/*
    This function called on loading of the postcomment.html page.
    It shows one post in postcomment.html page.
    It calls two helper functions:
    - populateUserData() which populates user's information.
    - populatePosts() which populates the information of one post.
*/
function showPost(){   
    populateUserData ();

    const urlParams = new URLSearchParams(window.location.search);
    const postid = urlParams.get('postid');
    console.log("postid=" + postid);
    $.ajax({
        url: `/post/${postid}`,
        method: 'GET',
        data: {},
        success: (data) => {
            populatePosts(data,'COMMENTS');

            const urlParams = new URLSearchParams(window.location.search);
            const edit = urlParams.get('edit');
            if(edit=='Y'){
                console.log('Edit Post');
                editPosthtml =
                    '<form id=\"PostFormId\" class=\'form my-1\'>' + 
                        '<input type=\"file\" accept=\"image/*\" id=\"postImageElement\" name=\"image\" />' +
                        '<textarea id=\'postText\' cols=\'30\' rows=\'4\'' + 
                        '></textarea>' +                 
                        '<input type=\'button\' class=\'btn btn-dark my-1\' value=\'Edit Post\' onclick=\"modifyPost(\'' +data[0]._id+ '\')\"/>'+
                    '</form>';
                $('#PostImgDiv').append(editPosthtml);
                $('#postText').val(data[0].text);
                $('#PostTextDiv').hide();
            }

        }
    });
}

/*
    This function is helper function.
    It is iterating through the posts array
    and send every post to the function: buildPostHtml()
    which is constructing and building the required html
    elements as per the business requirements for each post.
    Finally append the constructed html code to the
    html element (div with ID: PostsShowDiv)
*/
function populatePosts(data, landingFrom){
    for(const post of Array.from(data) ){
        $('#PostsShowDiv').append( buildPostHtml(post,landingFrom) );
    }
}

/*
    This function is helper function.
    It is dynamically constructing and building all
    the required html elements as per the business
    requirements for each post and page.
    It is called in the following cases:
    -   building and constructing the required html elements to
        display all the existing posts in the post.html page 
    - building and constructing the required html elements to
        display one post in the postcomment.html page
    Finally it returns the constructed html code.
        */
function buildPostHtml(post,landingFrom){
    console.log('landingFrom ' + landingFrom);
    let emailVar = decodeURIComponent(document.cookie.split('=')[1]);

    let postImageCode = '<div id=\"PostImgDiv\">' ;
    if(post.postImage !== null && post.postImage !== ''){
        postImageCode +=
                            '<img class=\'postshow-img\' src=\"./imageAPI/'+ post.postImage + '\" />';
    }
    postImageCode += '</div>';
    // show the proper like icon
    likeIconStr = '<i class=\'fas fa-thumbs-up\'></i>';
    if(post.likes.includes(userIdGlobal) ){
        likeIconStr= '<i class=\'fas fa-thumbs-up likedCSS\'></i>';
    }

    // construct the html of the post edit and delete icons 
    editIconStr= '';
    deleteIconStr='';
    if(post.user._id == userIdGlobal){
        editIconStr =
        '<button  class=\'btn btn-light\' onclick=\"openEditPostPage(\'' + post._id +'\')\">' +
                '<i class="fas fa-edit"></i>' +
        '</button >' ;

        deleteIconStr =
        '<button  class=\'btn btn-light\' onclick=\"deletePost(\'' + post._id +'\')\">' +
                '<i class="fas fa-trash-alt"></i>' +
        '</button >' ;
    }

    /*  
        construct the html of the post comments information
        to be dispalyed in the postcomment.html page
    */ 
    let commentsHtml = ''
    if(landingFrom =='COMMENTS'){
        for(const comment of Array.from(post.comments) ){
            deleteCommentIconStr = '';
            if(comment.commentByUser._id == userIdGlobal){              
                deleteCommentIconStr =
                '<button  class=\'btn btn-light\' onclick=\"deleteComment(\'' + post._id +'\',\'' + comment._id+ '\')\">' +
                        '<i class="fas fa-trash-alt"></i>' +
                '</button >' ;
            }

            commentsHtml+= 
            '<div style=\"display: flex;\">'+
                '<a href=\"./profile.html?email='+ comment.commentByUser.email +'\">'+
                '<img class=\'comment-profile-img\' src=\"./imageAPI/' +comment.commentByUser.avatar+ '\" />' +
                '</a>' +
                '<div>' +
                '<a href=\"./profile.html?email='+ comment.commentByUser.email +'\">'+
                    '<h4>'+comment.commentByUser.name+'</h4>' +
                '</a>' +
                '<h4>'+comment.commentText +'</h4>' +
                '<div style=\"display: flex;\"><p class=\'post-date\'>Commented on ' + comment.commentDate.substring(0,16).replace('T',' ') 
                + '</p>'+ deleteCommentIconStr + '</div>'+
                '</div>' +
                '</div>' ;
        }
        // costruct html for new comment text field and button
        commentsHtml+= 
            '<div style=\"display: flex;\">'+
                '<a href=\"./profile.html?email='+ emailVar +'\">'+
                '<img class=\'comment-profile-img\' src=\"./imageAPI/' +avatarGlobal+ '\" />' +
                '</a>' +
                '<form class=\'form my-1\' style=\"width:100%;\">' +
                '<textarea id=\'commentText\' rows=\'4\' placeholder=\'Write a comment...\' required></textarea>' +
                '<input type=\'button\' class=\'btn btn-dark my-1\' value=\'Comment\' onclick=\"postComment()\"/>' + 
                '</form>' +
                '</div>' ;
    }

    /*
        construct the variable that contains all the html elements
        that required to display the posts information
    */
    let htmlCode = 
    '<div class=\'post bg-white p-1 my-1\'>'+
    '<div>'+
        '<a href=\"./profile.html?email='+ post.user.email +'\">'+
        '<img class=\'round-img\' src=\"./imageAPI/'+ post.user.avatar +'\"  />'+
        '<h4>'+post.user.name+'</h4>'+
        '</a>'+
    '</div>'+
    '<div>'+

    postImageCode +  

    '<div id=\"PostTextDiv\"><p class=\'my-1\'>'+ post.text + '</p></div>'+
    '<p class=\'post-date\'>Posted on ' + post.postDate.substring(0,16).replace('T', ' ') + '</p>'+

    ((landingFrom == 'POSTS')?
    '<button class=\'btn btn-light\' onclick=\"postLikes(this,\''+ post._id + '\')\" \" onmouseleave=\"closePopup()\" onmouseenter=\"showLikes(this, \'' +
    post._id + '\')\">'+ likeIconStr + '<span style=\"padding: 5px;\" >' + post.likes.length + '</span>'+
    '</button >'+

    '<button  class=\'btn btn-light\' onclick=\"openCommentPage(\''+ post._id + '\')\" >'+
        '<i class=\'fas fa-comment-dots\'></i>'+
        '<span style=\"padding-left: 5px;\">' + post.comments.length + '</span>'+
    '</button >' +
    editIconStr +
    deleteIconStr 
    
    : commentsHtml )+

    '</div>'+
    '</div>';

    return htmlCode;
}

/*
    This function called from post.html page.
    It is inserting a new post record and upload
    its image in the database by calling the
    corresponding API's in the server.
    It alerts the user that his post
    has been published successfully in case of success.
    It raises alert message to the user if he
    clicks submit button without writing any text.
*/
function submitPost(){
    if(  $('#postText').val()){
        let emailVar = decodeURIComponent(document.cookie.split('=')[1]);
        let postImageName ="";
        if( $("#postImageElement").val() ){
            postImageName = document.getElementById("postImageElement").files[0].name;
        }
        
        $.ajax({
            url: '/post',
            method: 'POST',
            data: {  
                "email":emailVar,
                "text":$('#postText').val(),
                "postImage":postImageName
            },
            success: (data) => { 
                if( $("#postImageElement").val() ){
                    var formData = new FormData();
                    formData.append( 'image', document.getElementById("postImageElement").files[0] );

                    $.ajax({
                        url: `/imageAPI`,
                        method: 'POST',
                        processData: false,
                        contentType: false,
                        data: formData,
                        success: (data) => {
                            alert('Your post has been published successfully.');
        document.getElementById("PostFormId").reset();
        window.location.reload(); 
                        }
                    });
                }
        }
    });
        
    }else{
        alert('Sorry, you have to enter your post text first!');
    }
}

/*
    This function is called when the user
    clicks the edit button in the post.
    It is calling the postcomment.html page
    and send the user's email as a parameter.
*/
function openEditPostPage(postId){
    window.location.href ='./postcomment.html?postid='+postId +'&edit=Y' ;
}

/*
    This function called when the user clicks
    the update button in the post.
    It is modifying a post record in the database
    by calling the corresponding API's in the server.
    Then update the post image file in the database
    by calling the corresponding API in the server.
    It alerts the user that post has been updated
    successfully in case of success.
*/
function modifyPost(postId){
    console.log(postId);
    postImageValue = null;
    if( $("#postImageElement").val() ){
        postImageValue = document.getElementById("postImageElement").files[0].name ;
    }

    $.ajax({
        url: `/post/${postId}`,
        method: 'PUT',
        data: {
            text: $('#postText').val(),
            postImage: postImageValue
        },
        success: (data) => {
            if( $("#postImageElement").val() ){
                var formData = new FormData();
                formData.append( 'image', document.getElementById("postImageElement").files[0] );
            
                $.ajax({
                    url: `/imageAPI`,
                    method: 'POST',
                    processData: false,
                    contentType: false,
                    data: formData,
                    success: (data) => {
                        alert('Your post has been updated successfully.');
                        window.location.href ='./post.html' ;
                    }
                });
            }

           
        }
    });

}

/*
    This function is called when the user
    clicks the comment button in the post.
    It is calling the postcomment.html page
    and send the user's email as a parameter.
*/
function openCommentPage(postId){
    window.location.href ='./postcomment.html?postid='+postId ;
}

/*
    This function called when the user clicks
    the delete button in the post.
    It is deleting post record from the database
    by calling the corresponding API's in the server.
    It alerts the user that his post has been deleted
    successfully in case of success.
*/
function deletePost(postId){
    console.log(postId);
    $.ajax({
        url: `/post/${postId}`,
        method: 'DELETE',
        data: {},
        success: (data) => {
            console.log('delete data ' + data);
            alert('Your post has been deleted successfully.');
            window.location.reload(); 
        }
    });
}

/*
    This function is called when the user
    clicks the like button.
    It is either adding new like or removing
    an existing like to/on specific post and update
    the database by calling the corresponding APT.
    It toggles the like icon between liked (blue)
    and unliked (black).
    It also change the likes counter by adding
    one in case of like or decreasing one in case
    of unlike
*/
function postLikes(element , postId){
    console.log(postId);
    let emailVar = decodeURIComponent(document.cookie.split('=')[1]);
    $.ajax({
        url: `/like`,
        method: 'POST',
        data: {
            email:emailVar,
            postId: postId
        },
        success: (data) => {
        }
    });

    var likesCount = parseInt( $(element).find('span').text() );
    if($(element).children().hasClass("likedCSS")){
        $(element).children().removeClass("likedCSS");
        $(element).find('span').text(--likesCount);
    }
    else{
        $(element).children().addClass("likedCSS");
        $(element).find('span').text(++likesCount);
    }
}

/*
    This function called when the user clicks
    the create new comment button in the post.
    It is inserting a new comment record in the database
    by calling the corresponding API's in the server.
*/
function postComment(){
    let commentText = $('#commentText').val();
    if (commentText == '') {
        alert('Sorry, you have to write your comment first.');
    }
    else {
    let emailVar = decodeURIComponent(document.cookie.split('=')[1]);

    const urlParams = new URLSearchParams(window.location.search);
    const postid = urlParams.get('postid');
    console.log('commentText ' + commentText);
    $.ajax({
        url: `/comment`,
        method: 'POST',
        data: {
            email:emailVar,
            postId: postid,
            commentText: commentText
        },
        success: (data) => {
            window.location.href ='./post.html' ;
        }
    });
}
}

/*
    This function called when the user clicks
    the delete comment button in the post.
    It is deleting the comment record from the database
    by calling the corresponding API's in the server.
    It alerts the user that his comment has been deleted
    successfully in case of success.
*/
function deleteComment(postId, commentId){
    console.log(postId + ' ' + commentId);
    $.ajax({
        url: `/comment`,
        method: 'DELETE',
        data: {
            postId:postId,
            commentId: commentId
        },
        success: (data) => {
            console.log('delete data ' + data);
            alert('Your comment has been deleted successfully.');
            window.location.reload(); 
        }
    });
}

/*
    This function is helper function.
    it receives an element as parameter,
    then return the coordinates of that element.
*/
function getOffset(element) {
    const elementRect = element.getBoundingClientRect();
    return {
        left: elementRect.left + window.scrollX,
        top: elementRect.top + window.scrollY
    };
}

/*
    This function is calling when the mouse
    enters over the like icon of any post.
    It displays the likes popup above the like button.
    It gets the likes list of a specific post
    by calling the corresponding API's in the server.
    Then iterates in the post likes list and show
    the users who liked that post in the popup.
*/
function showLikes(element, postId){
    $.ajax({
        url: `/post/${postId}`,
        method: 'GET',
        data: {},
        success: (data) => {
            likesHtml = '';

            let i = 0
            for(const like of Array.from(data[0].likes) ){
                likesHtml += '<div style=\"display: flex;\">'+
                '<a href=\"./profile.html?email='+ like.email +'\">'+
                '<img class=\'comment-profile-img\' src=\"./imageAPI/' +like.avatar+ '\" />' +
                '</a>' +
                '<a href=\"./profile.html?email='+ like.email +'\">'+
                    '<h4>'+like.name+'</h4>' +
                '</a>' +
                '</div> <hr class="lineSeperator"/>'  ;
                i = i+1
            }
            
            if (likesHtml != '') {
                mousex = getOffset(element).left + 30
                mousey = getOffset(element).top - 40 - (i * 55)
                d = document.getElementById("LikesPopup");
                d.style.position = "absolute";
                d.style.left = mousex+'px';
                d.style.top = mousey+'px';

                $('#popupContainer').html(likesHtml);
                document.getElementById("LikesPopup").style.display = "block";
            }
        }
    });
}

/*
    This function is calling when the mouse
    leaves the like icon of any post.
    It hides the likes popup.
*/
function closePopup(){
    document.getElementById("LikesPopup").style.display = "none";
}