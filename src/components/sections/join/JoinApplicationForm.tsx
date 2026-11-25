"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";

const interestOptions = [
  { value: "development", label: "Software Development" },
  { value: "research", label: "Research and Development" },
  { value: "design", label: "Media and Graphics" },
  { value: "events", label: "Events and Operations" },
  { value: "marketing", label: "Marketing and Communications" },
  { value: "exploring", label: "Still exploring" },
];

const semesterOptions = [
  "1st semester", "2nd semester", "3rd semester", "4th semester",
  "5th semester", "6th semester", "7th semester", "8th semester", "Graduate / Other",
].map((value) => ({ value, label: value }));

export function JoinApplicationForm() {
  const [previewed, setPreviewed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreviewed(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tag color="mint">Application preview</Tag>
        <span className="font-mono text-xs text-muted">All fields marked * are required</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full name"
          name="fullName"
          placeholder="Your name"
          autoComplete="name"
          required
        />
        <Input
          label="University email"
          name="email"
          type="email"
          placeholder="name@nu.edu.pk"
          autoComplete="email"
          required
        />
        <Select
          label="Current semester"
          name="semester"
          options={semesterOptions}
          placeholder="Choose your semester"
          required
        />
        <Select
          label="Area of interest"
          name="interest"
          options={interestOptions}
          placeholder="Choose an area"
          required
        />
      </div>

      <Textarea
        label="Tell us about yourself"
        name="message"
        rows={5}
        placeholder="Your interests, skills, ideas, or what you would like to explore with SES..."
        required
      />

      <div className="flex flex-col gap-3 border-t-brutal pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm leading-relaxed text-muted">
          This is a front-end preview. Your details will not be sent or stored until an application backend is connected.
        </p>
        <Button type="submit" arrow>
          Preview application
        </Button>
      </div>

      {previewed && (
        <div role="status" className="flex items-start gap-3 rounded-brutal border-brutal bg-highlight p-4 text-ink">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-display font-bold">Form preview checked</p>
            <p className="mt-1 text-sm leading-relaxed">
              The form is ready for its future Google Forms or backend connection. No submission has been sent.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
