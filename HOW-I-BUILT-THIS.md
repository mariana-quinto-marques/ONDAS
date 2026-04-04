# How I Built ONDAS

**ONDAS** is a real-time water sports conditions app for Portugal, showing live wave, wind, and weather data for 25 surf, kitesurf, windsurf, and paddle spots across the country.

## The Idea

As someone who loves the Portuguese coast, I wanted a single place to check conditions across all the best water sports spots — from Moledo in the north to the Algarve, plus the Azores and Madeira. No more checking 5 different websites.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Typography | DM Serif Display + Inter (Google Fonts) |
| Maps | React-Leaflet + CartoDB Voyager tiles |
| Data Fetching | TanStack Query v5 |
| State | Zustand (localStorage persistence) |
| APIs | Open-Meteo Marine & Weather (free, no keys) |
| PWA | vite-plugin-pwa |
| Hosting | Vercel |

## Key Features

- **Real-time conditions** — wave height, swell, wind speed/direction, temperature, UV, and weather for every spot, updated every 15 minutes
- **Smart scoring** — each sport (surf, kitesurf, windsurf, paddle) has its own condition thresholds that color-code spots as Good, Fair, or Poor
- **Sorted by quality** — spots are automatically ranked from best to worst conditions
- **Interactive map** — Portugal's coast with color-coded markers on CartoDB Voyager tiles
- **Spot details** — full dashboard with wind compass, wave indicator, 24h forecast timeline, and approximate tide chart
- **Community reports** — users can rate conditions, report crowd levels, and leave notes (stored locally)
- **25 curated spots** across 7 regions, each with fun facts about the location
- **Mobile-first** — map-first layout with floating card carousel, fully responsive for desktop

## Design

The visual identity is inspired by vintage Portuguese travel posters — warm cream backgrounds, elegant serif typography (DM Serif Display), deep ocean teal accents, and white glassmorphism cards. The goal was to feel like a premium travel editorial, not a typical weather app.

## Data Architecture

The app makes just **2 API calls** to load conditions for all 25 spots simultaneously, by batching coordinates in a single Open-Meteo request. Individual spot pages fetch 3-day hourly forecasts. All responses are cached for 15 minutes via TanStack Query.

Tide data uses an approximate semi-diurnal model calibrated for Portugal's coast (~12h 25m cycle), since free tide APIs don't exist.

## What I Learned

- How to work with real-time weather/marine APIs and batch coordinate requests
- Building a scoring algorithm that translates raw meteorological data into human-friendly condition ratings
- Leaflet map customization — static maps, custom tile layers, and interactive markers
- Mobile-first design patterns — floating overlays, horizontal card carousels, glassmorphism on light backgrounds
- PWA configuration with offline caching strategies for API data and map tiles

## Links

- **Live App**: [ondas on Vercel]
- **Source Code**: [github.com/mariana-quinto-marques/ONDAS](https://github.com/mariana-quinto-marques/ONDAS)
