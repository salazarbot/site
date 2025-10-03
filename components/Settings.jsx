"use client"

import { useState } from "react"
import styles from "./Settings.module.css"

function TabSelector({ selected, onSelect }) {
  const tabs = ["Geral", "Notificações", "Permissões"]

  return (
    <div className={styles.nav}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function SettingsContent({ selected }) {
  if (selected === "Geral") {
    return (
      <div className={styles.config}>
        <h2>Configurações Gerais</h2>
        <label>
          <input type="checkbox" /> Ativar modo escuro
        </label>
      </div>
    )
  }

  if (selected === "Notificações") {
    return (
      <div className={styles.config}>
        <h2>Configurações de Notificações</h2>
        <label>
          <input type="checkbox" /> Receber notificações por email
        </label>
      </div>
    )
  }

  if (selected === "Permissões") {
    return (
      <div className={styles.config}>
        <h2>Permissões</h2>
        <label>
          <input type="checkbox" /> Permitir convites
        </label>
      </div>
    )
  }

  return <p>Selecione uma aba</p>
}

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState("Geral")

  return (
    <div className={styles.dashboard}>
      <TabSelector selected={selectedTab} onSelect={setSelectedTab} />
      <SettingsContent selected={selectedTab} />
    </div>
  )
}