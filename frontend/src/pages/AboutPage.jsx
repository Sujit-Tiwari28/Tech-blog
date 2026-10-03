const AboutPage = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-soft">
        <h1 className="text-4xl font-semibold text-white">About Me</h1>
        <p className="mt-6 max-w-3xl text-slate-300 leading-8">
          I am a passionate software engineer specializing in web development, full-stack JavaScript, and technical writing. I publish practical tutorials, algorithm walkthroughs, and career guidance for aspiring developers.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Experience</h2>
            <p className="mt-3 text-slate-400">Building scalable applications, solving algorithmic challenges, and delivering polished developer experiences.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Mission</h2>
            <p className="mt-3 text-slate-400">Share practical engineering knowledge, help developers grow, and document meaningful projects.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Focus</h2>
            <p className="mt-3 text-slate-400">LeetCode, React, Node.js, MongoDB, AI tools, career tips, and personal projects.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
