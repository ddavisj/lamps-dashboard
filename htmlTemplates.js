// TEMPLATES

const lampSvgTemplate = (color, colorTitle) => {
	return `
		  <svg height="50" width="50">
			  <circle fill='${color}' stroke="black" stroke-width="2" r="20" cx="25" cy="25">
				  <title>${colorTitle}</title>
			  </circle>
		  </svg>`;
};

const lampDataTemplate = (lamp, type, seriousEvents) => {
	const seriousEventsColor = seriousEvents > 0 ? 'darkred' : 'black';
	return `
	  <span class="lamp-id">${lamp.light_id}</span>
	  <span class="lamp-power">${lamp.wattage}</span>
	  <span class="lamp-type">${type}</span>
  
	  <span class="lamp-serious-events"> <span style="color: ${seriousEventsColor}" class="num-srs-events">${seriousEvents}</span></span>
	  `;
};

const headingTemplate = `
  <span id="headings">
	  <svg></svg>
	  <span class="lamp-id">ID</span>
	  <span class="lamp-power">Power</span>
	  <span class="lamp-type">Lamp Type</span>
  
	  <span class="lamp-serious-events"> 
		  S3 Events
	  </span>
	  <span class="serious-event-deets">Duration, High/Low Voltage</span>
  </span>
  `;
