# 📊 My Finance Dashboard Project

This is a full-stack finance system I built to help manage money records and user access. I wanted to focus on making it secure, easy to use, and smart about how it handles data.

---

## 💡 How I Thought About This Project 

I didn't just want to write code; I wanted to make sure the app actually made sense for a real company. Here are the simple rules and assumptions I followed while building this:

### 1. Who is who? (User Roles)
I imagined a small company where different people have different jobs. Not everyone should be able to change the money records! 

I created a **Privilege Ladder** to keep things organized:

| Feature / Action | Viewer | Analyst | Admin |
| :--- | :---: | :---: | :---: |
| **View Dashboard** | ✅ | ✅ | ✅ |
| **View Own Summaries** | ✅ | ✅ | ✅ |
| **View Company Summaries** | ❌ | ✅ | ✅ |
| **View User Summaries** | ❌ | ✅ | ✅ |
| **View User Records** | ❌ | ✅ | ✅ |
| **View Detailed User List** | ❌ | ❌ | ✅ |
| **Create Transactions** | ❌ | ❌ | ✅ |
| **Update/Edit Records** | ❌ | ❌ | ✅ |
| **Delete Records** | ❌ | ❌ | ✅ |
| **Toggle User Status** | ❌ | ❌ | ✅ |
| **Manage User Roles** | ❌ | ❌ | ✅ |

* **Viewer:** This is like a "Guest." They can see the their own records, but they can't touch anything or see private details about other employees.
* **Analyst:** This is for someone who needs to study the data. They can look at all the records and summaries to find patterns, but they aren't allowed to add or delete anything.
* **Admin:** The boss. They have the "master keys" to add transactions, change user roles, and even deactivate accounts if someone leaves the company.

### 2. User & Identity Management
* **Unique Emails:** I made sure the database won't let two people sign up with the same email. It keeps the login system clean and prevents confusion.
* **Stay Logged In (JWT):** When you log in, the server gives you a "digital pass" (a token). You carry this pass with you for every move you make so the server knows it's you without asking for a password every five seconds.
* **Locked Roles:** An Admin can change your role, but a regular user can't "promote" themselves. I check the user's role on the server for every single action to make sure no one is cheating the system.

### 3. Making the Money Math Work
* **Atomic Transactions:** Every entry MUST have an amount, a type (Income or Expense), and a category. If anything is missing, the system catches it before it ever reaches the database.
* **Perfect Numbers:** Even though users type "100" as text in a box, I make sure the server turns it into a real number before doing any math. This prevents weird errors when adding up totals.
* **Live Totals:** Every time you add a transaction, the dashboard recalculates everything instantly. You aren't looking at old data; you're seeing the "live" total right now.

### 4. Security & Reliability
* **Checking Twice:** I don't trust the user input! I check the data twice—once in the browser (so you get a nice error message immediately) and once on the server (just in case someone tries to bypass the UI).
* **Hidden Tech Errors:** If something breaks, I made sure the app says something helpful like "Invalid Login" instead of showing a scary wall of code or database errors. This keeps the app safer from hackers and looks better for the user.
* **Hono RPC Magic:** I used a tool called Hono RPC which connects my frontend and backend perfectly. It means my app "knows" what kind of data it's getting, so I don't have to guess and hope it doesn't crash.

---

## 🛠️ How to Run This Locally

### Backend
1. `cd backend`
2. `npm install`
3. Set up your `.env` file with the below variables.
4. `npx prisma migrate dev`
5. `npm run dev`


#### ENV Variables: 
| Variables | Value | 
| :--- | :--- |
| VITE_BACKEND_URL | http://localhost:3000 |
| VITE_API_URL | http://localhost:3000/api |

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

#### ENV Variables: 
| Variables | Value | 
| :--- | :--- |
| DATABASE_URL | postgres://**************xaW@db.prisma.io:5432/postgres?sslmode=require |
| JWT_SECRET | my_jwt_secret_key |

