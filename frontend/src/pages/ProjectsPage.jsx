const projects = [
  {
    title: 'Code Journal',
    description: 'A developer blog platform built for publishing articles, tutorials, and project updates.',
    link: '#',
    category: 'Web Development',
  },
  {
    title: 'LeetCode Companion',
    description: 'A React application for documenting algorithm solutions and learning paths.',
    link: '#',
    category: 'DSA',
  },
  {
    title: 'Portfolio CMS',
    description: 'Admin dashboard enabling secure post creation, editing and scheduling for a personal brand site.',
    link: '#',
    category: 'Full Stack',
  },
];

const ProjectsPage = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-soft">
        <h1 className="text-4xl font-semibold text-white">Projects</h1>
        <p className="mt-4 text-slate-300">Featured work and personal applications built with modern JavaScript tooling.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">{project.category}</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">{project.title}</h2>
              <p className="mt-4 text-slate-400">{project.description}</p>
              <a href={project.link} className="mt-6 inline-flex text-indigo-300 hover:text-white">
                View project →
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
