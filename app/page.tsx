"use client";

import HomeContent from "./pages/HomeContent";
import Navbar from "./components/Navbar";
import { useState } from "react";

export default function Page() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  return (
    <>
      <Navbar selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
      <HomeContent selectedTheme={selectedTheme} />
    </>
  );
}
