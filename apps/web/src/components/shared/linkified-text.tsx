import React from "react";

const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s]+)/gi;

export default function LinkifiedText({ text }: { readonly text: string }) {
  return (
    <span className="whitespace-pre-wrap">
      {text.split(URL_PATTERN).map((part, index) => {
        if (!/^(?:https?:\/\/|www\.)/i.test(part)) return <React.Fragment key={index}>{part}</React.Fragment>;

        const trailing = part.match(/[.,!?;:)]*$/)?.[0] ?? "";
        const visibleUrl = trailing ? part.slice(0, -trailing.length) : part;
        const href = /^www\./i.test(visibleUrl) ? `https://${visibleUrl}` : visibleUrl;
        return (
          <React.Fragment key={index}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-core underline underline-offset-2 hover:text-core-highlight"
            >
              {visibleUrl}
            </a>
            {trailing}
          </React.Fragment>
        );
      })}
    </span>
  );
}
