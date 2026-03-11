"use client";

import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";

type Project = {
  id: string;
  name: string;
  objective: string;
  target_audience: string;
  created_at: string | null;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data as Project[]);
      }
    };

    void fetchProjects();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedObjective = objective.trim();
    const trimmedAudience = audience.trim();

    if (!trimmedName || !trimmedObjective || !trimmedAudience) {
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: trimmedName,
        objective: trimmedObjective,
        target_audience: trimmedAudience,
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (error || !data) {
      // In a real app, surface this to the user.
      return;
    }

    setProjects((prev) => [data as Project, ...prev]);
    setName("");
    setObjective("");
    setAudience("");
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Research Projects
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Capture key details for each research project and keep them
            organized in one place.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-medium">Create a new project</h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-transparent focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-200"
                placeholder="e.g. User onboarding study"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="research-objective"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Research Objective
              </label>
              <textarea
                id="research-objective"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-transparent focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-200"
                rows={3}
                placeholder="What are you trying to learn or prove?"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="target-audience"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Target Audience
              </label>
              <input
                id="target-audience"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-transparent focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-200"
                placeholder="e.g. New customers, power users"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-900"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </section>

        <section aria-label="Project list" className="space-y-4">
          <h2 className="text-lg font-medium">Projects</h2>

          {projects.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No projects yet. Create your first research project using the form
              above.
            </p>
          ) : (
            <ul className="space-y-3">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Target audience:{" "}
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {project.target_audience}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
                    {project.objective}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
