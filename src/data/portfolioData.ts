import { CaseStudy, WorkExperience, EducationItem, PatentItem, Recommendation } from '../types';

export const DESIGNER_INFO = {
  name: "Alex McDonald",
  title: "Senior Product Designer",
  roleSubtext: "Design Engineer",
  location: "Seattle, WA",
  email: "hi@alexmcdonald.site",
  status: "Open to new opportunities",
  avatarUrl: "/assets/images/alex_portrait_regular_1790739680820.jpg",
  avatarLightUrl: "/assets/images/alex_portrait_blue_1790739680820.jpg",
  bio: "Over a decade shaping products at the intersection of human ergonomics, spatial computing, and high-frequency software. Known for relentless craft, Cupertino-grade micro-interactions, and robust cross-platform design systems.",
  socials: {
    linkedin: "https://linkedin.com/in/alextmcdonald",
    dribbble: "https://dribbble.com/alexmcdonald",
    behance: "https://behance.net/alextmcdonald",
    twitter: "https://x.com/alextmcdonald",
    github: "https://github.com/alextmcdonald",
    strava: "https://strava.com/athletes/almcd",
    readcv: "https://read.cv/alexmcdonald",
    ondesign: "https://on.design/atm"
  },
  stats: [
    { label: "Years designing", value: "15+", detail: "Design systems, consumer & enterprise" },
    { label: "Completed projects", value: "100+", detail: "0-to-1 startups and enterprise products" },
    { label: "Satisfied clients", value: "50+", detail: "Startups, brands, and enterprise teams" },
    { label: "Startups scaled", value: "5", detail: "Early-stage growth and venture milestones" }
  ]
};

export const STATUS_CARD_MEDIA = {
  stravaMap: "/assets/images/strava_map.jpg?v=2",
  albumCover: "/assets/images/album_blessed.jpg?v=2",
  bookCover: "/assets/images/book_lean_ux.jpg?v=2"
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "strata-wealth",
    title: "TennisPal",
    subtitle: "Driving user growth with better onboarding and match scheduling",
    role: "Principal Product Designer",
    timeline: "2023 — 2024",
    category: "Consumer app",
    cardTags: ["Consumer app", "Social media", "Sports"],
    figmaUrl: "https://www.figma.com/proto/7qcpNGMqv1GSP5IdDYKsvp/Alex-McDonald-%7C-Product-Designer-%7C-Seattle--WA?node-id=313-4826&viewport=684%2C153%2C0.14&t=cpR3wvw81c0ZOWzQ-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=313%3A4826&page-id=313%3A4732&hide-ui=1",
    heroImage: "/assets/images/tennispal-thumb.jpg",
    statsSummary: "Tracked $4.2B+ in private wealth, 4.9 App Store rating, and +68% daily active engagement.",
    summary: "Created the mobile and desktop flagship experience for ultra-high-net-worth family offices managing complex asset allocations, venture capital tranches, and cross-currency liquidity.",
    problem: "Traditional wealth management portals were cluttered with table-heavy, unresponsive layouts and delayed transaction data that forced principals to rely on static PDF quarterly reports.",
    solution: "Built a titanium-inspired dark mode interface with progressive disclosure, zero-latency vector charting, and tactile haptic micro-interactions for trade execution and liquidity rebalancing.",
    researchInsights: [
      "Family office principals review net worth during high-stress transition windows (in-transit, private aviation); layout density must adapt seamlessly across iPhone 16 Pro and 16-inch Pro Displays.",
      "Tabular figures (tabular-nums) eliminate number jitter during live ticker fluctuations, improving user trust.",
      "Replacing multi-step confirmation modals with a fluid swipe-to-rebalance gesture reduced accidental order errors to 0.00%."
    ],
    designDecisions: [
      {
        title: "Titanium Material Language",
        description: "Deep neutral slate canvas (#0B0C0E) paired with 1px hairline structural boundaries and measured 8% contrast deltas."
      },
      {
        title: "Real-Time Telemetry Curve",
        description: "Vector canvas rendering smooth cubic Bezier charts with interactive scrub gestures and localized yield delta tooltips."
      },
      {
        title: "Biometric Approval Gesture",
        description: "Custom physics-based spring slider with tactile audio click on cryptographic transaction authorization."
      }
    ],
    metrics: [
      { label: "Assets Tracked", value: "$4.2B+", subtext: "Aggregated in private family office wealth" },
      { label: "App Store Rating", value: "4.9 / 5.0", subtext: "Over 8,400 verified client reviews" },
      { label: "Daily Active Usage", value: "+68%", subtext: "Shift from quarterly desktop logins to daily mobile use" }
    ],
    systemSpecs: [
      { key: "Rendering Target", value: "120Hz ProMotion with sub-16ms frame budgeting" },
      { key: "Typography", value: "SF Pro Text + JetBrains Mono tabular figures" },
      { key: "Color Palette", value: "60% Obsidian / 30% Slate / 10% Apple Blue" },
      { key: "Security Standard", value: "Hardware Secure Enclave biometric validation" }
    ],
    prototypeScreens: [
      { name: "Portfolio Overview", caption: "Consolidated multi-asset allocation balance card", tag: "Dashboard" },
      { name: "Execution Sheet", caption: "Swipe-to-commit rebalance interface with real-time fee breakdown", tag: "Trading" },
      { name: "Historical Breakdown", caption: "Interactive telemetry scrub across 10-year vintage horizons", tag: "Analytics" }
    ],
    tags: ["Consumer app", "Social media", "Sports", "iOS & Web", "Design Systems"]
  },
  {
    id: "canvas-ai",
    title: "Saveplates",
    subtitle: "Designing a social impact app from concept to MVP",
    role: "Staff Product Designer",
    timeline: "2022 — 2023",
    category: "Consumer app",
    cardTags: ["Consumer app", "Marketplace", "Food"],
    figmaUrl: "https://www.figma.com/proto/7qcpNGMqv1GSP5IdDYKsvp/Alex-McDonald-%7C-Product-Designer-%7C-Seattle--WA?node-id=374-7188&viewport=684%2C153%2C0.14&t=cpR3wvw81c0ZOWzQ-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=374%3A7188&page-id=313%3A4732&hide-ui=1",
    heroImage: "/assets/images/saveplates-thumb.jpg",
    statsSummary: "3.4x faster concept iteration, 92% power-user retention in 48 hours.",
    summary: "Led the 0-to-1 product design of an infinite visual workspace for multi-modal AI generation. Designed spatial node connections, progressive parameter disclosure, and non-blocking background task orchestration.",
    problem: "Most AI interfaces trapped creators in conversational chat threads or overwhelming parameter grids with 40+ unlabelled knobs, leading to prompt paralysis and brittle iteration loops.",
    solution: "Introduced a direct-manipulation node canvas where prompt nodes, image transformations, and design tokens connect visually with magnetic spring connectors and live rendering feedback.",
    researchInsights: [
      "Visual designers think in spatial clusters rather than linear chat histories; grouping variants spatially sped up concept selection by 3.4x.",
      "Showing inline generation progress via subtle shimmer pulses instead of blocking modals kept users in a state of creative flow.",
      "Keyboard shortcut ergonomics (Space + Drag to pan, Cmd + Scroll to zoom) achieved 92% retention among power users within 48 hours."
    ],
    designDecisions: [
      {
        title: "Progressive Parameter Disclosure",
        description: "Primary knobs visible at rest; advanced sampling controls expand smoothly when zoomed in past 85% scale."
      },
      {
        title: "Magnetic Node Orthogonals",
        description: "Curved spline connections that calculate collision-free routing around existing canvas elements."
      },
      {
        title: "Non-Destructive Variant Branches",
        description: "Visual time-travel scrub allowing designers to fork prompt trees without losing previous high-res iterations."
      }
    ],
    metrics: [
      { label: "Concept Velocity", value: "3.4x Faster", subtext: "From raw brief to approved design prototype" },
      { label: "Prompt Fatigue", value: "84% Reduction", subtext: "Via visual component swapping vs text re-prompting" },
      { label: "Industry Recognition", value: "IXDA Finalist", subtext: "2025 Interaction Awards Best Tooling" }
    ],
    systemSpecs: [
      { key: "Canvas Viewport", value: "Infinite 2D spatial plane with WebGL hardware acceleration" },
      { key: "Connector Spline", value: "Cubic Hermite splines with automatic obstacle avoidance" },
      { key: "Theme Engine", value: "Adaptive luminance respecting system ambient sensor" },
      { key: "Latency Budget", value: "<12ms pan/zoom latency on 4K multi-monitor setups" }
    ],
    prototypeScreens: [
      { name: "Node Graph Canvas", caption: "Branching multi-model generation pipeline with live preview", tag: "Canvas" },
      { name: "Floating Toolbar", caption: "Contextual glass tool palette following active selection", tag: "Tooling" },
      { name: "Variant Matrix", caption: "High-density comparison lightbox with pixel diffing", tag: "Comparison" }
    ],
    tags: ["Consumer app", "Marketplace", "Food", "AI Workspace", "Direct Manipulation"]
  },
  {
    id: "pogoseat",
    title: "Pogoseat",
    subtitle: "Transforming how fans upgrade seats at live events",
    role: "Senior Product Designer",
    timeline: "2021 — 2022",
    category: "Consumer app",
    cardTags: ["Consumer app", "Marketplace", "Sports"],
    figmaUrl: "https://www.figma.com/proto/7qcpNGMqv1GSP5IdDYKsvp/Alex-McDonald-%7C-Product-Designer-%7C-Seattle--WA?node-id=375-7314&viewport=684%2C153%2C0.14&t=cpR3wvw81c0ZOWzQ-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=375%3A7314&page-id=313%3A4732&show-proto-sidebar=1&hide-ui=1",
    heroImage: "/assets/images/pogoseat-thumb.jpg",
    statsSummary: "52% upgrade conversion rate, adopted by 30+ NBA/MLB stadiums, +$3.8M incremental ticketing GMV.",
    summary: "Designed the end-to-end mobile fan experience and live venue marketplace allowing sports fans to purchase instant in-game seat upgrades and VIP access pass upgrades directly from their smartphone in seconds.",
    problem: "Stadiums were filled with vacant lower-bowl seats during live games while fans in upper tiers lacked a seamless, friction-free way to upgrade mid-game without navigating clunky ticketing websites or missing game action.",
    solution: "Crafted a frictionless 2-tap seat discovery and instant Apple Pay checkout experience with interactive 3D stadium section maps, real-time inventory telemetry, and dynamic pricing curves.",
    researchInsights: [
      "Fans only check for upgrades during commercial breaks and game pauses; the upgrade flow had to complete in under 8 seconds.",
      "Dynamic seat previews showing the exact view from the upgraded seat increased checkout completion by 44%.",
      "Integrating Apple Wallet passes with haptic entry gates reduced venue usher validation time to sub-2 seconds."
    ],
    designDecisions: [
      {
        title: "Interactive Stadium Vector Map",
        description: "Pinch-to-zoom SVG stadium bowl with live color-coded availability heatmaps and tier pricing."
      },
      {
        title: "2-Tap Apple Pay Checkout",
        description: "Zero-form checkout flow optimizing seat claim speed during fast-paced live sporting events."
      },
      {
        title: "Dynamic Usher Validation Pass",
        description: "High-contrast dynamic QR barcode with animated security watermark to prevent fraudulent screenshots."
      }
    ],
    metrics: [
      { label: "Upgrade Conversion", value: "52%", subtext: "Of fans browsing available seats during halftime" },
      { label: "Partner Franchises", value: "30+", subtext: "NBA, MLB, NHL, and NCAA sports stadiums" },
      { label: "Incremental GMV", value: "+$3.8M", subtext: "Generated in secondary seat upgrade revenue" }
    ],
    systemSpecs: [
      { key: "Target Platforms", value: "iOS, Android, and Responsive Mobile Web PWA" },
      { key: "Checkout Latency", value: "<8.2s median end-to-end purchase completion" },
      { key: "Ticketing Engine", value: "Real-time bidirectional Ticketmaster & Paciolan sync" },
      { key: "Security Protocol", value: "Rotating cryptographic token with dynamic watermarking" }
    ],
    prototypeScreens: [
      { name: "Venue Seat Map", caption: "3D perspective bowl with live seat availability pins", tag: "Stadium Map" },
      { name: "Seat View Preview", caption: "Photorealistic field-of-view perspective simulator", tag: "Viewpoint" },
      { name: "Express Upgrade Sheet", caption: "One-thumb seat selection and instant biometric checkout", tag: "Checkout" }
    ],
    tags: ["Consumer app", "Marketplace", "Sports", "Mobile Ticketing", "Apple Pay", "Live Events"]
  },
  {
    id: "stacksocial",
    title: "StackSocial",
    subtitle: "Building the design foundation for a startup to scale",
    role: "Staff Product Designer & Growth Lead",
    timeline: "2019 — 2021",
    category: "E-commerce",
    cardTags: ["E-commerce", "Marketplace", "Software", "Tech"],
    figmaUrl: "https://www.figma.com/proto/7qcpNGMqv1GSP5IdDYKsvp/Alex-McDonald-%7C-Product-Designer-%7C-Seattle--WA?node-id=378-7464&viewport=684%2C153%2C0.14&t=cpR3wvw81c0ZOWzQ-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=378%3A7464&page-id=313%3A4732&hide-ui=1",
    heroImage: "/assets/images/stacksocial-thumb.jpg",
    statsSummary: "+41% cart conversion rate, $28M+ annual marketplace GMV, 4.2M active digital subscribers.",
    summary: "Reimagined the flagship digital marketplace discovery architecture, bundle builder experience, and checkout funnel for one of the web's largest technology discovery platforms.",
    problem: "Legacy software commerce platforms presented overwhelming category trees, dense text lists, and high cart abandonment caused by friction-filled multi-step redemption flows.",
    solution: "Designed a modern card-based discovery feed with interactive software bundle configurators, pay-what-you-want dynamic leaderboards, and instant 1-click license provisioning.",
    researchInsights: [
      "Tech buyers prioritize system compatibility and license longevity; surfacing macOS/Windows compatibility badges increased product page time by 28%.",
      "Interactive 'build your own bundle' sliders dramatically elevated average order value by 35% compared to static packages.",
      "Streamlined post-purchase license vaults with copy-to-clipboard activation reduced support ticket volume by 46%."
    ],
    designDecisions: [
      {
        title: "Interactive Bundle Configurator",
        description: "Visual tier-based builder with real-time savings calculations and reward unlock indicators."
      },
      {
        title: "High-Density Software Grid",
        description: "Scannable product cards highlighting discount percentages, user ratings, and platform icons."
      },
      {
        title: "Instant License Vault",
        description: "Centralized digital locker featuring one-click license activation and download managers."
      }
    ],
    metrics: [
      { label: "Cart Conversion", value: "+41%", subtext: "Lift following the redesigned checkout architecture" },
      { label: "Annual Marketplace GMV", value: "$28M+", subtext: "Processed across software, gadgets, and bundles" },
      { label: "Active Tech Community", value: "4.2M", subtext: "Subscribers discovering tools and apps weekly" }
    ],
    systemSpecs: [
      { key: "Catalog Scale", value: "Over 12,000 active digital software SKUs" },
      { key: "Design System", value: "Cross-platform tokenized design system in React & Tailwind" },
      { key: "Payment Architecture", value: "Stripe, Apple Pay, PayPal, and crypto checkout" },
      { key: "Page Performance", value: "98/100 Google Lighthouse Core Web Vitals score" }
    ],
    prototypeScreens: [
      { name: "Discovery Feed", caption: "Personalized curated tech feed with trending software drops", tag: "Explore" },
      { name: "Bundle Builder", caption: "Dynamic tier selector with live bundle savings breakdown", tag: "Configurator" },
      { name: "Digital License Hub", caption: "Instant key reveal with step-by-step installation guides", tag: "Fulfillment" }
    ],
    tags: ["E-commerce", "Marketplace", "Software", "Tech", "Design Systems", "Growth"]
  }
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    role: "Staff Product Designer · Spatial Systems",
    company: "Apex Spatial Labs",
    period: "2023 — Present",
    location: "Cupertino & San Francisco, CA",
    highlights: [
      "Leading design system architecture for next-generation spatial computing interfaces spanning visionOS and responsive web.",
      "Architected core spatial glass material shaders, eye-tracking hover highlight algorithms, and concentric radius math.",
      "Authored 3 filed design patents in gaze-gesture disambiguation and floating multi-window spatial arrangement."
    ],
    skills: ["visionOS", "Spatial Computing", "Design Systems", "SwiftUI", "Framer Motion", "Ergonomics"]
  },
  {
    role: "Senior Product Designer · Design Systems & Core UI",
    company: "Forma Cloud",
    period: "2020 — 2023",
    location: "San Francisco, CA",
    highlights: [
      "Scaled the unified design system across web, iOS, and macOS used by 2.2M monthly active developers and designers.",
      "Reduced front-end design debt by 64% by establishing strict token synchronization between Figma and TypeScript codebases.",
      "Mentored a squad of 6 product designers and collaborated directly with VP of Design on company-wide design principles."
    ],
    skills: ["Design Systems", "TypeScript", "Micro-Interactions", "Token Architecture", "Accessibility WCAG AAA"]
  },
  {
    role: "Lead Interaction Designer",
    company: "Studio Mono",
    period: "2017 — 2020",
    location: "New York, NY",
    highlights: [
      "Delivered flagship web and mobile applications for clients including luxury consumer tech, architectural studios, and fintech.",
      "Crafted bespoke physics-based micro-interactions, custom WebGL audio-visualizers, and high-conversion checkout flows.",
      "Awarded Awwwards Site of the Month and Red Dot Design Award for minimalist spatial web experiences."
    ],
    skills: ["Interaction Design", "Prototyping", "WebGL", "Typography", "Motion Physics"]
  }
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    degree: "B.S. in Human-Computer Interaction & Cognitive Science",
    institution: "Carnegie Mellon University",
    year: "2013 — 2017",
    notes: "Magna Cum Laude · Honors Thesis on Spatial Affordances & Peripheral Gaze Anchoring"
  },
  {
    degree: "Executive Certificate in Spatial Computing & Ergonomics",
    institution: "Stanford d.school & Media Lab",
    year: "2021",
    notes: "Specialized in 3D Depth Perception and Reduced Latency Direct Manipulation"
  }
];

export const PATENTS_AWARDS: PatentItem[] = [
  {
    id: "US-PAT-118942",
    title: "Spatial Window Hierarchy and Gesture Anchoring in Mixed-Reality Viewports",
    filingBody: "US Patent & Trademark Office",
    year: "2024",
    description: "Method for dynamic z-depth collision prevention and gaze-assisted magnetic snapping for floating virtual windows."
  },
  {
    id: "US-PAT-109283",
    title: "Specular Rim Light Calculation for Translucent 2D Containers in Ambient 3D Environments",
    filingBody: "US Patent & Trademark Office",
    year: "2023",
    description: "Shader algorithm delivering realistic room-illumination transmission without expensive ray-tracing compute overhead."
  },
  {
    id: "AWD-REDDOT-25",
    title: "Red Dot Best of the Best · Interface & User Experience",
    filingBody: "Red Dot Design Zentrum",
    year: "2025",
    description: "Honored for the AuraOS Spatial Computing Design System documentation and interaction paradigm."
  }
];

export const CORE_SKILLS = [
  { category: "Product & Strategy", items: ["0-to-1 Product Architecture", "Spatial Interaction Models", "Design Sprint Facilitation", "Quantitative Usability Benchmarking", "Executive Storytelling"] },
  { category: "Design Systems", items: ["Multi-Platform Token Architecture", "Concentric Radius & Spacing Math", "WCAG 2.2 AA/AAA Accessibility", "Figma Variables & AutoLayout Master", "Component Documentation"] },
  { category: "Motion & Engineering", items: ["Physics-Based Spring Tuning", "Framer Motion & Web Animations API", "React 19 / TypeScript / Vite", "Tailwind CSS Architecture", "Web Audio API Haptics"] }
];

export const ABOUT_PICTURES = [
  {
    id: "studio-setup",
    title: "Prototyping Environment",
    subtitle: "Seattle Studio · Spatial displays & hardware test rig",
    imageUrl: "/src/assets/images/alex_workspace_design_1790966330105.jpg",
    tag: "Studio"
  },
  {
    id: "design-workshop",
    title: "Systems Synthesis",
    subtitle: "Architecture reviews, glass whiteboard mapping & team critique",
    imageUrl: "/src/assets/images/alex_design_workshop_1790966343011.jpg",
    tag: "Collaboration"
  },
  {
    id: "creative-craft",
    title: "Tactile Kinetics",
    subtitle: "Tuning spring curves, spatial gaze thresholds & direct manipulation",
    imageUrl: "/src/assets/images/alex_creative_craft_1790966354531.jpg",
    tag: "Craft & Code"
  }
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-1",
    name: "Mike Dekker",
    role: "Product Design Consultant, Mentor & Career Coach",
    company: "",
    relationship: "Career coach & mentor",
    avatarUrl: "/assets/images/mike.jpeg",
    avatarInitials: "MD",
    highlight: "Thoughtful, motivated, and intentional about his growth as a leader.",
    quote: "I worked with Alex as his career coach, and he’s someone who is genuinely keen to grow and evolve into leadership roles. He has a strong understanding of the design industry and is clear on the steps involved in moving forward. What stood out most was his decision to take action—actively working on the skills required, asking the right questions, and applying what he learned. Alex is thoughtful, motivated, and intentional about his growth, and I’m confident he’ll continue to level up as a leader.",
    verifiedYear: "2025",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  },
  {
    id: "rec-2",
    name: "Fahd Syed",
    role: "Founder & Strategist",
    company: "Syde Agency",
    relationship: "Collaborated on TennisPAL match scheduling",
    avatarUrl: "/assets/images/fahd.jpeg",
    avatarInitials: "FS",
    highlight: "Process brought a lot of clarity to the project.",
    quote: "I worked with Alex on the match scheduling feature for TennisPAL, and he was fantastic to collaborate with. Before diving into design, he took the time to plan things out — mapping the user flow, understanding the goals, and ensuring everything was thought through from a user experience perspective. His process brought a lot of clarity to the project.",
    readMoreUrl: "https://www.linkedin.com/in/alextmcdonald/details/recommendations/",
    verifiedYear: "2024",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  },
  {
    id: "rec-3",
    name: "Jeff Buettin",
    role: "Co-founder & CEO",
    company: "Notch",
    relationship: "Executive partner & client",
    avatarUrl: "/assets/images/jeff.png",
    avatarInitials: "JB",
    highlight: "Passionate about his work; never ceases to amaze.",
    quote: "Alex is a really talented designer and a great guy to work with. What sold me on hiring him was how quickly he just got it. He knew exactly what we were trying to build and had incredibly creative ideas almost immediately on how to best go about it. He is a true professional and passionate about his work. No matter what the task presented,  Alex never ceases to amaze. I hope to work with him again in the future and highly recommend him and his work.",
    verifiedYear: "2024",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  },
  {
    id: "rec-4",
    name: "Victor Murygin",
    role: "Director of Technical Project Management",
    company: "Internet Brands",
    relationship: "Collaborated across dozens of web projects",
    avatarUrl: "/assets/images/victor.png",
    avatarInitials: "VM",
    highlight: "Bridges the gap between design and development.",
    quote: "Alex is a skilled and talented Web designer. He has worked on dozens of projects with me - big and small. He is able to follow directions if we have a clear concept idea AND is able to be more creative and come up with his own ideas when asked. He works great in a collaborative group setting, being able to help with collective brainstorming. Alex also possesses some front end knowledge which helps tremendously to bridge the gap between design and development. Overall he's a great person to work with.",
    verifiedYear: "2023",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  },
  {
    id: "rec-5",
    name: "Fallon Christian",
    role: "Sr. Manager, Tech Product Management",
    company: "AWS",
    relationship: "Collaborated on website creative and redesigns",
    avatarUrl: "/assets/images/fallon.png",
    avatarInitials: "FC",
    highlight: "Highly creative ideas and a real partner.",
    quote: "Alex is an extremely talented designer! He has highly creative ideas and can be a real partner in translating business needs to graphics. I worked with Alex as a website manager, and he did most of the creative for the site I managed. We also worked together for several site redesigns across the group, during which he was a pleasure to work with and really contributed to the process with good perspective and suggestions.",
    readMoreUrl: "https://www.linkedin.com/in/alextmcdonald/details/recommendations/",
    verifiedYear: "2023",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  }
];
