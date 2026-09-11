import { useEffect } from "react";
import { useImmune } from "@/lib/store";

export function HydrateImmune() {
  useEffect(() => {
    void useImmune.persist.rehydrate();
  }, []);
  return null;
}
