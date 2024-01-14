import React from "react";

const Kbd = (props: { children: React.ReactNode }) => {
  return (
    <kbd className="inline-flex min-h-7 min-w-7 select-none items-center justify-center rounded-md border border-gray-200 bg-white px-1.5 py-1 font-mono text-sm font-bold text-gray-800 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-slate-900 dark:text-gray-200 dark:shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)]">
      {props.children}
    </kbd>
  );
};

export default Kbd;
