const CONTEST_DATA_URL = "https://raw.githubusercontent.com/sndaaasanada/vs-/refs/heads/main/markup4/pub2/musen.json?token=GHSAT0AAAAAAER5YBNKKUJCTUFARHX2DBJ62YG6OIA"

const contestIndex = document.getElementById("contest-index")
const contestList = document.getElementById("contest-list")
const statusMessage = document.getElementById("radio-status")

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
    const entryId = `contest-${date}`

    link.href = `#${entryId}`
    time.dateTime = date
    time.textContent = `${date.slice(5, 7)}/${date.slice(8, 10)}`
    link.append(time)
    item.append(link)
    return item
}

function createContestEntry(date, record) {
    const article = document.createElement("article")
    const header = document.createElement("header")
    const time = document.createElement("time")
    const title = document.createElement("h2")
    const stats = document.createElement("dl")
    const bandItem = document.createElement("div")
    const bandLabel = document.createElement("dt")
    const bandValue = document.createElement("dd")
    const resultItem = document.createElement("div")
    const resultLabel = document.createElement("dt")
    const resultValue = document.createElement("dd")
    const entryId = `contest-${date}`

    article.className = "contest-entry"
    article.id = entryId
    header.className = "contest-entry-heading"
    time.className = "contest-entry-date"
    time.dateTime = date
    time.textContent = formatDate(date)
    title.textContent = record.contest
    header.append(time, title)
    stats.className = "contest-stats"
    bandLabel.textContent = "周波数"
    bandValue.textContent = record.band
    bandItem.append(bandLabel, bandValue)
    resultLabel.textContent = "記録"
    resultValue.textContent = record.record
    resultItem.append(resultLabel, resultValue)
    stats.append(bandItem, resultItem)
    article.append(header, stats)
    return article
}

async function loadContestRecords() {
    try {
        const response = await fetch(CONTEST_DATA_URL, { cache: "no-store" })
        if (!response.ok) {
            throw new Error(`GitHubからコンテスト記録を取得できません（HTTP ${response.status}）。`)
        }

        const data = await response.json()
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new Error("記録データは日付をキーにしたJSONオブジェクトにしてください。")
        }

        const entries = Object.entries(data)
        for (const [date, record] of entries) {
            if (!isValidDate(date)) {
                throw new Error(`日付「${date}」は YYYY-MM-DD 形式ではありません。`)
            }
            if (
                !record ||
                typeof record !== "object" ||
                typeof record.contest !== "string" ||
                typeof record.band !== "string" ||
                typeof record.record !== "string"
            ) {
                throw new Error(`日付「${date}」の大会記録の形式が正しくありません。`)
            }
        }

        entries.sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        contestIndex.replaceChildren(...entries.map(([date]) => createDateLink(date)))
        contestList.replaceChildren(...entries.map(([date, record]) => createContestEntry(date, record)))

        if (entries.length === 0) {
            statusMessage.textContent = "コンテスト記録はまだありません。"
            statusMessage.classList.add("is-empty")
        } else {
            statusMessage.hidden = true
        }
    } catch (error) {
        console.error("コンテスト記録の読み込みに失敗しました:", error)
        statusMessage.textContent = `コンテスト記録を読み込めませんでした: ${error.message}`
        statusMessage.classList.add("is-error")
    }
}

loadContestRecords()