const MATHS_DATA_URL = "https://raw.githubusercontent.com/sndaaasanada/website_saspk.net/refs/heads/main/content.json"

const mathIndex = document.getElementById("math-index")
const mathList = document.getElementById("math-list")
const statusMessage = document.getElementById("math-status")

function createIndexItem(title, entryId) {
    const item = document.createElement("li")
    const link = document.createElement("a")

    link.href = `#${entryId}`
    link.textContent = title
    item.append(link)
    return item
}

function createMathEntry(values, index) {
    const [title, summary, description, tag, reference] = values
    const article = document.createElement("article")
    const heading = document.createElement("header")
    const number = document.createElement("span")
    const titleElement = document.createElement("h2")
    const summaryElement = document.createElement("p")
    const descriptionElement = document.createElement("p")
    const details = document.createElement("footer")
    const tagElement = document.createElement("span")
    const referenceElement = document.createElement("span")
    const entryId = `math-field-${index + 1}`

    article.className = "topic-entry"
    article.id = entryId
    heading.className = "topic-entry-heading"
    number.className = "topic-entry-number"
    number.textContent = String(index + 1).padStart(2, "0")
    titleElement.textContent = title
    heading.append(number, titleElement)
    summaryElement.className = "topic-entry-summary"
    summaryElement.textContent = summary
    descriptionElement.className = "topic-entry-description"
    descriptionElement.textContent = description
    details.className = "topic-entry-details"
    tagElement.className = "topic-entry-tag"
    tagElement.textContent = tag
    referenceElement.className = "topic-entry-reference"
    referenceElement.textContent = reference
    details.append(tagElement, referenceElement)
    article.append(heading, summaryElement, descriptionElement, details)
    return article
}

async function loadMathFields() {
    try {
        const response = await fetch(MATHS_DATA_URL, { cache: "no-store" })
        if (!response.ok) {
            throw new Error(`GitHubから数学データを取得できません（HTTP ${response.status}）。`)
        }

        const data = await response.json()
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new Error("数学データは識別子をキーにしたJSONオブジェクトにしてください。")
        }

        const entries = Object.entries(data)
        for (const [key, values] of entries) {
            if (!key || !Array.isArray(values) || values.length < 5 || values.slice(0, 5).some(value => typeof value !== "string")) {
                throw new Error(`「${key}」のデータ形式が正しくありません。`)
            }
        }

        mathIndex.replaceChildren(...entries.map(([, values], index) => createIndexItem(values[0], `math-field-${index + 1}`)))
        mathList.replaceChildren(...entries.map(([, values], index) => createMathEntry(values, index)))

        if (entries.length === 0) {
            statusMessage.textContent = "数学の分野はまだありません。"
            statusMessage.classList.add("is-empty")
        } else {
            statusMessage.hidden = true
        }
    } catch (error) {
        console.error("数学データの読み込みに失敗しました:", error)
        statusMessage.textContent = `数学データを読み込めませんでした: ${error.message}`
        statusMessage.classList.add("is-error")
    }
}

loadMathFields()