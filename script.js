const profilePath = "./content/profile.md";
const aboutPath = "./content/about.md";
const groupPath = "./content/group.md";
const publicationsPath = "./content/publications.md";
const honorsPath = "./content/honors.md";

async function fetchText(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.text();
}

function splitFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, body: markdown.trim() };
  }

  return {
    data: parseYamlLike(match[1]),
    body: match[2].trim()
  };
}

function parseYamlLike(source) {
  const result = {};
  const lines = source.split("\n");
  let currentKey = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r/g, "");
    if (!line.trim()) {
      continue;
    }

    if (/^\s*-\s+/.test(line) && currentKey) {
      result[currentKey].push(line.replace(/^\s*-\s+/, "").trim());
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyValueMatch) {
      continue;
    }

    const [, key, value] = keyValueMatch;
    if (value === "") {
      currentKey = key;
      result[currentKey] = [];
    } else {
      currentKey = null;
      result[key] = value.trim();
    }
  }

  return result;
}

function parseProfile(markdown) {
  const { data, body } = splitFrontmatter(markdown);
  return {
    name: data.name || "Your Name",
    navLabel: data.navLabel || data.name || "Home",
    portrait: data.portrait || "./assets/profile-placeholder.svg",
    roles: data.roles || [],
    emails: data.emails || [],
    links: data.links || [],
    note: data.note || "",
    updated: data.updated || "",
    body
  };
}

function parseLinkLine(line) {
  const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!match) {
    return null;
  }

  return { label: match[1], url: match[2] };
}

function renderProfile(profile) {
  document.title = profile.name;
  document.querySelector("#nav-home-link").textContent = profile.navLabel;
  document.querySelector("#header-text-name").textContent = profile.name;
  document.querySelector("#portrait").src = profile.portrait;
  document.querySelector("#portrait").alt = `${profile.name} portrait`;

  const roles = document.querySelector("#header-roles");
  roles.innerHTML = profile.roles
    .map((role) => `<div class="header-text-desc">${role}</div>`)
    .join("");

  const emails = document.querySelector("#header-emails");
  emails.innerHTML = profile.emails
    .map((email) => `<div><a href="mailto:${email}">${email}</a></div>`)
    .join("");

  const links = document.querySelector("#header-links");
  links.innerHTML = profile.links
    .map((line) => {
      const link = parseLinkLine(line);
      if (!link) {
        return "";
      }

      const icon = iconForLink(link.label);
      return `${icon}<a href="${link.url}"> ${link.label}</a>`;
    })
    .filter(Boolean)
    .join(" / ");

  document.querySelector("#about-note").innerHTML = profile.note
    ? marked.parseInline(profile.note)
    : "";
  document.querySelector("#last-updated").textContent = profile.updated
    ? `Last updated: ${profile.updated}`
    : "";
}

function iconForLink(label) {
  if (/scholar/i.test(label)) {
    return '<i class="fas fa-graduation-cap" aria-hidden="true"></i>';
  }

  if (/x|twitter/i.test(label)) {
    return '<i class="fab fa-twitter" aria-hidden="true"></i>';
  }

  if (/github/i.test(label)) {
    return '<i class="fab fa-github" aria-hidden="true"></i>';
  }

  return '<i class="fas fa-link" aria-hidden="true"></i>';
}

function renderMarkdown(selector, markdown, extraClass = "") {
  const element = document.querySelector(selector);
  element.classList.remove("loading-copy");
  if (extraClass) {
    element.classList.add(extraClass);
  }
  element.innerHTML = marked.parse(markdown);
}

function parsePublications(markdown) {
  const { data, body } = splitFrontmatter(markdown);
  const entries = body
    .split(/\n##\s+/)
    .map((chunk, index) => {
      const normalized = index === 0 ? chunk.replace(/^##\s+/, "") : chunk;
      const lines = normalized.trim().split("\n").filter(Boolean);
      if (!lines.length) {
        return null;
      }

      const title = lines.shift().trim();
      const meta = {};
      const descriptionLines = [];

      for (const line of lines) {
        const keyValueMatch = line.match(/^([A-Za-z]+):\s*(.*)$/);
        if (keyValueMatch) {
          meta[keyValueMatch[1].toLowerCase()] = keyValueMatch[2].trim();
        } else {
          descriptionLines.push(line);
        }
      }

      return {
        title,
        venue: meta.venue || "",
        authors: meta.authors || "",
        media: meta.media || "",
        links: meta.links || "",
        note: meta.note || "",
        description: descriptionLines.join("\n")
      };
    })
    .filter(Boolean);

  return { intro: data.intro || "", subtitle: data.subtitle || "", entries };
}

function extractMarkdownImage(markdown) {
  const match = markdown.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (!match) {
    return null;
  }

  return { alt: match[1], src: match[2] };
}

function renderPublicationIntro(intro, subtitle) {
  const parts = [];
  if (subtitle) {
    parts.push(`<div>${marked.parseInline(subtitle)}</div>`);
  }
  if (intro) {
    parts.push(`<div>${marked.parseInline(intro)}</div>`);
  }
  const element = document.querySelector("#publication-intro");
  element.classList.remove("loading-copy");
  element.innerHTML = parts.join("<br>");
}

function renderPublications(entries) {
  const container = document.querySelector("#publications-list");
  container.innerHTML = entries
    .map((entry) => {
      const media = extractMarkdownImage(entry.media);
      const mediaHtml = media
        ? `<img src="${media.src}" alt="${media.alt}" class="img-fluid paper-image">`
        : '<img src="./assets/publication-placeholder.svg" alt="Publication preview" class="img-fluid paper-image">';

      const linkHtml = entry.links
        .split(/\s+/)
        .map((token) => parseLinkLine(token))
        .filter(Boolean)
        .map((link) => `<a href="${link.url}">[${link.label}]</a>`)
        .join("\n                        ");

      const noteHtml = entry.note
        ? `<div class="paper-highlight publication-note">${marked.parseInline(entry.note)}</div>`
        : "";

      return `
        <div class="row publication-row">
          <div class="col-sm-4 publication-media">
            ${mediaHtml}
          </div>
          <div class="col-sm-8 publication-copy">
            <div class="paper-title">${entry.title}</div>
            <div class="paper-desc">${marked.parseInline(entry.venue)}</div>
            <div class="paper-author">${marked.parseInline(entry.authors)}</div>
            <div>${linkHtml}</div>
            ${noteHtml}
          </div>
        </div>
      `;
    })
    .join("");
}

function groupMarkdownToResearchList(markdown) {
  const lines = markdown.split("\n");
  const entries = [];
  const trailing = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (/^-\s+/.test(line)) {
      if (current) {
        entries.push(current);
      }
      current = [line.replace(/^-\s+/, "").trim()];
      continue;
    }

    if (current && (rawLine.startsWith("  ") || rawLine.startsWith("\t") || line === "")) {
      if (line) {
        current.push(line.trim());
      }
      continue;
    }

    if (current) {
      entries.push(current);
      current = null;
    }

    if (line) {
      trailing.push(line);
    }
  }

  if (current) {
    entries.push(current);
  }

  const listHtml = entries
    .map((entry) => {
      const [title, ...meta] = entry;
      const metaLines = meta
        .map((line) => `<div class="meta-line">${marked.parseInline(line)}</div>`)
        .join("");
      return `<li><div>${marked.parseInline(title)}</div>${metaLines}</li>`;
    })
    .join("");

  const trailingHtml = trailing.length ? marked.parse(trailing.join("\n")) : "";
  return `<ul class="research-list">${listHtml}</ul>${trailingHtml}`;
}

async function init() {
  try {
    const [profileRaw, aboutRaw, groupRaw, publicationsRaw, honorsRaw] = await Promise.all([
      fetchText(profilePath),
      fetchText(aboutPath),
      fetchText(groupPath),
      fetchText(publicationsPath),
      fetchText(honorsPath)
    ]);

    const profile = parseProfile(profileRaw);
    renderProfile(profile);
    const aboutData = splitFrontmatter(aboutRaw);
    renderMarkdown("#about-content", aboutData.body);

    const groupElement = document.querySelector("#group-content");
    groupElement.classList.remove("loading-copy");
    groupElement.innerHTML = groupMarkdownToResearchList(groupRaw);

    const publicationData = parsePublications(publicationsRaw);
    renderPublicationIntro(publicationData.intro, publicationData.subtitle);
    renderPublications(publicationData.entries);
    renderMarkdown("#honors-content", honorsRaw);
  } catch (error) {
    const message = `Failed to load site content: ${error.message}`;
    document.querySelector("#about-content").textContent = message;
    document.querySelector("#group-content").textContent = message;
    document.querySelector("#publication-intro").textContent = message;
    document.querySelector("#honors-content").textContent = message;
  }
}

init();
