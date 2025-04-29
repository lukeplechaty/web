window.addEventListener('load', () => {
	const params = new URLSearchParams(window.location.search);
	let videoFile = params.get('video');
	const startFromBeginning = params.get('start') === 'true';
	const jsonFile = params.get('jsonfile');
	const film = params.get('film') === 'true';
	let currentVideoIndex = 0;
	const videoList = [];
	const videoElement = document.getElementById('videoPlayer');
	const popup = document.getElementById('popup');
	const countdownElement = document.createElement('span');
	countdownElement.className = 'countdown';
	const skipCredits = document.createElement('button');
	skipCredits.textContent = 'Skip';
	const skipIntro = document.createElement('button');
	skipIntro.textContent = 'Skip';
	const popup2 = document.getElementById('popup2');
	const text = document.createElement('span');
	text.className = 'text';
	const backup = document.createElement('button');
	backup.id = 'backup';
	backup.textContent = 'Back to Browse';
	const container = document.createElement('div');
	container.appendChild(backup);
	popup2.appendChild(text);
	popup2.appendChild(container);
	let popupTimeout;
	let countdown;
	try{
		fetch(`data/${jsonFile.toLowerCase()}.json`).then(response => response.json()).then(data => {
			for (const season in data) {
				videoList.push(...data[season]);
			}
			if(film)
				currentVideoIndex = videoList.findIndex(video => video.filePath.includes(videoFile.replace('films/','')));
			else
			{
				currentVideoIndex = videoList.findIndex(video => video.filePath.includes(videoFile));
			}
		});
	} catch (error) {}
	if (videoFile) {
		if(!film)
			videoElement.src = `/videos/series/${jsonFile.toLowerCase()}/${videoFile}.mp4`;
		else 
			videoElement.src = `/videos/${videoFile}.mp4`;
		videoElement.preload = 'auto';
		if (!startFromBeginning) {
			const savedTime = localStorage.getItem(videoFile);
			if(videoList.length > 1) {
				savedTime = localStorage.getItem(videoList[currentVideoIndex].filePath);
			}
			if (savedTime) {
				videoElement.currentTime = savedTime;
			}
		}
		videoElement.addEventListener('timeupdate', () => {
			if(!film) {
				localStorage.setItem(videoList[currentVideoIndex].filePath, videoElement.currentTime);
			} else {
				localStorage.setItem(videoFile, videoElement.currentTime);
			}
			if (!film && videoElement.duration - videoElement.currentTime <= videoList[currentVideoIndex].endCredits && !popupTimeout && currentVideoIndex < videoList.length) {
				popup.appendChild(countdownElement);
				popup.appendChild(skipCredits);
				popup.style.display = 'block';
				countdown = 10;
				countdownElement.textContent = `Next video in ${countdown}`;
				popupTimeout = setTimeout(() => {
					popuptimer();
				}, 1000);
			} else if (!film && videoElement.currentTime > videoList[currentVideoIndex].introStart && videoElement.currentTime < (videoList[currentVideoIndex].introStart + videoList[currentVideoIndex].introLength)) {
				popup.appendChild(skipIntro);
				popup.style.display = 'block';
			} else if (!film && videoElement.currentTime > (videoList[currentVideoIndex].introStart + videoList[currentVideoIndex].introLength) && videoElement.duration - videoElement.currentTime > videoList[currentVideoIndex].endCredits) {
				popup.style.display = 'none';
				while (popup.hasChildNodes()) {
					popup.removeChild(popup.firstChild);
				}
			}
		});
		videoElement.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});
		videoElement.addEventListener('pause', () => {
			text.textContent = videoList[currentVideoIndex].videoName;
			popup2.style.display = 'block';
		});
		videoElement.addEventListener('ended', () => {
			text.textContent = videoList[currentVideoIndex].videoName;
			popup2.style.display = 'block';
		});
		videoElement.addEventListener('play', () => {
			popup2.style.display = 'none';
		});
		videoElement.play();
	} else {
		alert('No video file specified.');
	}
	backup.addEventListener('click', () => {
		history.back()
	});
	skipCredits.addEventListener('click', () => {
		popup.style.display = 'none';
		clearTimeout(popupTimeout);
		nextVideo();
	});
	skipIntro.addEventListener('click', () => {
		popup.style.display = 'none';
		while (popup.hasChildNodes()) {
			popup.removeChild(popup.firstChild);
		}
		videoElement.currentTime = videoList[currentVideoIndex].introStart + videoList[currentVideoIndex].introLength;
	});
	function popuptimer() {
		if(countdown <= 0) {
			popup.style.display = 'none';
			nextVideo();
		}
		else {
			countdown--;
			countdownElement.textContent = `Next video in ${countdown}`;
			clearTimeout(popupTimeout);
			popupTimeout = setTimeout(() => {
				popuptimer();
			}, 1000);
		}
	}
	function nextVideo() {
		while (popup.hasChildNodes()) {
			popup.removeChild(popup.firstChild);
		}
		popupTimeout = null;
		localStorage.removeItem(videoList[currentVideoIndex].filePath);
		currentVideoIndex++;
		if (currentVideoIndex < videoList.length) {
			videoElement.src = `/videos/series/${jsonFile.toLowerCase()}/${videoList[currentVideoIndex].filePath}.mp4`;
			localStorage.setItem(`${jsonFile} episode`, videoList[currentVideoIndex].filePath);
			videoElement.load();
			videoElement.play();
		} else {
			console.log('No more videos in the list.');
		}
	}
});