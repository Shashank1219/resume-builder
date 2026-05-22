import { TextRun } from "docx";
import { DOCX_SIZE_BODY } from "./template1Spec";

type RunFlags = { bold?: boolean; italics?: boolean; underline?: boolean };

function walk(node: Node, flags: RunFlags, runs: TextRun[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    if (text) {
      runs.push(
        new TextRun({
          text,
          bold: flags.bold,
          italics: flags.italics,
          underline: flags.underline ? {} : undefined,
          size: DOCX_SIZE_BODY,
        })
      );
    }
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const el = node as Element;
  const tag = el.tagName.toUpperCase();
  const next: RunFlags = { ...flags };
  if (tag === "STRONG" || tag === "B") next.bold = true;
  if (tag === "EM" || tag === "I") next.italics = true;
  if (tag === "U") next.underline = true;

  if (tag === "BR") {
    runs.push(new TextRun({ break: 1 }));
    return;
  }

  if (tag === "LI") {
    el.childNodes.forEach((child) => walk(child, next, runs));
    return;
  }

  if (tag === "P" || tag === "UL" || tag === "OL" || tag === "DIV" || tag === "SPAN") {
    el.childNodes.forEach((child) => walk(child, next, runs));
    return;
  }

  el.childNodes.forEach((child) => walk(child, next, runs));
}

/** Convert sanitized HTML to docx TextRuns (bold/italic/underline preserved). */
export function htmlToDocxRuns(html: string): TextRun[] {
  if (!html?.trim()) return [];
  if (typeof window === "undefined") {
    const plain = html.replace(/<[^>]+>/g, "");
    return plain ? [new TextRun({ text: plain, size: DOCX_SIZE_BODY })] : [];
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const runs: TextRun[] = [];
  doc.body.childNodes.forEach((child) => walk(child, {}, runs));
  return runs.length > 0 ? runs : [new TextRun({ text: html.replace(/<[^>]+>/g, ""), size: DOCX_SIZE_BODY })];
}

export function htmlToPlainText(html: string): string {
  if (!html?.trim()) return "";
  if (typeof window === "undefined") return html.replace(/<[^>]+>/g, "");
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").trim();
}

export function htmlListItems(html: string): string[] {
  if (!html?.trim()) return [];
  if (typeof window === "undefined") {
    return [html.replace(/<[^>]+>/g, "").trim()].filter(Boolean);
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  const items = Array.from(doc.body.querySelectorAll("li")).map((li) => (li.textContent ?? "").trim());
  if (items.length > 0) return items.filter(Boolean);
  const text = (doc.body.textContent ?? "").trim();
  return text ? [text] : [];
}
