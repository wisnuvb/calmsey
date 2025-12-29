import React, { JSX } from "react";
import { cn } from "@/lib/utils";

// Variant types for typography
type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label"
  | "caption"
  | "blockquote"
  | "code"
  | "pre";

// Style variants
type TypographyStyle =
  | "h2bold"
  | "h2reg"
  | "p1reg"
  | "p2reg"
  | "h1bold"
  | "h3semibold"
  | "h3bold"
  | "h3reg"
  | "h4reg"
  | "h4medium"
  | "h5bold"
  | "h5regular"
  | "h6bold"
  | "p2medium"
  | "p3regular"
  | "caption"
  | "code"
  | "blockquote";

interface TypographyProps {
  variant?: TypographyVariant;
  style?: TypographyStyle;
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  id?: string;
  "data-testid"?: string;
}

// Style mappings dengan font yang benar menggunakan Tailwind classes
const styleClasses: Record<TypographyStyle, string> = {
  // H2 Bold - menggunakan Nunito Sans
  h2bold:
    "font-bold text-[38px] leading-[120%] tracking-normal align-middle font-nunito-sans",
  h2reg:
    "font-normal text-[38px] leading-[120%] tracking-normal align-middle font-nunito-sans",

  // P1 Regular - menggunakan Work Sans
  p1reg: "font-work-sans font-normal text-base leading-[150%] align-middle",
  p2reg: "font-work-sans font-normal text-sm leading-[150%] align-middle",

  // Variant tambahan untuk kelengkapan
  h1bold: "font-bold text-3xl sm:text-[48px] font-nunito-sans leading-[120%]",
  h3semibold: "font-semibold text-2xl font-nunito-sans",
  h3bold:
    "text-xl sm:text-[32px] leading-[120%] tracking-normal font-bold font-nunito-sans",
  h3reg: "font-normal text-[32px] leading-[120%] font-nunito-sans",
  h4reg: "font-normal text-[24px] leading-[140%] font-work-sans",
  h4medium: "font-medium text-xl leading-snug tracking-tight font-nunito-sans",
  h5bold: "font-bold text-2xl leading-snug tracking-tight font-nunito-sans",
  h5regular:
    "font-normal text-lg leading-snug tracking-normal font-nunito-sans",
  h6bold: "font-bold text-xl leading-snug tracking-normal font-nunito-sans",
  p2medium:
    "font-medium text-base leading-relaxed tracking-normal font-work-sans",
  p3regular:
    "font-normal text-sm leading-relaxed tracking-normal font-work-sans",
  caption:
    "font-normal text-xs leading-tight tracking-wide uppercase font-work-sans",
  code: "font-mono text-sm bg-gray-100 px-1 py-0.5 rounded",
  blockquote:
    "font-normal text-lg leading-relaxed italic border-l-4 border-gray-300 pl-4 font-work-sans",
};

// Default variant mappings for semantic HTML
const defaultVariants: Record<TypographyVariant, TypographyStyle> = {
  h1: "h1bold",
  h2: "h2bold",
  h3: "h3semibold",
  h4: "h4medium",
  h5: "h5regular",
  h6: "h5regular",
  p: "p1reg",
  span: "p2medium",
  div: "p1reg",
  label: "p2medium",
  caption: "caption",
  blockquote: "blockquote",
  code: "code",
  pre: "code",
};

export const Typography: React.FC<TypographyProps> = ({
  variant = "p",
  style,
  children,
  className,
  as,
  id,
  "data-testid": dataTestId,
  ...props
}) => {
  // Determine the style to use
  const selectedStyle = style || defaultVariants[variant];

  // Determine the element to use
  const Component = as || variant;

  // Combine class names
  const combinedClassName = cn(styleClasses[selectedStyle], className);

  return (
    <Component
      className={combinedClassName}
      id={id}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </Component>
  );
};

// Export individual typography components for convenience
export const H1: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h4" {...props} />
);

export const H5: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h5" {...props} />
);

export const H6: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h6" {...props} />
);

export const P: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="p" {...props} />
);

export const Span: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="span" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="label" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Blockquote: React.FC<Omit<TypographyProps, "variant">> = (
  props
) => <Typography variant="blockquote" {...props} />;

export const Code: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="code" {...props} />
);

// Export default
export default Typography;
