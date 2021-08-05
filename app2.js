// CONSTANTS

const lampsInfoDiv = document.querySelector('#all-lamps');
const eventsDiv = document.querySelector('#events');
const seriousEventsDiv = document.querySelector('#serious-events');
const powerIssuesDiv = document.querySelector('#power-issues');

// MAKE CONCURRENT REQUESTS

async function runAll() {
	const allEventDetailsProm = axios.get('events.json');
	const lampDetailsProm = axios.get('lights.json');

	eventsData = await allEventDetailsProm;
	lampData = await lampDetailsProm;

	eventsData = eventsData.data;
	lampData = lampData.data;

	getEvents(eventsData);
	render(lampData);
}

runAll();

// Create an array to store all serious events
let seriousEventsArr;

async function getEvents(eventsData) {
	seriousEventsArr = eventsData.reduce((groupedByLightId, currEvent) => {
		const key = currEvent.light_id;
		if (parseInt(currEvent.severity) === 3) {
			if (!groupedByLightId[key]) groupedByLightId[key] = []; // create array for lightId if it doesn't exist
			groupedByLightId[key].push(currEvent);
		}
		return groupedByLightId;
	}, {});

	for (let i = 1; i <= 3; i++) {
		let eventCount = 0;
		const eventEl = document.createElement('p');

		for (let currEvent of eventsData) {
			if (parseInt(currEvent.severity) === i) {
				eventCount++;
			}
		}
		eventEl.innerText = `Severity ${i}: Total of ${eventCount}`;
		eventsDiv.append(eventEl);
	}
}

async function render(lamps) {
	const headings = document.createElement('div');
	headings.innerHTML = headingTemplate;

	lampsInfoDiv.append(headings);

	// Loop through lamp results

	for (let lamp of lamps) {
		// Lamp Type
		const type = lamp.lamp_type === 'High Pressure Sodium' ? 'Sodium' : 'LED';

		// Add Lamp Data
		const currLampEl = document.createElement('div');
		currLampEl.classList.add('parent-div');

		// SVG Color and Title
		const colorTitle = lamp.color;
		let cssColor;

		if (colorTitle === 'B45 Sky Blue') {
			cssColor = 'blue';
		} else if (colorTitle === 'G16 Traffic Green') {
			cssColor = 'green';
		} else {
			cssColor = 'grey';
		}

		// Fetch number of serious events from the array
		const numSeriousEvents = seriousEventsArr[lamp.light_id]
			? seriousEventsArr[lamp.light_id].length
			: 0;

		// Send data to render templates
		currLampEl.innerHTML = lampSvgTemplate(cssColor, colorTitle);
		currLampEl.innerHTML += lampDataTemplate(lamp, type, numSeriousEvents);

		// Limit no of S3 events to 3
		if (seriousEventsArr[lamp.light_id]) {
			for (
				let i = 0;
				i <
				(seriousEventsArr[lamp.light_id].length <= 3
					? seriousEventsArr[lamp.light_id].length
					: 3);
				i++
			) {
				// Create separate spans for each S3 event
				const seriousEventsDetailsEl = document.createElement('span');
				seriousEventsDetailsEl.classList.add('serious-event-deets');
				const currEvent = seriousEventsArr[lamp.light_id][i];

				// Get duration of event, round to no of mins
				seriousEventsDetailsEl.innerText = `${Math.round(
					currEvent.duration_sec / 60
				)}min - ${currEvent.code === 'low_voltage' ? 'LV' : 'HV'} ${i === 2
					? '   ++   '
					: ''} `;
				currLampEl.append(seriousEventsDetailsEl);
			}
		}
		lampsInfoDiv.append(currLampEl);
	}
}

// updated!
