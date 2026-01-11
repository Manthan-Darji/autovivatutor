# 🎓 AutoVivaTutor (AI University Tutor)

**Revolutionizing academic support with personalized, accessible, and intelligent AI tutoring.**

AutoVivaTutor is a modern, AI-powered educational platform designed to bridge the gap in university academic support. By leveraging advanced AI, real-time feedback, and personalized curriculum generation, it ensures every student has access to quality mentorship 24/7.

---

## 🚩 Problem Statement

University students face critical barriers in accessing personalized academic support due to limited tutor availability, high costs, and one-size-fits-all teaching approaches.

* **Capacity Gaps:** Traditional human tutors can only manage 20-30 students weekly, creating 40% capacity gaps during peak academic seasons.
* **High Costs:** Private tutoring costs $40-100 per hour, making quality support inaccessible for most students.
* **Student Struggles:** Research shows 36.1% of students cannot study adequately due to work commitments, and 45.8% struggle with focus and concentration.
* **Delayed Feedback:** Students wait 3-7 days for assignment feedback, significantly reducing learning retention and preventing timely course corrections.

These compounding barriers result in decreased motivation, higher dropout rates, and widening achievement gaps between students who can afford personalized help and those who cannot.

## 💡 Solution

**AI University Tutor** is an intelligent tutoring platform that leverages artificial intelligence and natural language processing to democratize education. It provides:

* **Instant Access:** 24/7 availability for queries, doubts, and learning support.
* **Personalization:** Tailored course generation based on user goals (e.g., "Python for Data Science").
* **Affordability:** Drastically reduces the cost barrier compared to human tutoring.
* **Real-time Feedback:** Instant grading and suggestions to improve learning retention immediately.

---

## ✨ Key Features

### 🤖 AI-Powered Learning
* **Smart Chat Assistant:** A conversational interface for real-time Q&A and doubt solving.
* **Course Generator:** Create custom learning paths on any topic (e.g., Machine Learning, UI/UX) with a single click.
* **Web-Augmented Knowledge:** Integrated **Firecrawl** search to fetch the latest academic resources and references.

### 📊 Student Dashboard
* **Progress Tracking:** Visual analytics of your learning activity and skill mastery using **Recharts**.
* **Streak System:** Gamified learning with daily streaks to keep you motivated.
* **Skill Mastery Charts:** Radar charts to visualize strengths and areas for improvement.

### 🍎 Teacher & Admin Tools
* **Role-Based Access:** Dedicated dashboards for Teachers to oversee content and Student progress.
* **Curriculum Management:** Tools for educators to create and manage structured courses.

### 🛡️ Secure & Modern Architecture
* **Authentication:** Secure Login/Signup via **Supabase Auth**.
* **Protected Routes:** Role-based route protection to ensure data privacy.
* **Responsive Design:** Fully mobile-responsive UI built with **Tailwind CSS** and **Shadcn UI**.

---

## 🛠️ Tech Stack

**Frontend:**
* **Core:** React, TypeScript, Vite
* **Styling:** Tailwind CSS, Shadcn UI, Lucide React (Icons)
* **State & Query:** TanStack Query, React Router DOM
* **Visualizations:** Recharts, Mermaid.js
* **Animations:** Framer Motion

**Backend & Services:**
* **BaaS:** Supabase (Database, Auth, Edge Functions)
* **AI & Search:** OpenAI (via Edge Functions), Firecrawl (Web Scraping/Search)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js (v18 or higher)
* npm or bun
* Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/manthan-darji/autovivatutor.git](https://github.com/manthan-darji/autovivatutor.git)
    cd autovivatutor
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the App**
    Visit `http://localhost:8080` to view the application.

---

## 📂 Project Structure

src/ ├── components/ # Reusable UI components (Shadcn, Custom) ├── contexts/ # React Contexts (AuthContext) ├── hooks/ # Custom hooks (useChat, useAuth) ├── integrations/ # Third-party integrations (Supabase) ├── lib/ # Utilities and API wrappers (Firecrawl) ├── pages/ # Main Application Pages (Chat, CreateCourse, Index) ├── services/ # Business logic services └── supabase/ # Edge functions and database migrations


---

## 📄 License

Distributed under the MIT License.
