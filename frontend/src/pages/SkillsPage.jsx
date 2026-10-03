const skills = [
  'JavaScript',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'TypeScript',
  'HTML & CSS',
  'Algorithms',
  'Data Structures',
  'API Design',
  'Testing',
  'Deployment',
];

const SkillsPage = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-soft">
        <h1 className="text-4xl font-semibold text-white">Skills</h1>
        <p className="mt-4 text-slate-300">Professional tools, libraries, and concepts I work with daily.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div key={skill} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-slate-200">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
