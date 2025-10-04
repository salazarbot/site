"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./Settings.module.css"
import { HiChevronRight } from "react-icons/hi";
import LoadingWheel from "./LoadingWheel";
import Image from "next/image";
import { useSession } from "next-auth/react";

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

function SettingsContent({ selected, guildId, guild, guildChannels }) {

  switch (selected) {

    case "Preferências": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
          {JSON.stringify(guildChannels)}

          <section>
            <h2>Configuração geral</h2>

            <div className={styles.option}>
              <label htmlFor="name">Nome do servidor</label>
              <p>{'Se você usar {ano} em alguma parte do nome, o Salazar atualizará o nome do servidor toda vez que o ano do roleplay for passado.'}</p>
              <input type="text" name="name" id="name" defaultValue={guild?.config?.server?.name}/>
            </div>

            <div className={styles.option}>
              <label htmlFor="preferences.extra_prompt">Prompt adicional</label>
              <p>Caso você queira algum detalhe ou especificação extra nas narrações do seu servidor.</p>
              <textarea name="preferences.extra_prompt" id="preferences.extra_prompt" defaultValue={guild?.config?.server?.preferences?.extra_prompt} placeholder="Ex.: Penalize o jogador e realce os resultados negativos das suas ações (caso você queira priorizar narração humana e usar o Salazar para agilidade mas com desvantagem)."/>
            </div>
          </section>

          <section>
            <h2>Definições de tempo e tamanho</h2>

            <div className={styles.option}>
              <label htmlFor="preferences.action_timing">Segundos para enviar partes da ação</label>
              <p>O tempo em que o Salazar esperará (em segundos) para que o jogador envie todas as mensagens que comporão sua ação.</p>
              <input type="number" name="preferences.action_timing" id="preferences.action_timing" defaultValue={guild?.config?.server?.preferences?.action_timing} />
            </div>

            <div className={styles.option}>
              <label htmlFor="preferences.min_event_length">Mínimo de caracteres de evento</label>
              <p>Mínimo de caracteres de uma mensagem de narrador em canal de evento para que o Salazar a armazene em sua memória como um evento.</p>
              <input type="number" name="preferences.min_event_length" id="preferences.min_event_length" defaultValue={guild?.config?.server?.preferences?.min_event_length} />
            </div>

            <div className={styles.option}>
              <label htmlFor="preferences.min_action_length">Mínimo de caracteres de ação</label>
              <p>Mínimo de caracteres de uma mensagem de jogador em canal de ação para que o Salazar a identifique como uma ação e narre seus resultados.</p>
              <input type="number" name="preferences.min_action_length" id="preferences.min_action_length" defaultValue={guild?.config?.server?.preferences?.min_action_length} />
            </div>

            <div className={styles.option}>
              <label htmlFor="preferences.min_diplomacy_length">Mínimo de caracteres de diplomacia</label>
              <p>Mínimo de caracteres de uma mensagem de jogador no canal de diplomacia para que o Salazar a leia e tente interpretar seus resultados para simular resposta de um país NPC, criar chat de guerra, etc.</p>
              <input type="number" name="preferences.min_diplomacy_length" id="preferences.min_diplomacy_length" defaultValue={guild?.config?.server?.preferences?.min_diplomacy_length} />
            </div>

            <div className={styles.option}>
              <label htmlFor="preferences.action_keyword">Palavra-chave que identifica ações</label>
              <p>Palavra-chave que caso a mensagem enviada em um canal de ações contenha, o Salazar irá tentar narrá-la mesmo se ela não atingir o mínimo de caracteres.</p>
              <input type="text" name="preferences.action_keyword" id="preferences.action_keyword" defaultValue={guild?.config?.server?.preferences?.action_keyword} />
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

          <section>
            <div className={styles.option}>
              <label htmlFor="channels.staff">Canal da administração</label>
              <p>Canal principal da administração do servidor.</p>
              <select name="channels.staff" id="channels.staff">
                <option value={guild?.config?.server?.channels?.staff}>{guild?.config?.server?.channels?.staff}</option>
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="channels.logs">Canal de registros</label>
              <p>Canal onde o Salazar irá registrar usos do bot como comandos e botões pressionados.</p>
              <select name="channels.logs" id="channels.logs">
                <option value={guild?.config?.server?.channels?.logs}>{guild?.config?.server?.channels?.logs}</option>
              </select>
            </div>
          </section>

          <section>
            <button className={styles.saveButton}>Salvar</button>
          </section>
        </div>
      )
      break;
    };

    case "Cargos": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>

          <section>
            <div className={styles.option}>
              <label htmlFor="roles.player">Cargo de jogador</label>
              <p>Cargo atribuído a todos os jogadores participantes do roleplay</p>
              <select name="roles.player" id="roles.player">
                <option value={guild?.config?.server?.roles?.player}>{guild?.config?.server?.roles?.player}</option>
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="roles.non_player">Cargo de não jogador</label>
              <p>Cargo atribuído a todos os membros não participantes do roleplay</p>
              <select name="roles.non_player" id="roles.non_player">
                <option value={guild?.config?.server?.roles?.non_player}>{guild?.config?.server?.roles?.non_player}</option>
              </select>
            </div>
          </section>

          <section>
            <button className={styles.saveButton}>Salvar</button>
          </section>
        </div>
      )
      break;
    };

    case "Inteligência Artificial": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>

          <section>
            <div className={styles.option}>
              <label htmlFor="channels.context">Canal da memória do bot</label>
              <p>Um fórum onde todos os acontecimentos do roleplay são registrados em ordem cronológica, controlando a memória do Salazar.</p>
              <select name="channels.context" id="channels.context">
                <option value={guild?.config?.server?.channels?.context}>{guild?.config?.server?.channels?.context}</option>
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="preferences.global_palpites">Responder jogadores com IA <input type="checkbox" name="preferences.global_palpites" id="preferences.global_palpites" defaultChecked={guild?.config?.server?.preferences?.global_palpites} /></label>
              <p>O Salazar usará um modelo mais fraco para responder com IA a qualquer jogador que o mencionar.</p>
            </div>
          </section>

          <section>
            <button className={styles.saveButton}>Salvar</button>
          </section>
        </div>
      )
      break;
    };

    case "Passagem de tempo": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
          <p>A passagem de tempo automática do Salazar é opcional, e você pode optar por passar anos apenas manualmente: basta não definir os dias para passar o ano.</p>

          <section>
            <div className={styles.option}>
              <label htmlFor="preferences.days_to_year">Dias para passar um ano</label>
              <p>Quantos dias da vida real são necessários para que o Salazar passe um ano do roleplay.</p>
              <input type="number" name="preferences.days_to_year" id="preferences.days_to_year" defaultValue={guild?.config?.server?.preferences?.days_to_year} />
            </div>

            <div className={styles.option}>
              <label htmlFor="channels.time">Canal de passagem do tempo</label>
              <p>Canal (geralmente chamado calendário) onde um administrador anuncia a passagem de tempo do roleplay. Caso a passagem automática esteja ativada, também será onde o Salazar irá anunciar.</p>
              <select name="channels.time" id="channels.time">
                <option value={guild?.config?.server?.channels?.time}>{guild?.config?.server?.channels?.time}</option>
              </select>
            </div>
          </section>

          <section>
            <button className={styles.saveButton}>Salvar</button>
          </section>
        </div>
      )
      break;
    };

    case "Roleplay": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>

          <section>
            <div className={styles.option}>
              <label htmlFor="channels.actions">Canais de ações</label>
              <p>Todos os canais de ações, onde os jogadores enviam ações para que sejam narradas.</p>
              <select style={{minHeight: '100px'}} name="channels.actions" id="channels.actions" multiple>
                {guild?.config?.server?.channels?.actions?.map(actionChannel => (
                  <option value={actionChannel} key={actionChannel}>{actionChannel}</option>
                ))}
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="channels.events">Canais de eventos</label>
              <p>Todos os canais de eventos, onde os administradores enviam acontecimentos do roleplay. O Salazar precisa saber esses canais para poder registrar eventos na sua memória.</p>
              <select style={{minHeight: '100px'}} name="channels.events" id="channels.events" multiple>
                {guild?.config?.server?.channels?.events?.map(eventChannel => (
                  <option value={eventChannel} key={eventChannel}>{eventChannel}</option>
                ))}
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="channels.narrations">Canal de narrações</label>
              <p>Canal onde o Salazar irá publicar narrações de ações. Ações feitas nos canais privados de países (pl) não serão narradas aqui.</p>
              <select name="channels.narrations" id="channels.narrations">
                <option value={guild?.config?.server?.channels?.narrations}>{guild?.config?.server?.channels?.narrations}</option>
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="channels.war">Canal de guerra</label>
              <p>Fórum onde o Salazar poderá narrar guerras (caso sejam declaradas no chat de diplomacia). As guerras criadas aqui e narradas por humanos também serão lembradas pelo Salazar.</p>
              <select name="channels.war" id="channels.war">
                <option value={guild?.config?.server?.channels?.war}>{guild?.config?.server?.channels?.war}</option>
              </select>
            </div>
          </section>

          <section>
            <button className={styles.saveButton}>Salvar</button>
          </section>
        </div>
      )
      break;
    };

    case "Diplomacia e NPCs": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
          <p>As funções diplomáticas são opcionais e podem ser desativadas, bastando não definir o canal da função.</p>

          <section>
            <div className={styles.option}>
              <label htmlFor="channels.diplomacy">Canal de diplomacia</label>
              <p>Canal destinado a ações diplomáticas especificamente. Aqui, o Salazar irá ler declarações de guerra para criar o canal adequado no fórum de guerras, além de simular interações diplomáticas entre os jogadores e países NPCs.</p>
              <select name="channels.diplomacy" id="channels.diplomacy" defaultValue={guild?.config?.server?.channels?.diplomacy || 'undefined'}>
                <option value={guild?.config?.server?.channels?.diplomacy}>{guild?.config?.server?.channels?.diplomacy}</option>
                <option value="undefined">Nenhum canal</option>
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="channels.npc_random_actions">NPC - Ações aleatórias</label>
              <p>Canal onde países NPCs enviarão ações aleatórias que condizem com o roleplay. Caso você não queira países NPCs fazendo ações, não defina esta opção.</p>
              <select name="channels.npc_random_actions" id="channels.npc_random_actions" defaultValue={guild?.config?.server?.channels?.npc_random_actions || 'undefined'}>
                <option value={guild?.config?.server?.channels?.npc_random_actions}>{guild?.config?.server?.channels?.npc_random_actions}</option>
                <option value="undefined">Nenhum canal</option>
              </select>
            </div>
          </section>

          <section>
            <button className={styles.saveButton}>Salvar</button>
          </section>
        </div>
      )
      break;
    };

    case "Ações secretas": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
          <p>Feature opcional para caso seu servidor não tenha canais privados de países e você queira uma alternativa para fazer ações secretas. Se você não quiser a usar, não defina os canais.</p>

          <section>
            <div className={styles.option}>
              <label htmlFor="channels.secret_actions">Canal de ações secretas</label>
              <p>Canal onde os jogadores enviarão ações secretas. Assim que enviadas, o Salazar apaga-as imediatamente e envia-as no canal administrativo de ações secretas.</p>
              <select name="channels.secret_actions" id="channels.secret_actions" defaultValue={guild?.config?.server?.channels?.secret_actions || 'undefined'}>
                <option value={guild?.config?.server?.channels?.secret_actions}>{guild?.config?.server?.channels?.secret_actions}</option>
                <option value="undefined">Nenhum canal</option>
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="channels.secret_actions_log">Canal administrativo de ações secretas</label>
              <p>Canal onde os administradores podem ler ações secretas para narrá-las manualmente.</p>
              <select name="channels.secret_actions_log" id="channels.secret_actions_log" defaultValue={guild?.config?.server?.channels?.secret_actions_log || 'undefined'}>
                <option value={guild?.config?.server?.channels?.secret_actions_log}>{guild?.config?.server?.channels?.secret_actions_log}</option>
                <option value="undefined">Nenhum canal</option>
              </select>
            </div>
          </section>

          <section>
            <button className={styles.saveButton}>Salvar</button>
          </section>
        </div>
      )
      break;
    };

    case "Escolha de países": {
      return (
        <div className={styles.config}>
          <h1>{selected}</h1>
          <p>Feature opcional que automatiza a escolha de países, criação de chats privados, cargos e emojis. Se você não quiser usar, não defina nenhum dos canais. Se quiser, tem que definir todos.</p>

          <section>
            <div className={styles.option}>
              <label htmlFor="channels.country_category">Categoria de chat dos países</label>
              <p>Categoria do seu servidor onde o Salazar irá criar e gerenciar os canais individuais de cada país automaticamente.</p>
              <select name="channels.country_category" id="channels.country_category" defaultValue={guild?.config?.server?.channels?.country_category || 'undefined'}>
                <option value={guild?.config?.server?.channels?.country_category}>{guild?.config?.server?.channels?.country_category}</option>
                <option value="undefined">Nenhum canal</option>
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="channels.country_picking">Canal de escolha de país</label>
              <p>Canal onde o Salazar possibilitará que os jogadores peçam países. Não se preocupe, a administração precisa aprovar os jogadores após o pedido.</p>
              <select name="channels.country_picking" id="channels.country_picking" defaultValue={guild?.config?.server?.channels?.country_picking || 'undefined'}>
                <option value={guild?.config?.server?.channels?.country_picking}>{guild?.config?.server?.channels?.country_picking}</option>
                <option value="undefined">Nenhum canal</option>
              </select>
            </div>

            <div className={styles.option}>
              <label htmlFor="channels.picked_countries">Canal de países escolhidos</label>
              <p>Canal onde os países que possuem jogadores são informados. Mais de uma pessoa podem controlar o mesmo país.</p>
              <select name="channels.picked_countries" id="channels.picked_countries" defaultValue={guild?.config?.server?.channels?.picked_countries || 'undefined'}>
                <option value={guild?.config?.server?.channels?.picked_countries}>{guild?.config?.server?.channels?.picked_countries}</option>
                <option value="undefined">Nenhum canal</option>
              </select>
            </div>
          </section>

          <section>
            <button className={styles.saveButton}>Salvar</button>
          </section>
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
  const { data: session } = useSession();

  const [selectedTab, setSelectedTab] = useState("Preferências")
  const [guild, setGuild] = useState(null)
  const [guildChannels, setGuildChannels] = useState(null)
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
    
    fetch(`https://cowapi.nemtudo.me/api/get_channels?guildId=${guildId}&memberId=427257953503019017`)
      .then(async res => {
        if (!res.ok) {
          const json = await res.json().catch(() => null)
          throw json || { message: "Erro desconhecido" }
        }
        return res.json()
      })
      .then(data => setGuildChannels(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));

  }, [guildId]);

  if (!guild) return <div className={styles.loading}><LoadingWheel /></div>

  return (
    <div className={styles.dashboard}>
      <TabSelector selected={selectedTab} onSelect={setSelectedTab} guildId={guild?.id || guildId} guild={guild} />
      <SettingsContent selected={selectedTab} guildId={guild?.id || guildId} guild={guild} guildChannels={guildChannels} />
    </div>
  )
}