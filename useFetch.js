export function fetchData() {
    return fetch('https://the-trivia-api.com/v2/questions')
        .then(response => response.json())
        .catch(error => {
            console.error(error);
        });
}