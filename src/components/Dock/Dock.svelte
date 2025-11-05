<script lang="ts">
  import { Github, Linkedin } from "lucide-svelte";
  import Ava from "../../assets/tebe-profile-transparent.png";
  import DockMenu from "./DockMenu.svelte";
  import DockItem from "./DockItem.svelte";
  let navs = [
    {
      label: "Linkedin",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/tubagus-ghiffari-maulana/",
    },
    { label: "Github", icon: Github, href: "https://github.com/76tebe" },
  ];
  import * as Tooltip from "$lib/components/ui/tooltip";
</script>

<DockMenu direction="middle" let:mouseX let:distance let:magnification>
  <DockItem {mouseX} {magnification} {distance}>
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          class="hover:bg-slate-900/10 transition-all duration-200 rounded-full"
        >
          <a href="https://tebe.world" target="_blank">
            <img src={Ava.src} alt="Portfolio Tebe" class="m-3 h-6 w-6" />
          </a>
        </Tooltip.Trigger>
        <Tooltip.Content sideOffset={8}>
          <p>Portfolio Tebe</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  </DockItem>
  {#each navs as item}
    <DockItem {mouseX} {magnification} {distance}>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger
            class="hover:bg-slate-900/10 transition-all duration-200 rounded-full p-3"
          >
            <a href={item.href} target="_blank" class="hover:cursor-pointer">
              <svelte:component this={item.icon} size={20} strokeWidth={1.2} />
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content sideOffset={8}>
            <p>{item.label}</p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </DockItem>
  {/each}
  <DockItem {mouseX} {magnification} {distance}>
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          class="hover:bg-slate-900/10 transition-all duration-200 rounded-full"
        >
          <a href="https://www.strava.com/athletes/122507083" target="_blank">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/strava.svg" alt="My Strava" class="m-3 h-5 w-5" />
          </a>
        </Tooltip.Trigger>
        <Tooltip.Content sideOffset={8}>
          <p>My Strava</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  </DockItem>
</DockMenu>
