const div_question = document.getElementById("question");
const div_answerParent = document.querySelector("#answer");
const div_answerRounded = document.querySelector("#answer .rounded");
const div_answerRaw = document.querySelector("#answer .raw");
const btn_calculate = document.getElementById("calculate");
const btn_next = document.getElementById("next");
const span_questionCount = document.querySelector(".question-count span.count");
let questionCount = 1;

updateQuestion();

btn_calculate.addEventListener("click", function () {
  try {
    const result = currentQuestion[1];
    div_answerRounded.textContent = Math.round(result);
    div_answerRaw.textContent = result.toFixed(2);
    btn_calculate.disabled = true;
    btn_next.disabled = false;
  } catch (error) {
    answerEl.textContent = "Invalid expression!";
  }
});

btn_next.addEventListener("click", function () {
  questionCount++;
  span_questionCount.textContent = questionCount;
  updateQuestion();
  btn_calculate.disabled = false;
  btn_next.disabled = true;
});

async function updateQuestion() {
  currentQuestion = generateQuestion();
  div_question.innerHTML = "";
  div_question.appendChild(currentQuestion[0]);
  div_answerRounded.textContent = "";
  div_answerRaw.textContent = "";
  // update MathJax
  await MathJax.startup.promise;
  MathJax.typesetClear([div_question]);
  await MathJax.typesetPromise([div_question]);
}

function generateQuestion() {
  const mMath = document.createElement("math");
  let termsCount = getTermsCount();
  let answer = 1;
  while (termsCount > 0) {
    let mTerm, term;
    if (Math.random() <= 0.75) [mTerm, term] = generateNumber(true);
    else [mTerm, term] = generateFraction();
    mMath.appendChild(mTerm);
    answer *= term;
    termsCount--;
    if (termsCount > 0) mMath.appendChild(generateMultiplicationSymbol());
  }
  return [mMath, answer];
}

function generateMultiplicationSymbol() {
  const symbol = document.createElement("mtext");
  symbol.innerHTML = "&nbsp;*&nbsp;";
  return symbol;
}

function generateFraction() {
  const [mNumerator, numerator] = generateNumber(Math.random() < 0.8);
  const [mDenominator, denominator] = generateNumber(Math.random() < 0.8);
  const mfrac = document.createElement("mfrac");
  mfrac.appendChild(mNumerator);
  mfrac.appendChild(mDenominator);
  return [mfrac, numerator / denominator];
}

function generateNumber(singleTerm = false) {
  const mNum = document.createElement("mn");
  if (singleTerm) {
    const num1 = generatePureNumber();
    mNum.textContent = num1;
    return [mNum, num1];
  }
  const num1 = generatePureNumber();
  const num2 = generatePureNumber();
  mNum.textContent = num1 + " + " + num2;
  return [mNum, num1 + num2];
}

function generatePureNumber() {
  const decimalsCount = getDecimalsCount();
  const upperBound = getUpperBound();
  return Number((Math.random() * upperBound).toFixed(decimalsCount)); // Fixme
}

function getDecimalsCount() {
  const prob = Math.random();
  if (prob < 0.2) return 0;
  else if (prob < 0.4) return 1;
  else if (prob < 0.8) return 2;
  return 3;
}

function getUpperBound() {
  const prob = Math.random();
  if (prob < 0.5) return 10;
  else if(prob < 0.98) return 100;
  return 1000;
}

function getTermsCount() {
  const prob = Math.random();
  if (prob < 0.25) return 2;
  return 3;
}

document.addEventListener("keydown", function (event) {
  if (event.key === "n") {
    if (btn_calculate.disabled) btn_next.click();
    else btn_calculate.click();
  }
});
