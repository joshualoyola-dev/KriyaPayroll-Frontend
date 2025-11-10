# Kriya Payroll System Frontend  

<p align="center">
  <img src="./public/kriya-logo.png" alt="Company Logo" height="80"/>
  &nbsp;&nbsp;&nbsp;
  <img src="./public/fs-logo.jpeg" alt="System Logo" height="80"/>
</p>  

## Overview  
The **Kriya Payroll System Frontend** powers the payroll management platform.  
It provides core services such as:  
- Creating and managing companies  
- User management and company-user linking  
- Payroll calculations and management  

## Key Features  
1. **Employee Management** – Add, update, and manage employees within a company.  
2. **Attendance Tracking** – Record and maintain employees’ attendance data.  
3. **Payrun Generation** – Generate different types of payruns:  
   - Regular  
   - Last  
   - Special  
4. **Payrun Management & Collaboration** – Manage payruns and collaborate with other users.  
5. **Data Exports** – Export payroll data for fund transfers.  

## Tech Stack  
- Backend: Node.js, Typescript
- Frontend: React JS, Tailwind Css, Javascript
- Database: MySql,  


## Getting Started  
1. Clone the repository:  
   ```bash
   git clone https://github.com/jzaragosa06/kriya-payroll-frontend.git

2. Install dependencies
    ```bash
    npm install
3. Configure .env variable
4. Run migration
5. Start server
    ```bash 
    npm run start    # for production
    npm run dev      # for development

## Docker
1. Pull the image from the docker repository: 
```
   docker pull spacemanatee/ats-payroll:latest
```
2. Run the container
```
   docker run -d -p 5173:80 spacemanatee/ats-payroll:latest
```
