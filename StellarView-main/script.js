  
  
  fetch('https://api.nasa.gov/planetary/apod?api_key=h9vhBGjUzWLkfU1bns0GkGPXfVm3RmoaltiEMF79')
  .then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data)
  }).catch((err) => {
    console.log(err)
  })
  
  
  
  
  function createStars() {
      const starsContainer = document.getElementById('stars');
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
      }
    }

    // Tab switching
    function switchTab(tab) {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      event.target.classList.add('active');
      document.getElementById(tab + '-tab').classList.add('active');
    }

    // NASA Images Search
    document.getElementById('fetchBtn').addEventListener('click', async function () {
      const searchTerm = document.getElementById('searchInput').value.trim();
      const resultsContainer = document.getElementById('results');
      
      if (!searchTerm) {
        resultsContainer.innerHTML = '<div class="error">Please enter a search term</div>';
        return;
      }

      resultsContainer.innerHTML = '<div class="loading">Searching the cosmos...</div>';

      try {
        const response = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}&media_type=image`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from NASA API');
        }

        const data = await response.json();
        const results = data.collection.items;

        if (results.length === 0) {
          resultsContainer.innerHTML = '<div class="error">No images found for your search term</div>';
          return;
        }

        resultsContainer.innerHTML = '';
        
        results.slice(0, 6).forEach(item => {
          if (item.links && item.links[0] && item.data && item.data[0]) {
            const imgUrl = item.links[0].href;
            const title = item.data[0].title || 'Untitled';
            const desc = item.data[0].description || 'No description available';

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
              <img src="${imgUrl}" alt="${title}" loading="lazy" />
              <h3>${title}</h3>
              <p>${desc}</p>
            `;
            resultsContainer.appendChild(card);
          }
        });
      } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '<div class="error">Failed to load images. Please try again.</div>';
      }
    });

    // Rocket Launch Info
    document.getElementById('showLaunch').addEventListener('click', async function() {
      const launchInfo = document.getElementById('launchInfo');
      const button = document.getElementById('showLaunch');
      
      button.textContent = '🔄 Loading...';
      button.disabled = true;

      try {
        const response = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming');
        
        if (!response.ok) {
          throw new Error('Failed to fetch launch data');
        }

        const data = await response.json();
        const nextLaunch = data.results[0];

        launchInfo.style.display = 'block';
        launchInfo.innerHTML = `
          <h2>${nextLaunch.name}</h2>
          <p><strong>Launch Site:</strong> ${nextLaunch.pad.name}</p>
          <p><strong>Agency:</strong> ${nextLaunch.launch_service_provider.name}</p>
          <div class="countdown" id="countdown">Calculating...</div>
        `;

        // Countdown timer
        const launchTime = new Date(nextLaunch.window_start);
        const countdownElement = document.getElementById('countdown');
        
        const updateCountdown = () => {
          const now = new Date();
          const diff = Math.max(0, launchTime - now);
          
          if (diff <= 0) {
            countdownElement.textContent = '🚀 LAUNCHED!';
            return;
          }

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        // Animate rocket
        setTimeout(() => {
          const rocket = document.getElementById('rocket');
          rocket.style.bottom = '100vh';
          rocket.style.transform = 'rotate(-45deg)';
        }, 1000);

        // Reset rocket after animation
        setTimeout(() => {
          const rocket = document.getElementById('rocket');
          rocket.style.bottom = '-100px';
          rocket.style.transform = 'rotate(0deg)';
        }, 5000);

      } catch (error) {
        console.error('Launch data error:', error);
        launchInfo.style.display = 'block';
        launchInfo.innerHTML = '<div class="error">Failed to load launch information. Please try again.</div>';
      } finally {
        button.textContent = '🚀 Show Next Launch';
        button.disabled = false;
      }
    });

    // Enter key support for search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        document.getElementById('fetchBtn').click();
      }
    });

    // Initialize
    createStars();