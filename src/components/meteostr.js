import React from 'react'
import {SimplePool, nip19} from 'nostr-tools'


const connectRelay = async () => {
  const pool = new SimplePool()
  const relays = ['wss://relay.snort.social'];
  const sub = pool.sub(
      [...relays],
      [
        {
          kinds: [1008],
          authors:'ded7b40aab64c02d0cededb3a9df2e5afafe6d98f1fdeca4eed334c09800c979',
        }
      ]
    )
  // Seleccionar el contenedor de mensajes
  const messageContainer = document.getElementById('message-container');
  const messageKind0Container = document.getElementById('message-kind0-container');
  // Limpiar los mensajes anteriores
  messageContainer.textContent = '';
  messageKind0Container.textContent = '';
  

  sub.on('event', (event) => {
    const { kind, content, pubkey, id, created_at } = event;
  
    if (kind === 0) {
      let latestMessage = null;
      const contentObj = JSON.parse(content);
      const messages = `
        <div class="pfp-container">
          <img class="pfp-image" src="${contentObj.picture}" alt="pfp">
        </div>
        <p><strong>${contentObj.name}</strong></p>
        <p>${contentObj.about}</p>
        <p><a href="${contentObj.about}" target="_blank" rel="noreferrer">Website</a></p>
        <p><strong>pubkey:</strong> ${pubkey}</p>
      `;
      const messageElement = document.createElement('div');
      messageElement.innerHTML = messages;
      messageElement.classList.add('message-kind0');
  
      // Only show the latest message
      if (!latestMessage || Date.parse(created_at) > Date.parse(latestMessage.created_at)) {
        messageKind0Container.textContent = '';
        messageKind0Container.appendChild(messageElement);
      }
    }
    if (kind === 1008) {
        const contentObj = JSON.parse(content);

      const noteId = nip19.noteEncode(id);
      const contentWithLinks = content.replace(/(https?:\/\/\S+)/gi, (match) => {
        const imgRegex = /\.(jpg|jpeg|png|webp|gif)$/i;
        if (imgRegex.test(match)) {
          return `<img class="nostr-img" src="${match}" alt="${match}">`;
        } else {
          return `[${match}](${match})`;
        }
      });
      const messages = `
        <div>
            <p><b>temperature_C:</b>${contentObj.temperature_C}</p>
            <p><b>humidity:</b>${contentObj.humidity}</p>
            <p><b>wind_avg_km_h:</b>${contentObj.wind_avg_km_h}</p>
            <p><b>wind_dir_deg:</b>${contentObj.wind_dir_deg}</p>
            <p><b>wind_max_km_h:</b>${contentObj.wind_max_km_h}</p>
            <p><b>rain_mm:</b>${contentObj.rain_mm}</p>
            <p><b>model:</b>${contentObj.model}</p>
            <p><b>mic:</b>${contentObj.mic}</p>
            <p><b>id:</b>${contentObj.id}</p>
            <p><b>battery_ok:</b>${contentObj.battery_ok}</p>
            <p><b>time:</b>${contentObj.time}</p>
            
        </div>
        <ul>
          <a href="https://snort.social/e/${noteId}" target="_blank" rel="noopener noreferrer"><li>View outside</li></a>
        </ul>
      `;
      const messageElement = document.createElement('div');
      messageElement.innerHTML = messages;
      messageElement.classList.add('message-kind1');
      messageContainer.appendChild(messageElement);
    }
  });  
};

export const Meteostr = () => {
    connectRelay();
  return (
    <div className='nostr-container'>
        <h3>Meteostr🌞</h3>
        <div id="message-kind0-container"></div>
        <p id="publicKeyResult"></p>
        <div id="message-container"></div>
    </div>
  )
}
export default Meteostr