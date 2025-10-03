"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./Settings.module.css"
import GuildInfo from "./GuildInfo"
import { HiChevronRight } from "react-icons/hi";
import LoadingWheel from "./LoadingWheel";
import Image from "next/image";

function TabSelector({ selected, onSelect, guildId, guild }) {
  const tabs = ["Geral", "Notificações", "Permissões"]

  const navRef = useRef(null);

  return (
    <div className={styles.nav} ref={navRef}>
      <section className={styles.guildInfo}>
        <Image src={guild.iconUrl} width={50} height={50} />
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
  if (selected === "Geral") {
    return (
      <div className={styles.config}>
        <h2>Configurações Gerais</h2>
        {guild?.config?.server?.name}
        <label>
          <input type="checkbox" id="dark" /> Ativar modo escuro
        </label>
      </div>
    )
  }

  if (selected === "Notificações") {
    return (
      <div className={styles.config}>
        <h2>Configurações de Notificações</h2>
        <label>
          <input type="checkbox" id="email" /> Receber notificações por email
        </label>
      </div>
    )
  }

  if (selected === "Permissões") {
    return (
      <div className={styles.config}>
        <h2>Permissões</h2>
        <label>
          <input type="checkbox" id="nv" /> Permitir convites
        </label>
      </div>
    )
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

  if(!guild) return <div className={styles.loading}><LoadingWheel /></div>

  return (
    <div className={styles.dashboard}>
      <TabSelector selected={selectedTab} onSelect={setSelectedTab} guildId={guild?.id  || guildId} guild={guild} />
      <SettingsContent selected={selectedTab} guildId={guild?.id || guildId} guild={guild} />
    </div>
  )
}