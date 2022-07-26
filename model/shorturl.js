class Model {
  constructor() {
    this.data = [
      {
        id: 1,
        url: "https://www.freecodecamp.org"
      }
    ]
  }

  getLatestID() {
    let sorted = this.data.sort((a, b) => b.id - a.id)
    if (!sorted[0]) return 0
    return sorted[0].id
  }

  getAllUrl() {
    return this.data
  }

  getUrl(url) {
    return (this.data.filter(obj => obj.url === url))[0]
  }

  getUrlById(id) {
    return (this.data.filter(obj => obj.id === parseInt(id)))[0]
  }

  insertUrl(url) {
    const urlExist = this.getUrl(url)
    if (urlExist) return urlExist
    const obj = {
      id: this.getLatestID() + 1,
      url: url
    }
    const succes = this.data.push(obj)
    if (succes) {
      return obj
    } else {
      return {
        error: "Something went wrong"
      }
    }
  }
}

module.exports = Model
