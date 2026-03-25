import { motion } from 'motion/react'

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon'

type PillarLayersProps = IconProps<keyof typeof animations>

const animations = {
  default: {
    top: {
      initial: { y: 0 },
      animate: {
        y: [0, -3, 0],
        transition: { duration: 0.45, ease: 'easeInOut' as const, delay: 0 },
      },
    },
    mid: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.45, ease: 'easeInOut' as const, delay: 0.05 },
      },
    },
    bot: {
      initial: { y: 0 },
      animate: {
        y: [0, -1, 0],
        transition: { duration: 0.45, ease: 'easeInOut' as const, delay: 0.1 },
      },
    },
  },
}

function IconComponent({ size, ...props }: PillarLayersProps) {
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
      <motion.path
        d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
        variants={variants.top}
        initial="initial"
        animate={on ? 'animate' : 'initial'}
      />
      <motion.path
        d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
        variants={variants.mid}
        initial="initial"
        animate={on ? 'animate' : 'initial'}
      />
      <motion.path
        d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
        variants={variants.bot}
        initial="initial"
        animate={on ? 'animate' : 'initial'}
      />
    </motion.svg>
  )
}

export function PillarLayers(props: PillarLayersProps) {
  return <IconWrapper icon={IconComponent} {...props} />
}
