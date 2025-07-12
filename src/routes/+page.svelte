<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import GoalAlert from '$lib/components/alerts/goalAlert.svelte';

	import HabitBlock from '$lib/components/habitBlock/habitBlock.svelte';

	import mdEditor from '$lib/components/mdEditor.svelte';

	import { habits, habitsDays, formattedDay } from '$lib/store.js';
	import { onMount } from 'svelte';
	import MdEditor from '$lib/components/mdEditor.svelte';

	let createHabitDialog = false;
	let habitGoal = '';
	let habitName = '';
	let showGoalAlert = false;

	function handleCreateHabitDialog(open: boolean) {
		createHabitDialog = open;
	}

	function onSave() {
		let habitsList = JSON.parse(localStorage.getItem('habits')) || [];
		if (habitGoal !== '') {
			if (Number(habitGoal) <= 0 || Number(habitGoal) > 86400) {
				showGoalAlert = true;
				return;
			} else {
				if (habitsList.some((h) => h.name === habitName)) {
					alert('Habit already exists.');
					return;
				}
				createHabitDialog = false;
				habits.update((currentHabits) => [
					...currentHabits,
					{
						id: crypto.randomUUID(),
						name: habitName,
						goal: Number(habitGoal),
						completed: false,
						createdAt: new Date().toISOString(),
						comment: ''
					}
				]);
				let habitsDaysObj = JSON.parse(localStorage.getItem('habitsDays')) || {};
				for (const date in habitsDaysObj) {
					const day = habitsDaysObj[date];
					if (!(habitName in day.habits_status)) {
						day.habits_status[habitName] = {
							completed: false,
							goal: Number(habitGoal),
							comment: ''
						};
					}
				}

				localStorage.setItem('habitsDays', JSON.stringify(habitsDaysObj));
				habitsDays.set(habitsDaysObj); // Update the Svelte store so UI reacts
			}
		}

		// Check if habit with same name already exists
	}
	function formatTodaysDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
	let date = '';
	$: dayValue = $habitsDays[$formattedDay];
	onMount(() => {
		date = formatTodaysDate(new Date());
		formattedDay.set(date);

		// Ensure habitsDays has an entry for today
		if (!$habitsDays[date]) {
			const newEntry = {
				formatted_day: date,
				habits_status: {},
				noOfCompleted: 0,
				percentCompleted: 0
			};
			// Add all habits for today
			for (const habit of $habits) {
				newEntry.habits_status[habit.name] = {
					completed: false,
					goal: habit.goal,
					comment: ''
				};
			}
			// Update both localStorage and the store
			const updatedHabitsDays = { ...$habitsDays, [date]: newEntry };
			localStorage.setItem('habitsDays', JSON.stringify(updatedHabitsDays));
			habitsDays.set(updatedHabitsDays);
		}
	});
</script>

<!-- This is a floating action button that opens the dialog to create a new habit -->
<Button
	onclick={() => (createHabitDialog = true)}
	class="hover:bg-sidebar-primary bg-opacity-10 fixed right-6 bottom-6 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full border-1 border-white p-0 text-xl text-white 
 shadow-lg  transition-all  duration-10 ease-in-out hover:border-0"
>
	+
</Button>

<Dialog.Root open={createHabitDialog} onOpenChange={handleCreateHabitDialog}>
	<Dialog.Content class="  bg-opacity-10 border-1 border-white   sm:max-w-[425px] ">
		<Dialog.Header>
			<Dialog.Title>Create a New Habit</Dialog.Title>
			<Dialog.Description>
				Add a new habit to keep track of. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<label for="name" class="text-right">Name</label>
				<Input
					id="name"
					bind:value={habitName}
					placeholder="What's the name of your habit"
					class="col-span-3"
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<label for="username" class="text-right">Goal</label>
				<Input
					id="username"
					placeholder="Goal in minutes"
					type="number"
					bind:value={habitGoal}
					max="86400"
					class="col-span-3"
				/>
			</div>
			{#if showGoalAlert}
				<div>
					<GoalAlert />
				</div>
			{/if}
		</div>
		<Dialog.Footer>
			<Button onclick={onSave} class="cursor-pointer">Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<MdEditor />
<div class="flex flex-col items-center justify-center gap-4 p-4">
	{#if dayValue !== undefined && dayValue.habits_status !== undefined && Object.keys(dayValue.habits_status).length > 0}
		{#each Object.entries(dayValue.habits_status) as [name, data] (name)}
			<HabitBlock
				habitName={name}
				habitGoal={data.goal}
				habitComment={data.comment}
				habitCompleted={data.completed}
			/>
		{/each}
	{:else}
		<p class="text-gray-500">No habits for today.</p>
	{/if}

	<!-- {#each _habitsDays[$formattedDay].habits_status as data, name (name)}
		<HabitBlock
			habitName={name}
			habitGoal={data.goal}
			habitComment={data.comment}
			habitCompleted={data.completed}
		/>
	{/each} -->
</div>
