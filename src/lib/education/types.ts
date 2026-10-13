export type Concept = {
  slug: string;
  name: string;
  definition: string;
  mechanism: string;
  practice: string;
  limit: string;
};

export type UniversityTopic = {
  slug: string;
  series: number;
  title: string;
  poster: string;
  posterAlt: string;
  summary: string;
  metaDescription: string;
  intro: string;
  concepts: Concept[];
};
