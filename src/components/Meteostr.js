import React, { useEffect, useState } from 'react';
import { SimplePool, nip19 } from 'nostr-tools';

const Meteostr = () => {
    const [messageList, setMessageList] = useState([]);
    const MAX_EVENTS = 50;
    let keyCounter = 0; // Declara la variable keyCounter aquí
  
    const addMessage = (message) => {
      setMessageList((prevMessageList) => [
        message,
        ...prevMessageList.slice(0, MAX_EVENTS - 1),
      ]);
    };
  
    useEffect(() => {
      connectRelay(addMessage);
    }, []);
  
    const connectRelay = async (addMessage) => {
      const pool = new SimplePool();
      const relays = ['wss://relay.snort.social'];
      const sub = pool.sub([...relays], [
        {
          kinds: [1008],
        },
      ]);
  
      sub.on('event', (event) => {
        const { kind, content, pubkey, id} = event;
  
        if (kind === 1008) {
          const contentObj = JSON.parse(content);
          const noteId = nip19.noteEncode(id);
          const messages = Object.entries(contentObj).map(([key, value]) => (
            <p key={`${key}-${noteId}`}>
              <b>{key}:</b> {value}
            </p>
          ));
  
          addMessage(
            <div className='message-kind1008' key={keyCounter}>
              {messages}
              <a href={`nostr:${pubkey}`} target='_blank'rel="noreferrer">👤pub</a>
              <a href={`https://www.nostr.guru/e/${id}`} target='_blank'rel="noreferrer">#️⃣note</a>
            </div>
          );
          keyCounter++;
        }
      });
    };
  
    return (
      <div className='nostr-container'>
        <h3>Meteostr🌞</h3>
        <p id='publicKeyResult'></p>
        <div id='message-container'>{messageList}</div>
      </div>
    );
  };
  
  export default Meteostr;
  