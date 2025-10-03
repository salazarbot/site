"use client"

import { useState, useRef } from "react"
import styles from "./Settings.module.css"
import GuildInfo from "./GuildInfo"
import { HiChevronRight } from "react-icons/hi";

function TabSelector({ selected, onSelect, guildId }) {
  const tabs = ["Geral", "Notificações", "Permissões"]

  const navRef = useRef(null);

  return (
    <div className={styles.nav} ref={navRef}>
      <GuildInfo guildId={guildId} />
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
      }}/>
    </div>
  )
}

function SettingsContent({ selected, guildId }) {
  if (selected === "Geral") {
    return (
      <div className={styles.config}>
        <h2>Configurações Gerais</h2>
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

  return (
    <div className={styles.dashboard}>
      <TabSelector selected={selectedTab} onSelect={setSelectedTab} guildId={guildId} />
      <SettingsContent selected={selectedTab} guildId={guildId} />
    </div>
  )
}