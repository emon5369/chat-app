# UsChat App

A real-time chat application built using **React**, **Appwrite**, and **TailwindCSS**. This app allows users to sign in, send messages, and interact with others in a chat room. Messages are stored and fetched in real time using **Appwrite's Database** and **Realtime API**.

## Features

- **Real-time Messaging:** Messages are updated instantly for all users.
- **Authentication:** User authentication is handled via Appwrite.
- **Message Creation and Deletion:** Users can send messages and delete their own messages.
- **Responsive Design:** Works well on both desktop and mobile devices.

## Tech Stack

- **Frontend:** React, TailwindCSS
- **Backend:** Appwrite (Database, Realtime API)
- **Icons:** React Feather

### Prerequisites

- **Node.js**
- **npm**
- **Appwrite** account for backend services

### Appwrite Setup

### Step 1: Create a New Project

1. Log in to your Appwrite console.
2. Create a new project and note down the **Project ID**.

### Step 2: Setup Authentication

1. Navigate to the **Auth** section of your project.
2. Enable **Email/Password Authentication** in the settings for user registration and login.

### Step 3: Setup Database Collections

1. Go to the **Database** section.
2. Create a collection named `messages`.
3. Add the following attributes:
   - `user_id` (string)
   - `username` (string)
   - `body` (string)
4. From the `messages` collection, go to the "settings" > "Permissions" > " + Add Role" and select "Any". Give this user type "Create", "Read", "Update" and "Delete" permissions.

### Step 4: Install the Appwrite SDK

```bash
npm install appwrite
```

## Installation

Follow these steps to get the project up and running on your local machine.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/emon5369/chat-app
   cd chat-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the root directory.
   - Add the following environment variables:

     ```bash
     REACT_APP_APPWRITE_ENDPOINT=<Your Appwrite endpoint>
     REACT_APP_APPWRITE_PROJECT_ID=<Your Appwrite project ID>
     REACT_APP_APPWRITE_DATABASE_ID=<Your Appwrite database ID>
     REACT_APP_APPWRITE_COLLECTION_ID=<Your Appwrite collection ID>
     ```

   Replace the placeholder values with your actual Appwrite project details.

4. **Run the development server:**

   ```bash
   npm run dev
   ```
The app should now be running at http://localhost:5173.

## Demo

Check out the live demo of UBlog: [Click here](http://uschatapp.netlify.app/)

**Demo Credentials:**

- **Email**: emon@gmail.com
- **Password**: 12345678

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue to discuss improvements or bug fixes.

