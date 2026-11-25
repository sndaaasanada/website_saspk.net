const contentspace = document.querySelector(".contentspace")
const error = document.getElementById("error")

function addcontent(data) {
    if (!data || typeof data !== 'object') {
        throw new Error("JSONの形式が正しくありません。");
    }

    const entries = Object.entries(data)
    contentspace.innerHTML = entries.map(([key, value], index) => `
        <div class="content" id="content${index + 1}">
            <p class="content_number">${index + 1}</p>
            <p class="content_title">${value[0] ?? key}</p>
            <p class="content_one">${value[1] ?? ''}</p>
            <p class="content_content">${value[2] ?? ''}</p>
            <p class="content_details">
                <span class="content_tag">${value[3] ?? ''}</span>
                <span class="content_lasttime">${value[4] ?? ''}</span>
            </p>
        </div>
    `).join('')
}

fetch('content.json')
  .then((response) => {
    if (!response.ok) throw new Error("content.jsonを読み込めません（HTTP " + response.status + "）。")
    return response.json()
  })
  .then((data) => {
    addcontent(data)
  })
  .catch((reason) => {
    error.textContent = "データを表示できませんでした: " + (reason.message || reason)
    error.hidden = false
  })
