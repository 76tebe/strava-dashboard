<script>
  import CalHeatmap from "cal-heatmap";
  import Tooltip from "cal-heatmap/plugins/Tooltip";
  import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
  import "cal-heatmap/cal-heatmap.css";
  import { onMount, tick } from "svelte";
  import { Skeleton } from "$lib/components/ui/skeleton/index.ts";

  const cal = new CalHeatmap();

  let loading = true;
  let data = [];
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch("/api/activities");
      const json = await response.json();

      data = json.activities.map((a) => ({
        start_date_local: a.start_date_local,
        distance: Math.round((a.distance / 1000) * 100) / 100,
      }));

      loading = false;

      await tick();

      cal.paint(
        {
          itemSelector: "#cal-heatmap",
          data: {
            source: data,
            type: "json",
            x: "start_date_local",
            y: "distance",
            groupY: "sum",
          },
          date: {
            start: new Date("2025-01-01"),
          },
          scale: {
            color: {
              type: "quantize",
              range: ["#ACEEBB", "#4AC26B", "#2DA44E", "#116329"],
              domain: [0, 20],
            },
          },
          domain: {
            type: "month",
            gutter: 4,
            label: {
              text: "MMM",
              textAlign: "start",
              position: "top",
            },
          },
          subDomain: {
            type: "ghDay",
            radius: 2,
            width: 11,
            height: 11,
            gutter: 4,
          },
        },
        [
          [
            Tooltip,
            {
              text: function (date, value, dayjsDate) {
                const roundedValue = value ? Math.round(value * 100) / 100 : 0;
                return (
                  (value ? roundedValue : "0") +
                  " km on " +
                  dayjsDate.format("dddd, MMMM D, YYYY")
                );
              },
            },
          ],
          [
            CalendarLabel,
            {
              width: 30,
              textAlign: "start",
              text: () =>
                dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? d : "")),
              padding: [25, 0, 0, 0],
            },
          ],
        ]
      );
    } catch (e) {
      error = e.message;
      loading = false;
    }
  });
</script>

<div
  class="-mx-4 sm:mx-0 w-2/3 bg-white border-2 border-slate-100 rounded-xl overflow-hidden"
>
  <div class="px-4 sm:px-0">
    <div class="flex flex-col gap-4 p-4 overflow-x-auto text-nowrap">
      {#if loading}
        {#each Array(4) as _, i}
          <Skeleton class="h-5 w-full rounded-sm" />
        {/each}
      {:else if error}
        <div class="flex flex-col gap-2">
          <p class="text-xs sm:text-sm">You should see my Strava data here.</p>
          <p class="text-xs sm:text-sm">
            Unfortunately, there is an error. Please kindly contact me or follow
            me on <a
              href="https://www.strava.com/athletes/122507083"
              class="underline text-[#FC5200]">Strava</a
            > if you find this.
          </p>
          <p class="text-xs sm:text-sm">Thank you!</p>
        </div>
      {:else}
        <div id="cal-heatmap" class="w-fit"></div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(#cal-heatmap .ch-subdomain-bg) {
    /* stroke: #CBD5E1;
    stroke-width: 1; */
    background-color: #eff2f5;
  }

  /* :global(#cal-heatmap .ch-subdomain-container) {
    overflow: visible;
  } */
</style>