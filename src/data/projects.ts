export interface Project {
    name: string;
    description: string;
    githubUrl: string;
    language?: string;
    tags?: string[];
}

export const featuredProjects: Project[] = [
    {
        name: "portfolio",
        description: "i wonder what this could be.....",
        githubUrl: "https://github.com/kidskoding/portfolio",
        language: "Astro",
    },
    {
        name: "dotfiles",
        description: "my very minimalistic set of dotfiles",
        githubUrl: "https://github.com/kidskoding/dotfiles",
        language: "Shell",
    },
    {
        name: "spotify-cli",
        description: "UIUC CS 128 Honors FA 2024 Final Project - A Command Line Interface (CLI) tool for Spotify built using Rust",
        githubUrl: "https://github.com/kidskoding/spotify-cli",
        language: "Rust",
    },
    {
        name: "personal-finance-agent",
        description: "a personal finance ai agent built with ruby on rails and plaid",
        githubUrl: "https://github.com/OpenAgents-Illinois/personal-finance-agent",
        language: "Ruby",
    },
    {
        name: "music-ai-agent",
        description: "a headless agentic AI music agent built using Go that selects your next Spotify track using Databricks analytics and Google Cloud infrastructure, adapting to your mood, context, and preferences in real-time",
        githubUrl: "https://github.com/kidskoding/music-ai-agent",
        language: "Go",
    },
    {
        name: "word-quest",
        description: "A simple word roguelike game developed with Rust",
        githubUrl: "https://github.com/kidskoding/word-quest",
        language: "Rust",
    },
    {
        name: "blockchain-network",
        description: "A decentralized blockchain network built using Rust",
        githubUrl: "https://github.com/kidskoding/blockchain-network",
        language: "Rust",
    },
    {
        name: "linalgrs",
        description: "A Rust crate with Linear Algebra concept implementations from scratch",
        githubUrl: "https://github.com/kidskoding/linalgrs",
        language: "Rust",
    },
    {
        name: "nes-emulator",
        description: "A NES (Nintendo Entertainment System) emulator built using Rust",
        githubUrl: "https://github.com/kidskoding/nes-emulator",
        language: "Rust",
    },
    {
        name: "rust-sandbox",
        description: "An interactive online code playground and compiler for Rust, allowing developers to write, test, and run Rust code directly in the browser on kidskoding.com!",
        githubUrl: "https://github.com/kidskoding-com/rust-sandbox",
        language: "JavaScript",
    },
    {
        name: "real-estate-analytics",
        description: "A Full Stack webpage built using Next, Express, Postgres, and Node that graphically displays valuable real estate data and information within the Texas area",
        githubUrl: "https://github.com/kidskoding/real-estate-analytics",
        language: "TypeScript",
    },
    {
        name: "neural-network",
        description: "I decided to create a neural network in C++ to show and explain ML, DL, and RL training",
        githubUrl: "https://github.com/kidskoding/neural-network",
        language: "C++",
    },
];

export const hackathons: Project[] = [
    {
        name: "woogent",
        description: "hackIllinois 2026: an API that lets AI agents shop on online stores, built and catered towards small businesses",
        githubUrl: "https://github.com/kidskoding/woogent-hackillinois-2026",
        language: "Python",
    },
    {
        name: "hackillinois-2025",
        description: "hackIllinois 2025 project",
        githubUrl: "https://github.com/kidskoding/hackillinois-2025",
        language: "Python",
    },
];

export const dsaProjects: Project[] = [
    {
        name: "leetcode",
        description: "leetcode sols",
        githubUrl: "https://github.com/kidskoding/leetcode",
        language: "Python",
    },
    {
        name: "leetcode-de",
        description: "leetcode data engineering problems for intern/new grad",
        githubUrl: "https://github.com/kidskoding/leetcode-de",
        language: "Jupyter Notebook",
    },
    {
        name: "aoc-2025",
        description: "Advent of Code 2025 via Python",
        githubUrl: "https://github.com/kidskoding/aoc-2025",
        language: "Python",
    },
    {
        name: "aoc-22",
        description: "aoc 22 in c++",
        githubUrl: "https://github.com/kidskoding/aoc-22",
        language: "C++",
    },
    {
        name: "project-euler",
        description: "project euler problems solved via rust",
        githubUrl: "https://github.com/kidskoding/project-euler",
        language: "Rust",
    },
];

export const otherProjects: Project[] = [
    {
        name: "graph-theory",
        description: "graph theory in C++",
        githubUrl: "https://github.com/kidskoding/graph-theory",
        language: "C++",
    },
    {
        name: "f1-genie-code",
        description: "using databricks genie code to perform data engineering, science, and analytics on Formula 1 data",
        githubUrl: "https://github.com/kidskoding/f1-genie-code",
        language: "Python",
    },
    {
        name: "pokelakehouse",
        description: "a data pipeline that ingests pokemon api data via Azure Databricks using a medallion architecture format (bronze -> silver -> gold)",
        githubUrl: "https://github.com/kidskoding/pokelakehouse",
        language: "Python",
    },
    {
        name: "pokedata",
        description: "data science, engineering, and analytics with pokemon in Python!",
        githubUrl: "https://github.com/kidskoding/pokedata",
        language: "Jupyter Notebook",
    },
    {
        name: "nixos-config",
        description: "my attempt at a nixos config",
        githubUrl: "https://github.com/kidskoding/nixos-config",
        language: "Nix",
    },
    {
        name: "prompt-engineering-sample",
        description: "prompt engineering sample work from Summer '25 internship",
        githubUrl: "https://github.com/kidskoding/prompt-engineering-sample",
        language: "Python",
    },
    {
        name: "digital-stopwatch",
        description: "A simple digital stopwatch built using Vanilla JavaScript, HTML, and CSS",
        githubUrl: "https://github.com/kidskoding/digital-stopwatch",
        language: "JavaScript",
    },
    {
        name: "pale-fire.nvim",
        description: "VSCode's Pale Fire Theme ported to Neovim",
        githubUrl: "https://github.com/kidskoding/pale-fire.nvim",
        language: "Lua",
    },
    {
        name: "sample-data-engineering-proj",
        description: "A sample data engineering project via. python, postgres, and aws",
        githubUrl: "https://github.com/kidskoding/sample-data-engineering-proj",
        language: "Python",
    },
    {
        name: "pizza-order-system",
        description: "A REST server built using Go that handles HTTP requests for pizza orders",
        githubUrl: "https://github.com/kidskoding/pizza-order-system",
        language: "Go",
    },
    {
        name: "poke-predictor",
        description: "a predictive model that estimates which pokemon lineup will win in a battle against another lineup",
        githubUrl: "https://github.com/isr-24-25/poke-predictor",
        language: "Go",
    },
    {
        name: "smart-logistics-app",
        description: "a smart logistics app using Rust that tracks packages in real time via API and optimizes delivery routes using Dijkstra's algorithm",
        githubUrl: "https://github.com/kidskoding/smart-logistics-app",
        language: "Rust",
    },
    {
        name: "pg",
        description: "a headless template application that demonstrates using Rust as a backend and postgres SQL to store users' username, email, and passwords",
        githubUrl: "https://github.com/kidskoding/pg",
        language: "Rust",
    },
    {
        name: "vex-software",
        description: "github repo for the vex robotics r&d fall '24 / spring '25 project",
        githubUrl: "https://github.com/abhay-harpalani/vex-software",
        language: "Python",
    },
    {
        name: "pong",
        description: "A reinforcement learning (RL) implementation of the popular ATARI game pong using C#, Unity, and Unity's ML Agents",
        githubUrl: "https://github.com/kidskoding/pong",
        language: "C#",
    },
    {
        name: "memory-allocator",
        description: "I built a somewhat safe memory allocator with Rust and the libc crate because i love crabs and memory safety",
        githubUrl: "https://github.com/kidskoding/memory-allocator",
        language: "Rust",
    },
    {
        name: "thread-safe-vector",
        description: "A thread safe vector in C++",
        githubUrl: "https://github.com/kidskoding/thread-safe-vector",
        language: "C++",
    },
    {
        name: "breakout",
        description: "A remake of the popular ATARI 2D game breakout using Python and Pygame",
        githubUrl: "https://github.com/kidskoding/breakout",
        language: "Python",
    },
    {
        name: "Tom",
        description: "Tom is a combination of a voice assistant AI and a website that I created to help tutor students in various subjects taught in school! Built using Volt.js, Python Flask, and Docker!",
        githubUrl: "https://github.com/kidskoding/Tom",
        language: "Python",
    },
    {
        name: "chess",
        description: "The classic game of chess made using Python 3 and pygame!",
        githubUrl: "https://github.com/kidskoding/chess",
        language: "Python",
    },
    {
        name: "hangman",
        description: "A simple Rust implementation of famous word game hangman for kidskoding.com",
        githubUrl: "https://github.com/kidskoding/hangman",
        language: "Rust",
    },
    {
        name: "multiserver",
        description: "A multiserver built using Java TCP Networking",
        githubUrl: "https://github.com/kidskoding/multiserver",
        language: "Java",
    },
    {
        name: "predictive-healthcare-system",
        description: "A machine learning model used to predict the likelihood of diabetes based on patient medical records and demographic data",
        githubUrl: "https://github.com/kidskoding/predictive-healthcare-system",
        language: "Python",
    },
    {
        name: "2048",
        description: "A clone of the iconic number-themed 2048 tile sliding puzzle game built using Python and Pygame.",
        githubUrl: "https://github.com/kidskoding/2048",
        language: "Python",
    },
    {
        name: "skin-cancer-detection",
        description: "A simple skin-care-detection software built utilizing advanced Machine Learning techniques in order to accurately detect skin cancer among patients",
        githubUrl: "https://github.com/kidskoding/skin-cancer-detection",
        language: "Python",
    },
    {
        name: "rl-playground",
        description: "reinforcement learning playground",
        githubUrl: "https://github.com/kidskoding/rl-playground",
        language: "Jupyter Notebook",
    },
    {
        name: "admin-dashboard",
        description: "A Full Stack Admin Dashboard created using PostgreSQL, Next.js, Express.js, and Node.js",
        githubUrl: "https://github.com/kidskoding/admin-dashboard",
        language: "TypeScript",
    },
];

export const aiAgents: Project[] = [
    {
        name: "cf_ai_procurement_agent",
        description: "AI-powered procurement agent that autonomously finds suppliers, sends quote requests, and analyzes email responses to recommend the best pricing deals",
        githubUrl: "https://github.com/kidskoding/cf_ai_procurement_agent",
        language: "TypeScript",
    },
    {
        name: "cf_ai_shipment_delay_tracking",
        description: "An AI agent that will determine which shipments will potentially be delayed due to extreme weather conditions, based on the shipment's zipcode",
        githubUrl: "https://github.com/kidskoding/cf_ai_shipment_delay_tracking",
        language: "TypeScript",
    },
    {
        name: "music-ai-agent",
        description: "a headless agentic AI music agent built using Go that selects your next Spotify track using Databricks analytics and Google Cloud infrastructure, adapting to your mood, context, and preferences in real-time",
        githubUrl: "https://github.com/kidskoding/music-ai-agent",
        language: "Go",
    },
    {
        name: "ev-battery-agent",
        description: "an autonomous AI agent built using Java and LangChain4j that proactively monitors battery health in various iconic EVs like Rivian and Tesla",
        githubUrl: "https://github.com/kidskoding/ev-battery-agent",
        language: "Java",
    },
    {
        name: "cfo-liquidity-agent",
        description: "an autonomous AI agent that uses Python and Google Cloud Functions to bridge settlement periods via the Stripe API, leveraging RAG and Databricks Mosaic AI for risk assessment in order to adjust merchant spending limits",
        githubUrl: "https://github.com/kidskoding/cfo-liquidity-agent",
        language: "Python",
    },
    {
        name: "pm-ai-agent",
        description: "An AI agent that handles product management using Rust",
        githubUrl: "https://github.com/kidskoding/pm-ai-agent",
        language: "Rust",
    },
    {
        name: "smart-gRPC",
        description: "using AI agents to intercept gRPC protocols w Rust",
        githubUrl: "https://github.com/kidskoding/smart-gRPC",
        language: "Rust",
    },
    {
        name: "vaultra",
        description: "a portmanteau of \"vault\" and \"orchestra\" - a fintech AI agent that small businesses \"hire\" to proactively improve creditworthiness and funding readiness",
        githubUrl: "https://github.com/OpenAgents-Illinois/vaultra",
        language: "Python",
    },
    {
        name: "personal-finance-agent",
        description: "a personal finance ai agent built with ruby on rails and plaid",
        githubUrl: "https://github.com/OpenAgents-Illinois/personal-finance-agent",
        language: "Ruby",
    },
];
