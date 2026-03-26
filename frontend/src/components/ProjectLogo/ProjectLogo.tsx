import "./ProjectLogo.css";

type ProjectLogoProps = {
    className?: string;
};

export function ProjectLogo({ className = "" }: ProjectLogoProps) {
    return (
        <div className={`project-logo ${className}`.trim()} aria-hidden="true">
            <svg viewBox="0 0 220 220" role="img">
                <title>Logo do projeto</title>
                <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="8"
                >
                    <path d="M110 16 188 60 188 154 110 198 32 154 32 60Z" />
                    <path d="M110 16 110 198" />
                    <path d="M32 60 110 104 188 60" />
                    <path d="M32 154 110 104 188 154" />
                    <path d="M64 78 110 52 156 78 156 142 110 168 64 142Z" />
                    <path d="M64 78 64 142" />
                    <path d="M156 78 156 142" />
                    <path d="M110 52 110 168" />
                    <path d="M64 110 110 136 156 110" />
                </g>
            </svg>
        </div>
    );
}