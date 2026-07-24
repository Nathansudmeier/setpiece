"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RouteFocus() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const main = document.getElementById("main-content");
    if (!main) return;

    const previousTabIndex = main.getAttribute("tabindex");
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });

    if (previousTabIndex === null) {
      main.addEventListener("blur", () => main.removeAttribute("tabindex"), {
        once: true,
      });
    }
  }, [pathname]);

  return null;
}
