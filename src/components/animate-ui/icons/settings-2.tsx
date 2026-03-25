import { motion, type Variants } from 'motion/react'

import {
  getVariants,
  useAnimateIconContext,
  IconWrapper,
  type IconProps,
} from '@/components/animate-ui/icons/icon'

type Settings2Props = IconProps<keyof typeof animations>

const animations = {
  default: {
    group: {
      initial: {
        rotate: 0,
        transition: {
          duration: 0.35,
          ease: 'easeInOut',
        },
      },
      animate: {
        rotate: [0, 36, -24, 0],
        transition: {
          duration: 0.7,
          ease: 'easeInOut',
        },
      },
    },
  } satisfies Record<string, Variants>,
} as const

function IconComponent({ size, ...props }: Settings2Props) {
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
        style={{ transformOrigin: '12px 12px' }}
      >
        <path d="M14 17H5" />
        <path d="M19 7h-9" />
        <circle cx="17" cy="17" r="3" fill="none" />
        <circle cx="7" cy="7" r="3" fill="none" />
      </motion.g>
    </motion.svg>
  )
}

function Settings2(props: Settings2Props) {
  return <IconWrapper icon={IconComponent} {...props} />
}

export {
  animations,
  Settings2,
  Settings2 as Settings2Icon,
  type Settings2Props,
  type Settings2Props as Settings2IconProps,
}
