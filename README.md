# AgriSense Insights

Build a polished college-workshop MVP web application called "AgriSense AI — Smart Farming Decision Support Platform".

Problem statement:
Build a decision-support platform combining soil, weather and crop data to recommend crop choices, irrigation schedules and farming actions, with explainable recommendations and historical field analytics.

Goal:
Create a convincing demo-ready web app for an S.A. Engineering College GenAI workshop. It should feel like a real agricultural AI dashboard, not a generic template.

Core features:
1. Dashboard overview with farm status, soil moisture, temperature, humidity, rainfall forecast, current crop, irrigation status, and a clear AI recommendation summary.
2. Soil Data page/section with inputs for soil moisture, pH, nitrogen, phosphorus, potassium, temperature and soil type. Include a "Generate Recommendation" action.
3. Weather section with current weather and a 7-day forecast using realistic mock/demo data. Clearly label demo data where appropriate; do not pretend live API data exists.
4. Crop Recommendation: recommend suitable crops based on the entered soil/weather values. Show top 3 crops with suitability scores and short reasons.
5. Irrigation Schedule: show recommended watering date/time, duration, priority and reason, using soil moisture and weather conditions.
6. AI Explainability: for every recommendation, provide a simple "Why this recommendation?" explanation showing the important factors used.
7. Historical Analytics: charts for soil moisture, rainfall, irrigation and crop performance/yield trends using realistic sample historical data.
8. Farming Actions: actionable cards such as irrigation, fertilizer check, pest monitoring and weather precautions.
9. Add a simple AI assistant/chat panel with predefined/demo responses about crop choice, irrigation and soil health. Make it clear that this is a demo assistant if no external AI API is connected.
10. Responsive navigation with Dashboard, Soil & Weather, Crop Recommendation, Irrigation, Analytics and AI Assistant.
11. Include a small "Data source / Demo mode" indicator so workshop judges understand the current prototype uses simulated data unless an API is connected.

Design:
- Modern agricultural technology aesthetic.
- Clean professional dashboard suitable for a college project presentation.
- Use natural green/earth tones with accessible contrast, subtle gradients, cards, icons and charts.
- Avoid excessive animations.
- Mobile responsive.
- Strong visual hierarchy and polished empty/loading/error states.
- Include a hero/header area saying "Smarter Decisions. Healthier Crops." and a concise explanation of the platform.
- Add a prominent "Analyze Farm" CTA.
- Use shadcn/ui components and clean TypeScript architecture.

Functional behavior:
- Soil inputs should update recommendation results locally using a transparent rule-based demo scoring model.
- Explain the score using factors such as soil pH, NPK, moisture, temperature and rainfall.
- Irrigation recommendation should respond to moisture and forecast conditions.
- Analytics should use realistic seeded mock data.
- No need to require authentication for the first MVP.
- Keep all demo data clearly separated so a real weather/soil/AI API can be connected later.
- Include a "Future integrations" note mentioning weather API, soil sensor/IoT data, ML crop model and LLM explanation layer.

Also include a small About/Methodology section explaining the pipeline:
Soil + Weather + Crop Data → Data Processing → Recommendation Engine → Explainable Recommendation → Farmer Action → Historical Analytics.

Make the app presentation-ready and ensure all main navigation routes/sections actually work.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://farm-logic-core.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4c062c34-45c0-4017-87ff-f85da1f2a496).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
