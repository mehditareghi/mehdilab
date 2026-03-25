
import * as React from 'react';
import {
  motion,
  type SVGMotionProps,
  type UseInViewOptions,
  type Variants,
  type HTMLMotionProps,
} from 'motion/react';

import { cn } from '@/lib/utils';
import { useIsInView } from '@/hooks/use-is-in-view';
import { Slot, type WithAsChild } from '@/components/animate-ui/primitives/animate/slot';

const staticAnimations = {
  path: {
    initial: { pathLength: 1 },
    animate: {
      pathLength: [0.05, 1],
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  } as Variants,
  'path-loop': {
    initial: { pathLength: 1 },
    animate: {
      pathLength: [1, 0.05, 1],
      transition: {
        duration: 1.6,
        ease: 'easeInOut',
      },
    },
  } as Variants,
} as const;

type StaticAnimations = keyof typeof staticAnimations;
type TriggerProp<T = string> = boolean | StaticAnimations | T;
type Trigger = TriggerProp<string>;

type AnimateIconContextValue = {
  animation: StaticAnimations | string;
  loop: boolean;
  loopDelay: number;
  /** When true, icon SVGs should use animate="animate" variant (hover / play). */
  active: boolean;
  animate?: Trigger;
  initialOnAnimateEnd?: boolean;
  completeOnStop?: boolean;
  persistOnAnimateEnd?: boolean;
  delay?: number;
};

type DefaultIconProps<T = string> = {
  animate?: TriggerProp<T>;
  animateOnHover?: TriggerProp<T>;
  animateOnTap?: TriggerProp<T>;
  animateOnView?: TriggerProp<T>;
  animateOnViewMargin?: UseInViewOptions['margin'];
  animateOnViewOnce?: boolean;
  animation?: T | StaticAnimations;
  loop?: boolean;
  loopDelay?: number;
  initialOnAnimateEnd?: boolean;
  completeOnStop?: boolean;
  persistOnAnimateEnd?: boolean;
  delay?: number;
};

type AnimateIconProps<T = string> = WithAsChild<
  HTMLMotionProps<'span'> &
    DefaultIconProps<T> & {
      children: React.ReactNode;
      asChild?: boolean;
    }
>;

type IconProps<T> = DefaultIconProps<T> &
  Omit<SVGMotionProps<SVGSVGElement>, 'animate'> & {
    size?: number;
  };

type IconWrapperProps<T> = IconProps<T> & {
  icon: React.ComponentType<IconProps<T>>;
};

const AnimateIconContext = React.createContext<AnimateIconContextValue | null>(
  null,
);

function useAnimateIconContext() {
  const context = React.useContext(AnimateIconContext);
  if (!context)
    return {
      animation: 'default',
      loop: false,
      loopDelay: 0,
      active: false,
      animate: undefined,
      initialOnAnimateEnd: undefined,
      completeOnStop: undefined,
      persistOnAnimateEnd: undefined,
      delay: undefined,
    };
  return context;
}

function composeEventHandlers<E extends React.SyntheticEvent<unknown>>(
  theirs?: (event: E) => void,
  ours?: (event: E) => void,
) {
  return (event: E) => {
    theirs?.(event);
    ours?.(event);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

function AnimateIcon({
  asChild = false,
  animate = false,
  animateOnHover = false,
  animateOnTap = false,
  animateOnView = false,
  animateOnViewMargin = '0px',
  animateOnViewOnce = true,
  animation = 'default',
  loop = false,
  loopDelay = 0,
  initialOnAnimateEnd = false,
  completeOnStop = false,
  persistOnAnimateEnd = false,
  delay = 0,
  children,
  ...props
}: AnimateIconProps) {
  void persistOnAnimateEnd;
  const [localAnimate, setLocalAnimate] = React.useState<boolean>(() => {
    if (animate === undefined || animate === false) return false;
    return delay <= 0;
  });
  const [currentAnimation, setCurrentAnimation] = React.useState<
    string | StaticAnimations
  >(typeof animate === 'string' ? animate : animation);

  /** Only sync `animate` prop → stop when it transitions true → false; never stomp hover/tap/view. */
  const prevControlledAnimateRef = React.useRef<boolean | undefined>(undefined);

  const delayRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopDelayRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAnimation = React.useCallback(
    (trigger: TriggerProp) => {
      const next = typeof trigger === 'string' ? trigger : animation;
      if (delayRef.current) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }
      setCurrentAnimation(next);
      if (delay > 0) {
        setLocalAnimate(false);
        delayRef.current = setTimeout(() => {
          setLocalAnimate(true);
        }, delay);
      } else {
        setLocalAnimate(true);
      }
    },
    [animation, delay],
  );

  const stopAnimation = React.useCallback(() => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    if (loopDelayRef.current) {
      clearTimeout(loopDelayRef.current);
      loopDelayRef.current = null;
    }
    setLocalAnimate(false);
  }, []);

  React.useEffect(() => {
    if (animate === undefined) return;
    setCurrentAnimation(typeof animate === 'string' ? animate : animation);
    if (animate) {
      startAnimation(animate as TriggerProp);
      prevControlledAnimateRef.current = true;
    } else {
      if (prevControlledAnimateRef.current === true) {
        stopAnimation();
      }
      prevControlledAnimateRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  React.useEffect(() => {
    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
      if (loopDelayRef.current) clearTimeout(loopDelayRef.current);
    };
  }, []);

  const viewOuterRef = React.useRef<HTMLElement>(null);
  const { ref: inViewRef, isInView } = useIsInView(viewOuterRef, {
    inView: !!animateOnView,
    inViewOnce: animateOnViewOnce,
    inViewMargin: animateOnViewMargin,
  });

  React.useEffect(() => {
    if (!animateOnView) return;
    if (isInView) startAnimation(animateOnView);
    else stopAnimation();
  }, [isInView, animateOnView, startAnimation, stopAnimation]);

  const childProps = (
    React.isValidElement(children) ? (children as React.ReactElement).props : {}
  ) as AnyProps;

  const handleMouseEnter = composeEventHandlers<React.MouseEvent<HTMLElement>>(
    childProps.onMouseEnter,
    () => {
      if (animateOnHover) startAnimation(animateOnHover);
    },
  );

  const handleMouseLeave = composeEventHandlers<React.MouseEvent<HTMLElement>>(
    childProps.onMouseLeave,
    () => {
      if (animateOnHover || animateOnTap) stopAnimation();
    },
  );

  const handlePointerDown = composeEventHandlers<
    React.PointerEvent<HTMLElement>
  >(childProps.onPointerDown, () => {
    if (animateOnTap) startAnimation(animateOnTap);
  });

  const handlePointerUp = composeEventHandlers<React.PointerEvent<HTMLElement>>(
    childProps.onPointerUp,
    () => {
      if (animateOnTap) stopAnimation();
    },
  );

  const content = asChild ? (
    <Slot
      ref={inViewRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      {...props}
    >
      {children}
    </Slot>
  ) : (
    <motion.span
      ref={inViewRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      {...props}
    >
      {children}
    </motion.span>
  );

  return (
    <AnimateIconContext.Provider
      value={{
        animation: currentAnimation,
        loop,
        loopDelay,
        active: localAnimate,
        animate,
        initialOnAnimateEnd,
        completeOnStop,
        delay,
      }}
    >
      {content}
    </AnimateIconContext.Provider>
  );
}

const pathClassName =
  "[&_[stroke-dasharray='1px_1px']]:![stroke-dasharray:1px_0px]";

function IconWrapper<T extends string>({
  size = 28,
  animation: animationProp,
  animate,
  animateOnHover,
  animateOnTap,
  animateOnView,
  animateOnViewMargin,
  animateOnViewOnce,
  icon: IconComponent,
  loop,
  loopDelay,
  persistOnAnimateEnd,
  initialOnAnimateEnd,
  delay,
  completeOnStop,
  className,
  ...props
}: IconWrapperProps<T>) {
  const context = React.useContext(AnimateIconContext);

  if (context) {
    const {
      animation: parentAnimation,
      loop: parentLoop,
      loopDelay: parentLoopDelay,
      active: parentActive,
      animate: parentAnimate,
      persistOnAnimateEnd: parentPersistOnAnimateEnd,
      initialOnAnimateEnd: parentInitialOnAnimateEnd,
      delay: parentDelay,
      completeOnStop: parentCompleteOnStop,
    } = context;

    const hasOverrides =
      animate !== undefined ||
      animateOnHover !== undefined ||
      animateOnTap !== undefined ||
      animateOnView !== undefined ||
      loop !== undefined ||
      loopDelay !== undefined ||
      initialOnAnimateEnd !== undefined ||
      persistOnAnimateEnd !== undefined ||
      delay !== undefined ||
      completeOnStop !== undefined;

    if (hasOverrides) {
      const inheritedAnimate: Trigger = parentActive
        ? (animationProp ?? parentAnimation ?? 'default')
        : false;

      const finalAnimate: Trigger = (animate ??
        parentAnimate ??
        inheritedAnimate) as Trigger;

      return (
        <AnimateIcon
          animate={finalAnimate}
          animateOnHover={animateOnHover}
          animateOnTap={animateOnTap}
          animateOnView={animateOnView}
          animateOnViewMargin={animateOnViewMargin}
          animateOnViewOnce={animateOnViewOnce}
          animation={animationProp ?? parentAnimation}
          loop={loop ?? parentLoop}
          loopDelay={loopDelay ?? parentLoopDelay}
          persistOnAnimateEnd={persistOnAnimateEnd ?? parentPersistOnAnimateEnd}
          initialOnAnimateEnd={initialOnAnimateEnd ?? parentInitialOnAnimateEnd}
          delay={delay ?? parentDelay}
          completeOnStop={completeOnStop ?? parentCompleteOnStop}
          asChild={false}
        >
          <span className="inline-flex items-center justify-center align-middle leading-none !pointer-events-auto">
            <IconComponent
              size={size}
              className={cn(
                className,
                '!pointer-events-auto',
                ((animationProp ?? parentAnimation) === 'path' ||
                  (animationProp ?? parentAnimation) === 'path-loop') &&
                  pathClassName,
              )}
              {...props}
            />
          </span>
        </AnimateIcon>
      );
    }

    const animationToUse = animationProp ?? parentAnimation;
    const loopToUse = parentLoop;
    const loopDelayToUse = parentLoopDelay;

    return (
      <AnimateIconContext.Provider
        value={{
          animation: animationToUse,
          loop: loopToUse,
          loopDelay: loopDelayToUse,
          active: parentActive,
          animate: parentAnimate,
          initialOnAnimateEnd: parentInitialOnAnimateEnd,
          delay: parentDelay,
          completeOnStop: parentCompleteOnStop,
        }}
      >
        <IconComponent
          size={size}
          className={cn(
            className,
            '!pointer-events-auto',
            (animationToUse === 'path' || animationToUse === 'path-loop') &&
              pathClassName,
          )}
          {...props}
        />
      </AnimateIconContext.Provider>
    );
  }

  if (
    animate !== undefined ||
    animateOnHover !== undefined ||
    animateOnTap !== undefined ||
    animateOnView !== undefined ||
    animationProp !== undefined
  ) {
    return (
      <AnimateIcon
        animate={animate}
        animateOnHover={animateOnHover}
        animateOnTap={animateOnTap}
        animateOnView={animateOnView}
        animateOnViewMargin={animateOnViewMargin}
        animateOnViewOnce={animateOnViewOnce}
        animation={animationProp}
        loop={loop}
        loopDelay={loopDelay}
        delay={delay}
        completeOnStop={completeOnStop}
        asChild={false}
      >
        <span className="inline-flex items-center justify-center align-middle leading-none !pointer-events-auto">
          <IconComponent
            size={size}
            className={cn(
              className,
              '!pointer-events-auto',
              (animationProp === 'path' || animationProp === 'path-loop') &&
                pathClassName,
            )}
            {...props}
          />
        </span>
      </AnimateIcon>
    );
  }

  return (
    <IconComponent
      size={size}
      className={cn(
        className,
        '!pointer-events-auto',
        (animationProp === 'path' || animationProp === 'path-loop') &&
          pathClassName,
      )}
      {...props}
    />
  );
}

function getVariants<
  V extends { default: T; [key: string]: T },
  T extends Record<string, Variants>,
>(animations: V): T {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { animation: animationType } = useAnimateIconContext();

  let result: T;

  if (animationType in staticAnimations) {
    const variant = staticAnimations[animationType as StaticAnimations];
    result = {} as T;
    for (const key in animations.default) {
      if (
        (animationType === 'path' || animationType === 'path-loop') &&
        key.includes('group')
      )
        continue;
      result[key] = variant as T[Extract<keyof T, string>];
    }
  } else {
    result = (animations[animationType as keyof V] as T) ?? animations.default;
  }

  return result;
}

export {
  pathClassName,
  staticAnimations,
  AnimateIcon,
  IconWrapper,
  useAnimateIconContext,
  getVariants,
  type IconProps,
  type IconWrapperProps,
  type AnimateIconProps,
  type AnimateIconContextValue,
};
