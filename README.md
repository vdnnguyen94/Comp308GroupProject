# COMP308 Project – Microservices with Microfrontend and GraphQL Gateway

This project demonstrates a full-stack application using microservices architecture with a GraphQL gateway and client-side microfrontends.
Please Read carefully.
---

## 📁 Project Setup

1. Create a folder for the project:

    \`\`\`
    mkdir COMP308Project
    cd COMP308Project
    \`\`\`

2. Clone the repository:

    \`\`\`
    git clone https://github.com/vdnnguyen94/MicroServicesGraphQL.git .
    \`\`\`

---

## 🚀 Server Architecture

The \`server/\` folder contains **4 microservices** and **1 GraphQL gateway**.

To start the server:


- cd server
- npm install
- npm run start:all

> This will start all microservices and the GraphQL gateway concurrently.

### Microservices and Ports

- \`student-microservices\`: runs on **port 3001**  
    - Includes authentication and token management  
- \`vitalsign-microservices\`: runs on **port 3002**
- \`product-microservices\`: runs on **port 3003** *(can be modified for additional microservices)*
- \`auth-microservices\`: runs on **port 3004** *(can be modified for additional microservices)*

### Gateway

- \`GraphQL gateway\`: runs on **port 4000**

> All services are connected to a MongoDB instance. You can create a new collection or database as needed.

---

## 🖥️ Client Microfrontend Setup

Inside the \`client/\` folder, you’ll find:

- \`shell-app\`: container app running the microfrontends (port **3015**)
- \`student-app\`: microfrontend for students (port **3010**)
- \`vital-app\`: microfrontend for vital signs (port **3011**)

### To start each app:

**Student App**

- cd student-app
- npm install
- npm run deploy


**Vital App**

- cd vital-app
- npm install
- npm run deploy


**Shell App**

- cd shell-app
- npm install
- npm run deploy


---

## ✅ Summary

- Server: 4 Microservices + 1 GraphQL Gateway (Ports: 3001–3004, 4000)
- Client: Microfrontends + Shell (Ports: 3010, 3011, 3015)
`;
