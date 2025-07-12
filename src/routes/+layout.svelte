<script lang="ts">
	import '../app.css';

	let { children } = $props();

	// Components
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { getLocalTimeZone, today } from '@internationalized/date';

	// Stores
	import { formattedDay, habits, habitsDays, selectedDay, selectedDayHabits } from '$lib/store.js';

	// Dark Mode
	import { ModeWatcher, setMode } from 'mode-watcher';
	setMode('dark');

	// Timer
	import { onMount } from 'svelte';
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);

	function updateCountdown() {
		const now = new Date();
		const tomorrow = new Date(now);
		tomorrow.setHours(24, 0, 0, 0); // Midnight of next day

		const diff = Math.floor((tomorrow.getTime() - now.getTime()) / 1000); // difference in seconds

		hours = Math.floor(diff / 3600);
		minutes = Math.floor((diff % 3600) / 60);
		seconds = diff % 60;
	}

	let interval: ReturnType<typeof setInterval> | undefined;


function formatDate() {
		const year = $selectedDay.year;
		const month = String($selectedDay.month).padStart(2, '0');
		const day = String($selectedDay.day).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
	let _habitsDays = {};
	let habitsForSelectedDay = {};
	onMount(() => {
		selectedDay.set(today(getLocalTimeZone()));
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

	updateCountdown();
	interval = setInterval(() => {
		updateCountdown();
	}, 1000);

	return () => clearInterval(interval);
});

	// Date
	function formatSelectedDate(day: number, month: number, year: number) {
		const date = new Date(year, month - 1, day);
		const formatter = new Intl.DateTimeFormat('en-Uk', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
		return formatter.format(date);
	}
</script>

<ModeWatcher />
<main>
	<Sidebar.Provider>
		<AppSidebar />
		<Sidebar.Inset>
			<header
				class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4"
			>
				<Sidebar.Trigger class="-ml-1 cursor-pointer" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							{formatSelectedDate($selectedDay.day, $selectedDay.month, $selectedDay.year)}
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item>Habits</Breadcrumb.Item>
						<Breadcrumb.Separator />
						<Breadcrumb.Item>
							Tomorrow in:
							<div class="timer">
								<span>{String(hours).padStart(2, '0')}:</span>
								<span>{String(minutes).padStart(2, '0')}:</span>
								<span>{String(seconds).padStart(2, '0')}</span>
							</div>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</header>
			{@render children()}
		</Sidebar.Inset>
	</Sidebar.Provider>
</main>
