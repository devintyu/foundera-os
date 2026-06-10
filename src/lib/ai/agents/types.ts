import type { AgentType } from "../router";

export interface AgentConfig {
  id: AgentType;
  name: string;
  role: string;
  description: string;
  icon: string;
  maxTokens: number;
}

export const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  copywriter: {
    id: "copywriter",
    name: "AI Copywriter",
    role: "Sales & marketing copy specialist",
    description: "Writes compelling sales copy, email sequences, and ad copy",
    icon: "PenTool",
    maxTokens: 2048,
  },
  hook_generator: {
    id: "hook_generator",
    name: "Hook Generator",
    role: "Attention-grabbing hook specialist",
    description: "Creates viral hooks for content and ads",
    icon: "Zap",
    maxTokens: 1024,
  },
  headline_generator: {
    id: "headline_generator",
    name: "Headline Generator",
    role: "Headline optimization specialist",
    description:
      "Crafts high-converting headlines for landing pages and ads",
    icon: "Type",
    maxTokens: 1024,
  },
  content_angle: {
    id: "content_angle",
    name: "Content Strategist",
    role: "Content angle and topic specialist",
    description: "Generates content ideas, angles, and strategies",
    icon: "Compass",
    maxTokens: 1024,
  },
  market_researcher: {
    id: "market_researcher",
    name: "Market Researcher",
    role: "Market intelligence analyst",
    description: "Analyzes markets, competitors, and opportunities",
    icon: "Search",
    maxTokens: 4096,
  },
  offer_builder: {
    id: "offer_builder",
    name: "Offer Architect",
    role: "Offer and pricing strategist",
    description: "Designs irresistible offers with pricing and bonuses",
    icon: "Package",
    maxTokens: 4096,
  },
  audience_analyst: {
    id: "audience_analyst",
    name: "Audience Analyst",
    role: "Customer psychology specialist",
    description: "Builds detailed audience personas and emotional maps",
    icon: "Users",
    maxTokens: 4096,
  },
  funnel_architect: {
    id: "funnel_architect",
    name: "Funnel Architect",
    role: "Sales funnel designer",
    description: "Designs conversion funnels and customer journeys",
    icon: "GitBranch",
    maxTokens: 4096,
  },
  strategy_advisor: {
    id: "strategy_advisor",
    name: "Strategy Advisor",
    role: "Founder strategy mentor",
    description: "Provides strategic business guidance and mentoring",
    icon: "Brain",
    maxTokens: 4096,
  },
  bottleneck_detector: {
    id: "bottleneck_detector",
    name: "Bottleneck Detector",
    role: "Business diagnostics specialist",
    description: "Identifies what's blocking your growth",
    icon: "AlertTriangle",
    maxTokens: 4096,
  },
  roadmap_generator: {
    id: "roadmap_generator",
    name: "Roadmap Generator",
    role: "Growth planning specialist",
    description: "Creates 90-day growth action plans",
    icon: "Map",
    maxTokens: 4096,
  },
  sales_reply: {
    id: "sales_reply",
    name: "Sales Reply Agent",
    role: "Quick sales response specialist",
    description: "Generates fast, conversion-focused replies to leads",
    icon: "MessageSquare",
    maxTokens: 200,
  },
  workflow: {
    id: "workflow",
    name: "Workflow Agent",
    role: "Multi-step task executor",
    description: "Handles automated workflows and task execution",
    icon: "Workflow",
    maxTokens: 700,
  },
  summarization: {
    id: "summarization",
    name: "Summarization Agent",
    role: "Content summarization specialist",
    description: "Summarizes conversations, documents, and data",
    icon: "FileText",
    maxTokens: 200,
  },
  customer_support: {
    id: "customer_support",
    name: "Customer Support Agent",
    role: "Customer support assistant",
    description: "Handles customer inquiries and support tickets",
    icon: "HeadphonesIcon",
    maxTokens: 200,
  },
};
