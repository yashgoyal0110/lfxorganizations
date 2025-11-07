LFX Organizations Dashboard
A comprehensive dashboard to view and explore past records of organizations participating in LFX programs. This tool is designed to help contributors discover organizations, understand their historical participation, and make informed decisions about where to contribute.
📋 Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js: Version 22.x (required)
Docker: Latest stable version
Docker Compose: Latest stable version

🚀 Getting Started
Follow these steps carefully to set up the project locally:
Step 1: Clone the Repository
bashgit clone <repository-url>
cd lfxorganizations
Step 2: Start the Backend Server (Terminal 1)
Open your first terminal and navigate to the root directory of the project. Run the following commands:
bashdocker compose build --no-cache
docker compose up
Important: Wait until you see the message "Server running successfully" in the terminal before proceeding to the next step. This indicates that the backend is ready to accept connections.
Step 3: Start the UI Development Server (Terminal 2)
Once the backend server is running successfully, open a second terminal and run:
bashcd ui
npm i
npm run dev
The frontend development server will start, and you should see output indicating the local URL where the application is accessible (typically http://localhost:3000 or similar).
Step 4: Access the Dashboard
Open your web browser and navigate to the URL shown in your second terminal. You should now see the LFX Organizations Dashboard running locally.
🏗️ Project Structure
lfxorganizations/
├── docker-compose.yml          # Docker configuration for backend services
├── Dockerfile                  # Docker image configuration
├── data/                       # JSON data files containing organization records
│   └── *.json                 # Organization data files
├── ui/                        # Frontend application
│   ├── package.json           # UI dependencies
│   ├── src/                   # Source code
│   └── ...
├── server/                    # Backend server code (if applicable)
└── README.md                  # This file
🤝 Contributing
We strongly encourage community contributions! Here are the ways you can help improve this project:
📊 Data Contributions
If you notice any inconsistencies, missing information, or outdated records in the organization data:

Navigate to the data/ directory
Locate the relevant JSON file
Edit the data to correct inconsistencies or add missing information
Submit a Pull Request with a clear description of what was changed and why

🎨 UI/UX Improvements
Help make the dashboard more user-friendly and visually appealing:

Suggest design improvements
Fix layout issues or visual bugs
Enhance accessibility features
Improve responsive design for mobile devices
Add new features that would benefit contributors

🐛 Bug Fixes
Found a bug? Please:

Check if an issue already exists for the bug
If not, create a new issue with detailed reproduction steps
Submit a Pull Request with the fix

How to Submit a Pull Request

Fork the repository to your GitHub account
Clone your fork locally:

bash   git clone https://github.com/your-username/lfxorganizations.git

Create a new branch for your changes:

bash   git checkout -b feature/your-feature-name

Make your changes and test them locally using the setup steps above
Commit your changes with clear, descriptive messages:

bash   git commit -m "Fix: Description of what you fixed"

Push to your fork:

bash   git push origin feature/your-feature-name

Open a Pull Request on the main repository with:

A clear title describing the change
Detailed description of what was changed and why
Any re


