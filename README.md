# 🚀 Campus Hiring Automation System (AI-Powered)

An AI-powered campus hiring platform that connects students and companies through intelligent job and candidate recommendations using the Gemini API.

---

## 📌 Overview

This system enables:

* **Students** to showcase their skills and get personalized job recommendations
* **Companies** to post job openings and receive ranked candidate suggestions

Unlike traditional portals, this platform uses **AI-driven matching** instead of basic keyword filtering, making hiring smarter and more efficient.

---

## 🎯 Key Features

### 👨‍🎓 Student Module

* Register/Login
* Create profile with skills & proficiency levels
* Upload resume (stored only, not parsed)
* View recommended jobs (AI-powered)
* Apply for jobs
* Track application status

---

### 🏢 Company Module

* Register/Login
* Create job postings with required skills
* View applicants for each job
* Get **AI-ranked candidate recommendations**
* Shortlist / Reject / Hire candidates

---

### 🤖 AI Recommendation System

Powered by Gemini API:

* Compares **student skills vs job requirements**
* Generates:

  * Match Percentage
  * Missing Skills
  * Strengths
  * Recommendation Label (High / Medium / Low Fit)
  * Explanation ("Why recommended")

---

## 🧠 How It Works

### 🔹 Step 1: Data Input

* Students enter skills manually (no resume parsing)
* Companies define job requirements

### 🔹 Step 2: Intelligent Matching

* Basic filtering selects top candidates/jobs
* Gemini API performs deep comparison

### 🔹 Step 3: AI Output

* Returns structured JSON:

```json
{
  "match_percentage": 85,
  "missing_skills": ["Docker"],
  "strengths": ["Strong in React and Node"],
  "recommendation": "High Fit",
  "explanation": "Candidate matches most required skills..."
}
```

---

## ⚙️ Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### AI Integration

* Gemini API (gemini-1.5-flash)

---

## 🏗️ Project Structure

```
backend/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── services/
  │     └── geminiService.js
  ├── config/
  └── server.js

frontend/
  ├── components/
  ├── pages/
  ├── context/
  └── App.jsx
```

---

## 🔌 API Endpoints

### 🔐 Authentication

* POST `/auth/student/register`
* POST `/auth/company/register`
* POST `/auth/login`

---

### 🎓 Student

* GET `/student/profile`
* PUT `/student/profile`
* GET `/student/recommended-jobs`
* POST `/student/apply/:jobId`

---

### 🏢 Company

* POST `/company/job`
* GET `/company/jobs`
* GET `/company/job/:jobId/applicants`
* GET `/company/job/:jobId/recommended-candidates`
* PATCH `/company/application/:id/status`

---

## 🧮 Recommendation Logic

### Step 1: Pre-filtering

* Select top 5–10 candidates/jobs using basic skill intersection

### Step 2: Gemini Evaluation

* Send structured input to Gemini API
* Receive match score + explanation

### Step 3: Caching

* Store results in database to:

  * Reduce API usage
  * Improve performance

---

## 🗄️ Database Schema

### Student

```json
{
  "name": "String",
  "email": "String",
  "skills": [
    {
      "name": "React",
      "level": "Intermediate"
    }
  ],
  "resumeUrl": "String"
}
```

---

### Job

```json
{
  "title": "Frontend Developer",
  "requiredSkills": [
    {
      "name": "React",
      "level": "Intermediate"
    }
  ]
}
```

---

### Application

```json
{
  "studentId": "ObjectId",
  "jobId": "ObjectId",
  "matchScore": 85,
  "recommendation": "High Fit",
  "explanation": "Strong alignment with required skills",
  "missingSkills": ["Docker"],
  "strengths": ["React expertise"]
}
```

---

### JobRecommendationCache (Optional)

```json
{
  "studentId": "ObjectId",
  "jobId": "ObjectId",
  "matchScore": 78,
  "recommendation": "Medium Fit",
  "explanation": "...",
  "createdAt": "Date"
}
```

---

## 💰 Cost Optimization Strategy

To stay within free API limits:

* Use Gemini only for **top 5–10 results**
* Cache responses in DB
* Avoid repeated API calls

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd project-folder
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key
```

---

### 4️⃣ Run Backend

```bash
npm run dev
```

---

### 5️⃣ Run Frontend

```bash
npm run dev
```

---

## 🔐 Security Considerations

* JWT-based authentication
* Role-based access control
* Input validation & sanitization

---

## 🔮 Future Enhancements

* Resume parsing using AI
* Interview question generation
* Skill gap learning recommendations
* Bias detection in hiring
* Real-time analytics dashboard

---

## 🧑‍💻 Author

**Prathmesh Chawhan**

---

## 📄 License

This project is for educational and research purposes.
