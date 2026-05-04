import type { ReactNode } from "react";
import "./PageTemplate.css";
import { AppHeader } from "../Header/Header";
import { AppSidebar } from "../Navbar/Navbar";

type PageTemplateProps = {
    title: string;
    children: ReactNode;
};

export function PageTemplate({ title, children }: PageTemplateProps) {
    return (
        <div className="page-template">
            <AppHeader title={title} />

            <AppSidebar />

            <main className="page-template__content">{children}</main>
        </div>
    );
}
