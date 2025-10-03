"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./Settings.module.css"
import { HiChevronRight } from "react-icons/hi";
import LoadingWheel from "./LoadingWheel";
import Image from "next/image";

function TabSelector({ selected, onSelect, guildId, guild }) {
  const tabs = ["Geral", "Canais", "Cargos"]

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

    case "Geral": {
      return (
        <div className={styles.config}>
          <h1>Configurações Gerais</h1>

          <label htmlFor="name">Nome do servidor</label>
          <input type="text" name="name" id="name" defaultValue={guild?.config?.server?.name}/>

          <label htmlFor="extra_prompt">Prompt adicional</label>
          <textarea name="extra_prompt" id="extra_prompt" defaultValue={guild?.config?.server?.preferences?.extra_prompt} />

          <label htmlFor="action_timing">Segundos para enviar partes da ação</label>
          <input type="number" name="action_timing" id="action_timing" defaultValue={guild?.config?.server?.preferences?.action_timing} />

          <label htmlFor="global_palpites">Responder jogadores com IA</label>
          <input type="checkbox" name="global_palpites" id="global_palpites" defaultValue={guild?.config?.server?.preferences?.global_palpites} />
        </div>
      )
      break;
    };

    case "Canais": {
      return (
        <div className={styles.config}>
          <h2>Configurações de Notificações</h2>
          <label>
            <input type="checkbox" id="email" /> Receber notificações por email
          </label>
        </div>
      )
      break;
    };

    case "Cargos": {
      return (
        <div className={styles.config}>
          <h2>Permissões</h2>
          <label>
            <input type="checkbox" id="nv" /> Permitir convites
          </label>
        </div>
      )
      break;
    };

    default:
      break;
  }

  return <p>Selecione uma aba</p>
}

export default function Settings({ guildId }) {
  const [selectedTab, setSelectedTab] = useState("Geral")
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