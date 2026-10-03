const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-8">
      {Array.from({ length: pages }, (_, idx) => idx + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          className={`rounded-full px-4 py-2 text-sm transition ${
            pageNumber === page ? 'bg-indigo-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          onClick={() => onChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
