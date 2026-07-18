import React from 'react';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="absolute left-0 top-0 -translate-y-full bg-pitch-500 text-neutral-0 px-4 py-2 text-body-md font-semibold transition-transform focus:translate-y-0 z-50 rounded-br-md"
    >
      Skip to main content
    </a>
  );
}
