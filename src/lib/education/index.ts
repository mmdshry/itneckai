import { aiAgents } from "@/lib/education/ai-agents";
import { algorithms } from "@/lib/education/algorithms";
import { deepLearning } from "@/lib/education/deep-learning";
import { generativeAi } from "@/lib/education/generative-ai";
import { machineLearning } from "@/lib/education/machine-learning";
import { typesOfAi } from "@/lib/education/types-of-ai";
import type { UniversityTopic } from "@/lib/education/types";

export const topics: UniversityTopic[] = [
  typesOfAi,
  machineLearning,
  deepLearning,
  algorithms,
  generativeAi,
  aiAgents,
];

export function getTopic(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export function topicNeighbors(slug: string) {
  const index = topics.findIndex((topic) => topic.slug === slug);
  if (index < 0) return { previous: undefined, next: undefined };
  return {
    previous: topics[index - 1],
    next: topics[index + 1],
  };
}
