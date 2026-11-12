import sanitize, { type IOptions } from "sanitize-html";

/**
 * Central HTML sanitizer for every dynamic `dangerouslySetInnerHTML` sink
 * (TinyMCE rich text, Markdown previews, CMS-provided HTML).
 *
 * - Isomorphic: no Node-only APIs, deterministic (same input -> same output), so it is
 *   safe to call in server components, client components (SSR + hydration) and the browser.
 * - Allowlist tuned to what TinyMCE / the app's rich-text features emit, including the
 *   `data-ms-*` hooks that RichTextWithEmbeddedModals relies on.
 * - Everything not listed here (script, style, object, embed, form, input, svg, meta, link,
 *   base, on* handlers, srcdoc, javascript:/vbscript:/data: URLs, ...) is removed.
 */

/** Iframes are only kept for these hosts (see src/lib/video-embed.ts). */
export const ALLOWED_IFRAME_HOSTNAMES = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
  // Embed yang lazim dipakai editor / sudah dipakai situs ini (Microsoft Forms, Power BI, Google).
  // Tambahkan host lain di sini bila ada embed sah yang ikut terhapus.
  "forms.cloud.microsoft",
  "forms.office.com",
  "forms.microsoft.com",
  "app.powerbi.com",
  "www.google.com",
  "maps.google.com",
  "docs.google.com",
];

const ALLOWED_TAGS = [
  // structure / text
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr", "wbr",
  "div", "span", "section", "article", "aside", "header", "footer", "main", "nav", "address",
  "blockquote", "pre", "code", "kbd", "samp", "var",
  "strong", "b", "em", "i", "u", "s", "strike", "del", "ins", "sub", "sup", "mark", "small",
  "abbr", "cite", "q", "time", "dfn", "bdi", "bdo", "ruby", "rt", "rp", "font",
  "details", "summary",
  // lists
  "ul", "ol", "li", "dl", "dt", "dd",
  // links / media
  "a", "img", "picture", "source", "figure", "figcaption",
  "video", "audio", "track", "iframe",
  // tables
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
  // inert (no <form> ancestor survives, so it cannot submit anything)
  "button",
];

// `src`/`href` style attributes are scheme-checked via allowedSchemesAppliedToAttributes.
const GLOBAL_ATTRS = [
  "class",
  "style",
  "id",
  "title",
  "lang",
  "dir",
  "role",
  "aria-*",
  // App hooks (data-ms-form-url, data-ms-download-*, data-section-id, ...) and
  // TinyMCE's data-mce-* attributes.
  "data-*",
];

const CSS_LENGTH = "-?(?:\\d+|\\d*\\.\\d+)(?:px|em|rem|%|pt|vh|vw|vmin|vmax|ch|ex|cm|mm|in)?";
const CSS_COLOR =
  "(?:#[0-9a-f]{3,8}|[a-z]+|(?:rgb|rgba|hsl|hsla)\\([\\d\\s.,%\\/-]+\\))";

const lengthOrKeyword = (...keywords: string[]) =>
  new RegExp(
    `^(?:${CSS_LENGTH}${keywords.length ? `|${keywords.join("|")}` : ""})$`,
    "i",
  );
const lengthList = new RegExp(
  `^(?:\\s*(?:${CSS_LENGTH}|auto|inherit)\\s*){1,4}$`,
  "i",
);
const colorValue = new RegExp(`^${CSS_COLOR}$`, "i");
// Parentheses are only ever accepted inside rgb()/hsl(); url(), expression(),
// var(), calc(), attr(), image-set() etc. cannot match.
const borderValue = new RegExp(
  `^(?:\\s*(?:${CSS_LENGTH}|${CSS_COLOR})\\s*)+$`,
  "i",
);
const keyword = (...values: string[]) =>
  new RegExp(`^(?:${values.join("|")})$`, "i");
const FONT_FAMILY = /^[\w\s,'"-]+$/;

const ALLOWED_STYLES: NonNullable<IOptions["allowedStyles"]> = {
  "*": {
    // color
    color: [colorValue],
    "background-color": [colorValue],
    // colour-only shorthand; anything with url()/gradient() fails the colour pattern
    background: [colorValue],
    // typography
    "font-size": [
      lengthOrKeyword(
        "xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large",
        "smaller", "larger", "inherit",
      ),
    ],
    "font-weight": [keyword("normal", "bold", "bolder", "lighter", "[1-9]00", "inherit")],
    "font-style": [keyword("normal", "italic", "oblique", "inherit")],
    "font-family": [FONT_FAMILY],
    "line-height": [lengthOrKeyword("normal", "inherit")],
    "letter-spacing": [lengthOrKeyword("normal", "inherit")],
    "word-spacing": [lengthOrKeyword("normal", "inherit")],
    "text-align": [keyword("left", "right", "center", "justify", "start", "end", "inherit")],
    "text-decoration": [/^(?:\s*(?:none|underline|overline|line-through|solid|double|dotted|dashed|wavy|#[0-9a-f]{3,8}|[a-z]+|(?:rgb|rgba|hsl|hsla)\([\d\s.,%/-]+\)))+\s*$/i],
    "text-decoration-line": [/^(?:\s*(?:none|underline|overline|line-through))+\s*$/i],
    "text-decoration-color": [colorValue],
    "text-decoration-style": [keyword("solid", "double", "dotted", "dashed", "wavy")],
    "text-indent": [lengthOrKeyword("inherit")],
    "text-transform": [keyword("none", "capitalize", "uppercase", "lowercase")],
    "white-space": [keyword("normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces")],
    "vertical-align": [
      lengthOrKeyword(
        "baseline", "sub", "super", "top", "text-top", "middle", "bottom", "text-bottom",
      ),
    ],
    direction: [keyword("ltr", "rtl")],
    // box model
    margin: [lengthList],
    "margin-top": [lengthOrKeyword("auto")],
    "margin-right": [lengthOrKeyword("auto")],
    "margin-bottom": [lengthOrKeyword("auto")],
    "margin-left": [lengthOrKeyword("auto")],
    padding: [lengthList],
    "padding-top": [lengthOrKeyword()],
    "padding-right": [lengthOrKeyword()],
    "padding-bottom": [lengthOrKeyword()],
    "padding-left": [lengthOrKeyword()],
    width: [lengthOrKeyword("auto", "fit-content", "min-content", "max-content", "inherit")],
    height: [lengthOrKeyword("auto", "fit-content", "min-content", "max-content", "inherit")],
    "min-width": [lengthOrKeyword("auto", "none")],
    "min-height": [lengthOrKeyword("auto", "none")],
    "max-width": [lengthOrKeyword("none", "inherit")],
    "max-height": [lengthOrKeyword("none", "inherit")],
    float: [keyword("left", "right", "none", "inherit")],
    clear: [keyword("left", "right", "both", "none")],
    display: [
      keyword(
        "block", "inline", "inline-block", "none", "table", "table-cell", "table-row",
        "list-item", "flex", "inline-flex",
      ),
    ],
    overflow: [keyword("visible", "hidden", "auto", "scroll")],
    "box-sizing": [keyword("border-box", "content-box")],
    opacity: [/^(?:0|1|0?\.\d+)$/],
    "aspect-ratio": [/^\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?$/],
    "word-break": [keyword("normal", "break-all", "keep-all", "break-word")],
    "overflow-wrap": [keyword("normal", "break-word", "anywhere")],
    // simple flex layout helpers (no grid, no position)
    gap: [lengthList],
    "row-gap": [lengthOrKeyword()],
    "column-gap": [lengthOrKeyword()],
    "flex-direction": [keyword("row", "row-reverse", "column", "column-reverse")],
    "flex-wrap": [keyword("nowrap", "wrap", "wrap-reverse")],
    "justify-content": [
      keyword("flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly", "start", "end"),
    ],
    "align-items": [keyword("flex-start", "flex-end", "center", "baseline", "stretch", "start", "end")],
    "align-self": [keyword("auto", "flex-start", "flex-end", "center", "baseline", "stretch")],
    "flex-grow": [/^\d+(?:\.\d+)?$/],
    "flex-shrink": [/^\d+(?:\.\d+)?$/],
    "object-fit": [keyword("fill", "contain", "cover", "none", "scale-down")],
    // borders (no `background`/`background-image`: those can carry url())
    border: [borderValue],
    "border-top": [borderValue],
    "border-right": [borderValue],
    "border-bottom": [borderValue],
    "border-left": [borderValue],
    "border-color": [borderValue],
    "border-width": [borderValue],
    "border-style": [borderValue],
    "border-top-color": [colorValue],
    "border-right-color": [colorValue],
    "border-bottom-color": [colorValue],
    "border-left-color": [colorValue],
    "border-top-width": [lengthOrKeyword("thin", "medium", "thick")],
    "border-right-width": [lengthOrKeyword("thin", "medium", "thick")],
    "border-bottom-width": [lengthOrKeyword("thin", "medium", "thick")],
    "border-left-width": [lengthOrKeyword("thin", "medium", "thick")],
    "border-top-style": [borderValue],
    "border-right-style": [borderValue],
    "border-bottom-style": [borderValue],
    "border-left-style": [borderValue],
    "border-radius": [lengthList],
    "border-collapse": [keyword("collapse", "separate")],
    "border-spacing": [lengthList],
    // lists / tables
    "list-style-type": [
      keyword(
        "none", "disc", "circle", "square", "decimal", "decimal-leading-zero",
        "lower-roman", "upper-roman", "lower-alpha", "upper-alpha", "lower-latin",
        "upper-latin", "lower-greek",
      ),
    ],
    "table-layout": [keyword("auto", "fixed")],
  },
};

const MEDIA_ATTRS = [
  "src", "controls", "autoplay", "loop", "muted", "playsinline", "preload",
  "width", "height", "poster",
];
const ALIGN_ATTRS = ["align", "valign", "bgcolor", "width", "height"];

const IMG_DATA_URL =
  /^data:image\/(?:png|jpe?g|gif|webp|avif|bmp|x-icon|svg\+xml);base64,[a-z0-9+/=\s]+$/i;

// `allowedEmptyAttributes` exists at runtime (v2.1x) but is missing from @types/sanitize-html.
export const SANITIZE_HTML_OPTIONS: IOptions & { allowedEmptyAttributes?: string[] } = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    "*": GLOBAL_ATTRS,
    a: ["href", "target", "rel", "name", "hreflang", "download"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding", "align"],
    picture: [],
    source: ["src", "srcset", "sizes", "type", "media"],
    video: MEDIA_ATTRS,
    audio: MEDIA_ATTRS,
    track: ["src", "kind", "srclang", "label", "default"],
    iframe: [
      "src", "width", "height", "title", "allow", "allowfullscreen", "frameborder",
      "loading", "referrerpolicy", "scrolling",
    ],
    table: ["border", "cellpadding", "cellspacing", "summary", ...ALIGN_ATTRS],
    thead: ["align", "valign"],
    tbody: ["align", "valign"],
    tfoot: ["align", "valign"],
    tr: ["align", "valign", "bgcolor", "height"],
    th: ["colspan", "rowspan", "scope", "headers", "abbr", ...ALIGN_ATTRS],
    td: ["colspan", "rowspan", "headers", ...ALIGN_ATTRS],
    col: ["span", ...ALIGN_ATTRS],
    colgroup: ["span", ...ALIGN_ATTRS],
    ol: ["start", "type", "reversed"],
    ul: ["type"],
    li: ["value", "type"],
    p: ["align"],
    div: ["align"],
    h1: ["align"],
    h2: ["align"],
    h3: ["align"],
    h4: ["align"],
    h5: ["align"],
    h6: ["align"],
    font: ["color", "size", "face"],
    time: ["datetime"],
    q: ["cite"],
    blockquote: ["cite"],
    details: ["open"],
    button: ["type", "disabled"],
    bdo: ["dir"],
  },
  allowedStyles: ALLOWED_STYLES,
  // http(s)/mailto/tel only; relative URLs and #hash links are always allowed.
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowedSchemesAppliedToAttributes: [
    "href", "src", "cite", "poster",
    // Opened in an <iframe> by MicrosoftFormModal: must never be javascript:/data:.
    "data-ms-form-url",
  ],
  allowProtocolRelative: true,
  allowedIframeHostnames: ALLOWED_IFRAME_HOSTNAMES,
  allowIframeRelativeUrls: false,
  allowedEmptyAttributes: ["alt", "allowfullscreen", "controls", "autoplay", "loop", "muted", "playsinline", "open", "default", "reversed", "disabled"],
  // Drop <script>/<style>/<textarea>/<option> including their text content.
  nonTextTags: ["script", "style", "textarea", "option", "noscript"],
  // An <iframe> whose src was rejected (host not allowlisted, javascript:, relative, ...)
  // would otherwise survive as an empty frame; drop it entirely.
  exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
  transformTags: {
    a: (tagName, attribs) => {
      const next = { ...attribs };
      if (next.target && next.target.toLowerCase() === "_blank") {
        const tokens = new Set(
          (next.rel ?? "").split(/\s+/).filter(Boolean),
        );
        tokens.add("noopener");
        tokens.add("noreferrer");
        next.rel = Array.from(tokens).join(" ");
      }
      return { tagName, attribs: next };
    },
    img: (tagName, attribs) => {
      const next = { ...attribs };
      // data: is only acceptable for real raster/svg-as-image payloads (never text/html).
      if (typeof next.src === "string" && /^\s*data:/i.test(next.src)) {
        if (!IMG_DATA_URL.test(next.src.trim())) delete next.src;
      }
      if (typeof next.srcset === "string" && /data:/i.test(next.srcset)) {
        delete next.srcset;
      }
      return { tagName, attribs: next };
    },
  },
};

/**
 * Sanitizes an HTML string for rendering via `dangerouslySetInnerHTML`.
 * Accepts anything: non-strings (null/undefined/numbers/objects) yield "".
 */
export function sanitizeHtml(html: unknown): string {
  if (typeof html !== "string" || html === "") return "";
  // Fast path: without "<" or "&" no element/entity can be created, so the string is
  // inert text and a parse/serialize round trip would be a no-op.
  if (html.indexOf("<") === -1 && html.indexOf("&") === -1) return html;
  return sanitize(html, SANITIZE_HTML_OPTIONS);
}
