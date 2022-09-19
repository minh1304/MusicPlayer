const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const heading= $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
          name: "Click Pow Get Down",
          singer: "Raftaar x Fortnite",
          path: "./assets/music/Click Pow Get Down-Raftaar -VlcMusic.CoM.mp3",
          image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
          name: "Tu Phir Se Aana",
          singer: "Raftaar x Salim Merchant x Karma",
          path: "./assets/music/Tu Phir Se Aana-Raftaar -VlcMusic.CoM.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Naachne Ka Shaunq",
          singer: "Raftaar x Brobha V",
          path: "./assets/music/Naachne Ka Shaunq-Brodha V-VlcMusic.CoM.mp3",          
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Mantoiyat",
          singer: "Raftaar x Nawazuddin Siddiqui",
          path: "./assets/music/Mantoiyat-Raftaar -VlcMusic.CoM.mp3",          
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Aage Chal",
          singer: "Raftaar",
          path: "./assets/music/Aage Chal-Raftaar -VlcMusic.CoM.mp3",          
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "Damn",
          singer: "Raftaar x kr$na",
          path: "./assets/music/Damn - Raftaar-(MastiMusic.Com).mp3",          
          image:
            "https://i.scdn.co/image/ab67616d0000b273441105b2aed66a31a869299f"
        },
        {
          name: "Feeling You",
          singer: "Raftaar x Harjas",
          path: "./assets/music/Feeling You (Mr Nair)-Raftaar -VlcMusic.CoM.mp3",
          image:
            "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-index = "${index}" >
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer  }</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handelEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth; //console({cd})
        //Xử lý cdQuay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,//10s
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        //Xử lý phogn1 to thu nhỏ
        document.onscroll = function() { 
            const scrollTop = document.documentElement.scrollTop ||window.scrollY
            const newCdwidth = cdWidth - scrollTop ;
            cd.style.width = newCdwidth >0 ? newCdwidth + 'px' : 0;
            cd.style.opacity = newCdwidth / cdWidth;

        }



        //Xử lý khi click play 
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } 
            else {
                audio.play();
            }
            audio.onplay =  function() {
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
            audio.onpause = function() {
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }
            //Chạy tiến độ bài hát 
            audio.ontimeupdate = function() {
                if(audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                    progress.value = progressPercent;
                }
            
            }
            //Xử lý khi tua bài hát
            progress.onchange = function(e) {
                const seekTime = audio.duration/ 100 * e.target.value;
                audio.currentTime = seekTime;
            }

            //Nút next bài 
            nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong() 
                } else {
                _this.nextSong()
                }
                audio.play();
                _this.render()
                _this.scrollToActiveSong()
            }
            //Nút trở về trước 
            prevBtn.onclick = function() {
                _this.prevSong()
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            } 
            //random 
            randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle('active', _this.isRandom);

            }
            //Phát lại 1 bài hát
            repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRandom;
                repeatBtn.classList.toggle('active', _this.repeatBtn);

            }

            //Bài hát kết thúc
            audio.onended = function() {
                if(_this.isRepeat){
                    audio.play()

                }
                else {
                    nextBtn.click();
                }
            }

            //Lắng nghe hành vi clcik vào playlist
            playlist.onclick = function(e) {
                //closest trả về chính nó và cha của nó
                const songNode = e.target.closest('.song:not(.active)');
                if(songNode || e.target.closest('.option')) {
                    //xử lý khi click vào song
                    if(songNode) {
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurrentSong();
                        _this.render();
                        audio.play();


                    }
                    // xử lý khi click vào option
                }

            }


        }

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        console.log(audio);
    },
    scrollToActiveSong: function() {
        setTimeout( () => {
            //scroll in to view element: khuất màn hình
            $('.song.active').scrollIntoView( {
                behavior: 'smooth',
                block: 'center'

            })


        },300)

    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex==this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()

    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex =0 ;
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0)
        {
            this.currentIndex = this.songs.length -1 ;
        }
        this.loadCurrentSong()
    },


    start: function() {
        //Định nghĩa thuộc tính cho object
        this.defineProperties()
        //Lắng nghe các sự kiện
        this.handelEvent()
        //tải bài hát đầu tiên
        this.loadCurrentSong()
        this.render()
    }
    
}
app.start()