import { writable } from 'svelte/store';
import { getLocalTimeZone, today } from '@internationalized/date';
import { browser } from '$app/environment';

let habitData = [];
let completedHabitsData = {};
let habitsDaysData = {};

if (browser) {
	const storedHabits = localStorage.getItem('habits');
	const storedCompletedHabits = localStorage.getItem('completedHabits');
	const storedHabitsDays = localStorage.getItem('habitsDays');
	if (storedHabits) {
		habitData = JSON.parse(storedHabits);
	}
	if (storedCompletedHabits) {
		completedHabitsData = JSON.parse(storedCompletedHabits);
	}
	if (storedHabitsDays) {
		habitsDaysData = JSON.parse(storedHabitsDays);
	}
}

export const selectedDay = writable(today(getLocalTimeZone()));
export const formattedDay = writable();
export const selectedDayHabits = writable();

// Subscribe to changes and update localStorage
export const habits = writable(habitData);
export const habitsDays = writable(habitsDaysData);
export const completedHabits = writable(completedHabitsData);

if (browser) {
	habits.subscribe((value) => {
		localStorage.setItem('habits', JSON.stringify(value));
	});
	completedHabits.subscribe((value) => {
		localStorage.setItem('completedHabits', JSON.stringify(value));
	});
	habitsDays.subscribe((value) => {
		localStorage.setItem('habitsDays', JSON.stringify(value));
	});
}
