import { Link } from "react-router-dom";

export function SiteLink({ href, children, ...props }) {
  return href.startsWith("/") ? (
    <Link to={href} {...props}>
      {children}
    </Link>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
