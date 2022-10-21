import "./css/index.css"
import IMask from "imask"

const ccBgColor1 = document.querySelector(".cc-bg g g path")

const ccBgColor2 = document.querySelector(".cc-bg g g:nth-child(2) path")
const ccFlag = document.querySelector(".cc-logo span:nth-child(2) img")

function changeCard(type) {
  const cardColor = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["black", "gray"],
  }

  ccBgColor1.setAttribute("fill", cardColor[type][0])
  ccBgColor2.setAttribute("fill", cardColor[type][1])
  ;`ccFlag.setAttribute("src", "/cc-" + type + ".svg")
  da pra fazer por interpolation tb`
  ccFlag.setAttribute("src", `cc-${type}.svg`)
}

changeCard("default")

globalThis.changeCard = changeCard

// cvc
const ccSecurityCode = document.getElementById("security-code")
const ccSecurityCodePattern = {
  mask: "0000",
}
const ccSecurityCodeMasked = IMask(ccSecurityCode, ccSecurityCodePattern)

const ccExpirationDate = document.getElementById("expiration-date")
const ccExpirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: parseInt(String(new Date().getFullYear()).slice(2)), //n precisa passar pra int
      to: parseInt(String(new Date().getFullYear()).slice(2)) + 10,
    },
  },
}
const ccExpirationDateMasked = IMask(ccExpirationDate, ccExpirationDatePattern)

const ccNumber = document.getElementById("card-number")
const ccNumberDynamic = {
  mask: [
    { mask: "0000 0000 0000 0000", regex: /^4\d{0,15}$/, flag: "visa" },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      flag: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      flag: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foundmask = dynamicMasked.compiledMasks.find(function (n) {
      return number.match(n.regex)
    })

    return foundmask
  },
}
const ccNumberMasked = new IMask(ccNumber, ccNumberDynamic)

const addCardButton = document.getElementById("button-add-card")
addCardButton.addEventListener("click", () => alert("boop"))
document
  .querySelector("form")
  .addEventListener("submit", (e) => e.preventDefault())

const ccHolder = document.querySelector("#card-holder")
const ccHolderNameDisplayed = document.querySelector(
  ".cc-holder div:nth-child(2)"
)

ccHolder.addEventListener("input", () => {
  ccHolderNameDisplayed.textContent =
    ccHolder.value.length === 0 ? "FULANO DA SILVA" : ccHolder.value
})

ccSecurityCodeMasked.on("accept", updateSecurityCode)

function updateSecurityCode() {
  const ccSecurityCodeDisplayed = document.querySelector(".cc-security .value")

  ccSecurityCodeDisplayed.textContent =
    ccSecurityCodeMasked.value.length === 0 ? "123" : ccSecurityCodeMasked.value
}

ccNumberMasked.on("accept", updateCardNumber)
function updateCardNumber() {
  const ccNumberDisplayed = document.querySelector("div.cc-number")

  changeCard(ccNumberMasked.masked.currentMask.flag)
  ccNumberDisplayed.textContent =
    ccNumberMasked.value.length === 0
      ? "1234 5678 9012 3456"
      : ccNumberMasked.value
}

ccExpirationDateMasked.on("accept", () => {
  const ccExpirationDateDisplayed = document.querySelector(
    ".cc-expiration .value"
  )
  ccExpirationDateDisplayed.textContent =
    ccExpirationDateMasked.value.length === 0
      ? "02/32"
      : ccExpirationDateMasked.value
})
