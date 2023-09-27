// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ==============================================================================
class Track {
  // Статичне приватне поле для зберігання списку обʼсктів Track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(3000 + Math.random() * 9000) // Генеруємо випадкове 10
    this.name = name
    this.author = author
    this.image = image
  }
  // Статичний метод для створення об екту Track 1 додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }
  // Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }
}

Track.create(
  'Інь Янь',
  'MOYATIK i ROXSOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Інь Янь',
  'MOYATIK i ROXSOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Зорепад',
  'Max Barskih',
  'https://picsum.photos/100/100',
)
Track.create(
  'Island',
  'Miley Cyrus',
  'https://picsum.photos/100/100',
)
Track.create(
  'На мить',
  'Ivan NAVI',
  'https://picsum.photos/100/100',
)
Track.create(
  'TAYANNA',
  'Вітер у волоссі',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist {
  // Статичне приватне поле для зберіганн
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
  }

  // Статичний метод для створення обʼєкту Playlist 1 додавання його до списку #list
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  // Статичний метод для отримання всього списку плейлістів
  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }
}
// ===============================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ======================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const isMix = !!req.query.isMix

  console.log(isMix)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/spotify-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const isMix = !!req.query.isMix

  const name = req.body.name
  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        messages: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',

    data: {
      messages: 'Успішно',
      info: 'Плейлист створений',
      link: `/spotify-playlist?id=${playlist.id}`,
    },
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
