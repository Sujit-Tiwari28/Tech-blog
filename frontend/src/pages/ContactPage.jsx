import { useState } from "react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      alert(data.message);

      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-soft">
        <h1 className="text-4xl font-semibold text-white">Contact</h1>

        <form className="mt-10 grid gap-6" onSubmit={submitHandler}>
          
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-slate-100"
            required
          />

          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-slate-100"
            required
          />

          <textarea
            rows="6"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-slate-100"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-fit rounded-full bg-indigo-500 px-7 py-3 text-sm font-semibold text-black"
          >
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;``