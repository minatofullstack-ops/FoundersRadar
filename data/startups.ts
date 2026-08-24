import type { StartupPattern } from "@/lib/matching";

export const startupPatterns: StartupPattern[] = [
  {
    id: "vertical-workflow",
    name: "Vertical workflow software",
    category: "B2B SaaS",
    problem: "Small teams still run their most important work through spreadsheets and scattered messages.",
    audience: "A narrowly defined professional niche you understand from the inside.",
    signal: "Operators with customer empathy can turn repeated manual work into a high-retention product.",
    strengths: ["operate", "sell"],
    roadmap: ["Interview 15 people in one niche", "Map the repeated workflow", "Prototype the smallest handoff", "Charge three design partners", "Measure weekly retained use", "Choose the wedge for a v1"],
  },
  {
    id: "expertise-marketplace",
    name: "Trusted expertise marketplace",
    category: "Network marketplace",
    problem: "People struggle to find credible help for high-stakes, specialized decisions.",
    audience: "A community where your network and reputation already create trust.",
    signal: "Founder-led distribution and relationship building can solve the cold-start problem.",
    strengths: ["sell", "operate"],
    roadmap: ["Define the highest-stakes use case", "Recruit 10 trusted experts", "Match the first users manually", "Document the trust signals", "Test a paid transaction", "Decide whether to automate"],
  },
  {
    id: "ai-copilot",
    name: "Practical AI copilot",
    category: "Applied AI",
    problem: "Knowledge workers lose hours translating expertise into repetitive decisions and drafts.",
    audience: "A workflow where you can explain the domain rules better than a generalist.",
    signal: "Technical fluency paired with domain depth creates a useful, defensible first product.",
    strengths: ["build", "operate"],
    roadmap: ["Collect 20 real workflow examples", "Define the human-in-the-loop step", "Build a narrow private prototype", "Test output quality with experts", "Price against time saved", "Harden the repeatable workflow"],
  },
  {
    id: "consumer-ritual",
    name: "Consumer ritual with community",
    category: "Consumer subscription",
    problem: "People want progress they can feel, but generic tools do not make the habit personal.",
    audience: "An identity-based community where you understand the emotional job to be done.",
    signal: "Strong storytelling and consistent community operations can compound into retention.",
    strengths: ["sell", "build"],
    roadmap: ["Describe the ritual in one sentence", "Recruit a founding cohort", "Run the habit manually for two weeks", "Ship the smallest repeatable loop", "Measure week-four retention", "Tune the paid membership"],
  },
];
