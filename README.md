# ChipWise

Intel and AMD processor + laptop recommendation dashboard. Built to centralize real processor data and help people (students, devs, gamers, AI folks, Linux users) actually pick the right laptop instead of guessing.

## What it does

- Browse and filter 137 Intel + AMD mobile processors, with real specs (cores, threads, TDP, NPU, iGPU)
- Browse laptops linked to their actual processor data
- Compare 2 to 4 processors side by side with radar charts
- A recommendation wizard that asks about your budget, gaming, programming, AI/ML, battery, portability etc, and gives you ranked laptop suggestions with reasons, no AI needed for this part
- An AI advisor you can chat with in plain English, it only answers using real data from the database, not made up specs
- An analytics page with charts (brand split, family breakdown, NPU stats, TOPS trend by year)

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind
- shadcn/ui for components
- MongoDB Atlas + Mongoose
- Zustand for state (filters, wizard)
- TanStack Table for the data tables
- Recharts for charts
- Groq (llama-3.3-70b) for the AI advisor, free and fast

## Project structure

```
chipwise/
├── scripts/
│   ├── seed.mjs            # loads processors csv into mongodb
│   └── seedLaptops.mjs     # loads laptops csv into mongodb
├── src/
│   ├── app/
│   │   ├── api/            # processors, laptops, advisor routes
│   │   ├── processors/     # explorer + detail page
│   │   ├── laptops/        # explorer + detail page
│   │   ├── compare/        # side by side comparison
│   │   ├── wizard/         # recommendation form + results
│   │   ├── advisor/        # ai chat
│   │   └── analytics/      # charts
│   ├── components/
│   │   └── ui/             # shadcn components
│   ├── data/                # seed csvs
│   └── lib/
│       ├── db/              # mongodb connection
│       ├── models/          # processor + laptop schemas
│       ├── store/           # zustand stores (filters, wizard)
│       └── utils/           # scoring, parsing helpers
```

## Getting started

1. Clone the repo and install stuff
```bash
npm install
```

2. Add a `.env.local` file in the root with:
```
MONGO_URI=your_mongodb_atlas_connection_string
GROQ_API_KEY=your_groq_api_key
```

3. Seed the database (only need to do this once, safe to rerun anytime)
```bash
npm run seed
npm run seed:laptops
```

4. Run it
```bash
npm run dev
```
Then go to `localhost:3000`

## Notes on the data

- Processor prices are researched typical laptop price bands in India for that chip tier, not official per chip pricing since Intel/AMD don't sell chips directly to consumers
- GPU compatibility column is a rough recommendation based on the chip's power class, not an official spec
- Some newer families (Arrow Lake, Panther Lake, Core Ultra Series 3, Ryzen AI 400, Ryzen AI Max+) still have placeholder core/thread data since research on them wasn't complete yet
- Scoring (gaming, programming, creator, battery, linux, future proof) is a rule based formula built from real specs, not hardcoded per chip

## Roadmap

Full build log and what's left to do lives in `ChipWise_Project_State.md`. Short version: all 7 phases (setup, data layer, explorer + comparison, laptop explorer, recommendation wizard, ai advisor, analytics) are done. Deploy is the last step.

## License

Open source, do whatever you want with it.
