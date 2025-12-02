import React from 'react';

interface ShapeIconProps {
    shapeId: string;
    className?: string;
}

export const ShapeIcon: React.FC<ShapeIconProps> = ({ shapeId, className }) => {
    const props = {
        className: className,
        width: "100%",
        height: "100%",
        viewBox: "0 0 64 64",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    };

    const strokeColor = "currentColor";
    const strokeWidth = 2;

    switch (shapeId) {
        case 'cylinder':
            return (
                <svg {...props}>
                    <path d="M32 12C45.2548 12 56 9.31371 56 6C56 2.68629 45.2548 0 32 0C18.7452 0 8 2.68629 8 6C8 9.31371 18.7452 12 32 12Z" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M56 6V58C56 61.3137 45.2548 64 32 64C18.7452 64 8 61.3137 8 58V6" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M8 58C8 54.6863 18.7452 52 32 52C45.2548 52 56 54.6863 56 58" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4 4"/>
                </svg>
            );
        case 'cone':
            return (
                <svg {...props}>
                    <path d="M32 64C45.2548 64 56 61.3137 56 58C56 54.6863 45.2548 52 32 52C18.7452 52 8 54.6863 8 58C8 61.3137 18.7452 64 32 64Z" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M8 58L32 2L56 58" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M32 2V52" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4 4"/>
                </svg>
            );
        case 'square-to-round':
            return (
                <svg {...props}>
                    <rect x="12" y="48" width="40" height="12" rx="2" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <ellipse cx="32" cy="8" rx="16" ry="6" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M16 8L12 48" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M48 8L52 48" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M32 14V48" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4 4"/>
                </svg>
            );
        case 'elbow':
            return (
                <svg {...props}>
                    <path d="M12 56H28C41.2548 56 52 45.2548 52 32V12" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M12 40H28C32.4183 40 36 36.4183 36 32V12" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M12 56V40" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M52 12H36" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M28 56L52 32" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4 4"/>
                </svg>
            );
        case 'offset':
            return (
                <svg {...props}>
                    <path d="M12 52V36L44 20V4" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M20 52V40L52 24V4" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M12 52H20" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M44 4H52" stroke={strokeColor} strokeWidth={strokeWidth}/>
                </svg>
            );
        case 'stairs':
            return (
                <svg {...props}>
                    <path d="M12 52H24V40H36V28H48V16" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M12 52V40" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M24 40V28" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M36 28V16" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M48 16V4" stroke={strokeColor} strokeWidth={strokeWidth}/>
                </svg>
            );
        case 'bracket':
            return (
                <svg {...props}>
                    <path d="M12 12V52H52" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M12 12L52 52" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <circle cx="24" cy="24" r="4" stroke={strokeColor} strokeWidth={strokeWidth}/>
                </svg>
            );
        case 'bolts':
            return (
                <svg {...props}>
                    <path d="M22 16H42V48H22V16Z" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M16 16H48V8H16V16Z" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M22 42H42" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M22 36H42" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M22 30H42" stroke={strokeColor} strokeWidth={strokeWidth}/>
                </svg>
            );
        case 'plate-weight':
            return (
                <svg {...props}>
                    <path d="M8 44L24 52L56 36L40 28L8 44Z" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M8 44V20L40 4V28" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M56 36V12L40 4" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M24 52V28" stroke={strokeColor} strokeWidth={strokeWidth}/>
                </svg>
            );
        case 'volumes':
            return (
                <svg {...props}>
                    <path d="M12 48V16L32 4L52 16V48L32 60L12 48Z" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M12 16L32 28L52 16" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M32 60V28" stroke={strokeColor} strokeWidth={strokeWidth}/>
                </svg>
            );
        case 'pipe-branching':
            return (
                <svg {...props}>
                    <path d="M12 48H52" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M12 32H52" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M32 32V12" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M24 12H40" stroke={strokeColor} strokeWidth={strokeWidth}/>
                </svg>
            );
        case 'arc-calculator':
            return (
                <svg {...props}>
                    <path d="M8 48C8 48 20 20 32 20C44 20 56 48 56 48" stroke={strokeColor} strokeWidth={strokeWidth}/>
                    <path d="M8 48H56" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="4 4"/>
                    <path d="M32 20V48" stroke={strokeColor} strokeWidth={strokeWidth}/>
                </svg>
            );
        default:
            return null;
    }
};
