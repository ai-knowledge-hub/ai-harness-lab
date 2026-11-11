import { Link } from "react-router-dom";
import { shouldLoadAstroDocument } from "../pilot-routing";

export function SiteLink({ href, children, ...props }) {
  return href.startsWith("/") ? (
    <Link to={href} {...props} reloadDocument={shouldLoadAstroDocument(href) || props.reloadDocument}>
      {children}
    </Link>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
