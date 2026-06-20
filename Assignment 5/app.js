
const STORAGE_KEY = "inkwell_posts_v1";
const LIKES_KEY = "inkwell_likes_v1";

function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through */ }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
  return [...SEED_POSTS];
}
function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
function loadLikedSet() {
  const raw = localStorage.getItem(LIKES_KEY);
  try { return new Set(JSON.parse(raw) || []); } catch (e) { return new Set(); }
}
function saveLikedSet(set) {
  localStorage.setItem(LIKES_KEY, JSON.stringify([...set]));
}

let posts = loadPosts();
let likedSet = loadLikedSet();
let editingPostId = null;
let activeCategory = "all";


function uid() { return "p" + Math.random().toString(36).slice(2, 9); }

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function catLabel(id) {
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.label : id;
}

function estimateReadTime(html) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function plainExcerpt(html, len = 140) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > len ? text.slice(0, len).trim() + "…" : text;
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2400);
}

function catIcon(name, size = 20) {
  const icons = {
    code: `<path d="M7 5L2 10l5 5M13 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    pen: `<path d="M4 16l1-4L14 3l3 3-9 9-4 1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>`,
    compass: `<circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M13 7l-2 5-4 1 2-5 4-1z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" fill="none"/>`,
    leaf: `<path d="M5 15c-1-6 4-11 11-11 1 7-4 11-11 11z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><path d="M5 15l6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    cup: `<path d="M4 4h10v6a5 5 0 01-10 0V4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><path d="M14 6h1.5a2 2 0 010 4H14" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
    book: `<path d="M4 4.5h5a2 2 0 012 2v9a2 2 0 00-2-1.5H4V4.5zM16 4.5h-5a2 2 0 00-2 2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>`,
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none">${icons[name] || icons.book}</svg>`;
}

function navigate(route, param) {
  window.scrollTo({ top: 0, behavior: "instant" });
  closeMobileMenu();
  closeSearch();
  render(route, param);
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.classList.toggle("active", a.dataset.route === route);
  });
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-route]");
  if (link) {
    e.preventDefault();
    navigate(link.dataset.route, link.dataset.param);
  }
});

function renderHome() {
  const app = document.getElementById("app");
  const published = posts.filter(p => p.status === "published");
  const featured = published.find(p => p.featured) || published[0];
  const rest = published.filter(p => p.id !== (featured && featured.id));
  const drafts = posts.filter(p => p.status === "draft");

  const catPills = ["all", ...CATEGORIES.map(c => c.id)].map(id => {
    const label = id === "all" ? "All stories" : catLabel(id);
    return `<button class="cat-pill ${activeCategory === id ? "active" : ""}" data-cat="${id}">${label}</button>`;
  }).join("");

  app.innerHTML = `
    <section class="hero page-enter">
      <div class="hero-grid">
        <div>
          <div class="hero-eyebrow">CMS-style blog platform · final project</div>
          <h1 class="hero-title">Words worth<br/><em>slowing down</em> for.</h1>
          <p class="hero-desc">Inkwell is a small publishing platform — write, edit, organize by category, and read distraction-free. Built to demonstrate a full content lifecycle, end to end.</p>
        </div>
        <div class="hero-side">
          <div class="hero-stats">
            <div>
              <div class="hero-stat-num">${published.length}</div>
              <div class="hero-stat-label">Published stories</div>
            </div>
            <div>
              <div class="hero-stat-num">${CATEGORIES.length}</div>
              <div class="hero-stat-label">Categories</div>
            </div>
            <div>
              <div class="hero-stat-num">${drafts.length}</div>
              <div class="hero-stat-label">Drafts in progress</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="wrap">
      <div class="cat-row" id="catRow">${catPills}</div>
    </div>

    ${featured ? `
    <section class="featured">
      <div class="wrap">
        <div class="featured-card" data-route="article" data-param="${featured.id}">
          <div class="featured-img">
            <img src="${featured.cover}" alt="${featured.title}" />
            <span class="featured-tag">Featured</span>
          </div>
          <div>
            <div class="featured-meta">${catLabel(featured.category)}<span class="dot"></span>${fmtDate(featured.date)}<span class="dot"></span>${featured.readTime} min read</div>
            <h2 class="featured-title">${featured.title}</h2>
            <p class="featured-excerpt">${featured.excerpt}</p>
            <div class="featured-author">
              <div class="avatar">${initials(featured.author)}</div>
              <div>
                <div class="author-name">${featured.author}</div>
                <div class="author-role">${featured.authorRole}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>` : ""}

    <section class="posts-section">
      <div class="wrap">
        <div class="section-head">
          <h2 class="section-title">${activeCategory === "all" ? "Latest stories" : catLabel(activeCategory)}</h2>
          <span class="section-count" id="postCount"></span>
        </div>
        <div id="postGrid"></div>
      </div>
    </section>
  `;

  document.getElementById("catRow").addEventListener("click", e => {
    const btn = e.target.closest(".cat-pill");
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    renderHome();
  });

  renderPostGrid();
}

function renderPostGrid() {
  const grid = document.getElementById("postGrid");
  const countEl = document.getElementById("postCount");
  if (!grid) return;

  let list = posts.filter(p => p.status === "published");
  const featuredId = (list.find(p => p.featured) || list[0] || {}).id;
  if (activeCategory === "all") {
    list = list.filter(p => p.id !== featuredId);
  } else {
    list = list.filter(p => p.category === activeCategory);
  }
  list = list.sort((a, b) => new Date(b.date) - new Date(a.date));

  countEl.textContent = `${list.length} ${list.length === 1 ? "story" : "stories"}`;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M12 8h24v32H12z" stroke="currentColor" stroke-width="1.5"/><path d="M18 18h12M18 24h12M18 30h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <h3>Nothing here yet</h3>
        <p>No published stories in this category.</p>
        <button class="btn-write" style="margin:0 auto" data-route="editor">Write the first one</button>
      </div>`;
    return;
  }

  grid.className = "post-grid";
  grid.innerHTML = list.map(p => `
    <article class="post-card" data-route="article" data-param="${p.id}">
      <div class="post-thumb"><img src="${p.cover}" alt="${p.title}" loading="lazy" /></div>
      <span class="post-cat">${catLabel(p.category)}</span>
      <h3 class="post-title">${p.title}</h3>
      <p class="post-excerpt">${p.excerpt}</p>
      <div class="post-foot">${p.author}<span class="dot"></span>${fmtDate(p.date)}<span class="dot"></span>${p.readTime} min</div>
    </article>
  `).join("");
}

function renderCategories() {
  const app = document.getElementById("app");
  const published = posts.filter(p => p.status === "published");

  app.innerHTML = `
    <section class="hero page-enter" style="padding-bottom:2.5rem">
      <div class="wrap">
        <div class="hero-eyebrow">Browse</div>
        <h1 class="hero-title" style="font-size:clamp(2.2rem,4.5vw,3.6rem)">Find your <em>next read</em></h1>
        <p class="hero-desc">Stories organized by topic — from technology to slow travel.</p>
      </div>
    </section>
    <div class="wrap">
      <div class="cat-page-grid">
        ${CATEGORIES.map(c => {
          const count = published.filter(p => p.category === c.id).length;
          return `
          <div class="cat-card" data-route="category-detail" data-param="${c.id}">
            <div class="cat-card-icon">${catIcon(c.icon, 22)}</div>
            <div class="cat-card-title">${c.label}</div>
            <div class="cat-card-count">${count} ${count === 1 ? "story" : "stories"}</div>
          </div>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderCategoryDetail(catId) {
  activeCategory = catId;
  navigate("home");
}

function renderArticle(postId) {
  const app = document.getElementById("app");
  const post = posts.find(p => p.id === postId);
  if (!post) {
    app.innerHTML = `<div class="wrap"><div class="empty-state"><h3>Story not found</h3><p>It may have been removed.</p><button class="btn-write" style="margin:0 auto" data-route="home">Back home</button></div></div>`;
    return;
  }

  const related = posts
    .filter(p => p.status === "published" && p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const isLiked = likedSet.has(post.id);

  app.innerHTML = `
    <article class="article-hero page-enter">
      <div class="wrap">
        <span class="back-link" data-route="home">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L3 7l6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Back to stories
        </span>
        <div class="article-meta-top">
          ${post.status === "draft" ? '<span style="color:var(--rust)">Draft</span><span>·</span>' : ""}
          ${catLabel(post.category)}
        </div>
        <h1 class="article-title">${post.title}</h1>
        ${post.sub ? `<p class="article-sub">${post.sub}</p>` : ""}
        <div class="article-byline">
          <div class="byline-left">
            <div class="avatar">${initials(post.author)}</div>
            <div>
              <div class="author-name">${post.author}</div>
              <div class="author-role">${post.authorRole} · ${fmtDate(post.date)} · ${post.readTime} min read</div>
            </div>
          </div>
          <div class="byline-right">
            <button class="action-btn" data-route="editor" data-param="${post.id}">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 1.5l3 3L4 13H1v-3l8.5-8.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
              Edit
            </button>
          </div>
        </div>
        <div class="article-cover"><img src="${post.cover}" alt="${post.title}" /></div>
      </div>
    </article>
    <div class="article-body">${post.body}</div>
    <div class="article-actions">
      <button class="action-btn like ${isLiked ? "active" : ""}" id="likeBtn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="${isLiked ? "currentColor" : "none"}"><path d="M7 12.5S1.5 9 1.5 5.2A2.7 2.7 0 017 3.5a2.7 2.7 0 015.5 1.7C12.5 9 7 12.5 7 12.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
        <span id="likeCount">${post.likes}</span>
      </button>
      <button class="action-btn danger" id="deleteBtn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 4h9M5.5 4V2.5h3V4M3.5 4l.5 8h6l.5-8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Delete story
      </button>
      ${post.status === "draft" ? `<button class="action-btn" id="publishBtn" style="color:var(--forest);border-color:var(--forest)">Publish now</button>` : ""}
    </div>
    ${related.length ? `
    <div class="related">
      <div class="section-head"><h2 class="section-title">More in ${catLabel(post.category)}</h2></div>
      <div class="post-grid">
        ${related.map(p => `
          <article class="post-card" data-route="article" data-param="${p.id}">
            <div class="post-thumb"><img src="${p.cover}" alt="${p.title}" loading="lazy" /></div>
            <span class="post-cat">${catLabel(p.category)}</span>
            <h3 class="post-title">${p.title}</h3>
            <p class="post-excerpt">${p.excerpt}</p>
            <div class="post-foot">${p.author}<span class="dot"></span>${fmtDate(p.date)}</div>
          </article>
        `).join("")}
      </div>
    </div>` : ""}
  `;

  document.getElementById("likeBtn").addEventListener("click", () => {
    if (likedSet.has(post.id)) {
      likedSet.delete(post.id);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      likedSet.add(post.id);
      post.likes += 1;
    }
    saveLikedSet(likedSet);
    savePosts(posts);
    renderArticle(postId);
  });

  document.getElementById("deleteBtn").addEventListener("click", () => {
    if (confirm(`Delete "${post.title}"? This can't be undone.`)) {
      posts = posts.filter(p => p.id !== post.id);
      savePosts(posts);
      toast("Story deleted");
      navigate("home");
    }
  });

  const publishBtn = document.getElementById("publishBtn");
  if (publishBtn) {
    publishBtn.addEventListener("click", () => {
      post.status = "published";
      savePosts(posts);
      toast("Story published");
      renderArticle(postId);
    });
  }
}

function renderEditor(postId) {
  const app = document.getElementById("app");
  editingPostId = postId || null;
  const existing = editingPostId ? posts.find(p => p.id === editingPostId) : null;

  const draft = existing ? { ...existing } : {
    id: uid(), title: "", sub: "", body: "", category: CATEGORIES[0].id,
    author: "Shubham", authorRole: "Contributing Writer",
    cover: COVER_OPTIONS[0], status: "draft", date: new Date().toISOString().slice(0, 10),
    readTime: 1, likes: 0, featured: false,
  };

  app.innerHTML = `
    <div class="editor-wrap page-enter">
      <div class="editor-head">
        <span class="editor-eyebrow">${existing ? "Editing story" : "New story"}</span>
        <div class="editor-actions">
          <button class="btn-ghost-sm" id="saveDraftBtn">Save draft</button>
          <button class="btn-publish" id="publishStoryBtn">Publish</button>
        </div>
      </div>

      <div class="field">
        <input type="text" id="titleInput" placeholder="Your story title…" value="${draft.title}" />
        <input type="text" id="subInput" placeholder="Add a one-line subtitle (optional)" value="${draft.sub || ""}" />
      </div>

      <div class="editor-meta-row">
        <div>
          <span class="field-label">Category</span>
          <select id="catSelect">
            ${CATEGORIES.map(c => `<option value="${c.id}" ${draft.category === c.id ? "selected" : ""}>${c.label}</option>`).join("")}
          </select>
        </div>
        <div>
          <span class="field-label">Author</span>
          <input type="text" class="text-input" id="authorInput" value="${draft.author}" />
        </div>
        <div>
          <span class="field-label">Author role</span>
          <input type="text" class="text-input" id="roleInput" value="${draft.authorRole}" />
        </div>
      </div>

      <div class="field">
        <span class="field-label">Cover image</span>
        <div class="cover-picker" id="coverPicker">
          ${COVER_OPTIONS.map((url, i) => `
            <div class="cover-opt ${draft.cover === url ? "active" : ""}" data-cover="${url}">
              <img src="${url}" alt="Cover option ${i + 1}" />
            </div>`).join("")}
        </div>
      </div>

      <div class="field">
        <span class="field-label">Story body</span>
        <div class="toolbar">
          <button type="button" class="tb-btn" data-cmd="bold" title="Bold">B</button>
          <button type="button" class="tb-btn" data-cmd="italic" title="Italic" style="font-style:italic">i</button>
          <span class="tb-sep"></span>
          <button type="button" class="tb-btn" data-cmd="h2" title="Heading">H2</button>
          <button type="button" class="tb-btn" data-cmd="quote" title="Quote">"</button>
          <span class="tb-sep"></span>
          <button type="button" class="tb-btn" data-cmd="ul" title="Bullet list">•</button>
        </div>
        <textarea id="bodyInput" placeholder="Write your story. Select text and use the toolbar, or write plain paragraphs separated by blank lines.">${draft.bodyRaw || (existing ? htmlToRaw(draft.body) : "")}</textarea>
      </div>

      <div class="editor-foot">
        <span id="wordCountLabel">0 words</span>
        <span>Autosaves as draft on save</span>
      </div>
    </div>
  `;

  let selectedCover = draft.cover;
  document.getElementById("coverPicker").addEventListener("click", e => {
    const opt = e.target.closest(".cover-opt");
    if (!opt) return;
    selectedCover = opt.dataset.cover;
    document.querySelectorAll(".cover-opt").forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
  });

  const bodyInput = document.getElementById("bodyInput");
  const wordLabel = document.getElementById("wordCountLabel");
  function updateWordCount() {
    const words = bodyInput.value.trim().split(/\s+/).filter(Boolean).length;
    wordLabel.textContent = `${words} word${words === 1 ? "" : "s"} · ~${Math.max(1, Math.round(words / 200))} min read`;
  }
  bodyInput.addEventListener("input", updateWordCount);
  updateWordCount();

  document.querySelectorAll(".tb-btn").forEach(btn => {
    btn.addEventListener("click", () => applyToolbarCmd(btn.dataset.cmd, bodyInput));
  });

  function collectForm(status) {
    const title = document.getElementById("titleInput").value.trim();
    const bodyRaw = bodyInput.value.trim();
    if (!title) { toast("Give your story a title first"); return null; }
    if (!bodyRaw) { toast("Your story needs some words"); return null; }
    const bodyHtml = rawToHtml(bodyRaw);
    return {
      ...draft,
      title,
      sub: document.getElementById("subInput").value.trim(),
      category: document.getElementById("catSelect").value,
      author: document.getElementById("authorInput").value.trim() || "Anonymous",
      authorRole: document.getElementById("roleInput").value.trim() || "Contributor",
      cover: selectedCover,
      body: bodyHtml,
      bodyRaw,
      excerpt: plainExcerpt(bodyHtml),
      readTime: estimateReadTime(bodyHtml),
      status,
      date: existing ? draft.date : new Date().toISOString().slice(0, 10),
    };
  }

  document.getElementById("saveDraftBtn").addEventListener("click", () => {
    const result = collectForm("draft");
    if (!result) return;
    upsertPost(result);
    toast("Saved as draft");
    navigate("article", result.id);
  });

  document.getElementById("publishStoryBtn").addEventListener("click", () => {
    const result = collectForm("published");
    if (!result) return;
    upsertPost(result);
    toast("Story published");
    navigate("article", result.id);
  });
}

function upsertPost(post) {
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx >= 0) posts[idx] = post; else posts.unshift(post);
  savePosts(posts);
}

/* Simple raw-text <-> light markup helpers for the editor */
function rawToHtml(raw) {
  return raw.split(/\n{2,}/).map(block => {
    block = block.trim();
    if (!block) return "";
    if (block.startsWith("## ")) return `<h2>${block.slice(3)}</h2>`;
    if (block.startsWith("> ")) return `<blockquote>${block.slice(2)}</blockquote>`;
    if (block.startsWith("- ")) {
      const items = block.split("\n").map(l => `<li>${l.replace(/^- /, "")}</li>`).join("");
      return `<ul>${items}</ul>`;
    }
    let inline = block
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
    return `<p>${inline}</p>`;
  }).join("\n");
}
function htmlToRaw(html) {
  return html
    .replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n")
    .replace(/<blockquote>(.*?)<\/blockquote>/g, "> $1\n\n")
    .replace(/<ul>(.*?)<\/ul>/gs, (m, inner) => inner.replace(/<li>(.*?)<\/li>/g, "- $1\n") + "\n")
    .replace(/<\/?strong>/g, "**")
    .replace(/<\/?em>/g, "*")
    .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
    .trim();
}
function applyToolbarCmd(cmd, textarea) {
  const start = textarea.selectionStart, end = textarea.selectionEnd;
  const sel = textarea.value.slice(start, end) || "text";
  let wrapped;
  if (cmd === "bold") wrapped = `**${sel}**`;
  else if (cmd === "italic") wrapped = `*${sel}*`;
  else if (cmd === "h2") wrapped = `\n\n## ${sel}\n\n`;
  else if (cmd === "quote") wrapped = `\n\n> ${sel}\n\n`;
  else if (cmd === "ul") wrapped = `\n\n- ${sel}\n- item two\n\n`;
  textarea.setRangeText(wrapped, start, end, "end");
  textarea.focus();
  textarea.dispatchEvent(new Event("input"));
}

function renderAbout() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="about-hero page-enter">
      <div class="wrap">
        <h1>Built to demonstrate a real <em>content lifecycle.</em></h1>
        <p>Inkwell is a final web development project: a self-contained CMS-style blog platform covering creation, editing, organization, and reading — without a backend server.</p>
      </div>
    </section>
    <div class="wrap">
      <div class="about-grid">
        <div class="about-feature">
          <div class="about-feature-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10.5 2.5l3 3L5 14H2v-3l8.5-8.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg></div>
          <h3>Write & edit</h3>
          <p>A distraction-free editor with a lightweight formatting toolbar, live word count, and reading-time estimate.</p>
        </div>
        <div class="about-feature">
          <div class="about-feature-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></div>
          <h3>Organize & find</h3>
          <p>Six categories, instant client-side search across titles, authors, and excerpts, and category landing pages.</p>
        </div>
        <div class="about-feature">
          <div class="about-feature-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10s2.5-5.5 7-5.5S17 10 17 10s-2.5 5.5-7 5.5S3 10 3 10z" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="10" r="2" stroke="currentColor" stroke-width="1.4"/></svg></div>
          <h3>Publish & manage</h3>
          <p>Draft and published states, likes, deletion with confirmation — the full lifecycle of a piece of content.</p>
        </div>
      </div>
    </div>
    <div class="wrap">
      <div class="tech-section">
        <div class="hero-eyebrow">Under the hood</div>
        <h2 class="section-title" style="margin-bottom:.5rem">Stack & approach</h2>
        <p style="color:var(--ink-soft);max-width:600px">No frameworks, no build step — vanilla HTML, CSS and JavaScript with a small client-side router and <code>localStorage</code> standing in for a database, so the whole CMS lifecycle works without a backend.</p>
        <div class="tech-list">
          <span class="tech-chip">HTML5</span>
          <span class="tech-chip">CSS3 (Grid + Flexbox)</span>
          <span class="tech-chip">Vanilla JavaScript</span>
          <span class="tech-chip">localStorage persistence</span>
          <span class="tech-chip">Client-side routing</span>
          <span class="tech-chip">Responsive design</span>
        </div>
      </div>
    </div>
  `;
}

function render(route, param) {
  if (route === "home") renderHome();
  else if (route === "categories") renderCategories();
  else if (route === "category-detail") renderCategoryDetail(param);
  else if (route === "article") renderArticle(param);
  else if (route === "editor") renderEditor(param);
  else if (route === "about") renderAbout();
  else renderHome();
}

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

function openSearch() {
  searchPanel.classList.add("open");
  setTimeout(() => searchInput.focus(), 200);
}
function closeSearch() {
  searchPanel.classList.remove("open");
  searchInput.value = "";
  searchResults.innerHTML = "";
}
document.getElementById("searchToggle").addEventListener("click", () => {
  searchPanel.classList.contains("open") ? closeSearch() : openSearch();
});
document.getElementById("searchClose").addEventListener("click", closeSearch);

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.innerHTML = ""; return; }
  const results = posts.filter(p =>
    p.status === "published" && (
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      catLabel(p.category).toLowerCase().includes(q)
    )
  ).slice(0, 8);

  if (results.length === 0) {
    searchResults.innerHTML = `<div class="search-empty">No stories match "${searchInput.value}"</div>`;
    return;
  }
  searchResults.innerHTML = results.map(p => `
    <div class="search-result-item" data-route="article" data-param="${p.id}">
      <span class="sr-title">${p.title}</span>
      <span class="sr-cat">${catLabel(p.category)}</span>
    </div>
  `).join("");
});

document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); openSearch(); }
  if (e.key === "Escape") closeSearch();
});

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
function closeMobileMenu() {
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("open");
}
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

navigate("home");
