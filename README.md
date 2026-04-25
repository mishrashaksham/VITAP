# 🏛️ VIT-AP University Website

A premium, multi-page website for **VIT-AP University** built with vanilla HTML/CSS/JavaScript and a Node.js/Express backend.

![VIT-AP University](public/images/campus_hero.png)

## 🌟 Features

### Frontend
- **6 Responsive Pages** — Home, About, Academics, Admissions, Campus Life, Contact
- **Modern Design** — VIT-AP maroon & gold branding, glassmorphism navbar, smooth animations
- **Interactive Elements** — Animated counters, tabbed programs, scroll-triggered animations, hover effects
- **Working Forms** — Contact form, admissions inquiry, newsletter subscription with toast notifications
- **Google Maps** — Embedded campus location map
- **Mobile-First** — Fully responsive across all devices

### Backend (Node.js + Express)
- **5 RESTful API Endpoints**:
  | Endpoint | Method | Purpose |
  |---|---|---|
  | `/api/contact` | POST | Contact form submissions |
  | `/api/admissions/inquiry` | POST | Admissions inquiry |
  | `/api/newsletter` | POST | Newsletter subscription |
  | `/api/events` | GET | Upcoming events |
  | `/api/stats` | GET | University statistics |
- **JSON File Database** — Lightweight storage in `data/db.json`
- **Input Validation** — Server-side email and field validation

## 📁 Project Structure

```
VITAP/
├── server.js                # Express backend server
├── package.json             # Dependencies
├── data/db.json             # JSON database
├── public/
│   ├── index.html           # Home page
│   ├── about.html           # About VIT-AP
│   ├── academics.html       # Programs & Schools (tabbed UI)
│   ├── admissions.html      # Admissions process & inquiry form
│   ├── campus.html          # Campus life & gallery
│   ├── contact.html         # Contact form & Google Maps
│   ├── css/styles.css       # Complete design system
│   ├── js/
│   │   ├── main.js          # Shared logic (nav, animations, counters)
│   │   ├── contact.js       # Contact form handler
│   │   └── admissions.js    # Admissions form handler
│   └── images/              # Campus images
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/mishrashaksham/VITAP.git
cd VITAP

# Install dependencies
npm install

# Start the server
npm start
```

Open **http://localhost:3000** in your browser.

## 🎨 Design

- **Primary Color:** `#650010` (VIT-AP Maroon)
- **Accent Color:** `#D4A849` (Gold)
- **Typography:** Inter (body) + Playfair Display (headings)
- **Animations:** Scroll-triggered fade-ups, animated counters, card hover effects
- **Navigation:** Glassmorphism navbar with backdrop blur

## 🌐 Live Demo

🔗 **[View Live Site](https://mishrashaksham.github.io/VITAP/)**

> Note: The GitHub Pages deployment serves the static frontend. For full backend functionality (form submissions, events API), run the project locally.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | JSON File Storage |
| Fonts | Google Fonts (Inter, Playfair Display) |
| Maps | Google Maps Embed API |

## 📄 License

This project is for educational purposes. VIT-AP University branding is used for demonstration only.

---

*Built with ❤️ for VIT-AP University*
