window.addEventListener('load', () => {
	const params = new URLSearchParams(window.location.search);
	const jsonFile = params.get('jsonfile');
	const header = document.querySelector('h1');
	header.textContent = `${jsonFile}`;
	const lastepisode = localStorage.getItem(`${jsonFile} episode`);
	if (lastepisode) {
		const episode = document.getElementById('playlast');
		episode.className = 'last-episode';
		const episodelink = document.createElement('a');
		episodelink.textContent = 'Continue Last Episode';
		episodelink.href = `/player.html?video=${lastepisode}&jsonfile=${jsonFile}`;
		episode.appendChild(episodelink);
	}
	fetch(`data/${jsonFile.toLowerCase()}.json`).then(response => response.json()).then(data => {
		const container = document.getElementById('videoLinks');
		for(const season in data){
			const seasonLinks = document.createElement('div');
			const seasonButton = document.createElement('button');
			seasonButton.className = 'collapsible';
			seasonButton.textContent = season;
			seasonLinks.appendChild(seasonButton);
			const seasonContent = document.createElement('div');
			seasonContent.className = 'content';
			data[season].forEach(video => {
				const linkContainer = document.createElement('div');
				linkContainer.className = 'video-link';
				const link = document.createElement('a');
				link.href = `/player.html?video=${video.filePath}&jsonfile=${jsonFile}`;
				link.textContent = video.videoName;
				const tooltip = document.createElement('div');
				tooltip.className = 'tooltip';
				const startFromBeginningLink = document.createElement('a');
				startFromBeginningLink.href = `/player.html?video=${video.filePath}&jsonfile=${jsonFile}&start=true`;
				const playButton = document.createElement('img');
				playButton.src = 'play-button.png';
				playButton.alt = 'Start from Beginning';
				playButton.className = 'play-button';
				const tooltipText = document.createElement('span');
				tooltipText.className = 'tooltiptext';
				tooltipText.textContent = 'Start from Beginning';
				startFromBeginningLink.appendChild(playButton);
				tooltip.appendChild(startFromBeginningLink);
				tooltip.appendChild(tooltipText);
				linkContainer.appendChild(link);
				linkContainer.appendChild(tooltip);
				seasonContent.appendChild(linkContainer);
			});
			seasonLinks.appendChild(seasonContent);
			container.appendChild(seasonLinks);
		}
		const coll = document.getElementsByClassName('collapsible');
		for (let i = 0; i < coll.length; i++) {
			coll[i].addEventListener('click', function() {
				this.classList.toggle('active');
				const content = this.nextElementSibling;
				if (content.style.display === 'block')content.style.display = 'none';
				else content.style.display = 'block';
			});
		}
	}).catch(error => console.error('Error loading videos:', error));
});