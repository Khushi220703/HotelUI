# Hotel Management System - Frontend (Vite + React)

This is the frontend of the **Hotel Management System** built with **React** and **Vite**. The frontend allows users to register, log in, search for hotels based on location, book rooms, and leave reviews. It communicates with the backend API to perform these operations.

# Table of Contents

1) [Project Description](#project-description)

2) [Features](#features)

3) [Tech Stack](#tech-stack)

4) [Installation](#installation)

5) [Usage](#usage)

6) [API Endpoints](#api-endpoints)

---

# Project Description
The frontend of the **Hotel Management System** provides a user-friendly interface where users can interact with the hotel booking platform. The application allows users to search for hotels, book rooms, and leave reviews. It communicates with the backend API to authenticate users, fetch hotel data, and submit reviews and bookings.

---

# Features

### User Features

1. **User Registration & Login**: Users can register and log in to the platform to access personalized services.
   
2. **Hotel Search**: Users can search for hotels based on location, availability, and other filters.

3. **Hotel Booking**: Users can book rooms in available hotels and manage their bookings.

4. **Leave Reviews**: Users can leave reviews for hotels they've stayed in to help other users make informed decisions.

5. **Email Verification**: After registering, users must verify their email to activate their account and gain full access.

---

### Admin Features

1. **Admin Login**: Admins can log into the system with special credentials.

2. **Add Hotels**: Admins can add new hotels to the platform, specifying details such as location, amenities, pricing, etc.

3. **Delete Hotels**: Admins have the authority to delete hotels from the platform when necessary.

4. **View Own Hotels**: Admins can only view and manage hotels they have added to the system.

5. **View Hotel Reviews**: Admins can view reviews left by users for all hotels and take action if any reviews violate terms.

---

# Tech Stack

1. **Frontend Framework**: React.js

2. **Bundler**: Vite

3. **Styling**: CSS / Bootstrap

4. **State Management**: React Hooks / Context API

5. **Authentication**: JWT (JSON Web Tokens)

6. **API Communication**: Axios or Fetch

---

# Installation

### Prerequisites

- **Node.js** (v16+ recommended)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/hotel-management-frontend.git
    cd hotel-management-frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the Vite development server:

    ```bash
    npm run dev
    ```

The frontend should now be running on `http://localhost:3000`.

---

# Usage

1. Once the frontend application is running:

2. Users can register and log in to the system.

3. Users can search hotels based on location and book rooms.

4. Users can leave reviews for hotels they have stayed in.

---


**Screenshots**

Home Page
<img width="1919" height="905" alt="Screenshot 2025-04-16 235140" src="https://github.com/user-attachments/assets/7b66a114-db0e-49b3-8573-efa127c80b42" />

Responsive View
<img width="458" height="729" alt="Screenshot 2025-04-17 002259" src="https://github.com/user-attachments/assets/f036dbe6-ae8a-4add-ba29-19b4ee428af0" />

The list of hotels based on users location
<img width="1919" height="908" alt="Screenshot 2025-04-16 235156" src="https://github.com/user-attachments/assets/9a94b0ad-d89a-4318-b1ee-40f1cc886e92" />

Adding the hotel by the admin
<img width="1919" height="906" alt="Screenshot 2025-04-16 235323" src="https://github.com/user-attachments/assets/f81b07b8-5601-4b05-a1f1-f3e6acdc518f" />

<img width="1919" height="912" alt="Screenshot 2025-04-17 000822" src="https://github.com/user-attachments/assets/a152f33f-04d6-4569-8e1e-d31c9dca25c7" />

This is hotel detail page here admin can delete hotel and user can book hotel and review hotel
<img width="1916" height="904" alt="Screenshot 2025-04-17 001300" src="https://github.com/user-attachments/assets/15bb4b97-8cf2-4a0c-a72b-000d4af3d4d6" />

Hotel detail page shows every detail regrading the hotel
<img width="1919" height="923" alt="Screenshot 2025-04-17 001610" src="https://github.com/user-attachments/assets/83be3cda-4a7a-45b7-af6f-279c009f783a" />

Book hotel
<img width="1904" height="902" alt="Screenshot 2025-04-17 001626" src="https://github.com/user-attachments/assets/bd216623-53f0-4466-9cec-71cb42dcb8c2" />

