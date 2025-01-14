"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "../../ui/navigation-menu"
import { Button } from "../../ui/button"
import { MenuIcon, PlusIcon, XIcon } from "lucide-react"
import { Separator } from "../../ui/separator"
import { signout } from "@/lib/actions"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import AvatarPopover from "./avatar-popover"
import NotificationPopover from "./notification-popover"
import UserWidget from "./user-widget"

const NavbarItems = [
	{
		name: "Item 1",
		href: "#",
	},
	{
		name: "Item 2",
		href: "#",
	},
	{
		name: "Item 3",
		href: "#",
	},
	{
		name: "Item 4",
		href: "#",
	},
]

const UserSidebarItems = [
	{
		name: "My Profile",
		href: "/account",
	},
	{
		name: "Notifications",
		href: "/notifications",
	},
	{
		name: "Settings",
		href: "/settings",
	},
]

export default function NavigationBar() {
	const supabase = createClient()

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		async function getUser() {
			const session = await supabase.auth.getUser()

			if (session.data.user) {
				setUser(session.data.user)
			}
		}

		getUser()
	}, [])

	return (
		<NavigationMenu className="z-[9999] sticky text-nowrap max-w-none w-full">
			<div className="z-[9999] w-full h-[80px] pl-6 pr-4 md:pr-6 flex justify-between items-center border-b-[1px] border-border">
				<div className="flex justify-start items-center">
					<Link
						href="/"
						className="flex item-center font-bold text-2xl gap-2"
					>
						<div className="flex shrink-0 items-center">
							<img
								className="h-8 w-auto"
								src="https://tailwindui.com/plus/img/logos/mark.svg?color=black"
								alt="Your Company"
							/>
						</div>
						<span className="hidden lg:inline">Website Name</span>
					</Link>
					<NavigationMenuList className="md:flex hidden ml-4 gap-4">
						{NavbarItems.map((item) => {
							return (
								<NavigationMenuItem key={item.name}>
									<Link
										href={item.href}
										legacyBehavior
										passHref
									>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
										>
											{item.name}
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							)
						})}
					</NavigationMenuList>
				</div>
				<div className="flex justify-center items-center gap-4">
					{user ? (
						<>
							<Link href="#">
								<Button
									variant="default"
									className="font-bold"
								>
									<PlusIcon />
									Action Button
								</Button>
							</Link>
							<div className="hidden md:flex justify-center items-center gap-4">
								<NotificationPopover />
								<AvatarPopover user={user} />
							</div>
						</>
					) : (
						<>
							<Link href="/login">
								<Button variant="link">Login</Button>
							</Link>
							<Link href="/signup">
								<Button variant="default">Sign Up</Button>
							</Link>
						</>
					)}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsMenuOpen(true)}
						className="md:hidden"
					>
						<MenuIcon />
					</Button>
				</div>
			</div>
			<div
				className={`md:hidden z-[9999] fixed ${isMenuOpen ? "right-0" : "-right-full"} top-0 w-[320px] h-full bg-background overflow-y-auto border-l-[1px] border-border transition-all duration-200`}
			>
				<div className="flex justify-between items-center h-[80px] w-full pl-6 pr-4 py-4">
					<div className="flex shrink-0 items-center">
						<img
							className="h-8 w-auto"
							src="https://tailwindui.com/plus/img/logos/mark.svg?color=black"
							alt="Your Company"
						/>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsMenuOpen(false)}
					>
						<XIcon />
					</Button>
				</div>
				<NavigationMenuList className="flex-col justify-center items-start gap-2 w-full px-3 pb-4">
					{NavbarItems.map((item) => {
						return (
							<NavigationMenuItem key={item.name}>
								<Link
									href={item.href}
									legacyBehavior
									passHref
								>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
									>
										{item.name}
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						)
					})}
				</NavigationMenuList>
				{user && (
					<>
						<div className="mx-2">
							<Separator className="w-full" />
						</div>
						<div className="pl-6 pr-4 py-4">
							<UserWidget userMetadata={user.user_metadata} />
							<NavigationMenuList className="flex flex-col items-start gap-2 mt-2">
								{UserSidebarItems.map((item) => {
									return (
										<NavigationMenuItem key={item.name}>
											<Link href={item.href}>
												<Button
													variant="link"
													className="block px-0"
												>
													{item.name}
												</Button>
											</Link>
										</NavigationMenuItem>
									)
								})}
								<Button
									variant="link"
									onClick={signout}
									className="px-0"
								>
									Sign Out
								</Button>
							</NavigationMenuList>
						</div>
					</>
				)}
			</div>
		</NavigationMenu>
	)
}
