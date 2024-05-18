'use client'

import { useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { dark } from "@clerk/themes";
import Image from 'next/image'

export const MobileProfile = () => {
  const { openUserProfile } = useClerk()
  const { user } = useUser()
  if (!user) return null

  const handleOpenProfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    openUserProfile(
      {
        appearance: {
          elements: {
            modalContent: {
              pointerEvents: "initial",
            }
          }
        }
      })
  }

  return (
      <Image onClick={(e) => handleOpenProfile(e)} src={user.imageUrl} alt={`${user.firstName}'s Profile Image`} width={48} height={48} className="mr-2 rounded-full" />
  )
}