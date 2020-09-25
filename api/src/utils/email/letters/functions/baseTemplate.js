function baseTemplate(host, content) {
    // Адрес логотипа
    const logoSrc = host + '/api/v1/letters-images/logo.svg'

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Letter</title>
            <style>
                .page-wrapper {
                    max-width: 580px;
                    margin: auto;
                }
                .header-wrapper {
                    padding: 30px 0 20px 0;
                }
                .hr {
                    height: 1px;
                    background-color: rgb(216, 216, 216);
                }
                .content {
                    padding: 30px 0 70px 0;
                }
                .paragraph {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 24px;
                    color: rgb(30, 30, 30);
                    padding: 0;
                    margin: 0;
                }
                .button-link-wrapper {
                    padding: 10px 0 20px 0;
                }
                .button-link {
                    display: inline-block;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 24px;
                    color: white;
                    text-decoration: none;
                    background-color: rgb(0, 122, 255);
                    padding: 13px 30px;
                    border-radius: 2px;
                }
                .footer-wrapper {
                    padding: 20px 0 40px 0;
                }
                .footer-text {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    line-height: 20px;
                    color: rgb(190, 190, 190);
                    margin: 0;
                }
            </style>
        </head>
        <body>
        
        <div class="page-wrapper">
            <div class="header-wrapper">
                <a href="">
                    <img src="${logoSrc}" alt="To Do List logo">
                </a>
            </div>
            <div class="hr"></div>
            <div class="content">
                ${content}
            </div>
            <div class="hr"></div>
            <div class="footer-wrapper">
                <p class="footer-text">
                    Write an email to <a href="mailto:mail@andrewkozinsky.ru">mail@andrewkozinsky.ru</a> if you have a question.
                </p>
            </div>
        </div>
        
        </body>
        </html>`
}

module.exports = baseTemplate