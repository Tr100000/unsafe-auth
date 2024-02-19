import * as Auth from "otpauth";

const searchParams = new URLSearchParams(window.location.search);
const secretInput = document.getElementById("secret") as HTMLInputElement;
const tokenText = document.getElementById("token") as HTMLParagraphElement;
const copyButton = document.getElementById("copy") as HTMLButtonElement;

const totp = new Auth.TOTP({
    algorithm: searchParams.get("algorithm") ?? "SHA1",
    digits: maybeGetSearchParam("digits", 6),
    period: maybeGetSearchParam("period", 30)
});

console.debug("Algorithm: " + totp.algorithm);
console.debug("Digits: " + totp.digits);
console.debug("Period: " + totp.period);

copyButton.addEventListener("click", async () => {
    generateToken();
    await navigator.clipboard.writeText(tokenText.innerHTML);
});

function generateToken() {
    totp.secret = Auth.Secret.fromBase32(secretInput.value);
    tokenText.innerHTML = totp.generate();
    copyButton.hidden = !tokenText.innerHTML;
}

function maybeGetSearchParam(name: string, fallback: number): number {
    return searchParams.has(name) ? parseInt(searchParams.get(name)!) : fallback;
}

setInterval(generateToken, 500);
