const CATEGORIES = [
  { id: "tech", label: "Technology", icon: "code" },
  { id: "design", label: "Design", icon: "pen" },
  { id: "travel", label: "Travel", icon: "compass" },
  { id: "life", label: "Life & Thought", icon: "leaf" },
  { id: "food", label: "Food", icon: "cup" },
  { id: "culture", label: "Culture", icon: "book" },
];

const COVER_OPTIONS = [
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80",
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=900&q=80",
  "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=900&q=80",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?w=900&q=80",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=900&q=80",
];

const SEED_POSTS = [
  {
    id: "p1",
    title: "The Quiet Discipline of Writing Every Day",
    sub: "Why consistency beats inspiration, and how a blank page stops being terrifying.",
    excerpt: "There's a particular kind of fear that comes from facing a blank page. Most writers never talk about it honestly — they talk around it.",
    body: `<p>There's a particular kind of fear that comes from facing a blank page. Most writers never talk about it honestly — they talk around it, dress it up as "writer's block," and wait for inspiration to rescue them.</p>
    <p>But inspiration is unreliable. It shows up on its own schedule, usually right after you've given up for the day. The writers who actually finish things — who ship books, articles, essays — rarely wait for it.</p>
    <h2>Showing up beats waiting</h2>
    <p>What separates a working writer from someone who dreams of writing is not talent. It's the willingness to sit down on a day when nothing feels worth saying, and write four hundred mediocre words anyway.</p>
    <blockquote>You can't edit a blank page. But you can edit a bad one.</blockquote>
    <p>This is the entire secret. Bad drafts are raw material. Blank pages are nothing. The discipline isn't about forcing brilliance on command — it's about producing something, anything, that future-you can shape into something worth reading.</p>
    <h2>Build a small, boring ritual</h2>
    <p>The same coffee. The same chair. The same fifteen minutes before the rest of the day intrudes. Rituals aren't superstition — they're a signal to your brain that it's time to work, removing the friction of deciding whether today is "a writing day."</p>
    <p>Eventually the question stops being whether you feel like writing. It becomes simply: what page am I on.</p>`,
    category: "life",
    author: "Maya Chen",
    authorRole: "Staff Writer",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80",
    status: "published",
    date: "2026-05-12",
    readTime: 4,
    likes: 128,
    featured: true,
  },
  {
    id: "p2",
    title: "Designing for Trust: Lessons from Fintech Interfaces",
    sub: "Small interface decisions that make people feel safe handing over their money.",
    excerpt: "Trust in software isn't built with a single hero shot. It's built in increments — through copy, through timing, through what you choose not to show.",
    body: `<p>Trust in software isn't built with a single hero shot. It's built in increments — through copy, through timing, through what you choose not to show.</p>
    <p>When we redesigned our payments flow, the biggest lift in conversion didn't come from a new color palette. It came from removing a confirmation step that felt redundant to us but felt reassuring to users.</p>
    <h2>Friction is sometimes the feature</h2>
    <p>Conventional wisdom says reduce friction everywhere. But in financial products, a small amount of friction at the right moment — a confirmation screen before an irreversible action — signals competence, not clumsiness.</p>
    <h2>Words carry more weight than color</h2>
    <p>We spent weeks debating button colors and almost no time on the copy beside them. That ordering was backwards. "Your payment is encrypted and reversible for 24 hours" does more for trust than any shade of blue.</p>
    <p>Design systems are good at consistency. They are not automatically good at empathy. That part still requires sitting with real users and watching where their cursor hesitates.</p>`,
    category: "design",
    author: "Rohan Mehta",
    authorRole: "Product Designer",
    cover: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=900&q=80",
    status: "published",
    date: "2026-05-08",
    readTime: 6,
    likes: 94,
    featured: true,
  },
  {
    id: "p3",
    title: "What Static Site Generators Get Right",
    sub: "A practical case for boring technology in 2026.",
    excerpt: "Every few months a new framework promises to fix the problems of the last one. Meanwhile, static files keep quietly working.",
    body: `<p>Every few months a new framework promises to fix the problems of the last one. Meanwhile, static files keep quietly working — served from a CDN edge, costing almost nothing, breaking almost never.</p>
    <p>For content that doesn't need to be regenerated on every request, static generation remains one of the best trade-offs in web engineering: instant loads, trivial caching, and a deploy story that fits in one command.</p>
    <h2>When dynamic rendering actually pays for itself</h2>
    <p>Personalization, real-time data, and heavy interactivity are real reasons to reach for server rendering or client-side frameworks. But a surprising amount of the web doesn't need any of that — and pretending it does adds complexity for no user benefit.</p>
    <p>Pick boring technology where boring technology solves the problem. Save the complexity budget for the parts of the product that actually need it.</p>`,
    category: "tech",
    author: "Maya Chen",
    authorRole: "Staff Writer",
    cover: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=900&q=80",
    status: "published",
    date: "2026-04-29",
    readTime: 5,
    likes: 76,
    featured: false,
  },
  {
    id: "p4",
    title: "Three Weeks on the Konkan Coast, Slowly",
    sub: "A travelogue about doing almost nothing, on purpose.",
    excerpt: "We didn't plan an itinerary. We picked a coastline and let each day decide itself — fishing villages, empty beaches, and a lot of coconut water.",
    body: `<p>We didn't plan an itinerary. We picked a coastline and let each day decide itself — fishing villages, empty beaches, and a lot of coconut water.</p>
    <p>Most travel writing is about doing as much as possible. This is the opposite kind of story: about staying in one small town for four days because the chai stall owner remembered our order, and that felt like enough of a reason.</p>
    <h2>The places without a name on the map</h2>
    <p>Some of the best afternoons happened in villages too small for the map app to label. A fisherman taught us how to read tide patterns by the color of the water. None of it was efficient. All of it was worth it.</p>
    <p>If you're used to checklist travel, the Konkan coast asks you to unlearn it. Go slow, stay longer than feels productive, and let boredom do some of the work.</p>`,
    category: "travel",
    author: "Ishaan Verma",
    authorRole: "Contributing Writer",
    cover: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=900&q=80",
    status: "published",
    date: "2026-04-21",
    readTime: 7,
    likes: 152,
    featured: false,
  },
  {
    id: "p5",
    title: "The Case for Cooking the Same Five Meals",
    sub: "Why a small, mastered repertoire beats a Pinterest board of recipes you'll never make.",
    excerpt: "Somewhere along the way, home cooking became a performance of variety. Five meals, made well and often, might be the better answer.",
    body: `<p>Somewhere along the way, home cooking became a performance of variety. Recipe apps reward novelty. But there's a quieter, more useful skill: knowing five meals so well you barely think while making them.</p>
    <h2>Mastery over menu</h2>
    <p>A dal you've made eighty times is better than a recipe you've followed once. Repetition builds intuition — when to add salt by feel, how long is "long enough" for onions to actually caramelize.</p>
    <p>Pick five dishes that cover your week. Learn them properly. The variety can come from what you pair them with, not from chasing a new recipe every night.</p>`,
    category: "food",
    author: "Ananya Iyer",
    authorRole: "Contributing Writer",
    cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80",
    status: "published",
    date: "2026-04-15",
    readTime: 4,
    likes: 61,
    featured: false,
  },
  {
    id: "p6",
    title: "Reading Slowly in a Skimming Culture",
    sub: "On the disappearing art of finishing a book without checking your phone.",
    excerpt: "We've gotten remarkably good at skimming and remarkably bad at sitting with a single paragraph long enough to actually think about it.",
    body: `<p>We've gotten remarkably good at skimming and remarkably bad at sitting with a single paragraph long enough to actually think about it.</p>
    <p>Slow reading isn't about reading less. It's about reading with your full attention parked in one place, instead of split across a feed running in the background of your mind.</p>
    <h2>A small experiment</h2>
    <p>Try one chapter, phone in another room. Notice how long it takes for your mind to start reaching for a phantom notification. That itch is the thing slow reading is training you out of.</p>`,
    category: "culture",
    author: "Rohan Mehta",
    authorRole: "Product Designer",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80",
    status: "published",
    date: "2026-04-02",
    readTime: 5,
    likes: 88,
    featured: false,
  },
  {
    id: "p7",
    title: "Notes on Building a Component Library Nobody Hates",
    sub: "Draft — figuring out the right framing for this one.",
    excerpt: "Most internal design systems end up either too rigid or too loose. There's a narrow path between the two that actually gets adopted.",
    body: `<p>Most internal design systems end up either too rigid or too loose. There's a narrow path between the two that actually gets adopted by the teams it's meant to serve.</p>
    <p>This one's still rough — more notes than essay right now.</p>`,
    category: "tech",
    author: "Maya Chen",
    authorRole: "Staff Writer",
    cover: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=900&q=80",
    status: "draft",
    date: "2026-05-18",
    readTime: 3,
    likes: 0,
    featured: false,
  },
];
