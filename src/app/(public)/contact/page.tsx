import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "Contact Us", description: "Get in touch with our team" });
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
      <p className="mt-2 text-base-content/60">Have a question or feedback? We&apos;d love to hear from you.</p>

      <form className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <label className="form-control">
            <span className="label-text">First name</span>
            <input type="text" className="input input-bordered mt-1" required />
          </label>
          <label className="form-control">
            <span className="label-text">Last name</span>
            <input type="text" className="input input-bordered mt-1" required />
          </label>
        </div>
        <label className="form-control">
          <span className="label-text">Email</span>
          <input type="email" className="input input-bordered mt-1" required />
        </label>
        <label className="form-control">
          <span className="label-text">Subject</span>
          <input type="text" className="input input-bordered mt-1" />
        </label>
        <label className="form-control">
          <span className="label-text">Message</span>
          <textarea className="textarea textarea-bordered mt-1 h-32" required />
        </label>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          Send Message
        </button>
      </form>
    </div>
  );
}
