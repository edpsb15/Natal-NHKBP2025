// =================================================================
// SCRIPT.JS - VERSI BERSIH & TAAN GOOGLE MAPS DIKOREKSI
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. VARIABEL INTI & KOORDINAT ---
    const coverPage = document.getElementById('coverPage');
    const openInvitationBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.querySelector('.music-text');
    const visualizer = document.getElementById('visualizer');
    const getDirectionsBtn = document.getElementById('getDirections');
    
    // KOORDINAT YANG BENAR
    const churchLat = 2.1167209; 
    const churchLng = 99.0869701;
    const destination = `${churchLat},${churchLng}`; 
    const destinationName = 'HKBP SIPAHUTAR';
    const destinationAddress = 'Ressort Sipahutar, Tapanuli Utara';
    
    let isMusicPlaying = false;
    let mapInitialized = false;
    let map;

    // --- 2. FUNGSI UTAMA: BUKA UNDANGAN ---

    openInvitationBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        coverPage.style.display = 'none';
        mainContent.style.display = 'block'; 
        document.body.style.overflow = 'auto'; 
        initMainContent(); 
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });

    // --- 3. INIALISASI KONTEN UTAMA ---

    function initMainContent() {
        createSnowflakes();
        startBackgroundMusic();
        startCountdown();
        initAnimations();
        setupMapLazyLoad();
    }

    // --- 4. FUNGSI SNOWFLAKES ---
    
    function createSnowflakes() {
        const snowflakesContainer = document.getElementById('snowflakesContainer');
        const snowflakeSymbols = ['❄', '❅', '❆', '❉', '❋', '✨', '⭐', '🌟'];
        snowflakesContainer.innerHTML = '';
        for (let i = 0; i < 150; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 12 + 6) + 's';
            snowflake.style.animationDelay = Math.random() * 15 + 's';
            snowflake.style.opacity = Math.random() * 0.8 + 0.2;
            snowflake.style.fontSize = (Math.random() * 15 + 20) + 'px';
            snowflake.style.zIndex = '9999';
            snowflakesContainer.appendChild(snowflake);
        }
    }

    function createCoverSnowflakes() {
        const coverSnowflakes = document.querySelector('.cover-snowflakes');
        const snowflakeSymbols = ['❄', '❅', '❆', '❉', '❋', '✨'];
        coverSnowflakes.innerHTML = '';
        for (let i = 0; i < 80; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 10 + 5) + 's';
            snowflake.style.animationDelay = Math.random() * 10 + 's';
            snowflake.style.opacity = Math.random() * 0.6 + 0.2;
            snowflake.style.fontSize = (Math.random() * 12 + 15) + 'px';
            snowflake.style.zIndex = '9999';
            coverSnowflakes.appendChild(snowflake);
        }
    }


    // --- 5. FUNGSI MAP LEAFLET (LINK DIKOREKSI) ---

    function setupMapLazyLoad() {
        const mapSection = document.querySelector('.map-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !mapInitialized) {
                    initMap();
                    mapInitialized = true;
                    observer.unobserve(mapSection);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });
        
        if (mapSection) {
            observer.observe(mapSection);
        }
    }

    function initMap() {
        try {
            map = L.map('map').setView([churchLat, churchLng], 16);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);
            
            // Marker
            const customIcon = L.divIcon({
                html: '<div style="background: #D4523F; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;"><i class="fas fa-map-marker-alt" style="color: white; font-size: 18px;"></i></div>',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
            
            L.marker([churchLat, churchLng], { icon: customIcon }).addTo(map)
                .bindPopup(`
                    <div style="text-align: center; padding: 15px; min-width: 250px;">
                        <h4 style="margin: 0 0 10px 0; color: #D4523F; font-weight: bold; font-family: Cinzel, serif;">${destinationName}</h4>
                        <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.4;">${destinationAddress}</p>
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                            <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${churchLat},${churchLng}', '_blank')" style="background: #D4523F; color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 12px; margin-top: 5px;">
                                <i class="fas fa-external-link-alt"></i> Buka di Google Maps
                            </button>
                        </div>
                    </div>
                `).openPopup();
            
            const style = document.createElement('style');
            style.textContent = `@keyframes pulse {
                0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(212, 82, 63, 0.4); }
                50% { transform: scale(1.1); box-shadow: 0 4px 20px rgba(212, 82, 63, 0.6); }
            }`;
            document.head.appendChild(style);
            
        } catch (error) {
            console.error('Error initializing map:', error);
            // Fallback Map UI
            document.getElementById('map').innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center;">
                    <i class="fas fa-map-marked-alt" style="font-size: 60px; color: #D4523F; margin-bottom: 20px;"></i>
                    <h4 style="color: #D4523F; margin-bottom: 10px;">${destinationName}</h4>
                    <p style="color: #666; margin-bottom: 5px;">${destinationAddress}</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=${churchLat},${churchLng}" 
                        target="_blank" style="background: #D4523F; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px;">
                        <i class="fas fa-external-link-alt"></i> Buka di Google Maps
                    </a>
                </div>
            `;
        }
    }

    // --- 6. FUNGSI ARAH (Directions - LINK DIKOREKSI) ---

    getDirectionsBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                // LINK DIKOREKSI
                window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destination}`, '_blank');
            }, function(error) {
                // LINK DIKOREKSI (Fall back jika lokasi ditolak)
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
            });
        } else {
            // LINK DIKOREKSI (Fall back jika Geolocation tidak didukung)
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
        }
    });

    // --- 7. FUNGSI MUSIK (Tetap) ---

    function startBackgroundMusic() {
        backgroundMusic.volume = 0.3;
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isMusicPlaying = true;
                updateMusicUI(true);
            }).catch(error => {
                console.log("Autoplay prevented: ", error);
                document.getElementById('musicPlayer').style.display = 'flex';
            });
        }
    }

    function updateMusicUI(isPlaying) {
        if (isPlaying) {
            musicIcon.className = 'fas fa-pause';
            musicText.textContent = 'Jeda Musik';
            visualizer.classList.add('active');
        } else {
            musicIcon.className = 'fas fa-play';
            musicText.textContent = 'Putar Musik';
            visualizer.classList.remove('active');
        }
    }

    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            isMusicPlaying = false;
            updateMusicUI(false);
        } else {
            backgroundMusic.play();
            isMusicPlaying = true;
            updateMusicUI(true);
        }
    });

    // --- 8. FUNGSI COUNTDOWN (Tetap) ---

    function startCountdown() {
        function updateCountdown() {
            const eventDate = new Date('December 23, 2025 18:00:00').getTime();
            const now = new Date().getTime();
            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            animateCountdown('days', days.toString().padStart(2, '0'));
            animateCountdown('hours', hours.toString().padStart(2, '0'));
            animateCountdown('minutes', minutes.toString().padStart(2, '0'));
            animateCountdown('seconds', seconds.toString().padStart(2, '0'));

            if (distance < 0) {
                clearInterval(countdownTimer);
                document.getElementById('countdown').innerHTML = `
                    <div class="event-started" style="text-align: center; padding: 40px;">
                        <i class="fas fa-gift" style="font-size: 4rem; color: #C19D60; margin-bottom: 20px; display: block;"></i>
                        <h3 style="color: white; font-size: 2.5rem; margin-bottom: 15px; font-family: Cinzel, serif;">Acara Sedang Berlangsung!</h3>
                        <p style="color: #C19D60; font-size: 1.5rem;">Selamat Menikmati Perayaan Natal</p>
                    </div>
                `;
            }
        }

        function animateCountdown(elementId, newValue) {
            const element = document.getElementById(elementId);
            if (element.textContent !== newValue) {
                element.style.transform = 'scale(1.2)';
                element.style.color = '#C19D60';
                
                setTimeout(() => {
                    element.textContent = newValue;
                    element.style.transform = 'scale(1)';
                    element.style.color = '#FFFFFF';
                }, 150);
            }
        }

        const countdownTimer = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --- 9. FUNGSI ANIMASI & PARALLAX (Tetap) ---

    function initAnimations() {
        const sections = document.querySelectorAll('.header-logos, .header, .hero, .detail-card, .rundown-card, .map-section, .info-card, .countdown, .footer, .donation, .gallery');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(40px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const ornaments = document.querySelectorAll('.ornament');
        
        ornaments.forEach(ornament => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            ornament.style.transform = `translateY(${yPos}px)`;
        });
    });

    // --- 10. INISIALISASI COVER PAGE (Tetap) ---

    function initCoverPage() {
        createCoverSnowflakes();
        
        mainContent.style.display = 'none';
        coverPage.style.display = 'flex';
        
        document.body.style.overflow = 'auto';
        
        const coverElements = document.querySelectorAll('.cover-header, .cover-body');
        coverElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        });
    }

    // --- 11. FUNGSI SUMBANGAN & WA CONFIRMATION (Tetap) ---

    const copyBtn = document.getElementById('copyBtn');
    const accountNumberSpan = document.getElementById('accountNumber');
    const donationForm = document.getElementById('donationForm');

    // Fitur Salin Clipboard
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const accountNumber = accountNumberSpan.textContent;
            
            navigator.clipboard.writeText(accountNumber)
                .then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
                    this.style.background = '#00a854'; 
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = ''; 
                    }, 1500);
                })
                .catch(err => {
                    console.error('Gagal menyalin:', err);
                });
        });
    }

    // Fitur Kirim ke WhatsApp
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputName = document.getElementById('inputName').value;
            const inputNominal = document.getElementById('inputNominal').value;
            const phoneNumber = '6281263649153'; 

            const rawText = 
                `Salam Natal,%0A` + 
                `Saya ${inputName} ingin konfirmasi sumbangan Natal sebesar Rp${inputNominal} untuk Perayaan Natal NHKBP Sipahutar 2025.%0A` +
                `%0ATerimakasih, Tuhan Memberkati!`;

            const message = encodeURIComponent(rawText);

            const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappLink, '_blank');
        });
    }

    // --- 12. Gallery (Tetap) ---
    
    
    // --- JALANKAN INISIALISASI ---
    initCoverPage();
});
