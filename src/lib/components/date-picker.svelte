<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { selectedDay, formattedDay, selectedDayHabits, habits, habitsDays } from '$lib/store.js';
	import { onMount } from 'svelte';

	let value = today(getLocalTimeZone());

	let _habitsList = [];
	let _habitsDays = {};
	let habitsForSelectedDay = {};
	let todaysDate = '';

	// Load from localStorage

	function formatTodaysDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
	onMount(() => {
		_habitsList = JSON.parse(localStorage.getItem('habits')) || [];
		_habitsDays = JSON.parse(localStorage.getItem('habitsDays')) || {};

		todaysDate = formatTodaysDate(new Date());
		if (!_habitsDays[todaysDate]) {
			const newEntry = {
				formatted_day: todaysDate,
				habits_status: {},
				noOfCompleted: 0,
				percentCompleted: 0
			};

			for (const habit of _habitsList) {
				newEntry.habits_status[habit.name] = {
					completed: false,
					goal: habit.goal,
					comment: ''
				};
			}

			_habitsDays[todaysDate] = newEntry;
			localStorage.setItem('habitsDays', JSON.stringify(_habitsDays));
		}
		habitsForSelectedDay = _habitsDays[todaysDate].habits_status;
		selectedDayHabits.set(habitsForSelectedDay);
	});

	function changeValue(newValue: any) {
		value = newValue;
		selectedDay.set(value);
		formattedDay.set(formatDate());
		_habitsDays = JSON.parse(localStorage.getItem('habitsDays')) || {};

		if (!_habitsDays[$formattedDay]) {
			const newEntry = {
				formatted_day: $formattedDay,
				habits_status: {},
				noOfCompleted: 0,
				percentCompleted: 0
			};

			for (const habit of $habits) {
				newEntry.habits_status[habit.name] = {
					completed: false,
					goal: habit.goal,
					comment: ''
				};
			}

			_habitsDays[$formattedDay] = newEntry;
			localStorage.setItem('habitsDays', JSON.stringify(_habitsDays));
			habitsDays.set(_habitsDays); // <-- Add this line
		}
		habitsForSelectedDay = _habitsDays[$formattedDay].habits_status;
		selectedDayHabits.set(habitsForSelectedDay);
	}
	function formatDate() {
		const year = value.year;
		const month = String(value.month).padStart(2, '0');
		const day = String(value.day).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
</script>

<Sidebar.Group class="px-0">
	<Sidebar.GroupContent>
		<Calendar
			bind:value
			onValueChange={changeValue}
			type="single"
			class="[&_[role=gridcell]_[role=button][data-today]]:bg-sidebar-primary [&_[role=gridcell]_[role=button][data-today]]:text-sidebar-primary-foreground cursor-pointer select-none [&_[data-bits-calendar-head-cell]]:w-[33px] [&_[role=gridcell]]:w-[33px]"
		/>
	</Sidebar.GroupContent>
</Sidebar.Group>
