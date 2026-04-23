# 🌿 EcoBazaarX

> **A Carbon Footprint Aware Shopping Assistant**

Welcome to **EcoBazaarX**, an innovative e-commerce platform designed to promote sustainable shopping. EcoBazaarX goes beyond traditional online shopping by tracking and displaying the environmental impact ($CO_2$ emissions) of products, empowering users to make eco-conscious purchasing decisions.

---

## 📖 Project Overview

EcoBazaarX is a modern e-commerce solution that integrates environmental awareness into the core shopping experience. By providing clear visibility into the carbon scores of various products, it serves as a smart shopping assistant for users who care about their ecological footprint. The platform offers a seamless shopping experience with features like secure authentication, smart cart management, and real-time notifications.

---

## 🛠️ Technology Stack

Our platform is built using a robust, highly scalable, and modern technology stack:

### 🎨 Frontend
* **React.js**: A dynamic JavaScript library for building fast and interactive user interfaces.
* **HTML5/CSS3**: Used for robust page structuring and modern styling for a responsive user interface.

### ⚙️ Backend
* **Java Spring Boot**: A powerful framework for building production-ready Spring applications quickly and with minimal configuration.
* **Spring Security & JWT**: Ensures robust authentication and scalable, stateless authorization using JSON Web Tokens.

### 🗄️ Database
* **MySQL**: A reliable relational database management system for secure and structured data storage.

---

## 🏗️ System Architecture

EcoBazaarX follows a standard **Three-Tier Architecture (Client-Server-Database)** for clear separation of concerns, scalability, and maintainability:

1. **Presentation Tier (Client)**: Built with React.js, it manages the user interface, routing, and user interactions.
2. **Application Tier (Server)**: The Java Spring Boot backend acts as the core processing unit, handling business logic, API requests, and secure authentication.
3. **Data Tier (Database)**: MySQL handles secure data persistence, retrieving and storing user profiles, product catalogs, and transactional data.

---

## ✨ Key Features

### 💻 Frontend Features
* **Interactive User Interface**: A modern, responsive design for a seamless shopping experience.
* **Carbon Score Display**: Intuitive visual indicators showing the environmental impact of products.
* **Smart Cart Management**: Dynamic add, remove, and quantity update functionalities.
* **User Profiles**: Personalized dashboard for managing account details and viewing data.
* **Toast Notifications**: Real-time interactive popups indicating success, error, or informational messages to the user.

### 🎛️ Backend Features
* **Secure User Authentication**: Robust login and registration system with secure password hashing.
* **JWT Authorization**: Secure, stateless session management across the platform.
* **Product Management API**: Endpoints for fetching, creating, and updating catalog items along with their carbon footprints.
* **Cart & Order Processing**: Efficient handling of cart states and checkout workflows.

---

## 🗂️ Database Schema Overview

The database is structured to maintain referential integrity and performance. Key entities include:

* **🧑‍💼 Users**: Stores user credentials, personal information, roles, and status.
* **🛍️ Products**: Contains product details, pricing, inventory count, and crucially, the **Carbon Score** ($CO_2$ emissions data).
* **🛒 Cart**: Maps users to their selected products, quantity, and tracks the aggregated carbon footprint of the cart.
* **🔐 OTP**: Temporary storage for one-time passwords used in secure account verification and password reset workflows.

---

## 🚀 Installation & Setup

Follow these steps to get EcoBazaarX running on your local machine.

### Prerequisites
* **Node.js** (v14+ recommended)
* **Java JDK** (v11 or v17 recommended)
* **Maven**
* **MySQL Server**

### 1️⃣ Database Setup
1. Open your MySQL client and create a new database.
   ```sql
   CREATE DATABASE ecobazaarx;
   ```
2. Ensure you update the database credentials (username and password) in the backend's `application.properties` file:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecobazaarx
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 2️⃣ Backend Setup (Spring Boot)
1. Navigate to the backend directory (e.g., `eco-shop-backend`):
   ```bash
   cd eco-shop-backend
   ```
2. Build the project using Maven:
   ```bash
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend should now be running on port `8080` (or your defined port).*

### 3️⃣ Frontend Setup (React.js)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd eco-shop-frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   *The frontend should now be running on `http://localhost:3000`.*

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is for educational purposes as part of the Infosys Springboard program.

---
*Built with ❤️ for a Greener Planet.*
