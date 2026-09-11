import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ANTIBODIES, MUTANTS } from "@/lib/data/antibodies";
import { STORIES, type StoryStatus } from "@/lib/data/backlog";
import { ISSUES } from "@/lib/data/catalog";

export type Topology = "local" | "hybrid" | "cloud";

export type ImmuneEvent = {
  t: number;
  kind: "dispatch" | "heal" | "vaccinate" | "story" | "check" | "topology";
  msg: string;
};

type State = {
  healed: Record<number, boolean>;
  storyStatus: Record<string, StoryStatus>;
  dispatched: string[];
  topology: Topology;
  checks: Record<string, boolean>;
  events: ImmuneEvent[];
  vaccinations: { t: number; mutant: string; caught: boolean; antibody: string }[];
  dispatch: (id: string) => void;
  setStory: (id: string, status: StoryStatus) => void;
  setTopology: (t: Topology) => void;
  toggleCheck: (id: string) => void;
  vaccinate: (mutantId: string) => { caught: boolean; antibody: string };
  reset: () => void;
};

const defaultStories = (): Record<string, StoryStatus> =>
  Object.fromEntries(STORIES.map((s) => [s.id, "backlog" as StoryStatus]));

function pushEvent(events: ImmuneEvent[], ev: ImmuneEvent): ImmuneEvent[] {
  return [ev, ...events].slice(0, 80);
}

const baselineEvent: ImmuneEvent = {
  t: 0,
  kind: "check",
  msg: "Census complete. Chronic inflammation: detection without clearance.",
};

export const useImmune = create<State>()(
  persist(
    (set, get) => ({
      healed: {},
      storyStatus: defaultStories(),
      dispatched: [],
      topology: "local",
      checks: {},
      events: [baselineEvent],
      vaccinations: [],
      dispatch: (id) => {
        const ab = ANTIBODIES.find((a) => a.id === id);
        if (!ab) return;
        if (get().dispatched.includes(id)) return;
        const healed = { ...get().healed };
        for (const n of ab.issues) healed[n] = true;
        const storyStatus = { ...get().storyStatus };
        for (const s of STORIES) {
          if (s.antibody === id && storyStatus[s.id] === "backlog") {
            storyStatus[s.id] = "ready";
          }
        }
        set({
          dispatched: [...get().dispatched, id],
          healed,
          storyStatus,
          events: pushEvent(get().events, {
            t: Date.now(),
            kind: "dispatch",
            msg: `${ab.name} deployed. ${ab.cures}.`,
          }),
        });
      },
      setStory: (id, status) => {
        const story = STORIES.find((s) => s.id === id);
        set({
          storyStatus: { ...get().storyStatus, [id]: status },
          events: pushEvent(get().events, {
            t: Date.now(),
            kind: "story",
            msg: `${id} → ${status}${story ? ` (${story.title})` : ""}`,
          }),
        });
      },
      setTopology: (t) =>
        set({
          topology: t,
          events: pushEvent(get().events, {
            t: Date.now(),
            kind: "topology",
            msg: `Topology set to ${t}. Sovereignty rules re-evaluated.`,
          }),
        }),
      toggleCheck: (id) =>
        set({ checks: { ...get().checks, [id]: !get().checks[id] } }),
      vaccinate: (mutantId) => {
        const mutant = MUTANTS.find((m) => m.id === mutantId);
        if (!mutant) return { caught: false, antibody: "" };
        const caught = get().dispatched.includes(mutant.antibody);
        const ab = ANTIBODIES.find((a) => a.id === mutant.antibody);
        const rec = {
          t: Date.now(),
          mutant: mutant.label,
          caught,
          antibody: ab?.name ?? mutant.antibody,
        };
        set({
          vaccinations: [rec, ...get().vaccinations].slice(0, 24),
          events: pushEvent(get().events, {
            t: Date.now(),
            kind: "vaccinate",
            msg: caught
              ? `Mutant “${mutant.label}” caught by ${ab?.name}. Memory cell path.`
              : `Mutant “${mutant.label}” not recognised. Deploy ${ab?.name} first.`,
          }),
        });
        return { caught, antibody: ab?.name ?? mutant.antibody };
      },
      reset: () =>
        set({
          healed: {},
          storyStatus: defaultStories(),
          dispatched: [],
          topology: "local",
          checks: {},
          vaccinations: [],
          events: [
            {
              t: Date.now(),
              kind: "check",
              msg: "Immune memory wiped. Returning to census baseline.",
            },
          ],
        }),
    }),
    { name: "tranc3-immune-v1", skipHydration: true },
  ),
);

export function gradeFromState(dispatched: string[], healed: Record<number, boolean>) {
  const issueScore = ISSUES.filter((i) => healed[i.number]).length / ISSUES.length;
  const abScore = dispatched.length / ANTIBODIES.length;
  const raw = 38 + issueScore * 32 + abScore * 30;
  const score = Math.round(Math.min(99, raw));
  const letter =
    score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";
  return { score, letter };
}

export function phaseProgress(storyStatus: Record<string, StoryStatus>, phase: 0 | 1 | 2 | 3) {
  const items = STORIES.filter((s) => s.phase === phase);
  const done = items.filter((s) => storyStatus[s.id] === "done").length;
  return { done, total: items.length, pct: items.length ? (done / items.length) * 100 : 0 };
}
