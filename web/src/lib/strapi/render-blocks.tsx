"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** JSON полей `blocks` из Strapi 5 (REST). */
export type StrapiBlocksJson = Record<string, unknown>[] | null | undefined;

type BlockNode = Record<string, unknown>;

function replaceLineBreaks(text: string): ReactNode {
  const parts = text.split(/\r?\n|\r/g);
  return (
    <>
      {parts.map((part, idx) => (
        <span key={idx}>
          {idx > 0 ? <br /> : null}
          {part}
        </span>
      ))}
    </>
  );
}

function TextInline(node: BlockNode): ReactNode {
  const text = typeof node.text === "string" ? node.text : "";
  const { bold, italic, underline, strikethrough, code } = node;
  const base = replaceLineBreaks(text);
  const wrap = (inner: ReactNode): ReactNode => {
    let out = inner;
    if (code) {
      out = <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">{out}</code>;
    }
    if (strikethrough) out = <del>{out}</del>;
    if (underline) out = <u>{out}</u>;
    if (italic) out = <em>{out}</em>;
    if (bold) out = <strong>{out}</strong>;
    return out;
  };
  return <>{wrap(base)}</>;
}

function LinkOrA({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  const external = /^https?:\/\//i.test(url);
  if (external) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline dark:text-blue-400"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={url} className="text-blue-600 underline dark:text-blue-400">
      {children}
    </Link>
  );
}

/** Только text/link (внутри ссылки Strapi не вкладывает блоки). */
function renderInlineOnly(children: unknown): ReactNode {
  if (!Array.isArray(children)) return null;
  return children.map((child, i) => {
    if (!child || typeof child !== "object") return null;
    const c = child as BlockNode;
    if (c.type === "text") {
      return <span key={i}>{TextInline(c)}</span>;
    }
    if (c.type === "link" && typeof c.url === "string") {
      return (
        <LinkOrA key={i} url={c.url}>
          {renderInlineOnly(c.children)}
        </LinkOrA>
      );
    }
    return null;
  });
}

function renderInlineOrBlock(child: unknown, key: number): ReactNode {
  if (!child || typeof child !== "object") return null;
  const c = child as BlockNode;
  if (c.type === "text") {
    return <span key={key}>{TextInline(c)}</span>;
  }
  if (c.type === "link" && typeof c.url === "string") {
    return (
      <LinkOrA key={key} url={c.url}>
        {renderInlineOnly(c.children)}
      </LinkOrA>
    );
  }
  return <Block key={key} node={c} />;
}

function renderMixedChildren(children: unknown): ReactNode {
  if (!Array.isArray(children)) return null;
  return children.map((child, i) => renderInlineOrBlock(child, i));
}

function codePlainText(children: unknown): string {
  if (!Array.isArray(children)) return "";
  const parts: string[] = [];
  const walk = (nodes: unknown[]) => {
    for (const n of nodes) {
      if (!n || typeof n !== "object") continue;
      const o = n as BlockNode;
      if (o.type === "text" && typeof o.text === "string") {
        parts.push(o.text);
      }
      if (Array.isArray(o.children)) {
        walk(o.children as unknown[]);
      }
    }
  };
  walk(children);
  return parts.join("");
}

function Block({ node }: { node: BlockNode }): ReactNode {
  const { type, children, ...rest } = node;

  if (type === "paragraph") {
    const ch = children as unknown[] | undefined;
    if (
      Array.isArray(ch) &&
      ch.length === 1 &&
      ch[0] &&
      typeof ch[0] === "object" &&
      (ch[0] as BlockNode).type === "text" &&
      ((ch[0] as BlockNode).text === "" || (ch[0] as BlockNode).text === undefined)
    ) {
      return <br />;
    }
    return (
      <p className="mb-4 leading-relaxed text-zinc-700 last:mb-0 dark:text-zinc-300">
        {renderMixedChildren(children)}
      </p>
    );
  }

  if (type === "heading") {
    const level =
      typeof rest.level === "number" && rest.level >= 1 && rest.level <= 6
        ? rest.level
        : 2;
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag className="mb-3 mt-6 font-semibold text-zinc-900 first:mt-0 dark:text-zinc-100">
        {renderMixedChildren(children)}
      </Tag>
    );
  }

  if (type === "quote") {
    return (
      <blockquote className="mb-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
        {renderMixedChildren(children)}
      </blockquote>
    );
  }

  if (type === "code") {
    return (
      <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
        <code>{codePlainText(children)}</code>
      </pre>
    );
  }

  if (type === "list") {
    const format = rest.format === "ordered" ? "ordered" : "unordered";
    const ListTag = format === "ordered" ? "ol" : "ul";
    const listClass =
      format === "ordered"
        ? "mb-4 list-decimal space-y-1 pl-6 text-zinc-800 dark:text-zinc-200"
        : "mb-4 list-disc space-y-1 pl-6 text-zinc-800 dark:text-zinc-200";
    return (
      <ListTag className={listClass}>
        {Array.isArray(children)
          ? children.map((ch, i) => <Block key={i} node={ch as BlockNode} />)
          : null}
      </ListTag>
    );
  }

  if (type === "list-item") {
    return (
      <li className="leading-relaxed [&_ol]:mt-2 [&_ul]:mt-2 [&_p]:mb-0">
        {renderMixedChildren(children)}
      </li>
    );
  }

  if (type === "image" && rest.image && typeof rest.image === "object") {
    const img = rest.image as {
      url?: string;
      alternativeText?: string | null;
    };
    if (!img.url) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={img.url}
        alt={img.alternativeText ?? ""}
        className="mb-4 max-h-[480px] w-auto max-w-full rounded-lg object-contain"
      />
    );
  }

  return null;
}

export function RenderStrapiBlocks({ content }: { content: StrapiBlocksJson }) {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return null;
  }
  return (
    <>
      {content.map((block, i) => {
        if (!block || typeof block !== "object") return null;
        return <Block key={i} node={block as BlockNode} />;
      })}
    </>
  );
}
