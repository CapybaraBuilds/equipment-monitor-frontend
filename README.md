# Equipment Monitor Dashboard

Real-time industrial equipment monitoring dashboard built with React, TypeScript, and Recharts.

## Tech Stack

React · TypeScript · Vite · Tailwind CSS · Recharts · Axios

## Features

- Live sensor data visualization (updates every 2 seconds)
- Color-coded equipment status indicators
- Active alert panel with WARNING/CRITICAL severity levels
- Upcoming maintenance schedule (next 7 days)
- Risk assessment based on alert patterns

## Architecture Decisions

- **Custom Hook ('useFetch<T>')**: Generic data fetching with polling support, reused accross all components
- **Context API**: Global equipment state shared without props drilling
- **React.memo**: Prevent unnecessary re-renders of equipment cards

## Run Locally

npm install
npm run dev

Backend must be running on port 3001. See equipment-monitor repo.
