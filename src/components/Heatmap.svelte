<script>
  import CalHeatmap from "cal-heatmap";
  import Tooltip from "cal-heatmap/plugins/Tooltip";
  import "cal-heatmap/cal-heatmap.css";
  import { onMount } from "svelte";

  const cal = new CalHeatmap();

  onMount(async () => {
    const response = await fetch("/api/activities");
    const json = await response.json();

    const data = json.activities.map((a) => ({
      start_date_local: a.start_date_local,
      moving_time: Math.ceil(a.moving_time / 60),
    }));

    cal.paint(
      {
        data: {
          source: data,
          type: "json",
          x: "start_date_local",
          y: "moving_time",
          groupY: "sum"
        },
        date: {
          start: new Date("2025-01-01"),
        },
        scale: {
          color: {
            type: "quantize",
            scheme: "Greens",
            domain: [0, 20, 40, 60, 80, 100],
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
              return (
                (value ? value : "0") +
                " minutes on " +
                dayjsDate.format("dddd, MMMM D, YYYY")
              );
            },
          },
        ],
      ]
    );
  });
</script>

<div id="cal-heatmap"></div>
