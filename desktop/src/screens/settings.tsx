import { useState, type FormEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_CONFIG, type McConfig } from "../lib/config.ts";

interface Props {
  config: McConfig;
  onChange: (config: McConfig) => void;
}

const FIELDS: { key: keyof Omit<McConfig, "theme">; label: string; hint: string }[] = [
  { key: "infinityIssuer", label: "Infinity issuer", hint: "Local auth worker: http://127.0.0.1:8005. Hosted: https://auth.trancendos.com." },
  { key: "infinityClientId", label: "Infinity client ID", hint: "The Management Center's public client registration in Infinity-One." },
  { key: "infinityScope", label: "Scopes", hint: "Space separated." },
  { key: "stageGatesUrl", label: "Stage Gates (Project Management)", hint: "SVC-TWH-05, default port 8705." },
  { key: "cmdbUrl", label: "CMDB (Service Management Center)", hint: "Atlas CMDB, default port 8765. Must match its CMDB_PUBLIC_ORIGIN." },
];

export function SettingsForm({ config, onChange }: Props) {
  const [draft, setDraft] = useState(config);
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    onChange(draft);
    setSaved(true);
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDesc>Stored on this computer only. No passwords or tokens are kept here.</CardDesc>
      </CardHeader>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {FIELDS.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label htmlFor={`cfg-${f.key}`} className="text-sm font-medium">{f.label}</label>
            <input
              id={`cfg-${f.key}`}
              value={draft[f.key]}
              onChange={(e) => {
                setSaved(false);
                setDraft({ ...draft, [f.key]: e.target.value });
              }}
              aria-describedby={`cfg-${f.key}-hint`}
              spellCheck={false}
              className="h-9 rounded-md border border-border bg-elevated px-2 font-mono text-sm text-fg"
            />
            <p id={`cfg-${f.key}-hint`} className="text-xs text-muted">{f.hint}</p>
          </div>
        ))}
        <fieldset className="flex items-center gap-2">
          <legend className="mb-1 text-sm font-medium">Appearance</legend>
          {(["dark", "light"] as const).map((theme) => (
            <Button
              key={theme}
              type="button"
              size="sm"
              variant={draft.theme === theme ? "primary" : "secondary"}
              aria-pressed={draft.theme === theme}
              onClick={() => {
                const next = { ...draft, theme };
                setDraft(next);
                onChange(next);
              }}
            >
              {theme === "dark" ? <Moon aria-hidden /> : <Sun aria-hidden />} {theme === "dark" ? "Black" : "White"}
            </Button>
          ))}
        </fieldset>
        <div className="flex items-center gap-2">
          <Button type="submit">Save</Button>
          <Button type="button" variant="ghost" onClick={() => setDraft({ ...DEFAULT_CONFIG, theme: draft.theme })}>Reset to defaults</Button>
          <span role="status" className="text-sm text-ok">{saved ? "Saved." : ""}</span>
        </div>
      </form>
    </Card>
  );
}
