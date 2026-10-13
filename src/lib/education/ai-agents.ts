import type { UniversityTopic } from "@/lib/education/types";

export const aiAgents: UniversityTopic = {
  slug: "ai-agents",
  series: 6,
  title: "Types of AI Agents",
  poster: "/education/ai-agents.png",
  posterAlt: "Infographic listing fifteen kinds of AI agents",
  summary: "Textbook agent designs, then the product shapes teams actually buy: chat, tools, retrieval, and workflows.",
  metaDescription:
    "How reflex, goal, utility, and learning agents differ from the tool-using, RAG, and workflow agents businesses deploy.",
  intro:
    "The first five labels come from the classic agent textbook: what the program knows and how it chooses. The later labels are product shapes — a bot that chats, a loop that calls tools, a coder, a browser. A single system can be several of these at once. A RAG agent that chats and calls a search tool is conversational, tool-using, and retrieval-based. We build the practical ones only after the busy work is named.",
  concepts: [
    {
      slug: "simple-reflex-agent",
      name: "Simple Reflex Agent",
      definition:
        "A simple reflex agent maps the current situation to an action with a rule. It does not remember and it does not look ahead.",
      mechanism:
        "If the condition matches, the action fires. The rule table is the whole program. Anything not in the table is invisible.",
      practice:
        "A routing rule: if the subject contains an invoice number, send it to accounts payable. Useful, and not what people mean by an AI agent in a sales deck.",
      limit:
        "Reflex rules are brittle when the world only partially matches the condition. They are still the right tool when the rule is truly that simple.",
    },
    {
      slug: "model-based-agent",
      name: "Model-Based Agent",
      definition:
        "A model-based agent keeps an internal picture of the world so it can act when it cannot see everything at once. The picture is a model of state, not a language model.",
      mechanism:
        "Percepts update the state. The action depends on that state plus the rules. If the update is wrong, later actions inherit the error.",
      practice:
        "A workflow that remembers which approvals are still open, instead of reacting only to the latest email.",
      limit:
        "The word 'model' here is older than 'large language model.' An LLM can sit inside a model-based agent. It is not the same idea.",
    },
    {
      slug: "goal-based-agent",
      name: "Goal-Based Agent",
      definition:
        "A goal-based agent chooses actions by asking which ones move it toward a described goal. The goal is a condition to reach, not a score to maximize.",
      mechanism:
        "Search or planning considers future states and prefers paths that end in the goal. The agent needs a way to know what its actions do.",
      practice:
        "'Get this request to Approved with the required attachments' is a goal. The steps can vary as long as that end state is true.",
      limit:
        "Goals that are vague — 'be helpful' — do not constrain search. Write the end state so a person can tell whether it was reached.",
    },
    {
      slug: "utility-based-agent",
      name: "Utility-Based Agent",
      definition:
        "A utility-based agent scores outcomes, not just success or failure, and picks the action with the better score. It can trade speed against risk.",
      mechanism:
        "A utility function assigns a number to states. The agent chooses the action with the highest expected utility. The function is a business decision written as arithmetic.",
      practice:
        "Choosing the next case to work when both urgency and value matter, instead of any path that merely 'finishes.'",
      limit:
        "If the score ignores a cost the business cares about, the agent will ignore it too. Utility is only as honest as the formula.",
    },
    {
      slug: "learning-agent",
      name: "Learning Agent",
      definition:
        "A learning agent improves its behavior from experience. The textbook splits what it does now from the part that critiques and updates that behavior.",
      mechanism:
        "A performance element acts. A critic compares the result with a standard. A learning element changes the behavior. A problem generator can seek new experiences.",
      practice:
        "A ranker that gets better as people correct its suggestions, with a review set so it cannot quietly drift.",
      limit:
        "Learning in production without a freeze switch turns yesterday's mistake into tomorrow's policy. Most useful 'agents' are updated by people on a schedule, not continuously.",
    },
    {
      slug: "rule-based-agent",
      name: "Rule-Based Agent",
      definition:
        "A rule-based agent is a reflex or expert system whose behavior is written as explicit if-then rules. The poster lists it separately from the simple reflex agent. The difference is emphasis, not a new theory.",
      mechanism:
        "Rules fire when conditions match, sometimes with priorities or a small inference chain. People can read the rule. They can also drown in a pile of exceptions.",
      practice:
        "Policy gates: what may be sent, what must stop for a person, what field is required. These gates should wrap any later model.",
      limit:
        "A large language model is not a substitute for the rule when the rule is a compliance line. Put the rule outside the model.",
    },
    {
      slug: "planning-agent",
      name: "Planning Agent",
      definition:
        "A planning agent builds a sequence of steps before or during the work, then follows or revises that sequence. It is the practical form of a goal-based agent.",
      mechanism:
        "Given a goal, a set of actions, and their preconditions, a planner searches for an ordered list that reaches the goal. Replanning happens when an action fails.",
      practice:
        "Breaking 'prepare the onboarding packet' into collect, draft, check, and file — and stopping if a required document is missing.",
      limit:
        "Plans that a model invents in prose are not checked plans. Prefer a small set of allowed steps over an open-ended story of what it might do.",
    },
    {
      slug: "conversational-agent",
      name: "Conversational Agent",
      definition:
        "A conversational agent uses dialogue as the way people give it work and read the result. Conversation is the interface. The work may still be retrieval, a ticket, or a draft.",
      mechanism:
        "Turns update the thread. The agent decides whether to answer, ask a clarifying question, or call a tool. The thread is not a system of record unless you write the outcome somewhere durable.",
      practice:
        "An assistant in the tools people already open, answering from approved material and handing off when the request leaves its scope.",
      limit:
        "A pleasant conversation can hide that nothing was filed. The outcome of the chat should land in the system where the work lives.",
    },
    {
      slug: "autonomous-agent",
      name: "Autonomous Agent",
      definition:
        "An autonomous agent carries a goal forward with little step-by-step instruction. Autonomy is how much you let it do, not how smart it is.",
      mechanism:
        "It loops — observe, decide, act — until a stop condition. Limits on tools, spend, and time are what keep the loop inside the business.",
      practice:
        "A watcher that drafts the routine update and waits. Full hands-off action fits only where a wrong step is cheap and reversible.",
      limit:
        "Do not start here. Start with a person confirming the action. Widen autonomy after you have seen the errors.",
    },
    {
      slug: "multi-agent-system",
      name: "Multi-Agent System",
      definition:
        "A multi-agent system gives different roles to different agents that pass work among themselves. The split only helps when the roles are truly different.",
      mechanism:
        "Each agent has tools and instructions. A coordinator, or a shared state, moves the task. Failures include loops, duplicated work, and nobody owning the final check.",
      practice:
        "One role drafts, another checks policy, a person approves. Three agents that all 'think generally' are usually one agent with extra confusion.",
      limit:
        "More agents multiply cost and failure points. Split a role only when a single instruction set is doing two jobs badly.",
    },
    {
      slug: "tool-using-agent",
      name: "Tool-Using Agent",
      definition:
        "A tool-using agent does not only talk. It calls systems: search, a database, mail, a ticket API. The tools are the difference between a demo and a workflow.",
      mechanism:
        "The model chooses a tool, fills arguments, reads the result, and continues. Permissions on the tool are the real boundary. The model will attempt whatever the tool allows.",
      practice:
        "Look up the customer, draft the note, and attach it to the case — each as a permitted call, each logged.",
      limit:
        "A tool with write access is an action, not a suggestion. Read-only first. Writes go through confirmation until the error rate is known.",
    },
    {
      slug: "rag-agent",
      name: "RAG Agent",
      definition:
        "A RAG agent answers by retrieving passages from your material and conditioning its draft on those passages. Retrieval-augmented generation is a pattern, not a personality.",
      mechanism:
        "A query fetches candidate chunks. The model writes from those chunks and should say when they do not contain the answer. Bad chunking or bad permissions produce confident nonsense.",
      practice:
        "Policy, SOP, and project answers that must stay inside documents the asker is allowed to see. The permission check happens at retrieval, not as a footnote.",
      limit:
        "Retrieval is not understanding and not completeness. If the source is outdated, the agent is outdated. Someone owns the corpus.",
    },
    {
      slug: "coding-agent",
      name: "Coding Agent",
      definition:
        "A coding agent reads a codebase, edits it, and often runs tests. It is a tool-using agent whose tools are the repository, the shell, and the test runner.",
      mechanism:
        "It plans a change, edits files, executes checks, and repairs from the errors. The repository permissions and the review are what keep a generated patch from shipping unseen.",
      practice:
        "Narrow, test-covered changes. A human still reads the diff when the change affects customers, money, or security.",
      limit:
        "Passing tests are not the same as the right product behavior. The agent does not know which requirement you forgot to write down.",
    },
    {
      slug: "browser-agent",
      name: "Browser Agent",
      definition:
        "A browser agent operates a website the way a person would: click, type, read the resulting page. It is a fallback when no proper API exists.",
      mechanism:
        "The agent looks at page structure or screenshots, chooses an element, and acts. Layout changes break it. Sessions, captchas, and terms of use bound what is allowed.",
      practice:
        "A last resort for a portal that has no integration, scoped to one task and watched. Prefer an API or a file drop when you can get one.",
      limit:
        "Driving a UI is slower and more fragile than calling a system. Do not make a browser agent the backbone of a daily process if a stable interface can be had.",
    },
    {
      slug: "agentic-workflow",
      name: "AI Agentic Workflow",
      definition:
        "An agentic workflow is the whole path: trigger, steps, tools, checks, and the place the result is stored. The agent is one part. The workflow is what the business feels.",
      mechanism:
        "A trigger starts the run. Steps call people, models, and systems. Branches stop for review. Logs show what happened. The design question is which steps remove repetition without hiding a decision that should stay human.",
      practice:
        "This is the unit we actually ship after Discover: a named piece of busy work, redesigned so people spend time on the judgment and not on the copying.",
      limit:
        "A workflow diagram with a model in the middle is not finished when the demo runs. It is finished when the time and the errors move in the direction you measured.",
    },
  ],
};
