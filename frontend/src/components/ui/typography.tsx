import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva("text-neutral-900 font-display", {
  variants: {
    variant: {
      "display-xl": "text-display-xl font-bold",
      "display-lg": "text-display-lg font-bold",
      h1: "text-h1 font-bold",
      h2: "text-h2 font-semibold",
      h3: "text-h3 font-semibold",
      h4: "text-h4 font-semibold font-sans", // H4 uses Inter per TDS
    },
  },
  defaultVariants: {
    variant: "h1",
  },
})

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "div" : variant === "display-xl" || variant === "display-lg" ? "h1" : variant || "h1"
    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

const textVariants = cva("text-neutral-800 font-sans", {
  variants: {
    variant: {
      "body-lg": "text-body-lg",
      "body-md": "text-body-md",
      "body-sm": "text-body-sm",
    },
  },
  defaultVariants: {
    variant: "body-md",
  },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  asChild?: boolean
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "p"
    return (
      <Comp
        ref={ref}
        className={cn(textVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export type CaptionProps = React.HTMLAttributes<HTMLSpanElement>

const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-caption text-neutral-600 font-sans", className)}
      {...props}
    />
  )
)
Caption.displayName = "Caption"

export type OverlineProps = React.HTMLAttributes<HTMLSpanElement>

const Overline = React.forwardRef<HTMLSpanElement, OverlineProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-overline text-neutral-600 font-sans", className)}
      {...props}
    />
  )
)
Overline.displayName = "Overline"

export interface DataTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  strong?: boolean
}

const DataText = React.forwardRef<HTMLSpanElement, DataTextProps>(
  ({ className, strong = false, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "font-mono",
        strong ? "font-medium" : "font-normal",
        className
      )}
      {...props}
    />
  )
)
DataText.displayName = "DataText"

export { Heading, Text, Caption, Overline, DataText }
