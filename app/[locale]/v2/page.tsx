"use client";

import { useLayoutEffect } from "react";
import LocalizedHome from "../page";

export default function LocalizedV2Page() {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", "v2");
    if (window.__webanti) {
      window.__webanti.theme = "v2";
    }
  }, []);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute("data-theme","v2");`,
        }}
      />
      <LocalizedHome forceTheme="v2" />
    </>
  );
}
