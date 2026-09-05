import Image from "next/image";

const screenshots = [
  {
    src: "/projects/mypantrychef/home.png",
    title: "Home",
    caption: "Start with a pantry-aware recipe request or jump back into a saved idea.",
  },
  {
    src: "/projects/mypantrychef/pantry.png",
    title: "Pantry",
    caption: "Keep ingredients organized by category so recipes can use what is already on hand.",
  },
  {
    src: "/projects/mypantrychef/recipe.png",
    title: "Recipe",
    caption: "Review quantities, timings, instructions, and pantry matches in one place.",
  },
  {
    src: "/projects/mypantrychef/cook-mode.png",
    title: "Cook mode",
    caption: "Follow one step at a time with progress tracking and a built-in timer.",
  },
  {
    src: "/projects/mypantrychef/settings.png",
    title: "Preferences",
    caption: "Set dietary preferences, exclusions, skill level, and default serving size.",
  },
] as const;

export function MyPantryChefGallery() {
  return (
    <section aria-labelledby="mypantrychef-gallery-heading" className="space-y-5 border-t border-border pt-6">
      <div className="space-y-2">
        <p className="text-sm text-primary">Product walkthrough</p>
        <h2 id="mypantrychef-gallery-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
          See the app in use
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          A quick tour from pantry setup to cooking. The screens below are captures of the current Expo Web prototype, using local demo ingredients and a sample recipe.
        </p>
      </div>

      <figure className="overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm">
        <Image
          src="/projects/mypantrychef/overview.webp"
          alt="MyPantryChef app overview showing the home, pantry, and cook mode screens"
          width={1200}
          height={700}
          className="h-auto w-full rounded-lg"
          sizes="(max-width: 768px) 100vw, 900px"
        />
        <figcaption className="px-2 pb-1 pt-3 text-sm leading-6 text-muted-foreground">
          From deciding what to eat, to using the pantry, to cooking dinner.
        </figcaption>
      </figure>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {screenshots.map((screenshot) => (
          <figure key={screenshot.src} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm">
            <div className="rounded-lg bg-slate-100 px-4 pt-4">
              <Image
                src={screenshot.src}
                alt={`${screenshot.title} screen in MyPantryChef`}
                width={860}
                height={1864}
                className="mx-auto h-auto max-h-[34rem] w-full object-contain object-top"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
              />
            </div>
            <figcaption className="space-y-1 px-2 pb-2 pt-3">
              <p className="font-medium">{screenshot.title}</p>
              <p className="text-sm leading-6 text-muted-foreground">{screenshot.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        Screenshot note: these are actual app captures from the local prototype, not live AI-generated outputs. Ingredient lists and recipe content are sample data used for the demo.
      </p>
    </section>
  );
}
