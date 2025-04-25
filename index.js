const form = document.getElementById('searchForm');
const input = document.getElementById('wordInput');
const resultContainer = document.getElementById('result');
const errorContainer = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const word = input.value.trim();
  resultContainer.innerHTML = '';
  errorContainer.textContent = '';

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error('Word not found');
    const data = await response.json();

    const entry = data[0];
    const meanings = entry.meanings.map(meaning => `
      <div>
        <strong>${meaning.partOfSpeech}</strong>: ${meaning.definitions[0].definition}
        <br />
        <em>${meaning.definitions[0].example || ''}</em>
      </div>
    `).join('<br/>');

    resultContainer.innerHTML = `
      <h2>${entry.word}</h2>
      <p>Pronunciation: ${entry.phonetics[0]?.text || 'N/A'}</p>
      <audio controls src="${entry.phonetics[0]?.audio || ''}"></audio>
      <div>${meanings}</div>
      <p><small>Source: <a href="${entry.sourceUrls[0]}" target="_blank">${entry.sourceUrls[0]}</a></small></p>
    `;
  } catch (error) {
    errorContainer.textContent = error.message;
  }
});
