import { motion, type Variants } from 'motion/react'

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon'

type PillarFlaskProps = IconProps<keyof typeof animations>

const noop: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
}

const animations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.45, ease: 'easeInOut' as const },
      },
    },
    p1: noop,
    p2: noop,
    p3: noop,
  },
}

function IconComponent({ size, ...props }: PillarFlaskProps) {
  const { active } = useAnimateIconContext()
  const variants = getVariants(animations)
  const on = active === true

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <motion.g
        variants={variants.group}
        initial="initial"
        animate={on ? 'animate' : 'initial'}
      >
        <motion.path
          d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"
          variants={variants.p1}
          initial="initial"
          animate={on ? 'animate' : 'initial'}
        />
        <motion.path
          d="M6.453 15h11.094"
          variants={variants.p2}
          initial="initial"
          animate={on ? 'animate' : 'initial'}
        />
        <motion.path
          d="M8.5 2h7"
          variants={variants.p3}
          initial="initial"
          animate={on ? 'animate' : 'initial'}
        />
      </motion.g>
    </motion.svg>
  )
}

export function PillarFlask(props: PillarFlaskProps) {
  return <IconWrapper icon={IconComponent} {...props} />
}
