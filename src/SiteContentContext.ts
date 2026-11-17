import { createContext, useContext } from "react";
import { defaultSiteContent } from "./data/siteContent";

export const SiteContentContext = createContext(defaultSiteContent);
export const useSiteContent = () => useContext(SiteContentContext);
