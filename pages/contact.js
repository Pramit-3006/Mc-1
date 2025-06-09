// File: pages/contact.js
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setStatus("Message sent successfully!");
      e.target.reset();
    } else {
      setStatus(data.error || "Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          style={{ marginBottom: 12, padding: 8, fontSize: 16 }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          style={{ marginBottom: 12, padding: 8, fontSize: 16 }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows={5}
          style={{ marginBottom: 12, padding: 8, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: 10, fontSize: 16, cursor: "pointer" }}>
          Send
        </button>
      </form>
      <p>{status}</p>
    </div>
  );
}
