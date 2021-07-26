// CONSTANTS

const lampsInfoDiv = document.querySelector('#all-lamps');
const eventsDiv = document.querySelector('#events');
const seriousEventsDiv = document.querySelector('#serious-events');
const powerIssuesDiv = document.querySelector('#power-issues');

// EVENTS

async function fetchEventDetails(url) {
	const response = await axios.get(url);
	return response;
}

let eventsData;
let seriousEventsArr;

fetchEventDetails('events.json')
	.then(res => {
		// ASST PART 3: The total number of severe (severity: 3) events per light
		// ASST PART 4: The basic event information for those severe events per light (no more than 3)

		const events = res.data;

		// Create an array to store all serious events
		seriousEventsArr = events.reduce((groupedByLightId, currEvent) => {
			const key = currEvent.light_id;
			if (parseInt(currEvent.severity) === 3) {
				if (!groupedByLightId[key]) groupedByLightId[key] = []; /// create array for lightId if it doesn't exist
				groupedByLightId[key].push(currEvent);
			}
			return groupedByLightId;
		}, {});

		for (let i = 1; i <= 3; i++) {
			let eventCount = 0;
			const eventEl = document.createElement('p');

			for (let currEvent of events) {
				if (parseInt(currEvent.severity) === i) {
					eventCount++;
				}
			}
			eventEl.innerText = `Severity ${i}: Total of ${eventCount}`;
			eventsDiv.append(eventEl);
		}
	})
	.catch(err => {
		console.log('IN CATCH!!');
		console.log(err);
	});

// ASST PART 1: The total number of events for each severity (1,2,3) regardless of light
// ASST PART 2: The basic light information for all lights (everything within the light object)

// GET LAMP DETAILS AND RENDER
async function fetchLampDetails(url) {
	const response = await axios.get(url);
	render(response.data);
}
fetchLampDetails('lights.json').catch(err => {
	console.log('IN CATCH!!');
	console.log(err);
});

const render = lamps => {
	console.log(seriousEventsArr);

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
};
