<script lang="ts">
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { formattedDay, habits, habitsDays } from '$lib/store';

	let { habitName, habitGoal, habitComment, habitCompleted } = $props();
	// decks.update(decksArray => decksArray.map(deck => deck.id === id ? {...deck, cards: [...deck.cards, {question: newQuestionTxt, answer: newAnswerTxt}]} : deck));

	let linethrough = $state(false);

	function toggleHabitCompletion() {
		habitCompleted = !habitCompleted;
	}
	function onCheckedChange(checked: boolean) {
		habitCompleted = checked;

		// Count the number of habits that are true and calculate the percent from habits.length

		// Update the habit's completed status in the store
		habitsDays.update((currentHabitsDays) => {
			const updatedHabitsDays = { ...currentHabitsDays };
			const todayKey = $formattedDay; // Assuming formattedDay is a string like 'YYYY-MM-DD'
			if (updatedHabitsDays[todayKey]) {
				updatedHabitsDays[todayKey].habits_status[habitName].completed = checked;
			}
			return updatedHabitsDays;
		});

		if (checked) {
			linethrough = true;
		} else {
			linethrough = false;
		}
		let noOfCompletedHabits = 0;
		let percentOfCompletedHabits = 0;
		for (const [key, obj] of Object.entries($habitsDays[$formattedDay].habits_status)) {
			if (obj.completed == true) {
				noOfCompletedHabits++;
				percentOfCompletedHabits = Math.floor(
					(noOfCompletedHabits / Object.keys($habitsDays[$formattedDay].habits_status).length) * 100
				);
				habitsDays.update((currentHabitsDays) => {
					const updatedHabitsDays = { ...currentHabitsDays };
					const todayKey = $formattedDay;
					updatedHabitsDays[todayKey].noOfCompleted = noOfCompletedHabits;
					updatedHabitsDays[todayKey].percentCompleted = percentOfCompletedHabits;
					return updatedHabitsDays;
				});
			}
		}
	}
	function onCommentChange() {
		// Update the habit's comment in the store
		habitsDays.update((currentHabitsDays) => {
			const updatedHabitsDays = { ...currentHabitsDays };
			const todayKey = $formattedDay; // Assuming formattedDay is a string like 'YYYY-MM-DD'
			if (updatedHabitsDays[todayKey]) {
				updatedHabitsDays[todayKey].habits_status[habitName].comment = habitComment;
			}
			return updatedHabitsDays;
		});
	}
</script>

{#if habitCompleted}
	<Collapsible.Root
		class="border-sidebar-primary w-full space-y-2 rounded-2xl border-1 
      bg-[url('data:image/svg+xml;base64,CiAgICAgIDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmRldi9zdmdqcyIgdmlld0JveD0iMCAwIDcwMCA3MDAiIHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBvcGFjaXR5PSIwLjgzIj4KICAgICAgICA8ZGVmcz4KICAgICAgICAgIDxmaWx0ZXIgaWQ9Im5ubm9pc2UtZmlsdGVyIiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHByaW1pdGl2ZVVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJsaW5lYXJSR0IiPgogICAgICAgICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC4xMTYiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjE1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHJlc3VsdD0idHVyYnVsZW5jZSI+PC9mZVR1cmJ1bGVuY2U+CiAgICAgICAgICAgIDxmZVNwZWN1bGFyTGlnaHRpbmcgc3VyZmFjZVNjYWxlPSIxOCIgc3BlY3VsYXJDb25zdGFudD0iMC43IiBzcGVjdWxhckV4cG9uZW50PSIyMCIgbGlnaHRpbmctY29sb3I9IiM3OTU3QTgiIHg9IjAlIiB5PSIwJSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgaW49InR1cmJ1bGVuY2UiIHJlc3VsdD0ic3BlY3VsYXJMaWdodGluZyI+CiAgICAgICAgICAgICAgPGZlRGlzdGFudExpZ2h0IGF6aW11dGg9IjMiIGVsZXZhdGlvbj0iMTAwIj48L2ZlRGlzdGFudExpZ2h0PgogICAgICAgICAgICA8L2ZlU3BlY3VsYXJMaWdodGluZz4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIgeD0iMCUiIHk9IjAlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBpbj0ic3BlY3VsYXJMaWdodGluZyIgcmVzdWx0PSJjb2xvcm1hdHJpeCI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPC9kZWZzPgogICAgICAgIDxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0PgogICAgICAgIDxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBmaWxsPSIjNzk1N2E4IiBmaWx0ZXI9InVybCgjbm5ub2lzZS1maWx0ZXIpIj48L3JlY3Q+CiAgICAgIDwvc3ZnPgogICAg')] 
    bg-clip-padding  p-4  bg-blend-overlay backdrop-blur-lg backdrop-opacity-20
  "
	>
		<div class="flex items-center justify-between space-x-4 px-4">
			<div class="flex items-center space-x-2">
				<Checkbox class="cursor-pointer" checked={habitCompleted} {onCheckedChange} id="terms" />
				<h1 class="text-sidebar-primary font-mono text-lg line-through">{habitName}</h1>
			</div>

			<div class="flex items-center space-x-2">
				<Badge>{habitGoal}mins</Badge>
				<Badge class="bg-sidebar-primary text-white">Completed</Badge>
				<Collapsible.Trigger
					class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 cursor-pointer p-0' })}
				>
					<ChevronsUpDownIcon />
					<span class="sr-only">Toggle</span>
				</Collapsible.Trigger>
			</div>
		</div>

		<Collapsible.Content class="p-4">
			<Input bind:value={habitComment} onchange={onCommentChange} placeholder="Any comment?" />
		</Collapsible.Content>
	</Collapsible.Root>
{:else}
	<Collapsible.Root
		class="w-full space-y-2 rounded-2xl border-1 border-white 
      bg-[url('data:image/svg+xml;base64,CiAgICAgIDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmRldi9zdmdqcyIgdmlld0JveD0iMCAwIDcwMCA3MDAiIHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBvcGFjaXR5PSIwLjgzIj4KICAgICAgICA8ZGVmcz4KICAgICAgICAgIDxmaWx0ZXIgaWQ9Im5ubm9pc2UtZmlsdGVyIiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHByaW1pdGl2ZVVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJsaW5lYXJSR0IiPgogICAgICAgICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC4xMTYiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjE1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHJlc3VsdD0idHVyYnVsZW5jZSI+PC9mZVR1cmJ1bGVuY2U+CiAgICAgICAgICAgIDxmZVNwZWN1bGFyTGlnaHRpbmcgc3VyZmFjZVNjYWxlPSIxOCIgc3BlY3VsYXJDb25zdGFudD0iMC43IiBzcGVjdWxhckV4cG9uZW50PSIyMCIgbGlnaHRpbmctY29sb3I9IiM3OTU3QTgiIHg9IjAlIiB5PSIwJSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgaW49InR1cmJ1bGVuY2UiIHJlc3VsdD0ic3BlY3VsYXJMaWdodGluZyI+CiAgICAgICAgICAgICAgPGZlRGlzdGFudExpZ2h0IGF6aW11dGg9IjMiIGVsZXZhdGlvbj0iMTAwIj48L2ZlRGlzdGFudExpZ2h0PgogICAgICAgICAgICA8L2ZlU3BlY3VsYXJMaWdodGluZz4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIgeD0iMCUiIHk9IjAlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBpbj0ic3BlY3VsYXJMaWdodGluZyIgcmVzdWx0PSJjb2xvcm1hdHJpeCI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgICAgPC9maWx0ZXI+CiAgICAgICAgPC9kZWZzPgogICAgICAgIDxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0PgogICAgICAgIDxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBmaWxsPSIjNzk1N2E4IiBmaWx0ZXI9InVybCgjbm5ub2lzZS1maWx0ZXIpIj48L3JlY3Q+CiAgICAgIDwvc3ZnPgogICAg')] 
    bg-clip-padding  p-4  bg-blend-overlay backdrop-blur-lg backdrop-opacity-20
  "
	>
		<div class="flex items-center justify-between space-x-4 px-4">
			<div class="flex items-center space-x-2">
				<Checkbox checked={habitCompleted} {onCheckedChange} id="terms" />

				<h1 class="font-mono text-lg">{habitName}</h1>
			</div>

			<div class="flex items-center space-x-2">
				<Badge>{habitGoal}mins</Badge>
				<Badge class="bg-sidebar-primary text-white">Pending</Badge>
				<Collapsible.Trigger
					class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 cursor-pointer p-0' })}
				>
					<ChevronsUpDownIcon />
					<span class="sr-only">Toggle</span>
				</Collapsible.Trigger>
			</div>
		</div>

		<Collapsible.Content class="p-4">
			<Input bind:value={habitComment} onchange={onCommentChange} placeholder="Any comment?" />
		</Collapsible.Content>
	</Collapsible.Root>
{/if}
