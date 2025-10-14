<script>
  import CalHeatmap from "cal-heatmap";
  import Tooltip from "cal-heatmap/plugins/Tooltip";
  import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
  import "cal-heatmap/cal-heatmap.css";
  import { onMount } from "svelte";

  const cal = new CalHeatmap();

  onMount(async () => {
    const response = await fetch("/api/activities");
    const json = await response.json();

    const data = json.activities.map((a) => ({
      start_date_local: a.start_date_local,
      distance: Math.round(a.distance / 1000 * 100) / 100,
    }));

    cal.paint(
      {
        data: {
          source: data,
          type: "json",
          x: "start_date_local",
          y: "distance",
          groupY: "sum"
        },
        date: {
          start: new Date("2025-01-01"),
        },
        scale: {
          color: {
            type: "quantize",
            scheme: "Greens",
            domain: [0, 5, 7.5, 10, 15, 20, 25],
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
          CalendarLabel, {
            width: 30,
            textAlign: "start",
            text: () => dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? d : "")),
            padding: [25, 0, 0, 0]
          }
        ]
      ]
    );
  });
</script>

<div id="cal-heatmap"></div>
