# ⚽ FOOTBALL MANIA ⚽

A full-stack web application built with React and Node.js that provides live and completed match scores, detailed statistics, league standings, and interactive pitch formations, designed to mirror the experience of professional sports data apps.

**Live Demo Link:**(https://footballmania77.netlify.app)

---

### Features

* **Live & Historical Matches:** View scores for live games or use the date navigator to browse completed matches from previous days.
* **Search Functionality:** Easily filter the matches list by team name to quickly find a specific game.
* **Comparative Match Statistics:** See a side-by-side comparison of team stats like possession, shots, and goals.
* **Interactive Virtual Pitch:** View starting lineups on a dynamic football pitch, with each player correctly positioned by their role (Goalkeeper, Defender, etc.). Player markers are clickable, leading to detailed stats.
* **Detailed Player Pages:** Click on any player from the pitch to see their individual in-game statistics, including attacking, defending, duels, and passing metrics.
* **Substitutions & Bench:** View a complete list of players on the bench and all substitution events that occurred during the match.
* **League Standings:** Navigate to a dedicated "Leagues" section to view the current tables for major football leagues around the world.

---

### Technology Stack

This project is built with a modern, full-stack architecture:

* **Frontend:**
    * **React.js:** For building a dynamic and responsive user interface.
    * **React Router:** For multi-page navigation.
    * **Axios:** For making API requests to the backend.
    * **CSS:** For custom styling, layout, and animations.
* **Backend:**
    * **Node.js:** As the JavaScript runtime environment.
    * **Express.js:** As the web server framework to create our own API.
* **API:**
    * Data is sourced from the [API-Football](https://www.api-football.com/).
* **Deployment:**
    * Backend deployed on **Render**.
    * Frontend deployed on **Netlify**.

---

### How to Run This Project Locally

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/](https://github.com/)[YOUR_GITHUB_USERNAME]/football-mania.git
    ```
2.  **Navigate to the Backend and Install Dependencies:**
    ```sh
    cd football-mania/backend
    npm install
    ```
3.  **Create a `.env` file** in the `backend` folder and add your API key:
    ```
    API_KEY=your_api_key_here
    ```
4.  **Start the Backend Server:**
    ```sh
    node server.js
    ```
5.  **Open a new terminal**, navigate to the Frontend and Install Dependencies:
    ```sh
    cd ../frontend
    npm install
    ```
6.  **Start the Frontend App:**
    ```sh
    npm start
    ```

The application will open automatically at `http://localhost:3000`.
