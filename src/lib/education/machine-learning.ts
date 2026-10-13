import type { UniversityTopic } from "@/lib/education/types";

export const machineLearning: UniversityTopic = {
  slug: "machine-learning",
  series: 2,
  title: "Types of Machine Learning",
  poster: "/education/machine-learning.png",
  posterAlt: "Infographic listing fifteen machine-learning labels",
  summary: "Ways of learning from examples, and the jobs those methods are often asked to do.",
  metaDescription:
    "How supervised, unsupervised, reinforcement, and related learning setups differ — and which labels are tasks rather than training styles.",
  intro:
    "The first five labels describe how a system learns. Several later labels describe the question it is answering, such as 'which category?' or 'which number?'. A classification model is often supervised. A clustering model is often unsupervised. The poster places both kinds of word in one row, so the notes below keep them apart.",
  concepts: [
    {
      slug: "supervised-learning",
      name: "Supervised Learning",
      definition:
        "Supervised learning trains on examples that already have the answer attached. The answer might be a category, a number, or a span of text.",
      mechanism:
        "The model sees inputs and targets, adjusts until its guesses move closer to those targets, and is then checked on examples it did not train on. The labels are the expensive part.",
      practice:
        "Predicting whether a ticket is billing or access, or estimating hours from a job description, starts here when past cases are labeled.",
      limit:
        "Labels that are late, biased, or inconsistently applied teach that inconsistency. The model will not notice a definition the team never agreed on.",
    },
    {
      slug: "unsupervised-learning",
      name: "Unsupervised Learning",
      definition:
        "Unsupervised learning looks for structure in data that has no answer column. It groups, compresses, or flags what stands apart.",
      mechanism:
        "The algorithm defines similarity — distance, density, or a reconstruction error — and organizes records against that definition. A person still names what the groups mean.",
      practice:
        "Sorting a year of support notes into themes before anyone has a taxonomy, or finding accounts that do not resemble their peers.",
      limit:
        "A cluster is not a business category until someone checks it. Unsupervised output is a proposal, not a decision.",
    },
    {
      slug: "semi-supervised-learning",
      name: "Semi-Supervised Learning",
      definition:
        "Semi-supervised learning uses a small set of labeled examples together with a large set of unlabeled ones. It spends labeling effort where it changes the model most.",
      mechanism:
        "The labeled slice anchors the meaning. The unlabeled slice teaches the shape of the data, often by treating confident predictions as temporary labels or by learning a shared representation.",
      practice:
        "A team labels a few hundred emails, then lets the model use thousands of unlabeled ones to stabilize categories.",
      limit:
        "Confident and wrong predictions can spread. Hold out a labeled set that the temporary labels never touch.",
    },
    {
      slug: "self-supervised-learning",
      name: "Self-Supervised Learning",
      definition:
        "Self-supervised learning invents its own practice questions from the data, such as hiding a word or a patch and asking the model to recover it. No one writes an answer key.",
      mechanism:
        "The training signal comes from the input itself. A model that gets good at those puzzles learns features that later tasks can reuse with much less labeling.",
      practice:
        "Large language and vision models are pretrained this way, then adapted to a company task with a smaller supervised set or with instructions.",
      limit:
        "Pretraining does not know your policies. A self-supervised model still needs grounding and review before it speaks for the business.",
    },
    {
      slug: "reinforcement-learning",
      name: "Reinforcement Learning",
      definition:
        "Reinforcement learning improves by trying actions and receiving a reward or a penalty. There is no list of correct moves, only a score for how the sequence turned out.",
      mechanism:
        "An agent observes a state, acts, and updates from the return it gets. The reward function is the real design. A sloppy reward produces a system that games the score.",
      practice:
        "Tuning a control policy, or ranking which next action in a long process led to a completed case, can be framed this way. Most office workflows are still easier as supervised steps plus rules.",
      limit:
        "Reinforcement learning is a training setup. It is also listed later on the algorithms poster as if it were one algorithm. It is a family.",
    },
    {
      slug: "classification",
      name: "Classification",
      definition:
        "Classification assigns an input to one of a known set of categories. It is a task. Supervised learning is the usual way to train it.",
      mechanism:
        "The model outputs a score per class. A threshold or an argmax picks the label. Errors are not equal: missing a fraud case is not the same as a false alarm.",
      practice:
        "Routing mail, tagging a document type, or deciding whether a request is in or out of policy.",
      limit:
        "Do not add a class the business cannot define with examples. 'Other' becomes a junk drawer if the real categories are fuzzy.",
    },
    {
      slug: "regression",
      name: "Regression",
      definition:
        "Regression predicts a number: a duration, a cost, a quantity, a probability. Like classification, it is a task, not a separate school of learning.",
      mechanism:
        "The model maps inputs to a continuous target and is scored on how far the guesses land, often with squared or absolute error. Intervals matter more than a single point when the cost of being off is uneven.",
      practice:
        "Estimating cycle time, expected order size, or how many hours a repeated task consumes.",
      limit:
        "A precise-looking number can rest on a thin history. Publish the range and the cases where the estimate should not be used.",
    },
    {
      slug: "clustering",
      name: "Clustering",
      definition:
        "Clustering groups records that resemble each other, without being told the group names. It is the common unsupervised task.",
      mechanism:
        "An algorithm partitions points by distance or density. The number of groups, or the density cutoff, is a choice. Different choices yield different maps of the same data.",
      practice:
        "Finding types of customers, incidents, or sites before a reporting taxonomy exists.",
      limit:
        "Clusters shift when the similarity measure changes. Name them only after reading members, not from the algorithm's index.",
    },
    {
      slug: "dimensionality-reduction",
      name: "Dimensionality Reduction",
      definition:
        "Dimensionality reduction represents each record with fewer numbers while keeping as much of the useful variation as possible. It is a compression of features, not of the business question.",
      mechanism:
        "Methods such as PCA build new axes that capture shared variance, or neighbor methods that keep local distances. Downstream models or plots use those axes.",
      practice:
        "Making a crowded set of survey answers or sensor readings plottable, or speeding a later model by dropping redundant inputs.",
      limit:
        "The new axes are often hard to explain. If a manager must defend a decision, prefer a smaller set of original fields over an abstract component.",
    },
    {
      slug: "anomaly-detection",
      name: "Anomaly Detection",
      definition:
        "Anomaly detection flags records that do not look like the usual pattern. It is a task that can be unsupervised, supervised, or a simple rule.",
      mechanism:
        "The system learns a picture of normal — a dense region, a reconstruction, a range — and scores how far a new case sits from it. Rare is not the same as bad.",
      practice:
        "Unusual invoices, login patterns, or sensor readings that deserve a person before they become incidents.",
      limit:
        "Alert fatigue kills the value. Tune for the number of reviews the team can actually do.",
    },
    {
      slug: "ensemble-learning",
      name: "Ensemble Learning",
      definition:
        "Ensemble learning combines several models so their disagreements cancel. It is a construction method, usable on classification, regression, and other tasks.",
      mechanism:
        "Bagging trains models on different slices and averages them. Boosting trains each next model on what the previous ones missed. A stack can also learn how to weigh members.",
      practice:
        "Tabular predictions — churn, delay, quote ranges — often improve when a forest or a boosted set replaces one fragile tree.",
      limit:
        "A committee is harder to explain and easier to overfit if the evaluation set leaks into every member. Keep a final check the ensemble never saw.",
    },
    {
      slug: "transfer-learning",
      name: "Transfer Learning",
      definition:
        "Transfer learning reuses a model trained on one task as the starting point for another. The second task needs fewer examples because the first one already taught general features.",
      mechanism:
        "Most of the pretrained network stays fixed or moves slowly, and a smaller head is trained on the new labels. The closer the new job is to the old one, the more that reuse helps.",
      practice:
        "Adapting a document model to your contract types, or a vision model to your product photos, instead of training from scratch.",
      limit:
        "Transfer carries old biases and old blind spots. If the source task never saw your edge cases, the head cannot invent them.",
    },
    {
      slug: "online-learning",
      name: "Online Learning",
      definition:
        "Online learning updates the model as examples arrive, instead of waiting for a full batch rebuild. It fits streams that drift.",
      mechanism:
        "Each new record nudges the parameters. The step size controls how fast yesterday's pattern is forgotten. A frozen copy is kept so a bad day of data can be rolled back.",
      practice:
        "A ranking or a fraud score that must follow a shifting pattern week to week, with a person watching the error rate.",
      limit:
        "Continuous update without a holdout turns the latest anecdote into policy. Drift detection matters as much as the update rule.",
    },
    {
      slug: "active-learning",
      name: "Active Learning",
      definition:
        "Active learning asks people to label the examples that would teach the model the most, rather than a random sample. It spends expert time on the boundary cases.",
      mechanism:
        "The model scores unlabeled items by uncertainty or expected change, a person labels the shortlist, and the model retrains. The loop repeats.",
      practice:
        "Building a document classifier when attorneys or dispatchers can review dozens of cases, not thousands.",
      limit:
        "The model asks about what it finds confusing, which can miss whole regions it has never seen. Seed the pool so every important class appears.",
    },
    {
      slug: "federated-learning",
      name: "Federated Learning",
      definition:
        "Federated learning trains a shared model across separate datasets that are not copied into one place. Each site keeps its raw records.",
      mechanism:
        "Sites compute updates locally and send those updates, not the rows, to be averaged. Privacy still depends on what the updates leak and on the contract around them.",
      practice:
        "A model improved by several organizations that cannot pool customer records, or by devices that should not upload raw logs.",
      limit:
        "Federation is an infrastructure choice. It does not, by itself, make the model accurate, fair, or legal to use.",
    },
  ],
};
