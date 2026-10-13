import type { UniversityTopic } from "@/lib/education/types";

export const typesOfAi: UniversityTopic = {
  slug: "types-of-ai",
  series: 1,
  title: "Types of AI",
  poster: "/education/types-of-ai.png",
  posterAlt: "Infographic listing fifteen labels under Types of AI",
  summary: "Capability claims, memory styles, and everyday job types — three ladders drawn as one list.",
  metaDescription:
    "A practical reading of fifteen AI labels, from narrow systems in use today to hypothetical general and superintelligent systems.",
  intro:
    "This map mixes three different questions: how broad a system is, whether it keeps a memory, and what job it is hired to do. Narrow tools that write, see, or recommend already exist. General intelligence and self-aware machines do not. Read each label as a description of a behavior, not as a rung you must climb.",
  concepts: [
    {
      slug: "narrow-ai",
      name: "Narrow AI (ANI)",
      definition:
        "Narrow AI is built to do a bounded job, such as sorting mail, drafting a reply, or flagging an invoice exception. It can be very capable inside that boundary and useless outside it.",
      mechanism:
        "Designers choose the inputs, the success measure, and the actions the system may take. Training data, rules, or both are scoped to that job, so performance is judged on the task rather than on general understanding.",
      practice:
        "Almost every system a business uses today is narrow: a spam filter, a demand forecast, a meeting summary, a copilot that answers from one tenant's files.",
      limit:
        "Calling a product 'AI' does not make it general. A strong narrow system still fails when the job, the data, or the permissions change.",
    },
    {
      slug: "general-ai",
      name: "General AI (AGI)",
      definition:
        "General AI would learn and perform unfamiliar tasks across domains at roughly human flexibility. No deployed product meets that bar.",
      mechanism:
        "The idea is a system that can transfer skill without a new project for every workflow: pick up a novel task, gather what it needs, and check its own work. Research prototypes still depend on human setup, tools, and evaluation.",
      practice:
        "Treat AGI as a research target, not a buying category. Current projects should be scoped as narrow systems with a named owner and a measurable outcome.",
      limit:
        "Vendor language often slides from 'assistant' to 'general intelligence.' Ask which workflow it completes and what happens when it is wrong.",
    },
    {
      slug: "super-ai",
      name: "Super AI (ASI)",
      definition:
        "Super AI is a hypothetical system that outperforms people across most cognitive work, including the work of improving itself. It is speculation, not a product.",
      mechanism:
        "The claim depends on a system that can set goals, invent methods, and compound improvements faster than human review. None of those capabilities is demonstrated as a stable, controllable whole.",
      practice:
        "It does not change this quarter's automation decision. Time saved still comes from specific workflows with a human accountable for the result.",
      limit:
        "Planning around superintelligence skips the only question that pays off now: where are people losing time?",
    },
    {
      slug: "reactive-machines",
      name: "Reactive Machines",
      definition:
        "A reactive machine responds to the situation in front of it and does not store experience for the next decision. Chess programs that evaluate the current board are the classic example.",
      mechanism:
        "Each input is mapped to an output from rules or a model that sees only the present state. Nothing about yesterday's game changes today's evaluation unless a person retrains or rewrites the system.",
      practice:
        "A form that validates the fields on screen, or a control that reacts to a sensor reading, is reactive if it has no running memory of prior cases.",
      limit:
        "This is a memory design, not a capability level. A reactive system can still be narrow, and a narrow system can still remember.",
    },
    {
      slug: "limited-memory-ai",
      name: "Limited Memory AI",
      definition:
        "Limited-memory systems use recent history as well as the current input. That window might be a conversation, a few sensor frames, or a customer's last interactions.",
      mechanism:
        "The model or the application keeps a short state: prior turns, a sliding window of events, or features computed from recent records. Older context falls away unless it is written into a database the system can look up.",
      practice:
        "Lane-keeping that watches the last few seconds of video, and a chat assistant that uses the thread so far, both depend on limited memory.",
      limit:
        "A longer prompt is not a durable memory. If the business needs last quarter's decision remembered, store it on purpose and retrieve it.",
    },
    {
      slug: "theory-of-mind-ai",
      name: "Theory of Mind AI",
      definition:
        "Theory-of-mind AI would model what another person believes, wants, and might do next. Research studies pieces of this. Production systems do not have a reliable mind model.",
      mechanism:
        "A true version would keep a separate picture of someone else's knowledge and update it as they speak and act. Today's assistants infer tone or intent from text patterns, which is a weaker and less stable trick.",
      practice:
        "Useful stand-ins already exist: routing a message by detected intent, or drafting a reply that matches a customer's stated goal. Those are classifiers, not models of belief.",
      limit:
        "Do not brief a team as if the software understands motives. It predicts likely words and labels from examples.",
    },
    {
      slug: "self-aware-ai",
      name: "Self-Aware AI",
      definition:
        "Self-aware AI would have a first-person sense of its own state, continuity, and interests. There is no accepted test that shows a machine has that, and no product should be sold as if it does.",
      mechanism:
        "The label borrows from consciousness research. Monitoring internal metrics, such as confidence or tool errors, is engineering feedback. It is not evidence of experience.",
      practice:
        "Ignore this category in a business case. Accountability stays with the people who deploy the system and the people who act on its output.",
      limit:
        "A system that says 'I think' is using a conversational pattern. The sentence is not a report of an inner life.",
    },
    {
      slug: "generative-ai",
      name: "Generative AI",
      definition:
        "Generative AI produces new artifacts — text, images, audio, code, or structured records — that were not stored as finished answers. It is a job type, not a step above narrow AI.",
      mechanism:
        "A model learns patterns in examples, then samples a new output conditioned on a prompt and, often, on retrieved context. Quality depends on the data, the instructions, and a check by someone who owns the result.",
      practice:
        "Drafting a status email, proposing a process checklist, or turning meeting notes into tasks are generative uses. The draft still needs a person.",
      limit:
        "Generation is not retrieval. If the answer must match a policy or a contract, ground the draft in the source and review it.",
    },
    {
      slug: "predictive-ai",
      name: "Predictive AI",
      definition:
        "Predictive AI estimates something not yet observed: a number, a class, a risk, or a next event. It scores the likelihood. It does not, by itself, take the action.",
      mechanism:
        "Historical examples train a model to map inputs to an outcome. At run time the same mapping produces a forecast, often with a confidence range. Decisions still need a threshold and an owner.",
      practice:
        "Demand forecasts, lead scores, late-payment risk, and 'this invoice looks unusual' are predictive. They pay off when someone acts on the score.",
      limit:
        "A forecast of the past's pattern fails when the business changes. Predictive and generative systems are often combined, but they answer different questions.",
    },
    {
      slug: "conversational-ai",
      name: "Conversational AI",
      definition:
        "Conversational AI holds a dialogue: it takes turns, tracks the thread, and answers in language a person can use. The conversation is the interface, not proof of general intelligence.",
      mechanism:
        "Speech or text is turned into an intent or a prompt. A policy, a retrieval step, and a language model decide the reply. State lives in the thread and in whatever systems the assistant is allowed to call.",
      practice:
        "An internal assistant that answers 'where is the SOP?' from approved documents is conversational. So is a front-door bot that books a handoff to a person.",
      limit:
        "Fluency hides gaps. If the assistant cannot cite a source or refuse, it will sound sure while it is guessing.",
    },
    {
      slug: "computer-vision-ai",
      name: "Computer Vision AI",
      definition:
        "Computer vision turns images or video into labels, measurements, or text. It reads pixels. It does not understand a workplace the way an employee does.",
      mechanism:
        "Models detect patterns — edges, objects, text, defects — learned from labeled or self-labeled images. A downstream rule decides whether a detection is worth a human look.",
      practice:
        "Reading a photo of a form, counting items on a dock, or checking whether a safety vest is visible are vision jobs. Lighting and camera angle change the result.",
      limit:
        "Vision is a modality. The same business problem might be solved more reliably from a barcode or a database field than from a picture.",
    },
    {
      slug: "speech-ai",
      name: "Speech AI",
      definition:
        "Speech AI listens to talk and turns it into text, or turns text into talk. Recognition and synthesis are separate skills that are often bundled.",
      mechanism:
        "Recognition maps audio frames to words, handling accent, noise, and overlap only as well as its training allows. Synthesis maps words to a voice waveform. Meaning, if any, is handled by a different step.",
      practice:
        "Call transcripts, voice notes turned into tasks, and a spoken readout of a dashboard are ordinary uses. The transcript is a draft of what was said, not minutes of what was decided.",
      limit:
        "Speech on this poster sits beside conversational AI. A voice interface can be both. The microphone does not add judgment.",
    },
    {
      slug: "recommendation-ai",
      name: "Recommendation AI",
      definition:
        "Recommendation AI ranks items for a person or a situation: the next article, product, expert, or document most likely to help. Ranking is the product.",
      mechanism:
        "Signals such as past clicks, similar users, item attributes, or a text query produce a score. The top of the list is shown. Feedback from what people actually open updates later rankings.",
      practice:
        "A knowledge base that surfaces the three SOPs closest to a ticket, or a catalog that suggests a related part, is a recommender.",
      limit:
        "Recommendations reinforce what was popular. They are a poor way to find the rare case that matters, unless the ranking is built for that case.",
    },
    {
      slug: "autonomous-ai",
      name: "Autonomous AI",
      definition:
        "Autonomous AI takes a sequence of actions with limited supervision, inside limits set by people. Autonomy is a permission level, not a kind of intelligence.",
      mechanism:
        "The system observes, chooses, acts, and checks a stop condition. Guardrails define what it may touch, how much it may spend, and when it must hand back to a person.",
      practice:
        "A vehicle keeping a lane, or a workflow that files a routine request and stops at an approval, is autonomous only inside that fence.",
      limit:
        "More autonomy raises the cost of a wrong action. Start with a recommendation a person confirms, then widen only where the error is cheap and visible.",
    },
    {
      slug: "agentic-ai",
      name: "Agentic AI",
      definition:
        "Agentic AI pursues a goal by planning steps and using tools, rather than answering in one pass. It is still narrow if the goal and the tools are narrow.",
      mechanism:
        "A loop proposes a next action, calls a search, a database, or another system, reads the result, and continues until the goal or a limit is hit. People design the tools, the stop rules, and the audit trail.",
      practice:
        "An assistant that looks up a policy, drafts the reply, and files it in the right folder — waiting for approval — is agentic. The value is the finished workflow, not the loop itself.",
      limit:
        "Agentic is not the same as autonomous, and neither is general AI. A goal-seeking loop can still wander, repeat itself, or act on a bad retrieval.",
    },
  ],
};
