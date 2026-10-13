import type { UniversityTopic } from "@/lib/education/types";

export const generativeAi: UniversityTopic = {
  slug: "generative-ai",
  series: 5,
  title: "Types of Generative AI",
  poster: "/education/generative-ai.png",
  posterAlt: "Infographic listing fifteen generative AI output types",
  summary: "What these systems emit — text, media, code, records — and the overlaps hiding in the last five labels.",
  metaDescription:
    "A business reading of generative AI outputs, from text and code to synthetic data, and why text-to-image is not a separate kind of intelligence.",
  intro:
    "Every item here is an output type. Text-to-image is image generation with a text prompt. Text-to-video and text-to-3D are the same pattern. Multimodal generation is the umbrella, not a later stage. The useful question is which artifact your workflow needs, who checks it, and which source it must not contradict.",
  concepts: [
    {
      slug: "text-generation",
      name: "Text Generation",
      definition:
        "Text generation writes new language: a draft, a summary, a classification stated in words, or a structured note. The words are new. The facts should not be.",
      mechanism:
        "A language model continues from a prompt and, when the job requires it, from retrieved passages. Sampling chooses likely next tokens. Instructions and examples steer tone and shape.",
      practice:
        "First drafts of replies, meeting notes turned into tasks, and plain-language versions of a policy paragraph a person will edit.",
      limit:
        "Fluent text is not a source. If the sentence must match a contract, a price, or a law, the generator has to be tied to that source and reviewed.",
    },
    {
      slug: "image-generation",
      name: "Image Generation",
      definition:
        "Image generation synthesizes a picture from a prompt, a sketch, or another image. It invents pixels that fit a description.",
      mechanism:
        "Diffusion models, GANs, or transformers learn the statistics of images and then sample a new one conditioned on text or on a reference. The result can look finished while depicting something that never existed.",
      practice:
        "Concept art, marketing variations, and empty-state illustrations. Not evidence, not a photo of your site, not a diagram of a real process unless a person built that diagram.",
      limit:
        "Text-to-image, listed later, is this same job. The extra label does not add a capability.",
    },
    {
      slug: "video-generation",
      name: "Video Generation",
      definition:
        "Video generation produces a moving sequence, either from a prompt or by extending still images across time. Motion and consistency are the hard parts.",
      mechanism:
        "The model must keep objects, lighting, and identity stable from frame to frame while changing what the prompt asks to change. Longer clips multiply the chances of a drift.",
      practice:
        "Short explanatory clips or storyboards. A generated clip is not a recording of a procedure your team follows.",
      limit:
        "Text-to-video is the prompted version of this, not a different technology family.",
    },
    {
      slug: "audio-generation",
      name: "Audio Generation",
      definition:
        "Audio generation creates sound that is not speech and not necessarily music: effects, atmospheres, or other waveforms. The poster splits this from music and speech.",
      mechanism:
        "A model samples a waveform or a spectrogram conditioned on a description or a reference clip. Quality is judged by ear and by whether the sound is licensed to resemble a source.",
      practice:
        "Rough sound beds for a product demo. Rarely the bottleneck in an operations workflow.",
      limit:
        "The border with music and speech is production convenience. A voice note is speech. A scored cue is music. The model class does not track that business distinction cleanly.",
    },
    {
      slug: "music-generation",
      name: "Music Generation",
      definition:
        "Music generation writes musical material: melody, harmony, rhythm, or a full arrangement. It is audio generation aimed at music.",
      mechanism:
        "Models learn patterns from recordings or symbolic scores and sample new material in a requested style. Style imitation is the feature and the rights problem.",
      practice:
        "Temp tracks and ideation. A published piece still needs a rights check a model cannot give you.",
      limit:
        "Do not treat a generated cue as cleared because no human composer was in the room.",
    },
    {
      slug: "speech-generation",
      name: "Speech Generation",
      definition:
        "Speech generation turns text into spoken audio, or transforms one voice performance into another. It is the synthesis half of speech AI.",
      mechanism:
        "A model maps text, and sometimes a target voice, to a waveform. Cloning a voice takes a sample of that voice and enough care about consent.",
      practice:
        "Readouts of a report, training narration, or a consistent voice for an internal demo. Callers should know when they are hearing a synthetic voice.",
      limit:
        "A generated voice can say false words convincingly. The script still needs an owner.",
    },
    {
      slug: "code-generation",
      name: "Code Generation",
      definition:
        "Code generation writes or edits source code from a description, a failing test, or the surrounding file. The output is text that a toolchain must accept.",
      mechanism:
        "A model trained on code predicts the next tokens, guided by the repository context and by tests. Compilation, tests, and review are the real checks. The model does not run your business rules unless you execute them.",
      practice:
        "Boilerplate, migrations, and a first pass at a function a developer will read. It saves typing. It does not remove responsibility for what ships.",
      limit:
        "Generated code can look idiomatic and still be wrong, insecure, or licensed from a source you did not intend to copy.",
    },
    {
      slug: "3d-generation",
      name: "3D Generation",
      definition:
        "3D generation produces geometry, a scene, or an asset a 3D tool can open, from a prompt, an image, or a scan. It is not a photograph and not a measured survey unless the pipeline says so.",
      mechanism:
        "Models predict meshes, voxels, or neural fields, sometimes lifting a single image into an approximate shape. Fine structure and scale are the usual failures.",
      practice:
        "Early product visualization and placeholder assets. Engineering dimensions still come from CAD and measurement.",
      limit:
        "Text-to-3D, the last item on the poster, is this job started from words.",
    },
    {
      slug: "synthetic-data-generation",
      name: "Synthetic Data Generation",
      definition:
        "Synthetic data generation creates artificial records that stand in for real ones, for testing, training, or sharing when the real rows cannot move.",
      mechanism:
        "Rules, simulations, or generative models sample rows that match chosen statistics. Privacy depends on whether those rows can be tied back to a person. Usefulness depends on whether the important rare cases were included.",
      practice:
        "Load tests, demo environments, and training a model when real labeled data is scarce — after someone checks that the synthetic set still contains the failures you care about.",
      limit:
        "A dataset that looks realistic can omit the exception that costs money. Synthetic data does not replace a holdout of real cases.",
    },
    {
      slug: "document-generation",
      name: "Document Generation",
      definition:
        "Document generation fills a contract, a report, a proposal, or a form so the result is a file the business recognizes. It is text generation plus a template and a source of facts.",
      mechanism:
        "A template holds the structure. Fields come from systems of record. A model may draft the unbound prose. The merge step should not let the model overwrite a figure that came from the ledger.",
      practice:
        "Statements of work, recurring reports, and packets assembled from the same inputs every time.",
      limit:
        "If the document creates an obligation, a person accountable for that obligation reviews it. Generation speeds the assembly. It does not sign.",
    },
    {
      slug: "ai-assisted-design",
      name: "AI-Assisted Design",
      definition:
        "AI-assisted design proposes layouts, variants, or components inside a design process a person still directs. The model offers options. The designer decides.",
      mechanism:
        "Prompts, constraints, and brand rules condition image, layout, or vector suggestions. The tool is useful when iteration is cheap and the acceptance criteria are visual and explicit.",
      practice:
        "Exploring campaign layouts or interface variations before a designer commits. Brand and accessibility checks stay manual.",
      limit:
        "This overlaps image generation and document generation. The distinguishing piece is the human loop, not a separate kind of model.",
    },
    {
      slug: "multimodal-generation",
      name: "Multimodal Generation",
      definition:
        "Multimodal generation takes more than one kind of input or emits more than one kind of output — text and image, image and audio, a document and a diagram. It is the category that contains several of the rows around it.",
      mechanism:
        "A shared model, or a pipeline of models, maps between modalities. Alignment is the risk: the caption can describe a picture the pixels do not show.",
      practice:
        "A report that drafts the paragraph and a chart from the same table, with the chart numbers locked to the table.",
      limit:
        "Multimodal is not more intelligent. It is more ways to be inconsistently wrong. Check each modality against the source.",
    },
    {
      slug: "text-to-image",
      name: "Text-to-Image Generation",
      definition:
        "Text-to-image generation is image generation conditioned on a written prompt. It is a subset of image generation, repeated here as its own box.",
      mechanism:
        "The prompt is encoded and used to steer the image sampler. Extra controls — a sketch, a depth map, a product photo — narrow what the words leave ambiguous.",
      practice:
        "Illustrations where no photograph exists and none is being claimed. Always label the image as generated when a viewer might think it is evidence.",
      limit:
        "The words 'text-to-image' do not add a review step. The review step is still required.",
    },
    {
      slug: "text-to-video",
      name: "Text-to-Video Generation",
      definition:
        "Text-to-video generation is video generation started from a written prompt, sometimes plus a starting frame. It is the prompted case of video generation.",
      mechanism:
        "The model extends a scene through time under the prompt. Identity, text on screen, and physics drift as the clip gets longer.",
      practice:
        "A short concept clip for a pitch. Not a training record of how a job is done, unless people filmed that job.",
      limit:
        "Seeing it as item 14 after item 03 double-counts one capability.",
    },
    {
      slug: "text-to-3d",
      name: "Text-to-3D Generation",
      definition:
        "Text-to-3D generation is 3D generation started from a description. The output is an approximate asset, not a measured model.",
      mechanism:
        "Text conditions a 3D representation, often by way of image views that are then lifted into geometry. Fine mechanical detail is usually wrong.",
      practice:
        "Placeholder objects in a scene while a real model is built. Do not send the mesh to manufacturing.",
      limit:
        "It repeats 3D generation. Use whichever label your team already understands, and do not buy both as if they were different products.",
    },
  ],
};
