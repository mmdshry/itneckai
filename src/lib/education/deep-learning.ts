import type { UniversityTopic } from "@/lib/education/types";

export const deepLearning: UniversityTopic = {
  slug: "deep-learning",
  series: 3,
  title: "Types of Deep Learning",
  poster: "/education/deep-learning.png",
  posterAlt: "Infographic listing fifteen deep-learning architectures and techniques",
  summary: "Network shapes and a few techniques that use them, from older stacks to transformers and graphs.",
  metaDescription:
    "What CNNs, RNNs, transformers, GANs, and the other labels on a deep-learning map actually do — and which ones are historical.",
  intro:
    "Deep learning means many layers of learned features, not one architecture. This list mixes network families, training tricks, and one application (style transfer). Some entries, such as deep belief networks, matter mostly as history. The notes say what is still the usual tool and what has been superseded.",
  concepts: [
    {
      slug: "cnn",
      name: "Convolutional Neural Network (CNN)",
      definition:
        "A CNN looks at small neighborhoods of an input and reuses the same detector across the whole field. It is the standard starting point for images and other grid-shaped data.",
      mechanism:
        "Filters slide over the input, producing maps of local patterns. Later layers combine those patterns into larger ones. Pooling or strides shrink the map so the network can see more with fewer numbers.",
      practice:
        "Reading a photographed form, spotting a defect on a part, or classifying a scan. The same idea appears inside many vision backbones even when the outer system is a transformer.",
      limit:
        "A CNN does not know the meaning of a scene. It knows textures and shapes it was shown. A new camera angle can be a new problem.",
    },
    {
      slug: "rnn",
      name: "Recurrent Neural Network (RNN)",
      definition:
        "An RNN reads a sequence one step at a time and carries a hidden state forward. That state is its memory of what came before.",
      mechanism:
        "At each step the same cell combines the new input with the previous state. Training through many steps tends to forget early inputs, which is why gated cells replaced plain RNNs for long text.",
      practice:
        "Short sequences — a few sensor readings, a short token stream — can still use a recurrent cell. Most language work moved to transformers.",
      limit:
        "Recurrence is a way to handle order. It is not, by itself, understanding. Long documents exposed the memory limit.",
    },
    {
      slug: "lstm",
      name: "Long Short-Term Memory (LSTM)",
      definition:
        "An LSTM is a recurrent cell with gates that decide what to store, what to forget, and what to expose. It was built so earlier steps could survive a long sequence.",
      mechanism:
        "Input, forget, and output gates are small networks. They scale how much of the previous cell state passes through, which keeps gradients from vanishing as quickly as in a plain RNN.",
      practice:
        "Older speech and translation systems, and some time-series models that must remember an event from much earlier in the window.",
      limit:
        "LSTMs train step by step, so they are slower to scale than attention models. For text, they are usually the legacy choice.",
    },
    {
      slug: "gru",
      name: "Gated Recurrent Unit (GRU)",
      definition:
        "A GRU is a simpler gated recurrent cell than an LSTM. It keeps an update gate and a reset gate instead of a separate memory cell.",
      mechanism:
        "The gates mix the new input with the previous hidden state. Fewer parameters make it cheaper, and on many shorter sequences it matches an LSTM.",
      practice:
        "Compact sequence models where an LSTM is heavier than the data justifies, such as short operational time series.",
      limit:
        "Simpler gates do not remove the sequential bottleneck. A GRU is still a recurrent network, not a transformer.",
    },
    {
      slug: "autoencoder",
      name: "Autoencoder",
      definition:
        "An autoencoder compresses an input into a smaller code and then rebuilds the input from that code. The useful part is often the code, not the reconstruction.",
      mechanism:
        "An encoder narrows the representation. A decoder expands it. Training minimizes the difference between input and reconstruction, so the code must keep whatever the loss cares about.",
      practice:
        "Denoising a signal, detecting anomalies when reconstruction fails, or learning a compact vector for later search.",
      limit:
        "A faithful reconstruction can still ignore the business fact you needed. The loss function decides what 'good' means.",
    },
    {
      slug: "dbn",
      name: "Deep Belief Network (DBN)",
      definition:
        "A deep belief network stacks restricted Boltzmann machines and pretrains them layer by layer. It was an early way to train deep nets before modern recipes took over.",
      mechanism:
        "Each layer learns a representation of the one below, without labels, then the stack can be fine-tuned with labels. The pretraining gave early deep models a usable starting point.",
      practice:
        "You will meet DBNs in papers from the late 2000s more often than in a new business system. Current stacks use backpropagation end to end, usually from a pretrained transformer or CNN.",
      limit:
        "Listing a DBN beside a transformer implies they are peer choices. For a new workflow they are not.",
    },
    {
      slug: "gan",
      name: "Generative Adversarial Network (GAN)",
      definition:
        "A GAN trains two networks against each other: one generates samples, the other tries to tell generated samples from real ones. The generator improves when it fools the critic.",
      mechanism:
        "The discriminator's error teaches the generator. At equilibrium the generator's samples should be hard to distinguish from the training set. Training is famously unstable.",
      practice:
        "Image synthesis and some data-augmentation work. Diffusion and transformer models have taken over much of what GANs were used for in images and media.",
      limit:
        "A GAN learns to imitate a dataset, including its biases and its gaps. It does not retrieve a source of truth.",
    },
    {
      slug: "transformer",
      name: "Transformer Network",
      definition:
        "A transformer uses attention so each token can look at the others directly, instead of carrying a single running memory. It is the architecture behind most current language and many multimodal models.",
      mechanism:
        "Self-attention computes a weighted mix of values from the sequence. Layers of attention and small feed-forward networks stack. Training parallelizes across the sequence, which is why these models scaled.",
      practice:
        "Drafting, summarizing, classifying, and extracting from text. The same block appears in systems that also read images or audio.",
      limit:
        "Attention over a long context is not the same as knowing the company. Without retrieval and review, a transformer fills gaps with plausible text.",
    },
    {
      slug: "rbm",
      name: "Restricted Boltzmann Machine (RBM)",
      definition:
        "A restricted Boltzmann machine is a two-layer energy model that learns a probability distribution over its inputs. DBNs are stacks of them.",
      mechanism:
        "Visible units connect to hidden units, with no connections inside a layer. Training adjusts those weights so likely data has lower energy. It was a building block, not a modern end product.",
      practice:
        "Historical feature learning and some older recommender research. New systems rarely start with an RBM.",
      limit:
        "The poster places RBMs next to transformers. They belong to an earlier toolkit.",
    },
    {
      slug: "dqn",
      name: "Deep Q-Network (DQN)",
      definition:
        "A DQN uses a deep network to estimate the value of each action in a state, so a reinforcement learner can pick the action with the highest expected return.",
      mechanism:
        "The network approximates the Q function. Experience replay and a slowly updated target network keep training from chasing a moving target. The agent still needs a reward and a safe place to practice.",
      practice:
        "Game-playing research and some control problems. Office processes are seldom a clean enough environment to train a DQN against live work.",
      limit:
        "DQN is one reinforcement-learning method, not 'deep learning' as a whole. The algorithms poster repeats that confusion.",
    },
    {
      slug: "sparse-coding",
      name: "Sparse Coding Network",
      definition:
        "Sparse coding represents an input with as few active features as possible. A sparse coding network learns those features so most of them stay off for any one example.",
      mechanism:
        "An objective rewards accurate reconstruction and penalizes dense activations. The result is a dictionary of parts. New inputs are explained by a handful of parts.",
      practice:
        "Signal and image representations where interpretability of parts matters more than raw benchmark score. It is uncommon as the core of a business assistant.",
      limit:
        "Sparsity is a pressure on the representation. It does not name the parts in business language.",
    },
    {
      slug: "neural-style-transfer",
      name: "Neural Style Transfer",
      definition:
        "Neural style transfer renders the content of one image in the visual style of another. It is an application of deep features, not a general architecture.",
      mechanism:
        "A network pretrained for recognition supplies feature maps. An optimization, or a later feed-forward model, matches content features from one image and style statistics from another.",
      practice:
        "Design exploration and illustration. It is a poor tool when the output must stay factually identical to a source document.",
      limit:
        "Style is texture and color statistics. Transferring a painting's look onto a chart does not make the chart more true.",
    },
    {
      slug: "seq2seq",
      name: "Sequence to Sequence (Seq2Seq)",
      definition:
        "Sequence-to-sequence models read an input sequence and write an output sequence that may have a different length. Translation is the classic case.",
      mechanism:
        "An encoder compresses the input. A decoder generates the output step by step, originally from the encoder's final state and later with attention over all encoder states.",
      practice:
        "Translation, summarization, and converting a messy note into a structured record. Modern versions are usually transformers trained as encoder-decoders or as decoders alone.",
      limit:
        "The poster lists seq2seq beside attention and transformers as if they were alternatives. Attention is a mechanism inside many seq2seq models. A transformer is one way to build them.",
    },
    {
      slug: "attention",
      name: "Attention Mechanism",
      definition:
        "Attention lets a model weight which parts of an input matter for the current step, instead of squeezing everything into one vector. It is a component, not a full system.",
      mechanism:
        "Queries ask, keys advertise, and values carry content. The output is a weighted sum of values. Self-attention does this inside one sequence. Cross-attention does it from a decoder to an encoder or a retrieved document.",
      practice:
        "Any current language model, and many systems that must point at the sentence they used. Attention weights are a clue, not a guarantee of a correct citation.",
      limit:
        "High attention on a passage does not mean the passage was understood or that it was the right source.",
    },
    {
      slug: "gnn",
      name: "Graph Neural Network (GNN)",
      definition:
        "A graph neural network computes features on nodes, edges, or whole graphs by passing messages along connections. Use it when the relationships are the data, not an afterthought.",
      mechanism:
        "Each node updates from its neighbors for several rounds. After a few hops, a node has mixed in a local neighborhood. The result can classify a node, predict a link, or score a graph.",
      practice:
        "Fraud rings, dependency maps, molecules, or 'which account is tied to which vendor' when a table of isolated rows would hide the link.",
      limit:
        "A GNN is the wrong default for a pile of documents or a flat spreadsheet. If you cannot draw the edges, you do not have a graph problem yet.",
    },
  ],
};
