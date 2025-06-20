# QR Bites 🍽️

QR Bites is a responsive digital ordering system for cafes and restaurants. Customers can scan a QR code to instantly access the web application, explore the menu, and place orders directly from their table.

## ✨ Features

- 📱 QR code-based customer access — no login required  
- 📂 Category-wise menu (e.g., multiple items under "Pizzas")
- 🧾 Auto-generated, downloadable bill after order
- 🛒 Place orders directly from the table  
- 🧑‍💼 Admin panel to:
  - Add/edit/delete categories and products
  - View live customer orders with table info
  - Manage other admins

## 🛠️ Tech Stack

- **Frontend**: Angular  
- **Backend**: Node.js, Express.js  
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)


## 🚀 Getting Started

1. Clone the repository

      ```bash
    git clone https://github.com/Asmit-04/QR-Bites.git
   
2. Navigate to both `backend/` and `frontend/` folders and run the following commands separately in each:

   ```bash
   npm install
   npm start

3. Connect your MySQL database  
4. Make sure to create separate .env file for both the frontend and backend, and add all required key. 
5. Visit `http://localhost:4200/` to use the app  

## 📦 Deployment

You can deploy the **frontend** on platforms like **Netlify** or **Vercel**.

For the **backend**, you can use platforms such as **Render**, **Railway**, or a **VPS**/**cloud service** (like **AWS**, **DigitalOcean**, or **Heroku**) that supports **Node.js** and allows external **MySQL** database connections.

Make sure your **MySQL database** is hosted on a reliable provider like:

- **PlanetScale**
- **Neon** (with MySQL support)
- **ClearDB (Heroku Add-on)**
- **Self-hosted MySQL** (on your cloud server or managed DB services like AWS RDS)

---

