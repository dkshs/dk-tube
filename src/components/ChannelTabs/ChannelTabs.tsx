import type { UserWithVideosAndPlaylists, VideoWithUser } from "@/utils/types";

import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { ChevronDown } from "lucide-react";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useSafePush } from "@/hooks/useSafePush";
import { userFormatter } from "@/utils/formatters";
import { ChannelVideoCard } from "./components";

interface ChannelTabsProps {
  readonly user: UserWithVideosAndPlaylists;
}

function TabsContent({ className, ...props }: Tabs.TabsContentProps) {
  return (
    <Tabs.Content
      className={`w-full outline-none ring-ring focus-visible:ring-2 ${className}`}
      {...props}
    />
  );
}

function TriggerButton({
  className,
  text,
  ...props
}: Tabs.TabsTriggerProps & { readonly text: string }) {
  return (
    <Tabs.Trigger
      className={`rounded-t-lg border-b border-transparent px-6 py-4 text-sm font-medium uppercase text-foreground/80 ring-ring duration-200 hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 data-[state=active]:border-foreground ${className}`}
      {...props}
    >
      {text}
    </Tabs.Trigger>
  );
}

export function ChannelTabs({ user }: ChannelTabsProps) {
  const userVideos = useMemo(
    () => [
      ...(user.videos.map((video) => ({
        ...video,
        user: userFormatter(user),
      })) as VideoWithUser[]),
    ],
    [user],
  );
  const {
    query: { tab },
  } = useRouter();
  const { safePush } = useSafePush();
  const [amountOfVideos, setAmountOfVideos] = useState(3);
  const { width: screenWidth } = useWindowDimensions();

  const currentTab = `${
    tab === "videos" ? "videos" : tab === "playlists" ? "playlists" : "home"
  }`;

  const tabs = [
    { value: "home", text: "Início" },
    { value: "videos", text: "Vídeos" },
    { value: "playlists", text: "Playlists" },
  ];

  return (
    <Tabs.Root
      defaultValue={currentTab}
      onValueChange={(tab) => safePush(`/channel/${user.id}?tab=${tab}`)}
      value={currentTab}
    >
      <Tabs.List className="border-b border-secondary">
        <div className="relative mx-auto flex w-full max-w-screen-2xl xs:px-2">
          {tabs.map((tab) => (
            <TriggerButton value={tab.value} text={tab.text} key={tab.value} />
          ))}
        </div>
      </Tabs.List>
      <div className="mx-auto flex w-full max-w-screen-2xl xs:px-2">
        <TabsContent value="home">
          {userVideos.length === 0 || !userVideos[0] ? (
            <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
              <h2 className="text-2xl font-semibold">
                {user.username} não possui vídeos
              </h2>
              <p className="text-sm text-foreground/80">
                {user.username} não possui vídeos.
              </p>
            </div>
          ) : (
            <>
              <div className="w-full pb-6 xs:max-w-5xl xs:pt-3">
                <ChannelVideoCard
                  video={userVideos[0]}
                  variant={screenWidth > 590 ? "main" : "large"}
                />
              </div>
              <div className="overflow-hidden border-t border-foreground/20 px-3 pt-6">
                <Link
                  className="font-semibold outline-none ring-ring duration-200 focus-visible:ring-2"
                  href={`/channel/${user.id}?tab=videos`}
                >
                  Vídeos
                </Link>
                <div className="relative mt-3 flex w-full snap-x snap-mandatory flex-col gap-2 overflow-x-auto pb-6 xs:flex-row xs:gap-3 xs:pt-3">
                  {userVideos
                    .filter((video) => video.id !== userVideos[0]?.id)
                    .slice(0, screenWidth < 590 ? amountOfVideos : 12)
                    .map((video) => (
                      <ChannelVideoCard
                        key={video.id}
                        video={video}
                        variant="small"
                      />
                    ))}
                  {screenWidth < 590 && userVideos.length > amountOfVideos && (
                    <button
                      type="button"
                      className="flex items-center self-center rounded-full bg-secondary p-2 duration-200 hover:bg-secondary/80 focus:bg-secondary/60 focus:outline-none"
                      onClick={() => setAmountOfVideos((prev) => prev + 3)}
                      aria-label="Carregar mais vídeos"
                    >
                      <ChevronDown />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent value="videos">
          <div className="flex w-full grid-cols-2 flex-col gap-7 pb-6 xs:grid xs:gap-4 xs:pl-1 xs:pt-3 mdlg:grid-cols-4">
            {userVideos.length > 0 &&
              userVideos.map((video) => (
                <ChannelVideoCard
                  key={video.id}
                  video={video}
                  variant="large"
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="playlists">
          <div className="flex w-full grid-cols-2 flex-col gap-7 pb-6 xs:grid xs:gap-4 xs:pl-1 xs:pt-3 mdlg:grid-cols-4">
            {user.playlists.map((playlist) => (
              <div key={playlist.id} className="h-full">
                <h3>{playlist.name}</h3>
              </div>
            ))}
          </div>
        </TabsContent>
      </div>
    </Tabs.Root>
  );
}
