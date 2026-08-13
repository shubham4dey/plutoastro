import React, { useState } from "react";
 
const RASHIS = [

  "Aries (Mesh)", "Taurus (Vrishabh)", "Gemini (Mithun)", "Cancer (Kark)",

  "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrishchik)",

  "Sagittarius (Dhanu)", "Capricorn (Makar)", "Aquarius (Kumbh)", "Pisces (Meen)"

];
 
const PreChatForm = ({ onSubmit, astrologerName, onClose }) => {

  const [form, setForm] = useState({

    name: "",

    dob: "",

    rashi: "",

    query: "",

  });
 
  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value });

  };
 
  const handleSubmit = (e) => {

    e.preventDefault();

    if (!form.name || !form.dob || !form.rashi || !form.query) {

      alert("Sab fields bharo!");

      return;

    }

    onSubmit(form);

  };
 
  return (
<div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
<div className="bg-[#1b1b2f] rounded-2xl p-8 max-w-md w-full border border-purple-600">
<h2 className="text-2xl font-bold text-white mb-2">

          Chat with {astrologerName}
</h2>
<p className="text-gray-400 text-sm mb-6">

          Better guidance ke liye ye details bharo
</p>
 
        <form onSubmit={handleSubmit} className="space-y-4">
<div>
<label className="text-purple-300 text-sm">Full Name</label>
<input

              type="text"

              name="name"

              value={form.name}

              onChange={handleChange}

              className="w-full mt-1 px-4 py-3 bg-[#24243c] rounded-lg text-white outline-none focus:border-purple-500 border border-transparent"

              placeholder="Your name"

              required

            />
</div>
 
          <div>
<label className="text-purple-300 text-sm">Date of Birth</label>
<input

              type="date"

              name="dob"

              value={form.dob}

              onChange={handleChange}

              className="w-full mt-1 px-4 py-3 bg-[#24243c] rounded-lg text-white outline-none focus:border-purple-500 border border-transparent"

              required

            />
</div>
 
          <div>
<label className="text-purple-300 text-sm">Rashi (Zodiac)</label>
<select

              name="rashi"

              value={form.rashi}

              onChange={handleChange}

              className="w-full mt-1 px-4 py-3 bg-[#24243c] rounded-lg text-white outline-none focus:border-purple-500 border border-transparent"

              required
>
<option value="">Select Rashi</option>

              {RASHIS.map((r) => (
<option key={r} value={r}>{r}</option>

              ))}
</select>
</div>
 
          <div>
<label className="text-purple-300 text-sm">Your Query</label>
<textarea

              name="query"

              value={form.query}

              onChange={handleChange}

              rows={3}

              className="w-full mt-1 px-4 py-3 bg-[#24243c] rounded-lg text-white outline-none focus:border-purple-500 border border-transparent resize-none"

              placeholder="Apna sawal likho..."

              required

            />
</div>
 
          <div className="flex gap-3">
<button

              type="submit"

              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold hover:opacity-90 transition-all"
>

              Start Chat
</button>
<button

              type="button"

              onClick={onClose}

              className="px-6 py-3 border-2 border-purple-800 rounded-lg text-purple-300 hover:bg-purple-900 transition-all"
>

              Cancel
</button>
</div>
</form>
</div>
</div>

  );

};
 
export default PreChatForm;
 