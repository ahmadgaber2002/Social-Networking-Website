# Social Networking Website

This project is a social networking website that allows users to create accounts, post content, like and comment on posts, and view other users' profiles. It is built using Node.js, Express, and MongoDB for the backend, and HTML, CSS, and JavaScript for the frontend.

## Features

- **User Authentication:** Users can register, log in, and log out. Passwords are securely stored.
- **User Profiles:** Each user has a profile that displays their information and posts.
- **Posting:** Users can create, edit, and delete posts, as well as upload images.
- **Commenting and Liking:** Users can comment on and like posts, with the ability to delete their own comments.
- **Responsive Design:** The website is designed to be responsive and user-friendly.

### Backend Files

- **server.js**: This is the main server file that handles all the routing and API calls, manages the connection to the MongoDB database, and serves the static files. It also manages user authentication, posting, commenting, and liking functionalities.

### Frontend Files

- **HTML Files**:
  - `index.html`: The landing page of the website.
  - `login.html`: The login page where users enter their credentials.
  - `register.html`: The registration page for new users.
  - `post.html`: The main page where users can view and create posts.
  - `postcomment.html`: The page where users can view and comment on individual posts.
  - `profile.html`: The user profile page displaying the user's information and posts.

- **CSS Files**:
  - `global.css`: General styles applied across the website.
  - `index.css`: Styles specific to the landing page.
  - `post.css`: Styles specific to the posts and comments.

- **JavaScript Files**:
  - `login.js`: Manages the login process by validating user credentials against the server API.
  - `register.js`: Handles the registration process, including form validation and user creation.
  - `post.js`: Manages the post and comment functionalities, including creating, editing, deleting, and displaying posts and comments.
  - `profile.js`: Handles displaying and editing user profile information.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/social-networking-website.git
    cd social-networking-website
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the MongoDB server**:
    Ensure MongoDB is installed and running on your machine.

4. **Run the server**:
    ```bash
    node server.js
    ```

5. **Access the website**:
    Open your web browser and navigate to `http://localhost:3000`.

## Usage

- **Registration**: Visit the registration page and create a new account.
- **Login**: Use your credentials to log in and access the main functionalities.
- **Profile**: View and edit your profile by clicking on your avatar or username.
- **Posting**: Create, edit, or delete posts and upload images.
- **Interaction**: Comment on and like other users' posts.

## APIs

The server.js file provides a set of APIs to interact with the MongoDB database:

- **User Management**:
  - `POST /user`: Registers a new user.
  - `POST /login`: Logs in a user and sets a session cookie.
  - `GET /user/:email`: Retrieves user information based on email.

- **Post Management**:
  - `POST /post`: Creates a new post.
  - `GET /post`: Retrieves all posts.
  - `GET /post/:postid`: Retrieves a specific post.
  - `DELETE /post/:postid`: Deletes a specific post.
  - `PUT /post/:postid`: Updates a specific post.

- **Comment Management**:
  - `POST /comment`: Adds a new comment to a post.
  - `DELETE /comment`: Deletes a comment from a post.

- **Like Management**:
  - `POST /like`: Adds or removes a like from a post.

- **Image Upload/Download**:
  - `POST /imageAPI`: Uploads an image.
  - `GET /imageAPI/:filename`: Retrieves an image.
