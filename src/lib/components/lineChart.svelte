<script>
	import { formattedDay, habitsDays } from '$lib/store';
	import chartjs from 'chart.js/auto';
	import * as Select from '$lib/components/ui/select/index.js';
	let chartData;
	import { onMount } from 'svelte';

	/**
	 * @type {number[]}
	 */
	let chartValues = [];
	let chartLabels = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	let ctx;
	let chartCanvas;

	let jan = 0;
	let feb = 0;
	let mar = 0;
	let apr = 0;
	let may = 0;
	let jun = 0;
	let jly = 0;
	let aug = 0;
	let sept = 0;
	let oct = 0;
	let nov = 0;
	let dec = 0;

	let chartYear;
	onMount(() => {
		ting();
		const [year, month, day] = String($formattedDay).split('-');
		chartYear = year;

		ctx = chartCanvas.getContext('2d');
		var chart = new chartjs(ctx, {
			type: 'bar',
			data: {
				labels: chartLabels,
				datasets: [
					{
						label: `% of Goal Completed for ${chartYear}`,
						backgroundColor: 'oklch(0.6559 0.2118 354.3084)',
						borderColor: 'rgb(255, 99, 132)',
						data: chartValues
					}
				]
			},
			options: {
				scales: {
					y: {
						max: 100,
						min: 0
					}
				}
			}
		});
	});

	function ting() {
		for (const [key, obj] of Object.entries($habitsDays)) {
			const [year, month, day] = String(obj.formatted_day).split('-');
			if (year == '2025') {
				switch (month) {
					case '01':
						jan += Number(obj.percentCompleted);
						break;
					case '02':
						feb += Number(obj.percentCompleted);
						break;
					case '03':
						mar += Number(obj.percentCompleted);
						break;
					case '04':
						apr += Number(obj.percentCompleted);
						break;
					case '05':
						may += Number(obj.percentCompleted);
						break;
					case '06':
						jun += Number(obj.percentCompleted);
						break;
					case '07':
						jly += Number(obj.percentCompleted);
						break;
					case '08':
						aug += Number(obj.percentCompleted);
						break;
					case '09':
						sept += Number(obj.percentCompleted);
						break;
					case '10':
						oct += Number(obj.percentCompleted);
						break;
					case '11':
						nov += Number(obj.percentCompleted);
						break;
					case '12':
						dec += Number(obj.percentCompleted);
						break;
					default:
						console.error(`Invalid month: ${month}`);
				}
			}
		}
		jan = Math.floor((jan / (31 * 100)) * 100);
		feb = Math.floor((feb / (28 * 100)) * 100);
		mar = Math.floor((mar / (31 * 100)) * 100);
		apr = Math.floor((apr / (30 * 100)) * 100);
		may = Math.floor((may / (31 * 100)) * 100);
		jun = Math.floor((jun / (30 * 100)) * 100);
		jly = Math.floor((jly / (31 * 100)) * 100);
		aug = Math.floor((aug / (31 * 100)) * 100);
		sept = Math.floor((sept / (31 * 100)) * 100);
		oct = Math.floor((oct / (31 * 100)) * 100);
		nov = Math.floor((nov / (30 * 100)) * 100);
		dec = Math.floor((dec / (31 * 100)) * 100);
		chartValues.push(jan, feb, mar, apr, may, jun, jly, aug, sept, oct, nov, dec);
		console.log(chartValues);
	}
</script>

<div class="w-full">
	<canvas bind:this={chartCanvas}></canvas>
</div>
