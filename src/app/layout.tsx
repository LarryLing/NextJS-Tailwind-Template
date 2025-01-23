import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/global-blocks/theme-provider"
import { createClient } from "@/lib/supabase/server"
import NavigationBar from "@/components/global-blocks/navigation-bar/navigation-bar"
import { UserProfile } from "@/lib/types"
import "./globals.css"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "NextJS Template",
	description: "A NextJS Template",
}

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
    const supabase = await createClient()
    const user = await supabase.auth.getUser()

    const {data: profileData } = await supabase
        .from("profiles")
        .select("display_name, email, role, bio, avatar")
        .eq("id", user.data.user?.id)
        .single()

    let userProfile = null
    if (profileData) {
        userProfile = {
            ...profileData
        }

        if (profileData.avatar) {
            const { data: avatarBlob  } = await supabase.storage.from("avatars").getPublicUrl(profileData.avatar)
            userProfile.avatar = avatarBlob.publicUrl
        }
    }

	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
                >
                    <NavigationBar userProfile={userProfile as UserProfile}>
                        { userProfile &&
                            <Avatar>
                                <AvatarImage src={userProfile.avatar} />
                                <AvatarFallback>
                                    {userProfile.display_name
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar> }
                    </NavigationBar>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
