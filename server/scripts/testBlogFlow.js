/**
 * E2E TEST — PlutoAstro Blog Management flow
 * Create → Save (MongoDB) → Publish → Homepage Latest Blogs →
 * Read More (slug) → Unpublish → Disappear → Delete
 *
 * Usage: node scripts/testBlogFlow.js   (server must be running on :5000)
 */

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const BASE = "http://localhost:5000";

// ---- read JWT_SECRET from server/.env (same file the server uses) ----
const envContent = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const JWT_SECRET = (envContent.match(/^JWT_SECRET\s*=\s*(.+)\s*$/m) || [])[1];

let failed = 0;
const check = (name, cond, extra) => {
  console.log(`${cond ? "PASS" : "FAIL"} | ${name}${extra ? " | " + extra : ""}`);
  if (!cond) failed++;
};

// 1x1 transparent PNG (valid image, passes multer fileFilter)
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

async function call(pathname, options = {}, withAuth = true) {
  const headers = { ...(options.headers || {}) };
  if (withAuth) headers.Authorization = `Bearer ${TOKEN}`;
  const res = await fetch(`${BASE}${pathname}`, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    /* non-JSON */
  }
  return { status: res.status, data };
}

let TOKEN = "";
let createdBlog = null;

(async () => {
  console.log("=== BLOG E2E TEST ===");
  if (!JWT_SECRET) {
    console.log("FATAL | JWT_SECRET not found in server/.env");
    process.exit(1);
  }
  TOKEN = jwt.sign(
    { id: "e2e-test-admin", email: "e2e-test@plutoastro.local" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // ---------- AUTH PROTECTION ----------
  const noAuth = await call("/api/blogs/admin/all", {}, false);
  check("admin/all without token -> 401", noAuth.status === 401);

  const badAuth = await call("/api/blogs/admin/all", {
    headers: { Authorization: "Bearer invalid.token.here" },
  }, false);
  check("admin/all with invalid token -> 401", badAuth.status === 401);

  const goodAuth = await call("/api/blogs/admin/all");
  check("admin/all with valid token -> 200", goodAuth.status === 200 && goodAuth.data.success === true);

  // ---------- BASELINE COUNTS ----------
  const beforePublic = await call("/api/blogs?limit=100");
  const beforeAdmin = await call("/api/blogs/admin/all");
  const publicBefore = (beforePublic.data.blogs || []).length;
  const adminBefore = (beforeAdmin.data.blogs || []).length;
  check("public GET /api/blogs -> 200", beforePublic.status === 200 && beforePublic.data.success === true);
  check("drafts excluded from public list", adminBefore >= publicBefore);

  // ---------- CREATE (draft, with featured image) ----------
  const form = new FormData();
  form.append("title", "E2E Test Blog - delete me");
  form.append("excerpt", "E2E excerpt verification");
  form.append("content", "E2E content body for verification.");
  form.append("author", "E2E Tester");
  form.append("category", "Astrology");
  form.append("tags", "e2e, test, verification");
  form.append("isPublished", "false");
  form.append("featuredImage", new Blob([PNG_BYTES], { type: "image/png" }), "e2e-image.png");

  const created = await call("/api/blogs", { method: "POST", body: form });
  check("POST /api/blogs -> 201", created.status === 201 && created.data.success === true,
    `status=${created.status} body=${JSON.stringify(created.data).slice(0, 300)}`);
  createdBlog = created.data.blog;
  check("created blog saved with slug", createdBlog && !!createdBlog.slug, createdBlog && createdBlog.slug);
  check("created blog has featuredImage URL", createdBlog && !!createdBlog.featuredImage, createdBlog && createdBlog.featuredImage);
  check("created blog is draft (isPublished=false)", createdBlog && createdBlog.isPublished === false);

  // image actually served?
  if (createdBlog && createdBlog.featuredImage) {
    const imgRes = await fetch(createdBlog.featuredImage);
    check("featured image URL reachable", imgRes.status === 200);
  }

  // ---------- DRAFT NOT PUBLIC ----------
  const afterCreatePublic = await call(`/api/blogs?limit=100&search=e2e-test-blog`);
  check("draft NOT in public list", (afterCreatePublic.data.blogs || []).length === 0);

  if (!createdBlog) {
    console.log("=== RESULT ===");
    console.log(`${failed} TEST(S) FAILED`);
    process.exit(1);
  }

  const afterCreateAdmin = await call("/api/blogs/admin/all");
  check("draft IS in admin list", (afterCreateAdmin.data.blogs || []).some((b) => b._id === createdBlog._id));

  // ---------- PUBLISH ----------
  const published = await call(`/api/blogs/${createdBlog._id}/publish`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished: true }),
  });
  check("PATCH publish -> isPublished=true", published.status === 200 && published.data.blog.isPublished === true);

  // ---------- HOMEPAGE LATEST BLOGS SEES IT ----------
  const afterPublishPublic = await call(`/api/blogs?limit=6`);
  check("published blog appears in public list (Latest Blogs source)",
    (afterPublishPublic.data.blogs || []).some((b) => b._id === createdBlog._id));

  // ---------- READ MORE (slug detail page) ----------
  const bySlug = await call(`/api/blogs/${createdBlog.slug}`, {}, false);
  check("GET /api/blogs/:slug -> 200 (Read More works)",
    bySlug.status === 200 && bySlug.data.blog && bySlug.data.blog.slug === createdBlog.slug);

  // ---------- EDIT ----------
  const editForm = new FormData();
  editForm.append("title", "E2E Test Blog - EDITED");
  editForm.append("excerpt", "E2E excerpt EDITED");
  const edited = await call(`/api/blogs/${createdBlog._id}`, { method: "PUT", body: editForm });
  check("PUT /api/blogs/:id -> updated", edited.status === 200 && edited.data.blog.title === "E2E Test Blog - EDITED");

  // ---------- UNPUBLISH ----------
  const unpublished = await call(`/api/blogs/${createdBlog._id}/publish`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished: false }),
  });
  check("PATCH unpublish -> isPublished=false", unpublished.status === 200 && unpublished.data.blog.isPublished === false);

  const afterUnpublish = await call(`/api/blogs?limit=6`);
  check("unpublished blog disappears from public list",
    !(afterUnpublish.data.blogs || []).some((b) => b._id === createdBlog._id));

  const bySlugUnpub = await call(`/api/blogs/${createdBlog.slug}`, {}, false);
  check("unpublished blog detail -> 404", bySlugUnpub.status === 404);

  // ---------- DELETE ----------
  const deleted = await call(`/api/blogs/${createdBlog._id}`, { method: "DELETE" });
  check("DELETE /api/blogs/:id -> success", deleted.status === 200 && deleted.data.success === true);

  const afterDeleteAdmin = await call("/api/blogs/admin/all");
  check("deleted blog removed from admin list",
    !(afterDeleteAdmin.data.blogs || []).some((b) => b._id === createdBlog._id));

  const afterDeleteById = await call(`/api/blogs/${createdBlog._id}`, {}, false);
  check("deleted blog detail -> 404", afterDeleteById.status === 404);

  console.log("=== RESULT ===");
  console.log(failed === 0 ? "ALL TESTS PASSED" : `${failed} TEST(S) FAILED`);
  process.exit(failed === 0 ? 0 : 1);
})().catch((err) => {
  console.error("FATAL |", err);
  process.exit(1);
});
