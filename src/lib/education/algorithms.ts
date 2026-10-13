import type { UniversityTopic } from "@/lib/education/types";

export const algorithms: UniversityTopic = {
  slug: "algorithms",
  series: 4,
  title: "Types of AI/ML Algorithms",
  poster: "/education/algorithms.png",
  posterAlt: "Infographic listing fifteen machine-learning algorithms and families",
  summary: "Concrete algorithms, plus two names — reinforcement learning and deep learning — that are whole families.",
  metaDescription:
    "What linear models, trees, boosting, clustering, and neural nets do in practice, and why two labels on this list are not single algorithms.",
  intro:
    "Most of these names are specific methods you can train on a table of examples. The last two are not. Reinforcement learning is a way of learning from reward. Deep learning is a family of networks. They sit on this poster because the chart is a sampler, not a classification.",
  concepts: [
    {
      slug: "linear-regression",
      name: "Linear Regression",
      definition:
        "Linear regression predicts a number as a weighted sum of the inputs, plus a constant. The relationship it can draw is a straight line, or a flat plane in more dimensions.",
      mechanism:
        "Training finds weights that shrink the gap between predicted and actual values. Coefficients show the direction and size of each input's association, if the inputs are not standing in for each other.",
      practice:
        "A first estimate of cost, duration, or volume when you suspect a roughly straight relationship and you need an explanation a manager can read.",
      limit:
        "Curves, cliffs, and interactions bend away from a line. If the residual plot is a smile, the linear model is the wrong shape.",
    },
    {
      slug: "logistic-regression",
      name: "Logistic Regression",
      definition:
        "Logistic regression predicts the probability of a class, even though the name says regression. A cutoff turns that probability into a yes or no.",
      mechanism:
        "A weighted sum is passed through a logistic curve so the output stays between 0 and 1. Training pushes probability toward the observed class. Coefficients remain readable.",
      practice:
        "Will this invoice need review? Will this lead reply? It is a strong baseline before any heavier model.",
      limit:
        "It still assumes a linear score. If the classes are tangled, a tree or a boosted model may separate them when a line cannot.",
    },
    {
      slug: "decision-tree",
      name: "Decision Tree",
      definition:
        "A decision tree asks a sequence of yes/no questions about the inputs and ends in a prediction. You can draw the whole path.",
      mechanism:
        "Each split chooses a field and a threshold that makes the child groups purer. Growth stops at a depth or a leaf size so the tree does not memorize noise.",
      practice:
        "Eligibility checks and simple risk sorts where the team must see the rule, not only the score.",
      limit:
        "A single tree is jumpy: a small data change can rewrite the questions. Forests and boosting exist because of that.",
    },
    {
      slug: "random-forest",
      name: "Random Forest",
      definition:
        "A random forest averages many trees trained on different samples and different subsets of fields. The average is more stable than any one tree.",
      mechanism:
        "Bagging plus random feature choices makes the trees disagree. For regression their votes are averaged. For classification the majority, or the average probability, wins.",
      practice:
        "Tabular prediction when a single tree is too brittle and a linear model is too stiff: delays, demand, simple risk scores.",
      limit:
        "You can explain one tree and you can rank which fields the forest used. You cannot honestly narrate 'the rule' as if the forest were one path.",
    },
    {
      slug: "gradient-boosting",
      name: "Gradient Boosting",
      definition:
        "Gradient boosting builds trees one after another, each trained to correct the errors left by the ones before it. The sum is the model.",
      mechanism:
        "The next tree fits the gradient of the loss, a picture of where the current ensemble is wrong. A small learning rate and shallow trees keep any one step from dominating.",
      practice:
        "Structured business data — pricing support, propensity, operational estimates — where accuracy matters and the rows are tables, not raw text or images.",
      limit:
        "Boosting will fit noise if you let it run. Early stopping on a set it has not trained on is part of the method, not an extra.",
    },
    {
      slug: "xgboost",
      name: "XGBoost",
      definition:
        "XGBoost is a specific, heavily engineered gradient-boosting library. It is not a different idea from boosting. It is a fast, regularized implementation that won a lot of tabular contests.",
      mechanism:
        "It grows trees with a regularized objective, handles missing values with a learned default direction, and parallelizes the split search. You still choose depth, learning rate, and the number of rounds.",
      practice:
        "The same tabular jobs as gradient boosting, when the team wants a mature tool with predictable training behavior.",
      limit:
        "The logo on a poster is not a reason to skip a linear baseline. If the linear model is close, the extra complexity may not be worth explaining.",
    },
    {
      slug: "svm",
      name: "Support Vector Machine (SVM)",
      definition:
        "A support vector machine finds a boundary that separates classes with the widest margin it can. Points nearest the boundary — the support vectors — define it.",
      mechanism:
        "In the original space the boundary is linear. A kernel maps the points so a linear boundary there corresponds to a curve in the original features. The fit depends on only the points near the edge.",
      practice:
        "Small or medium classification sets with a clear margin, including some text tasks before neural encoders became cheap.",
      limit:
        "Training cost and fiddly kernels made SVMs less common once boosted trees and neural nets scaled more easily. The geometry is still a good way to think about separation.",
    },
    {
      slug: "knn",
      name: "K-Nearest Neighbors (KNN)",
      definition:
        "K-nearest neighbors predicts from the closest known examples. There is no separate training step beyond storing the data.",
      mechanism:
        "A distance — often scaled Euclidean — finds the k nearest rows. Their average, or their majority class, is the prediction. The choice of k and of the distance is the whole model.",
      practice:
        "A quick check of 'what did similar past cases do?' when the table is not huge and similarity is meaningful after scaling.",
      limit:
        "Distance falls apart in many dimensions, and every prediction scans the history. It is a poor default once the table is large or the fields are mixed types.",
    },
    {
      slug: "naive-bayes",
      name: "Naive Bayes",
      definition:
        "Naive Bayes estimates the class from how likely the evidence is under each class, with a simplifying assumption that the fields are independent given the class.",
      mechanism:
        "It multiplies per-field likelihoods and the class prior, then normalizes. The independence assumption is usually false and often good enough for a fast baseline, especially with word counts.",
      practice:
        "Spam and other text filters, or a first pass at document type, when you want something small and inspectable.",
      limit:
        "Correlated clues get counted twice. Do not treat the probability as calibrated just because the formula produces a number between 0 and 1.",
    },
    {
      slug: "k-means",
      name: "K-Means Clustering",
      definition:
        "K-means partitions points into k groups by placing a center in each group and assigning every point to the nearest center. You choose k.",
      mechanism:
        "Centers start somewhere, points join the closest center, centers move to the mean of their members, and the loop repeats until assignments settle. Different starts can settle in different places.",
      practice:
        "A first cut of customers, sites, or behaviors into a handful of buckets you will then read by hand.",
      limit:
        "K-means wants round, similar-sized blobs and is pulled by outliers. Uneven or winding groups need a different clustering method.",
    },
    {
      slug: "dbscan",
      name: "DBSCAN Clustering",
      definition:
        "DBSCAN groups points that have enough neighbors nearby and marks isolated points as noise. It does not ask you for the number of groups.",
      mechanism:
        "A point is a core if at least a minimum number of points lie within a radius. Clusters grow by connecting core points. Anything left over is noise.",
      practice:
        "Finding dense pockets in incidents or locations, and ignoring the stray points that k-means would force into a group.",
      limit:
        "One radius does not fit clusters of different densities. The parameters are still a choice, just not the choice named k.",
    },
    {
      slug: "pca",
      name: "Principal Component Analysis (PCA)",
      definition:
        "PCA rotates the data onto new axes that capture the largest variations first. Later axes can be dropped when they add little.",
      mechanism:
        "The axes are the eigenvectors of the covariance. Each record becomes a set of scores on those axes. The first components are the directions the data already stretches.",
      practice:
        "Compressing many correlated measurements before a plot or a downstream model, or seeing whether a few directions dominate.",
      limit:
        "Variance is not importance. A rare but critical field can be the small component PCA throws away. The axes are also mixtures, so they are awkward to explain.",
    },
    {
      slug: "ann",
      name: "Artificial Neural Network (ANN)",
      definition:
        "An artificial neural network is a stack of simple units that combine inputs and pass the result through a nonlinearity. 'ANN' on this poster means the basic feed-forward kind, not every deep model.",
      mechanism:
        "Each layer computes weighted sums and activates them. Backpropagation assigns blame for the error and updates the weights. Depth and width decide what shapes the network can fit.",
      practice:
        "A small network on tabular or signal data when linear models underfit and a tree ensemble is not the house style. Large language and vision systems are neural networks too, but they are not this diagram.",
      limit:
        "The poster separates ANN from deep learning as items 13 and 15. Deep learning is neural networks with many layers. The split is historical, not a clean technical border.",
    },
    {
      slug: "reinforcement-learning",
      name: "Reinforcement Learning",
      definition:
        "Reinforcement learning is a training setup in which a system learns actions from reward, not a single algorithm with one implementation.",
      mechanism:
        "Methods under this name include Q-learning, policy gradients, and actor-critic variants. Each defines how experience updates a policy. The reward design dominates the outcome.",
      practice:
        "Control and sequencing problems with a simulator or a very cheap real-world trial. Most back-office work is better specified as labeled examples plus approval rules.",
      limit:
        "It also appears on the machine-learning poster. Seeing it here as 'an algorithm' next to k-means overstates how plug-and-play it is.",
    },
    {
      slug: "deep-learning",
      name: "Deep Learning",
      definition:
        "Deep learning is the use of neural networks with many layers. It is a family of models, covered on its own map, not one algorithm you select from a dropdown.",
      mechanism:
        "Layers learn features from raw inputs — pixels, tokens, waveforms — so less of the representation is hand-built. Training needs data, compute, and a task-specific check.",
      practice:
        "Language, vision, and speech products. For a modest table of business columns, a linear model or a boosted tree is often the better first tool.",
      limit:
        "Putting deep learning last on an algorithm chart suggests it is the upgrade path. It is the right tool when the input is unstructured or the pattern is too tangled for the simpler methods above.",
    },
  ],
};
