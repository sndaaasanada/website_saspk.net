const DIARY_DATA_URL = "https://raw.githubusercontent.com/sndaaasanada/website_saspk.net/refs/heads/main/diarie.json"

const dateList = document.getElementById("date-list")
const diaryList = document.getElementById("diary-list")
const statusMessage = document.getElementById("diary-status")

function isValidDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
    const parsedDate = new Date(`${date}T00:00:00Z`)
    return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date
}

function formatDate(date) {
    return date.replace(/-/g, ".")
}

function createDateLink(date) {
    const item = document.createElement("li")
    const link = document.createElement("a")
    const time = document.createElement("time")
    const entryId = `diary-${date}`

    link.href = `#${entryId}`
    time.dateTime = date
    time.textContent = formatDate(date)
    link.append(time)
    item.append(link)
    return item
}

function createDiaryEntry(date, content) {
    const article = document.createElement("article")
    const heading = document.createElement("h2")
    const time = document.createElement("time")
    const text = document.createElement("p")
    const entryId = `diary-${date}`

    article.className = "diary-entry"
    article.id = entryId
    heading.className = "diary-entry-heading"
    time.className = "diary-entry-date"
    time.dateTime = date
    time.textContent = formatDate(date)
    heading.append(time)
    text.className = "diary-entry-content"
    text.textContent = content
    article.append(heading, text)
    return article
}

async function loadDiaries() {
    try {
        const response = await fetch(DIARY_DATA_URL, { cache: "no-store" })
        if (!response.ok) {
            throw new Error(`GitHubから日記データを取得できません（HTTP ${response.status}）。`)
        }

        const data = await response.json()
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new Error("日記データは日付をキーにしたJSONオブジェクトにしてください。")
        }

        const entries = Object.entries(data)
        for (const [date, content] of entries) {
            if (!isValidDate(date)) {
                throw new Error(`日付「${date}」は YYYY-MM-DD 形式ではありません。`)
            }
            if (typeof content !== "string") {
                throw new Error(`日付「${date}」の本文は文字列にしてください。`)
            }
        }

        entries.sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        dateList.replaceChildren(...entries.map(([date]) => createDateLink(date)))
        diaryList.replaceChildren(...entries.map(([date, content]) => createDiaryEntry(date, content)))

        if (entries.length === 0) {
            statusMessage.textContent = "日記はまだありません。"
            statusMessage.classList.add("is-empty")
        } else {
            statusMessage.hidden = true
        }
    } catch (error) {
        console.error("日記データの読み込みに失敗しました:", error)
        statusMessage.textContent = `日記データを読み込めませんでした: ${error.message}`
        statusMessage.classList.add("is-error")
    }
}

loadDiaries()