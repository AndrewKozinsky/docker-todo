
function resetPasswordLetterContentTemplate(resetUrl) {
    
    return `
        <p class="paragraph">
            Reset password request was made. Please click on this button to reset your password and provide the new one.
        </p>
        <div class="button-link-wrapper">
            <a href="${resetUrl}" class="button-link">
                Reset my password
            </a>
        </div>
        <p class="paragraph">
            If you didn't forget your password, please ignore this email.
        </p>
    `
}

module.exports = resetPasswordLetterContentTemplate