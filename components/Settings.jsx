"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./Settings.module.css"
import { HiChevronRight } from "react-icons/hi";
import LoadingWheel from "./LoadingWheel";
import Image from "next/image";

function TabSelector({ selected, onSelect, guildId, guild }) {
  const tabs = ["Preferências", "Administração", "Cargos", "Inteligência Artificial", "Passagem de tempo", "Roleplay", "Diplomacia e NPCs", "Ações secretas", "Escolha de países"]

  const navRef = useRef(null);

  return (
    <div className={styles.nav} ref={navRef}>
      <section className={styles.guildInfo}>
        <Image src={guild.iconUrl} width={50} height={50} alt={`Ícone de ${guild.name}`} />
        <h1>{guild.name}</h1>
      </section>

      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={selected == tab ? styles.selected : ''}
        >
          {tab}
        </button>
      ))}
      <HiChevronRight className={styles.mobileOpen} size={32} onClick={(ev) => {
        navRef?.current?.classList.toggle(styles.active);
        ev.target.classList.toggle(styles.rotated)
      }} />
    </div>
  )
}

function SettingsContent({ selected, guildId, guild }) {

  switch (selected) {

    case "Preferências": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>

          <section>
            <h2>Configuração geral</h2>

            <div className={styles.option}>
              <label htmlFor="name">Nome do servidor</label>
              <p>{'Se você usar {ano} em alguma parte do nome, o Salazar atualizará o nome do servidor toda vez que o ano do roleplay for passado.'}</p>
              <input type="text" name="name" id="name" defaultValue={guild?.config?.server?.name}/>
            </div>

            <div className={styles.option}>
              <label htmlFor="extra_prompt">Prompt adicional</label>
              <p>Caso você queira algum detalhe ou especificação extra nas narrações do seu servidor.</p>
              <textarea name="extra_prompt" id="extra_prompt" defaultValue={guild?.config?.server?.preferences?.extra_prompt} placeholder="Ex.: Penalize o jogador e realce os resultados negativos das suas ações (caso você queira priorizar narração humana e usar o Salazar para agilidade mas com desvantagem)."/>
            </div>
          </section>

          <section>
            <h2>Definições de tempo e tamanho</h2>

            <div className={styles.option}>
              <label htmlFor="action_timing">Segundos para enviar partes da ação</label>
              <p>O tempo em que o Salazar esperará (em segundos) para que o jogador envie todas as mensagens que comporão sua ação.</p>
              <input type="number" name="action_timing" id="action_timing" defaultValue={guild?.config?.server?.preferences?.action_timing} />
            </div>

            <div className={styles.option}>
              <label htmlFor="min_event_length">Mínimo de caracteres de evento</label>
              <p>Mínimo de caracteres de uma mensagem de narrador em canal de evento para que o Salazar a armazene em sua memória como um evento.</p>
              <input type="number" name="min_event_length" id="min_event_length" defaultValue={guild?.config?.server?.preferences?.min_event_length} />
            </div>

            <div className={styles.option}>
              <label htmlFor="min_action_length">Mínimo de caracteres de ação</label>
              <p>Mínimo de caracteres de uma mensagem de jogador em canal de ação para que o Salazar a identifique como uma ação e narre seus resultados.</p>
              <input type="number" name="min_action_length" id="min_action_length" defaultValue={guild?.config?.server?.preferences?.min_action_length} />
            </div>

            <div className={styles.option}>
              <label htmlFor="min_diplomacy_length">Mínimo de caracteres de diplomacia</label>
              <p>Mínimo de caracteres de uma mensagem de jogador no canal de diplomacia para que o Salazar a leia e tente interpretar seus resultados para simular resposta de um país NPC, criar chat de guerra, etc.</p>
              <input type="number" name="min_diplomacy_length" id="min_diplomacy_length" defaultValue={guild?.config?.server?.preferences?.min_diplomacy_length} />
            </div>

            <div className={styles.option}>
              <label htmlFor="action_keyword">Palavra-chave que identifica ações</label>
              <p>Palavra-chave que caso a mensagem enviada em um canal de ações contenha, o Salazar irá tentar narrá-la mesmo se ela não atingir o mínimo de caracteres.</p>
              <input type="text" name="action_keyword" id="action_keyword" defaultValue={guild?.config?.server?.preferences?.action_keyword} />
            </div>
          </section>

          <section>
            <button className={styles.saveButton}>Salvar</button>
          </section>
        </div>
      )
      break;
    };

    case "Administração": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
        </div>
      )
      break;
    };

    case "Cargos": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
        </div>
      )
      break;
    };

    case "Inteligência Artificial": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
        </div>
      )
      break;
    };

    case "Passagem de tempo": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
        </div>
      )
      break;
    };

    case "Roleplay": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
        </div>
      )
      break;
    };

    case "Diplomacia e NPCs": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
        </div>
      )
      break;
    };

    case "Ações secretas": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
        </div>
      )
      break;
    };

    case "Escolha de países": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
        </div>
      )
      break;
    }

    default:
      break;
  }

  return <p>Selecione uma aba</p>
}

export default function Settings({ guildId }) {
  const [selectedTab, setSelectedTab] = useState("Preferências")
  const [guild, setGuild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!guildId) return

    setLoading(true)
    fetch(`/api/discord/guild?id=${guildId}`)
      .then(async res => {
        if (!res.ok) {
          const json = await res.json().catch(() => null)
          throw json || { message: "Erro desconhecido" }
        }
        return res.json()
      })
      .then(data => setGuild(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [guildId]);

  if (!guild) return <div className={styles.loading}><LoadingWheel /></div>

  return (
    <div className={styles.dashboard}>
      <TabSelector selected={selectedTab} onSelect={setSelectedTab} guildId={guild?.id || guildId} guild={guild} />
      <SettingsContent selected={selectedTab} guildId={guild?.id || guildId} guild={guild} />
    </div>
  )
}