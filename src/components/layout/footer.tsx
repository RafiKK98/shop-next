import { cacheLife } from "next/cache";
import { Input } from "@/components/ui";
import { ROUTES, SITE } from "@/constants";
import { NAVIGATION } from "@/constants/navigation";
import { Camera, Globe, Hash, Mail, Play } from "lucide-react";
import Link from "next/link";

async function Copyright() {
  "use cache";
  cacheLife("days");
  return (
    <p className="text-center text-xs text-base-content/40">
      &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
    </p>
  );
}

const socialIcons: Record<string, React.ReactNode> = {
  Facebook: <Globe size={18} />,
  Twitter: <Hash size={18} />,
  Instagram: <Camera size={18} />,
  YouTube: <Play size={18} />,
};

export function Footer() {
  const footerSections = Object.values(NAVIGATION.footer);

  return (
    <footer className="mt-auto border-t border-base-200 bg-base-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link
              href={ROUTES.home as unknown as any}
              className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
            >
              {SITE.name}
            </Link>
            <p className="mt-3 text-sm text-base-content/60 max-w-xs">
              Your destination for quality products at great prices.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {NAVIGATION.social.map((social) => (
                <Link
                  key={social.label}
                  href={social.href as unknown as any}
                  className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-primary"
                  aria-label={social.label}
                >
                  {socialIcons[social.label] ?? null}
                </Link>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/80">
                {section.title}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href as unknown as any}
                      className="text-sm text-base-content/60 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-base-200 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-base-content/40" />
              <span className="text-sm text-base-content/60">Stay updated</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-64"
                aria-label="Email for newsletter"
              />
              <button className="btn btn-primary btn-sm">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-base-200 pt-6">
          <Copyright />
        </div>
      </div>
    </footer>
  );
}
