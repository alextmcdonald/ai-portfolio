import { CaseStudy, WorkExperience, EducationItem, PatentItem, Recommendation } from '../types';

export const DESIGNER_INFO = {
  name: "Alex McDonald",
  title: "Senior Product Designer",
  roleSubtext: "AI Design Engineer",
  location: "Seattle, WA",
  email: "me@alextmcdonald.com",
  status: "Open to new opportunities",
  avatarUrl: "/assets/images/alex_portrait_regular_1790739680820.jpg",
  avatarLightUrl: "/assets/images/alex_portrait_blue_1790739680820.jpg",
  bio: "Over a decade shaping products at the intersection of human ergonomics, spatial computing, and high-frequency software. Known for relentless craft, Cupertino-grade micro-interactions, and robust cross-platform design systems.",
  socials: {
    linkedin: "https://linkedin.com/in/alextmcdonald",
    dribbble: "https://dribbble.com/alexmcdonald",
    behance: "https://behance.net/alextmcdonald",
    twitter: "https://x.com/alexmcdesign",
    github: "https://github.com/alextmcdonald",
    strava: "https://strava.com/athletes/almcd",
    figma: "https://figma.com/@alextmcdonald",
    readcv: "https://read.cv/alexmcdonald"
  },
  stats: [
    { label: "Years experience", value: "10+", detail: "Apple, Fintech & Spatial Tech" },
    { label: "Design patents", value: "3", detail: "Spatial UI & Gaze Gesture Anchoring" },
    { label: "Systems scale", value: "140+", detail: "Global Cross-Platform Adoption" },
    { label: "Products shipped", value: "24+", detail: "Spatial & High-Frequency Software" }
  ]
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "aura-spatial-os",
    title: "Drive Auto",
    subtitle: "Architecting the next paradigm of glass depth, gaze ergonomics, and 3D spatial window anchoring.",
    role: "Lead Spatial Designer & Systems Architect",
    timeline: "2024 — 2025",
    category: "B2B Enterprise",
    cardTags: ["B2B Enterprise", "Automotive"],
    heroImage: "/src/assets/images/casestudy_spatial_device_1790887169601.jpg",
    videoUrl: "/assets/videos/driveauto.mp4",
    statsSummary: "Task switching 42% faster, 38% gaze fatigue reduction. Adopted across 140+ engineers.",
    summary: "Designed and engineered an end-to-end spatial computing interface system built from the ground up for floating glass environments. Solved ergonomic fatigue from extended gaze selection, dynamic ambient lighting occlusion, and multi-window depth collisions.",
    problem: "Early spatial apps suffered from eye fatigue due to high-contrast white frost cards, disorienting 3D floating z-depth layers, and clunky touch metaphors ported carelessly from 2D tablet operating systems.",
    solution: "Developed tinted neutral grey glass shaders with directional rim specular highlights, concentric corner radii math (r_inner = r_outer - padding), and an adaptive gaze-focus physics curve that gently magnifies targets before pinch confirmation.",
    researchInsights: [
      "Eye saccades are ~30% less accurate than finger taps; target bounding boxes required a minimum 56pt gaze-hit radius with comfortable 12pt safety gutters.",
      "Pure white frosted glass caused severe eye fatigue in dark environments; adopting neutral warm-grey tinted glass reduced luminance spikes by 48%.",
      "Sound feedback synchronized at the exact moment of finger contact reduces perceived input latency by over 80ms."
    ],
    designDecisions: [
      {
        title: "Adaptive Depth Anchoring",
        description: "Windows intelligently adjust their z-distance based on window content density, maintaining constant angular resolution in the user's field of view."
      },
      {
        title: "Dynamic Specular Horizon",
        description: "A calculated rim highlight that tracks virtual room light sources, making glass windows feel physically present rather than flat SVG overlays."
      },
      {
        title: "Gaze-Spring Magnetism",
        description: "Subtle 2px spring lift towards the optical center on gaze hover with compositor-only transforms, providing reassuring tactile confirmation."
      }
    ],
    metrics: [
      { label: "Task Switching", value: "42% Faster", subtext: "In continuous multi-window spatial benchmarking" },
      { label: "Gaze Fatigue", value: "38% Reduction", subtext: "Measured across 3-hour continuous workflow tests" },
      { label: "System Adoption", value: "99.4%", subtext: "Adopted across 140+ engineers and 6 product squads" }
    ],
    systemSpecs: [
      { key: "Target Field of View", value: "64° horizontal comfortable viewing arc" },
      { key: "Window Corner Radius", value: "40px outer / 26px card / 18px nested" },
      { key: "Gaze Hit Radius", value: "56pt minimum interactive bounding area" },
      { key: "Backdrop Filter Blur", value: "32px Gaussian with 180% color saturation" }
    ],
    prototypeScreens: [
      { name: "Window Management", caption: "Multi-depth spatial arrangement with magnetic snapping", tag: "Spatial 3D" },
      { name: "Ornaments & Controls", caption: "Floating bottom capsule with physics-driven state transitions", tag: "Controls" },
      { name: "Dynamic Glass Shader", caption: "Real-time room illumination reflection and specular rim highlight", tag: "Shader" }
    ],
    tags: ["B2B Enterprise", "Automotive", "Spatial UI", "Design Systems", "Ergonomics"]
  },
  {
    id: "strata-wealth",
    title: "TennisPal",
    subtitle: "High-net-worth portfolio management with tactile micro-interactions, dark titanium UI, and sub-16ms telemetry.",
    role: "Principal Product Designer",
    timeline: "2023 — 2024",
    category: "Consumer app",
    cardTags: ["Consumer app", "Social media", "Sports"],
    heroImage: "/src/assets/images/casestudy_fintech_mobile_1790732888826.jpg",
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
    subtitle: "Low-cognitive-load infinite canvas balancing autonomous agent execution with direct human manipulation.",
    role: "Staff Product Designer",
    timeline: "2022 — 2023",
    category: "Consumer app",
    cardTags: ["Consumer app", "Marketplace", "Food"],
    heroImage: "/src/assets/images/casestudy_canvas_device_1790887188018.jpg",
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
    subtitle: "Real-time in-venue seat upgrades and dynamic VIP marketplace for major sports franchises and live events.",
    role: "Senior Product Designer",
    timeline: "2021 — 2022",
    category: "Consumer app",
    cardTags: ["Consumer app", "Marketplace", "Sports"],
    heroImage: "/src/assets/images/golfscanner_preview_1790968360808.jpg",
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
    subtitle: "Discovery engine and high-velocity commerce marketplace connecting millions of tech enthusiasts with cutting-edge software and digital bundles.",
    role: "Staff Product Designer & Growth Lead",
    timeline: "2019 — 2021",
    category: "E-commerce",
    cardTags: ["E-commerce", "Marketplace", "Software", "Tech"],
    heroImage: "/src/assets/images/casestudy_ai_workspace_1790732898643.jpg",
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
    name: "Elena Rostova",
    role: "VP of Product Design",
    company: "Horizon OS / Spatial Ecosystems",
    relationship: "Managed Alex directly",
    avatarInitials: "ER",
    highlight: "Rare multi-dimensional systems thinker down to the sub-pixel shader.",
    quote: "Alex is the rare designer who thinks in multi-dimensional systems and executes down to the sub-pixel shader. His work on vision ergonomics and spatial depth hierarchies set the benchmark for our entire product organization. He doesn't merely solve surface-level interface challenges; he digs into technical constraints, aligns cross-functional partners effortlessly, and consistently models what modern product leadership should look like at scale.",
    verifiedYear: "2025",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  },
  {
    id: "rec-2",
    name: "Marcus Vance",
    role: "Staff Software Engineer",
    company: "Apple Ecosystem & macOS Platforms",
    relationship: "Collaborated on cross-platform core frameworks",
    avatarInitials: "MV",
    highlight: "Writes production-grade code and respects engineering reality.",
    quote: "Collaborating with Alex is effortless because he doesn't just hand off static Figma files—he writes clean, production-grade code, understands GPU rendering pipelines, and respects real engineering constraints. He speaks our language fluently, builds working interactive prototypes to resolve edge cases well before sprint planning, and bridges the gap between design aspiration and engineering delivery better than anyone I have worked with.",
    verifiedYear: "2024",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  },
  {
    id: "rec-3",
    name: "Sarah Lin-Chen",
    role: "Head of Product",
    company: "Apex Global Financial Systems",
    relationship: "Senior stakeholder on enterprise transaction suites",
    avatarInitials: "SL",
    highlight: "Turned our most complex workflows into fluid, delightful spatial experiences.",
    quote: "Alex turned our most complex financial transaction suite into a fluid, intuitive, and delightful spatial experience. He communicates with extraordinary clarity, translates ambiguity into actionable product roadmaps, and champions end-user needs while keeping strategic business metrics front and center. His ability to facilitate design sprints and consistently deliver world-class work under intense deadlines was invaluable to our launch.",
    verifiedYear: "2024",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  },
  {
    id: "rec-4",
    name: "David K. O'Connor",
    role: "Principal Design Director",
    company: "Spatial Systems & HCI Lab",
    relationship: "Collaborated across multiple spatial hardware programs",
    avatarInitials: "DO",
    highlight: "Brings infectious curiosity and narrative depth to every design challenge.",
    quote: "Beyond his impeccable visual craft and precision, Alex brings infectious curiosity and narrative depth to every design challenge. He approaches complex human-computer interaction problems with deep empathy, rigorous user research, and an unrelenting commitment to elegance. Any product organization looking to define new industry standards will see their creative bar rise immediately with Alex on board.",
    verifiedYear: "2023",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  },
  {
    id: "rec-5",
    name: "Maya Patel",
    role: "Director of Design Systems",
    company: "CloudScale & Enterprise AI",
    relationship: "Partnered on multi-platform design token architecture",
    avatarInitials: "MP",
    highlight: "A visionary systems architect who bridges design tokens and production scale.",
    quote: "Alex's mastery of design token architecture and scalable component ecosystems transformed our product development lifecycle. He spearheaded our multi-platform tokenization initiative, reducing design debt by over 40% and uniting dozens of disparate feature squads under one cohesive design language. He is not only a visionary systems architect, but an inspiring mentor who elevates everyone around him.",
    verifiedYear: "2025",
    linkedinUrl: "https://linkedin.com/in/alextmcdonald"
  }
];
