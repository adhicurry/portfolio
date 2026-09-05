import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "src/data/resume.tsx"), "utf8");
const ast = ts.createSourceFile("resume.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let dataNode;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "DATA") dataNode = node.initializer;
  ts.forEachChild(node, visit);
}
visit(ast);
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(p => [p.name.text, literal(p.initializer)]));
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isAsExpression(node)) return literal(node.expression);
  // Component references are intentionally excluded from the content manifest.
  return null;
}
assert(dataNode, "DATA declaration must exist");
const data = literal(dataNode);
const projects = [...data.academicProjects, ...data.personalProjects];
const publications = [...data.publications, ...data.additionalPublications];
assert.equal(projects.length, 11, "Preserve all eleven original projects");
assert.equal(publications.length, 11, "Preserve all eleven publication records");
assert.equal(data.patents.length, 3);
assert.equal(data.awards.length, 8);
assert.equal(new Set(projects.map(p => p.slug)).size, projects.length);
assert.equal(new Set(publications.map(p => p.citation)).size, publications.length);
for (const p of projects) {
  assert.match(p.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(p.description && p.longDescription, `${p.slug}: missing copy`);
  assert(!/\(inferred\)|precious beam time|clever heat-recycling|make that impossible/i.test(p.description + p.longDescription), `${p.slug}: unresolved editorial issue`);
  const localImages = [p.image, ...[...p.longDescription.matchAll(/!\[[^\]]*\]\((\/[^)]+)\)/g)].map(m => m[1])].filter(Boolean);
  for (const image of localImages) assert(fs.existsSync(path.join(root, "public", image)), `${p.slug}: missing asset ${image}`);
}
const counts = Object.fromEntries(["phd", "industry", "undergraduate", "independent"].map(category => [category, data.academicProjects.filter(p => p.category === category).length]));
assert.deepEqual(counts, {phd: 1, industry: 3, undergraduate: 1, independent: 1});
const submitted = publications.filter(p => /submitted/i.test(p.note ?? ""));
assert.equal(submitted.length, 1, "Keep manuscript status separate");
assert(submitted[0].slug === "uncertainty-aware-drug-target-affinity-prediction");
const routes = [
  ...[["/",data.name,"Home"],["/research","Research","Research"],["/projects","Projects","Projects"],["/publications","Publications","Publications"],["/contact","Contact","Contact"]].map(([path,title,nav]) => ({path,title,nav})),
  ...projects.map(p => ({path:`/projects/${p.slug}`, title:p.title, nav:["phd","industry","undergraduate"].includes(p.category)?"Research":"Projects"})),
  ...publications.filter(p => p.slug).map(p => ({path:`/research/publications/${p.slug}`,title:p.citation.match(/"([^"]+)"/)?.[1] ?? p.citation, nav:"Publications"})),
];
const manifest = { counts: {projects:projects.length,publications:publications.length,patents:data.patents.length,awards:data.awards.length,...counts},routes, projects, publications };
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({passed:true,counts:manifest.counts,routes:routes.length},null,2));
