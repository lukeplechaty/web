window.addEventListener('load', () => {
	fetch('data/films.json').then(response => response.json()).then(data => {
		const videos = data.videos;
		const header = document.querySelector('h1');
		header.textContent = `${videos.length} Films`;
		createVideoLinks(videos);
		const searchInput = document.getElementById('searchInput');
		searchInput.addEventListener('input', () => filterVideos(videos, searchInput.value));
	}).catch(error => console.error('Error loading videos:', error));
});
function createVideoLinks(videos) {
	const container = document.getElementById('videoLinks');
	container.innerHTML = '';
	videos.forEach(video => {
		const linkContainer = createLinkContainer(video);
		container.appendChild(linkContainer);
	});
}
function createLinkContainer(video) {
	const linkContainer = document.createElement('div');
	linkContainer.className = 'video-link';
	const thumbnail = createThumbnail(video.filePath);
	const link = createLink(video.filePath);
	const tooltip = createTooltip(video.filePath);
	fetch(`/verify/films/${video.filePath}.mp4`).then(response => {
		if (response.status == 404) {
			const text1 = document.createElement('div');
			text1.className = 'diagonal-text';
			text1.textContent = 'NO VIDEO';
			link.appendChild(text1);
		}
	});
	link.appendChild(thumbnail);
	link.appendChild(document.createTextNode(video.videoName));
	link.appendChild(tooltip);
	linkContainer.appendChild(link);
	return linkContainer;
}
function createThumbnail(filePath) {
	const thumbnail = document.createElement('img');
	thumbnail.src = `images/${filePath}.jpg`;
	thumbnail.alt = `NEED\r\n IMAGE\r\n HEAR`;
	thumbnail.className = 'video-thumbnail';
	return thumbnail;
}
function createLink(filePath) {
	const link = document.createElement('a');
	link.href = `/player.html?video=films/${filePath}&jsonfile=films&film=true`;
	link.className = 'link-wrapper';
	return link;
}
function createTooltip(filePath) {
	const tooltip = document.createElement('div');
	tooltip.className = 'tooltip';
	const startFromBeginningLink = document.createElement('a');
	startFromBeginningLink.href = `/player.html?video=films/${filePath}&jsonfile=films&film=true&start=true`;
	const playButton = document.createElement('img');
	playButton.src = 'images/play-button.png';
	playButton.alt = 'Start from Beginning';
	playButton.className = 'play-button';
	const tooltipText = document.createElement('span');
	tooltipText.className = 'tooltiptext';
	tooltipText.textContent = 'Start from Beginning';
	startFromBeginningLink.appendChild(playButton);
	tooltip.appendChild(startFromBeginningLink);
	tooltip.appendChild(tooltipText);
	return tooltip;
}
function filterVideos(videos, query) {
	const filteredVideos = videos.filter(video => video.videoName.toLowerCase().includes(query.toLowerCase()));
	createVideoLinks(filteredVideos);
}
	